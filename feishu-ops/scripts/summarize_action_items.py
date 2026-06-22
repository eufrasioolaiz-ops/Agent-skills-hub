"""Extract lightweight action items from plain text.

Usage:
    python scripts/summarize_action_items.py notes.txt
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


ACTION_HINTS = ("需要", "负责", "跟进", "完成", "确认", "提交", "安排", "整改", "review", "send", "finish")
DATE_PATTERN = re.compile(r"(\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}月\d{1,2}日|明天|今天|本周|下周)")


def extract_items(text: str) -> list[str]:
    items: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip(" -\t")
        if not line:
            continue
        if any(hint in line for hint in ACTION_HINTS) or DATE_PATTERN.search(line):
            items.append(line)
    return items


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python scripts/summarize_action_items.py <text-file>", file=sys.stderr)
        return 2

    text = Path(sys.argv[1]).read_text(encoding="utf-8")
    items = extract_items(text)
    for index, item in enumerate(items, start=1):
        print(f"{index}. {item}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

