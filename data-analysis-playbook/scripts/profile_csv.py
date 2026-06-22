"""Profile a CSV file with standard-library Python.

Usage:
    python scripts/profile_csv.py data.csv
"""

from __future__ import annotations

import csv
import sys
from collections import Counter
from pathlib import Path


def profile_csv(path: Path) -> None:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)

    print(f"file: {path}")
    print(f"rows: {len(rows)}")
    print(f"columns: {len(reader.fieldnames or [])}")

    for field in reader.fieldnames or []:
        values = [row.get(field, "") for row in rows]
        missing = sum(1 for value in values if value == "")
        unique = len(set(values))
        examples = [value for value, _ in Counter(values).most_common(3) if value != ""]
        print(f"- {field}: missing={missing}, unique={unique}, examples={examples}")


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: python scripts/profile_csv.py <csv-file>", file=sys.stderr)
        return 2
    profile_csv(Path(sys.argv[1]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

