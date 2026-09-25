#!/usr/bin/env python3
"""Check that every resume bullet cites Approved claims and keeps their numbers and qualifiers.

Each \\resumeItem must end its line with a claim comment, for example:
    \\resumeItem{Cut phone-login latency from ~8s to ~2s.} % claim: CL-7
    \\resumeItem{Graduate coursework in NLP and ML.} % claim: profile

Claims come from a Claims database SQL export saved as JSON ({"results": [...]}).
Standard library only.
"""

import argparse
import json
from pathlib import Path
import re
import sys

CLAIM_COMMENT = re.compile(r"%\s*claim:\s*(.+)$")
NUMBER = re.compile(r"\d[\d,]*(?:\.\d+)?")
PROFILE = "profile"


def claim_key(value):
    """Notion's SQL export returns the unique ID as a bare number; drafts cite CL-12."""
    return re.sub(r"^[A-Za-z]+-", "", str(value).strip())


def load_claims(path):
    rows = json.loads(Path(path).read_text())
    rows = rows.get("results", rows) if isinstance(rows, dict) else rows
    claims = {}
    for row in rows:
        claim_id = row.get("ID") or row.get("userDefined:ID")
        if claim_id in (None, ""):
            raise ValueError("Every exported claim needs an ID column")
        claims[claim_key(claim_id)] = row
    return claims


def resume_items(source):
    """Yield (line number, item TeX, citation text) for every \\resumeItem."""
    start = 0
    while (index := source.find("\\resumeItem{", start)) != -1:
        depth, cursor = 0, index + len("\\resumeItem")
        while cursor < len(source):
            char = source[cursor]
            if char == "\\":
                cursor += 2
                continue
            depth += {"{": 1, "}": -1}.get(char, 0)
            cursor += 1
            if depth == 0:
                break
        body = source[index + len("\\resumeItem{"):cursor - 1]
        line_end = source.find("\n", cursor)
        tail = source[cursor:line_end if line_end != -1 else len(source)]
        match = CLAIM_COMMENT.search(tail)
        yield source.count("\n", 0, index) + 1, body, match[1] if match else None
        start = cursor


def plain_text(tex):
    text = re.sub(r"(?<!\\)%.*", "", tex)
    text = text.replace("\\%", "%").replace("---", "—").replace("--", "–").replace("\\&", "&")
    text = re.sub(r"\\[a-zA-Z]+\*?", " ", text)
    return re.sub(r"\s+", " ", text.replace("{", "").replace("}", "").replace("~", " ")).strip()


def numbers(text):
    return {token.replace(",", "") for token in NUMBER.findall(text)}


def phrases(value):
    return [part.strip() for part in (value or "").split(";") if part.strip()]


def check(source, claims):
    results, problems = [], 0
    for line, body, citation in resume_items(source):
        text = plain_text(body)
        issues = []
        ids = [part.strip() for part in (citation or "").split(",") if part.strip()]
        if not ids:
            issues.append("missing '% claim:' comment")
        cited = []
        for claim_id in ids:
            if claim_id.lower() == PROFILE:
                continue
            claim = claims.get(claim_key(claim_id))
            if claim is None:
                issues.append(f"{claim_id} is not in the claims export")
            elif claim.get("Status") != "Approved":
                issues.append(f"{claim_id} is {claim.get('Status') or 'unset'}, not Approved")
            else:
                cited.append(claim)
        allowed = set()
        for claim in cited:
            allowed |= numbers(" ".join(str(claim.get(key) or "") for key in ("Claim", "Short", "Qualifier")))
            for qualifier in phrases(claim.get("Qualifier")):
                if qualifier.lower() not in text.lower():
                    issues.append(f"missing required qualifier '{qualifier}'")
            for banned in phrases(claim.get("Never say")):
                if banned.lower() in text.lower():
                    issues.append(f"uses banned wording '{banned}'")
        profile_only = ids and all(claim_id.lower() == PROFILE for claim_id in ids)
        unsupported = sorted(numbers(text) - allowed)
        if unsupported and not profile_only:
            issues.append("numbers not found in cited claims: " + ", ".join(unsupported))
        problems += bool(issues)
        results.append({"line": line, "claims": ids, "text": text, "issues": issues,
                        **({"unverifiedNumbers": unsupported} if profile_only and unsupported else {})})
    return results, problems


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("source", help="Working LaTeX resume")
    parser.add_argument("claims", help="Claims SQL export (JSON)")
    parser.add_argument("--report", help="Optional path for the JSON report")
    args = parser.parse_args()
    try:
        results, problems = check(Path(args.source).read_text(), load_claims(args.claims))
    except (ValueError, OSError, json.JSONDecodeError) as error:
        print(f"Claim check refused: {error}", file=sys.stderr)
        return 1
    report = {"status": "failed" if problems or not results else "passed",
              "bullets": len(results), "bulletsWithIssues": problems, "results": results}
    if not results:
        report["error"] = "No \\resumeItem bullets found"
    output = json.dumps(report, indent=2, ensure_ascii=False)
    if args.report:
        Path(args.report).write_text(output + "\n")
    print(output)
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    sys.exit(main())
