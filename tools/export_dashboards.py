"""Export the UI-managed dashboards from the Pi into dashboards/*.yaml, redacted.

Usage: python tools/export_dashboards.py <ssh-target>
       (ssh-target is user@host of the Home Assistant Pi; it is not stored here)

The repository is public, so coordinates and calendar entity ids are replaced
by placeholders and the export aborts when anything private is left.
"""

import json
import re
import subprocess
import sys
from pathlib import Path

import yaml

STORAGE = "/homeassistant/.storage"
OUT = Path(__file__).resolve().parent.parent / "dashboards"
COORDINATE_KEY = re.compile(r"latitude|longitude", re.I)
CALENDAR_ID = re.compile(r"\bcalendar\.[a-z0-9_]+")
PRIVATE = [
    re.compile(r"\b\d{1,3}(\.\d{1,3}){3}\b"),
    re.compile(r"[\w.+-]+@[\w-]+\.\w+"),
    re.compile(r"\b([0-9a-f]{2}:){5}[0-9a-f]{2}\b", re.I),
    re.compile(r"token|password|api_key", re.I),
]


def remote(target, command):
    return subprocess.run(
        ["ssh", "-o", "BatchMode=yes", target, command],
        check=True, capture_output=True, text=True, encoding="utf-8",
    ).stdout


def redact(node, calendars):
    if isinstance(node, dict):
        return {
            key: "REDACTED" if COORDINATE_KEY.search(key) else redact(value, calendars)
            for key, value in node.items()
        }
    if isinstance(node, list):
        return [redact(item, calendars) for item in node]
    if isinstance(node, str):
        return CALENDAR_ID.sub(
            lambda match: calendars.setdefault(match.group(), f"calendar.redacted_{len(calendars) + 1}"),
            node,
        )
    return node


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    target = sys.argv[1]
    names = remote(target, f"sudo ls {STORAGE}").split()
    names = sorted(name for name in names if name.startswith("lovelace"))
    calendars = {}
    documents = {}
    for name in names:
        data = json.loads(remote(target, f"sudo cat {STORAGE}/{name}"))["data"]
        text = yaml.safe_dump(redact(data, calendars), sort_keys=False, allow_unicode=True, width=120)
        for pattern in PRIVATE:
            found = pattern.search(text)
            if found:
                sys.exit(f"{name}: private-looking value left after redaction: {found.group()!r}")
        documents[name] = text
    OUT.mkdir(exist_ok=True)
    for stale in OUT.glob("*.yaml"):
        stale.unlink()
    for name, text in documents.items():
        (OUT / f"{name}.yaml").write_text(text, encoding="utf-8", newline="\n")
    print(f"exported {len(documents)} files, redacted {len(calendars)} calendar ids")


if __name__ == "__main__":
    main()
