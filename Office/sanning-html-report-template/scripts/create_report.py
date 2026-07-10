#!/usr/bin/env python3
"""Create a self-contained Sanning HTML report starter from a bundled template."""

from __future__ import annotations

import argparse
import html
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]

def main() -> int:
    parser = argparse.ArgumentParser(description="Create a Sanning HTML report starter.")
    parser.add_argument("--mode", choices=("single", "deck"), required=True)
    parser.add_argument("--flow", choices=("horizontal", "vertical"), default="horizontal")
    parser.add_argument("--title", required=True)
    parser.add_argument("--module", default="汇报模块")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    template_name = "single-page.html" if args.mode == "single" else "slide-deck.html"
    template = (SKILL_ROOT / "assets" / template_name).read_text(encoding="utf-8")
    logo = (SKILL_ROOT / "assets" / "sanning-logo.data-uri.txt").read_text(encoding="utf-8").strip()
    if not logo.startswith("data:image/"):
        raise ValueError("The embedded Sanning logo data URI is invalid.")
    replacements = {
        "__SANNING_LOGO_DATA_URI__": logo,
        "__REPORT_TITLE__": html.escape(args.title, quote=True),
        "__REPORT_MODULE__": html.escape(args.module, quote=True),
        "__FLOW__": args.flow,
    }
    for marker, value in replacements.items():
        template = template.replace(marker, value)
    if "__" in template:
        raise ValueError("Template placeholders remain after generation.")
    output = Path(args.output).expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(template, encoding="utf-8")
    print(f"Created {output}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
