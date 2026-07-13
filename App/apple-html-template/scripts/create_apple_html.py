#!/usr/bin/env python3
"""Generate a standalone, original glassmorphism product page."""

from __future__ import annotations

import argparse
import base64
import html
import re
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]


def data_uri(path: Path) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Create a standalone glassmorphism product page.")
    parser.add_argument("--product-name", required=True)
    parser.add_argument("--eyebrow", default="PRODUCT LINE")
    parser.add_argument("--headline", required=True)
    parser.add_argument("--hero-copy", required=True)
    parser.add_argument("--page-subtitle", default="产品概念页")
    parser.add_argument("--intro-title", default="把复杂留给系统，把注意力还给用户。")
    parser.add_argument("--intro-copy", default="用清晰层级、克制材质和适度动效，让核心价值被自然看见。")
    parser.add_argument("--hero-image-alt", default="透明产品概念图")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    template = (SKILL_ROOT / "assets" / "product-page.html").read_text(encoding="utf-8")
    replacements = {
        "__PRODUCT_NAME__": html.escape(args.product_name, quote=True),
        "__PRODUCT_INITIAL__": html.escape(args.product_name[0], quote=True),
        "__EYEBROW__": html.escape(args.eyebrow, quote=True),
        "__HERO_TITLE__": html.escape(args.headline, quote=True),
        "__HERO_COPY__": html.escape(args.hero_copy, quote=True),
        "__PAGE_SUBTITLE__": html.escape(args.page_subtitle, quote=True),
        "__INTRO_TITLE__": html.escape(args.intro_title, quote=True),
        "__INTRO_COPY__": html.escape(args.intro_copy, quote=True),
        "__HERO_IMAGE_ALT__": html.escape(args.hero_image_alt, quote=True),
        "__HERO_IMAGE_DATA_URI__": data_uri(SKILL_ROOT / "assets" / "translucent-sensor-hero.png"),
    }
    for marker, value in replacements.items():
        template = template.replace(marker, value)
    if re.search(r"__[A-Z0-9_]+__", template):
        raise ValueError("Template placeholders remain after generation.")

    output = Path(args.output).expanduser().resolve()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(template, encoding="utf-8")
    print(f"Created {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
