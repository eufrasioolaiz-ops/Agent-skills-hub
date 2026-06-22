#!/usr/bin/env python3
"""Scaffold a Windows Electron floating performance BI widget."""

from __future__ import annotations

import argparse
import json
import platform
import shutil
import subprocess
import sys
from pathlib import Path
from typing import List, Optional


SKILL_ROOT = Path(__file__).resolve().parents[1]
TEMPLATE_DIR = SKILL_ROOT / "assets" / "electron-performance-bi-template"


def fail(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(1)


def copy_template(output: Path, force: bool) -> None:
    if not TEMPLATE_DIR.exists():
        fail(f"template not found: {TEMPLATE_DIR}")

    output.mkdir(parents=True, exist_ok=True)

    for source in TEMPLATE_DIR.rglob("*"):
        relative = source.relative_to(TEMPLATE_DIR)
        target = output / relative

        if source.is_dir():
            target.mkdir(parents=True, exist_ok=True)
            continue

        if target.exists() and not force:
            fail(f"target file exists; use --force to overwrite: {target}")

        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)


def update_package_name(output: Path, package_name: Optional[str]) -> None:
    if not package_name:
        return

    package_path = output / "package.json"
    data = json.loads(package_path.read_text(encoding="utf-8"))
    data["name"] = package_name
    package_path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def run(command: List[str], cwd: Path) -> None:
    print("+ " + " ".join(command))
    subprocess.run(command, cwd=cwd, check=True)


def npm_command() -> Optional[str]:
    return shutil.which("npm.cmd") or shutil.which("npm")


def powershell_command() -> Optional[str]:
    return shutil.which("powershell.exe") or shutil.which("powershell")


def install_dependencies(output: Path) -> None:
    npm = npm_command()
    if not npm:
        fail("npm was not found. Install Node.js LTS, then rerun with --install.")

    run([npm, "install"], output)


def create_shortcut(output: Path) -> None:
    if platform.system().lower() != "windows":
        print("shortcut skipped: desktop shortcuts are only supported on Windows")
        return

    script = output / "scripts" / "create-shortcut.ps1"
    if not script.exists():
        fail(f"shortcut script not found: {script}")

    powershell = powershell_command()
    if not powershell:
        fail("powershell.exe was not found; cannot create Windows shortcut")

    electron = output / "node_modules" / "electron" / "dist" / "electron.exe"
    if not electron.exists():
        fail("Electron binary not found. Run with --install before --shortcut.")

    run([powershell, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(script)], output)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path, help="Target project directory")
    parser.add_argument("--package-name", help="Optional package.json name override")
    parser.add_argument("--force", action="store_true", help="Overwrite existing template files")
    parser.add_argument("--install", action="store_true", help="Run npm install after scaffolding")
    parser.add_argument("--shortcut", action="store_true", help="Create a desktop shortcut after install")
    args = parser.parse_args()

    output = args.output.resolve()
    copy_template(output, args.force)
    update_package_name(output, args.package_name)

    if args.install:
        install_dependencies(output)

    if args.shortcut:
        create_shortcut(output)

    print(f"scaffolded: {output}")
    print("next: npm run check && npm start")


if __name__ == "__main__":
    main()
