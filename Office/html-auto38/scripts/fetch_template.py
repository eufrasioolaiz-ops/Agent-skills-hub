#!/usr/bin/env python3
"""Download one approved HTML Auto 38 template without cloning its repository.

中文：按模板 slug 下载单个 HTML 模板，不克隆整个上游仓库。
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


BASE_URL = "https://raw.githubusercontent.com/zarazhangrui/beautiful-html-templates/main"
SLUGS = {
    "8-bit-orbit", "biennale-yellow", "block-frame", "blue-professional",
    "bold-poster", "broadside", "capsule", "cartesian", "cobalt-grid", "coral",
    "creative-mode", "daisy-days", "editorial-tri-tone", "grove", "long-table",
    "mat", "monochrome", "neo-grid-bold", "peoples-platform", "pin-and-paper",
    "pink-script", "playful", "raw-grid", "retro-windows", "retro-zine",
    "sakura-chroma", "scatterbrain", "signal", "soft-editorial", "stencil-tablet",
    "studio", "vellum",
}
RUNTIME_SLUGS = {
    "grove", "monochrome", "neo-grid-bold", "signal", "soft-editorial", "studio",
}


def download(url: str, destination: Path) -> bytes:
    request = Request(url, headers={"User-Agent": "html-auto38-template-fetcher/1.0"})
    try:
        with urlopen(request, timeout=30) as response:
            content = response.read()
    except (HTTPError, URLError) as error:
        raise RuntimeError(f"Download failed: {url}\n{error}") from error
    destination.write_bytes(content)
    return content


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", choices=sorted(SLUGS), help="Template slug from references/template-catalog.md；模板英文标识")
    parser.add_argument("--output", type=Path, required=True, help="Directory for the downloaded files；模板文件保存目录")
    args = parser.parse_args()

    output = args.output.expanduser().resolve() / args.slug
    output.mkdir(parents=True, exist_ok=True)
    prefix = f"{BASE_URL}/templates/{args.slug}"
    html = download(f"{prefix}/template.html", output / "template.html")
    print(f"Saved {output / 'template.html'}")

    try:
        download(f"{prefix}/template.json", output / "template.json")
        print(f"Saved {output / 'template.json'}")
    except RuntimeError as error:
        print(f"Warning: metadata was not downloaded. {error}", file=sys.stderr)

    if args.slug in RUNTIME_SLUGS or b"<deck-stage" in html:
        download(f"{BASE_URL}/runtime/deck-stage.js", output / "deck-stage.js")
        print(f"Saved {output / 'deck-stage.js'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
