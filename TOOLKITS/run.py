#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import time
import subprocess
from pathlib import Path

# =========================================================
# COLORAMA
# =========================================================

try:
    from colorama import init, Fore, Style

    init(autoreset=True)

    BLACK = Fore.BLACK
    RED = Fore.RED
    GREEN = Fore.GREEN
    CYAN = Fore.CYAN
    YELLOW = Fore.YELLOW
    MAGENTA = Fore.MAGENTA
    BLUE = Fore.BLUE
    WHITE = Fore.WHITE
    RESET = Style.RESET_ALL
    BOLD = Style.BRIGHT

except ImportError:
    BLACK = RED = GREEN = CYAN = YELLOW = MAGENTA = BLUE = WHITE = ""
    RESET = BOLD = ""


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path("/home/b2b/TOOLKITS")
TOOLS_DIR = BASE_DIR / ".Scripts"

# الـ venv الحقيقي
VENV_DIR = BASE_DIR / "virtualEnv"
VENV_PYTHON = VENV_DIR / "bin" / "python"
VENV_PIP = VENV_DIR / "bin" / "pip"


# =========================================================
# OPTIONS
# =========================================================

OPTIONS = {
    "1": ("Brute Force Instagram cli", "instagram_brute.py"),
    "2": ("Brute Force Snapchat cli", "snap_randomer.py"),
    "3": ("Brute Force TikTok cli", "tiktok.py"),
    "4": ("Auto save Email message Html", "AUto_save_HTML_phishing.py"),
    "5": ("Pro server Phishing", "server.py"),
    "6": ("Pro GUI Brute tool", "profitione.py"),
    "7": ("Followers Up with this Cli", "fofo.py"),
    "8": ("OSINT Kits", "33.py"),
    "9": ("Auto Tor Random IP socks", "autoTOR.py"),
   "10": ("IP getinfo", "ip-tracer.sh"),
   "11": ("wifi password Generator", "71sta.py"),
   "12": ("Bob ControleX2", "CLI_SERVER_C2.py")
}


# =========================================================
# BANNER
# =========================================================

BANNER = f"""{BOLD}{RED}

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡤⠤⠤⠀⠀⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⡼⠟⠓⠒⠂⠀⢀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡾⠀⠀⠀⠀⠀⣐⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡤⠖⠋⠁⠀⠀⠀⠀⠀⢀⠔⠃⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣮⡅⠀⠀⠀⠀⢠⡁⠀⠀⠀⠀⠀⣠⣶⡼⠛⠁⠀⠀⠀⠀⠀⠀⠀⢀⡴⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣏⡀⠀⠀⠀⠘⠀⠀⠀⠀⠀⣦⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⡇⠀⠀⢌⠁⠀⠀⠀⠀⣰⠏⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⠊⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⡀⠀⠀⠀⠀⣿⠀⠀⠎⠀⠀⠀⠀⢰⡏⠀⠀⠀⠀⠀⠀⠀⢀⣠⣧⣤⠤⠤⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠈⠻⣦⠀⠀⠀⢸⣧⠀⠁⠀⠀⠀⢀⣿⠀⠀⠀⠀⣀⣤⡶⠚⠋⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢦⡀⠀⠘⣻⢀⠄⠀⠀⠀⢸⠇⢐⣆⡾⠟⠉⠀⠀⠀⠀⠀⠀⠀⢀⠔⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣄⣄⣾⠶⢆⣀⣀⣀⣿⣦⣤⣿⣟⣖⣜⣅⣰⢏⣠⢟⠉⠀⠀⠀⠀⠀⠀⠀⢀⠤⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⢇⠜⠉⠒⣿⣿⡿⠟⢻⣿⣿⣿⣿⣿⣿⣜⣵⠟⠁⠀⠀⠀⠀⠀⠀⢀⠠⠠⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⢀⡪⠁⠀⠀⠀⣰⣿⣃⣤⣤⣾⣿⣿⣿⡿⢿⣿⣿⢿⠆⠀⠀⠀⠀⠀⠛⠑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⡾⠁⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⢿⢳⣿⣿⠁⠈⠻⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⡾⠁⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⡏⣦⣿⡿⠁⠀⠀⠀⠱⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⠃⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣷⣿⠟⢁⠀⠀⠀⠀⠀⠈⠣⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡜⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⠿⠿⢿⣿⡟⠁⠀⠈⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡰⣻⠁⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠔⠁⠀⠀⠀⠀⠀⠀⠀⢠⠗⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠎⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡌⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

                  {BLACK}this tool kamed by B2B404{RED}⠀⠀⠀⠀
{BLACK}you can install other tools URL : https://github.com/aymenbikou01-tech{RED}⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
{RESET}"""




# =========================================================
# CLEAR
# =========================================================

def clear_screen():
    os.system("clear" if os.name == "posix" else "cls")


# =========================================================
# VENV
# =========================================================

def venv_available():
    return (
        VENV_DIR.is_dir()
        and VENV_PYTHON.is_file()
    )


def get_prompt():
    if venv_available():
        return (
            f"{GREEN}{BOLD}ven{RESET}"
            f"{WHITE}({GREEN}{BOLD}Selver{RESET}{WHITE})"
            f"{GREEN} > {RESET}"
        )

    return (
        f"{GREEN}{BOLD}Selver{RESET}"
        f"{GREEN} > {RESET}"
    )


# =========================================================
# STATUS
# =========================================================


                        
   


    


# =========================================================
# MENU
# =========================================================
def print_menu():

    print(BANNER)
    

    # =========================================
    # BUILD MENU ROWS
    # =========================================

    rows = [
        ("1", "4", "5"),
        ("2", "3", "6"),
        ("7", "8", "9"),
        ("10", "11","12"),
        ("0")
    ]

    # =========================================
    # PREPARE TEXT
    # =========================================

    import re

    def clean_ansi(text):
        return re.sub(r"\033\[[0-9;]*m", "", text)

    def option_text(key):

        if key == "0":
            return (
                f"{BLUE}{BOLD}[0]{RESET} "
                f"{WHITE}Exit{RESET}"
            )

        description = OPTIONS[key][0]

        return (
            f"{CYAN}[{key}]{RESET} "
            f"{WHITE}{description}{RESET}"
        )

    # =========================================
    # CALCULATE COLUMN WIDTH AUTOMATICALLY
    # =========================================

    column_widths = [0, 0, 0]

    for row in rows:

        for index, key in enumerate(row):

            text = option_text(key)
            real_length = len(clean_ansi(text))

            if real_length > column_widths[index]:
                column_widths[index] = real_length

    # Space between columns
    gap = 4

    # Total menu width
    inner_width = (
        sum(column_widths)
        + (gap * 2)
    )

    # =========================================
    # TOP FRAME
    # =========================================

    print(
        f"{RED}{BOLD}"
        f"╭{'─' * (inner_width + 2)}╮"
        f"{RESET}"
    )

    # =========================================
    # PRINT OPTIONS
    # =========================================

    for row in rows:

        parts = []

        for index, key in enumerate(row):

            text = option_text(key)

            real_length = len(clean_ansi(text))

            padding = column_widths[index] - real_length

            parts.append(
                text
                + (" " * padding)
            )

        line = (
            (" " * 1)
            + (" " * gap).join(parts)
            + (" " * 1)
        )

        print(
            f"{RED}│{RESET}"
            f"{line}"
            f"{RED}│{RESET}"
        )

    # =========================================
    # BOTTOM FRAME
    # =========================================

    print(
        f"{RED}{BOLD}"
        f"╰{'─' * (inner_width + 2)}╯"
        f"{RESET}"
    )



# =========================================================
# CHECK SCRIPT
# =========================================================

def check_script(script_path):

    if not script_path.exists():

        print(
            f"\n{RED}{BOLD}[✗] Script not found:{RESET}"
        )

        print(
            f"{YELLOW}{script_path}{RESET}"
        )

        return False

    return True


# =========================================================
# RUN SCRIPT
# =========================================================

def run_script(script_name):

    clear_screen()

    script_path = TOOLS_DIR / script_name

    print(
        f"{CYAN}{BOLD}"
        "╔════════════════════════════════════════════╗"
        f"{RESET}"
    )

    print(
        f"{CYAN}{BOLD}║ {WHITE}Launching: "
        f"{YELLOW}{script_name:<26}"
        f"{CYAN}║{RESET}"
    )

    print(
        f"{CYAN}{BOLD}"
        "╚════════════════════════════════════════════╝"
        f"{RESET}\n"
    )

    if not check_script(script_path):

        input(
            f"\n{MAGENTA}Press Enter to return...{RESET}"
        )

        return

    try:

        # -------------------------------------------------
        # BASH
        # -------------------------------------------------

        if script_path.suffix.lower() == ".sh":

            command = [
                "bash",
                str(script_path)
            ]

            interpreter = "Bash"

        # -------------------------------------------------
        # PYTHON
        # -------------------------------------------------

        elif script_path.suffix.lower() == ".py":

            if venv_available():

                command = [
                    str(VENV_PYTHON),
                    str(script_path)
                ]

                interpreter = "virtualEnv / Python"

            else:

                command = [
                    sys.executable,
                    str(script_path)
                ]

                interpreter = "System Python"

        # -------------------------------------------------
        # EXECUTABLE
        # -------------------------------------------------

        else:

            command = [
                str(script_path)
            ]

            interpreter = "Executable"

        print(
            f"{GREEN}[+] Interpreter : {WHITE}{interpreter}{RESET}"
        )

        print(
            f"{GREEN}[+] File        : {WHITE}"
            f"{script_path.name}{RESET}"
        )

        print()

        time.sleep(0.5)

        subprocess.run(
            command,
            cwd=str(TOOLS_DIR),
            check=False
        )

    except KeyboardInterrupt:

        print(
            f"\n\n{YELLOW}[!] Interrupted by user.{RESET}"
        )

    except Exception as error:

        print(
            f"\n{RED}[✗] Error:{RESET} "
            f"{error}"
        )

    input(
        f"\n{CYAN}{BOLD}"
        "Press Enter to return to menu..."
        f"{RESET}"
    )


# =========================================================
# MAIN
# =========================================================

def main():

    if not BASE_DIR.is_dir():

        print(
            f"{RED}{BOLD}"
            "[✗] TOOLKITS directory not found!"
            f"{RESET}"
        )

        print(BASE_DIR)

        sys.exit(1)

    if not TOOLS_DIR.is_dir():

        print(
            f"{RED}{BOLD}"
            "[✗] .Scripts directory not found!"
            f"{RESET}"
        )

        print(TOOLS_DIR)

        sys.exit(1)

    while True:

        clear_screen()

        print_menu()

        choice = input(
            f"\n{get_prompt()}"
        ).strip()

        # =================================================
        # EXIT
        # =================================================

        if choice == "0":

            clear_screen()

            print(
                f"\n{RED}{BOLD}"
                "╔════════════════════════════════════╗"
                f"{RESET}"
            )

            print(
                f"{RED}{BOLD}"
                "║        Goodbye, void bear!        ║"
                f"{RESET}"
            )

            print(
                f"{RED}{BOLD}"
                "╚════════════════════════════════════╝"
                f"{RESET}\n"
            )

            break

        # =================================================
        # INVALID
        # =================================================

        if choice not in OPTIONS:

            print(
                f"\n{RED}[✗] Invalid option.{RESET}"
            )

            time.sleep(1)

            continue

        # =================================================
        # RUN
        # =================================================

        description, script_name = OPTIONS[choice]

        run_script(script_name)


# =========================================================
# START
# =========================================================

if __name__ == "__main__":

    try:

        main()

    except KeyboardInterrupt:

        print(
            f"\n\n{YELLOW}[!] Interrupted.{RESET}"
        )

        sys.exit(0)
