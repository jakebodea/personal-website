#!/usr/bin/env python3
"""Turn saved Notion page fetches into one compact Markdown bank for drafting and critics.

Save each fetched Career Evidence page (the fetch tool's JSON result, or its page
text) as a file in one directory, then run:
    compact-bank.py <fetch-dir> <bank.md> [--include-candidates]

Only Approved records are kept by default. Standard library only.
"""

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys

PROPERTIES = re.compile(r"<properties>\s*(\{.*?\})\s*</properties>", re.S)
CONTENT = re.compile(r"<content>\s*(.*?)\s*</content>", re.S)
MENTION = re.compile(r'<mention-page url="([^"]+)"\s*/>')
PAGE_URL = re.compile(r'<page url="([^"]+)"')
KEEP = ("Kind", "Organization", "Approval", "Primary source")


def page_text(raw):
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return raw
    return data.get("text", raw) if isinstance(data, dict) else raw


def record(path):
    text = page_text(path.read_text())
    properties, content = PROPERTIES.search(text), CONTENT.search(text)
    if not properties or not content:
        raise ValueError(f"{path.name} is not a Notion page fetch")
    fields = json.loads(properties[1])
    url = PAGE_URL.search(text)
    return {"name": fields.get("Name") or fields.get("title") or path.stem,
            "fields": fields, "url": url[1] if url else "",
            "body": MENTION.sub(lambda match: f"[linked page]({match[1]})", content[1])}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("fetches", help="Directory of saved page fetches")
    parser.add_argument("output", help="Compact Markdown bank to write")
    parser.add_argument("--include-candidates", action="store_true")
    args = parser.parse_args()
    try:
        paths = sorted(path for path in Path(args.fetches).iterdir() if path.is_file())
        records = [record(path) for path in paths]
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print(f"Compaction refused: {error}", file=sys.stderr)
        return 1
    kept = [item for item in records
            if args.include_candidates or item["fields"].get("Approval") == "Approved"]
    kept.sort(key=lambda item: (item["fields"].get("Organization") or "", item["name"]))
    sections = []
    for item in kept:
        meta = [f"{key}: {item['fields'][key]}" for key in KEEP if item["fields"].get(key)]
        observed = item["fields"].get("date:Observed on:start")
        meta += [f"Observed on: {observed}"] if observed else []
        sections.append(f"## {item['name']}\n{' · '.join(meta)} · {item['url']}\n\n{item['body']}\n")
    Path(args.output).write_text("# Career Evidence (compact)\n\n" + "\n".join(sections))
    print(json.dumps({"records": len(records), "kept": len(kept),
                      "sha256": hashlib.sha256(Path(args.output).read_bytes()).hexdigest(),
                      "bytes": Path(args.output).stat().st_size}, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
