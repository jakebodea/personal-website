#!/usr/bin/env python3
"""Compile one temporary, never-overwritten resume revision; no third-party Python packages."""

import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import re
import resource
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[4]
MAX_SOURCE = 150_000
XHTML = "{http://www.w3.org/1999/xhtml}"
# Layout targets for a full, balanced page (inches of white space below the last line).
BOTTOM_GAP_MIN, BOTTOM_GAP_MAX = 0.15, 0.6
MAX_LINES_PER_BULLET = 2
WIDOW_MAX_WORDS = 2
LINE_TOLERANCE_PT = 4
MONTH = r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?"
HYPHEN_DATE_RANGE = re.compile(
    rf"\b(?:{MONTH}\s+)?(?:19|20)\d{{2}}\s*-\s*(?:{MONTH}\s+)?(?:(?:19|20)\d{{2}}|Present)\b")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def executable(name):
    found = shutil.which(name)
    fallback = Path("/Library/TeX/texbin") / name
    if found:
        return found
    if fallback.is_file() and os.access(fallback, os.X_OK):
        return str(fallback)
    raise ValueError(f"Missing required tool: {name}")


def limits():
    resource.setrlimit(resource.RLIMIT_FSIZE, (20 * 1024 * 1024,) * 2)
    resource.setrlimit(resource.RLIMIT_CPU, (45, 45))


def run(args, cwd, env, log):
    with log.open("ab") as stream:
        stream.write(("\n$ " + Path(args[0]).name + "\n").encode())
        stream.flush()
        try:
            result = subprocess.run(
                args, cwd=cwd, env=env, stdin=subprocess.DEVNULL,
                stdout=stream, stderr=subprocess.STDOUT, timeout=45,
                preexec_fn=limits, check=False,
            )
        except subprocess.TimeoutExpired as error:
            raise ValueError(f"{Path(args[0]).name} exceeded 45 seconds") from error
    if result.returncode:
        raise ValueError(f"{Path(args[0]).name} failed ({result.returncode}); inspect compile.log")


def tex_command(binary, directory):
    if sys.platform != "darwin":
        raise ValueError("The compiler requires macOS sandbox-exec; no unsandboxed fallback")
    profile = f'''(version 1)
    (allow default)
    (deny network*)
    (deny file-read-data
      (require-all
        (require-any (subpath "/Users") (subpath "/Volumes")
          (subpath "/private/var/folders") (subpath "/private/tmp")
          (subpath {json.dumps(str(Path.home().resolve()))}))
        (require-not (subpath {json.dumps(str(directory))}))))
    (deny file-write*
      (require-all (require-not (subpath {json.dumps(str(directory))}))
        (require-not (subpath "/dev"))))'''
    return [executable("sandbox-exec"), "-p", profile, binary,
            "-no-shell-escape", "-interaction=nonstopmode", "-halt-on-error",
            "-file-line-error", "-jobname=resume", "resume.tex"]


def check_bounds(path, expected_pages):
    root = ET.parse(path).getroot()
    pages = list(root.iter("{http://www.w3.org/1999/xhtml}page"))
    if len(pages) != expected_pages or not pages:
        raise ValueError("Text bounds have missing or inconsistent pages")
    count = 0
    for page in pages:
        width, height = float(page.attrib["width"]), float(page.attrib["height"])
        if not all(math.isfinite(v) and v > 0 for v in (width, height)):
            raise ValueError("Invalid page bounds")
        for word in page.iter("{http://www.w3.org/1999/xhtml}word"):
            count += 1
            x1, y1, x2, y2 = (float(word.attrib[k]) for k in ("xMin", "yMin", "xMax", "yMax"))
            if (not all(math.isfinite(v) for v in (x1, y1, x2, y2))
                    or x1 < 0 or y1 < 0 or x2 > width + 1 or y2 > height + 1
                    or x1 > x2 or y1 > y2):
                raise ValueError("Some text extends beyond the PDF page boundary or has invalid bounds")
    if not count:
        raise ValueError("No word bounds could be checked")
    return count


def text_lines(page):
    """Group words into visual lines; a bullet glyph sits a few points above its text."""
    words = sorted(((float(w.attrib["yMax"]), float(w.attrib["xMin"]), float(w.attrib["xMax"]),
                     (w.text or "").strip()) for w in page.iter(f"{XHTML}word")))
    lines = []
    for word in words:
        if lines and word[0] - lines[-1]["y"] <= LINE_TOLERANCE_PT:
            lines[-1]["words"].append(word)
        else:
            lines.append({"y": word[0], "words": [word]})
    for line in lines:
        line["words"].sort(key=lambda word: word[1])
    return lines


def layout_metrics(path, extracted):
    """Measure page fill and bullet shape from Poppler word bounds."""
    page = next(ET.parse(path).getroot().iter(f"{XHTML}page"))
    height = float(page.attrib["height"])
    lines = text_lines(page)
    bullets, current, text_x = [], None, None
    for line in lines:
        first = line["words"][0]
        if first[3] == "•" and len(line["words"]) > 1:
            text_x = line["words"][1][1]
            current = [line["words"][1:]]
            bullets.append(current)
        elif current is not None and abs(first[1] - text_x) <= 1.5:
            current.append(line["words"])
        else:
            current = None
    long_bullets = [" ".join(w[3] for w in bullet[0])[:60] for bullet in bullets
                    if len(bullet) > MAX_LINES_PER_BULLET]
    widows = [" ".join(w[3] for w in bullet[-1]) for bullet in bullets
              if len(bullet) > 1 and len(bullet[-1]) <= WIDOW_MAX_WORDS]
    bottom_gap = round((height - max(line["y"] for line in lines)) / 72, 2)
    metrics = {"bottomGapInches": bottom_gap, "bullets": len(bullets),
               "linesPerBullet": [len(bullet) for bullet in bullets],
               "longBullets": long_bullets, "widows": widows,
               "hyphenDateRanges": HYPHEN_DATE_RANGE.findall(extracted)}
    findings, warnings = [], []
    if not BOTTOM_GAP_MIN <= bottom_gap <= BOTTOM_GAP_MAX:
        findings.append(f"Bottom white space is {bottom_gap} in; target "
                        f"{BOTTOM_GAP_MIN}-{BOTTOM_GAP_MAX} in")
    if long_bullets:
        findings.append(f"{len(long_bullets)} bullet(s) exceed {MAX_LINES_PER_BULLET} lines: "
                        + "; ".join(long_bullets))
    if metrics["hyphenDateRanges"]:
        findings.append("Date ranges use a hyphen; use an en dash (--): "
                        + "; ".join(metrics["hyphenDateRanges"]))
    if widows:
        warnings.append(f"{len(widows)} bullet(s) end with a short last line: " + "; ".join(widows))
    return metrics, findings, warnings


def new_destination(path):
    path = Path(os.path.abspath(path))
    if path != path.resolve():
        raise ValueError("Symlinked output paths are not allowed")
    temp_root = Path(tempfile.gettempdir()).resolve()
    if temp_root == ROOT or ROOT in temp_root.parents:
        raise ValueError("Temporary root must be outside the repository")
    try:
        relative = path.relative_to(temp_root)
    except ValueError as error:
        raise ValueError("Output must be inside the system temporary directory") from error
    if (len(relative.parts) != 5 or not relative.parts[0].startswith("resume-studio-")
            or relative.parts[1] != "applications"
            or not re.fullmatch(r"[a-z0-9][a-z0-9-]*", relative.parts[2])
            or relative.parts[3] != "revisions"
            or not re.fullmatch(r"[0-9]{3,}", relative.parts[4])):
        raise ValueError("Output must be <temp>/resume-studio-*/applications/<slug>/revisions/<number>")
    workspace = temp_root / relative.parts[0]
    if (not workspace.is_dir() or workspace.stat().st_uid != os.getuid()
            or workspace.stat().st_mode & 0o077):
        raise ValueError("Create a private temporary workspace with tempfile.mkdtemp first")
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    path.mkdir(mode=0o700)  # Exclusive creation protects every earlier revision.
    return path


def render(args):
    inputs = {"resume.tex": Path(args.source).read_bytes(),
              "job-snapshot.md": Path(args.job).read_bytes(),
              "career-evidence.md": Path(args.evidence).read_bytes()}
    source = inputs["resume.tex"].decode("utf-8")
    if len(inputs["resume.tex"]) > MAX_SOURCE:
        raise ValueError("LaTeX source exceeds the 150 KB limit")
    if "\\begin{document}" not in source or "\\end{document}" not in source:
        raise ValueError("Provide a complete LaTeX document")
    out = new_destination(args.output)
    for name, data in inputs.items():
        (out / name).write_bytes(data)
    work = out / "compile"
    work.mkdir(mode=0o700)
    (work / "resume.tex").write_bytes(inputs["resume.tex"])
    log = out / "compile.log"
    log.touch()
    report = {"status": "failed", "createdAt": datetime.now(timezone.utc).isoformat(),
              "pages": None, "findings": [], "warnings": [], "layout": None,
              "visualReview": "required",
              "hashes": {name: digest(data) for name, data in inputs.items()}, "tools": {}}
    findings = report["findings"]
    # Do not inherit agent credentials, TEXINPUTS, or user TeX configuration.
    env = {"PATH": os.environ.get("PATH", "/usr/bin:/bin"), "LANG": "C", "LC_ALL": "C",
           "HOME": str(work), "TMPDIR": str(work), "openin_any": "p", "openout_any": "p",
           "TEXMFHOME": str(work / "texmf-home"), "TEXMFOUTPUT": str(work),
           "TEXMFCONFIG": str(work / "texmf-config"), "TEXMFVAR": str(work / "texmf-var"),
           "SOURCE_DATE_EPOCH": "0", "FORCE_SOURCE_DATE": "1"}
    try:
        binaries = {name: executable(name) for name in ("pdflatex", "pdfinfo", "pdftotext", "pdftoppm")}
        for name, binary in binaries.items():
            version = subprocess.run([binary, "--version" if name == "pdflatex" else "-v"],
                                     env=env, capture_output=True, timeout=10, check=True)
            report["tools"][name] = (version.stdout + version.stderr).decode(errors="replace").splitlines()[0]
        command = tex_command(binaries["pdflatex"], work)
        for _ in range(2):
            run(command, work, env, log)
        run([binaries["pdfinfo"], "resume.pdf"], work, env, out / "pdfinfo.txt")
        info = (out / "pdfinfo.txt").read_text()
        match = re.search(r"^Pages:\s+(\d+)", info, re.MULTILINE)
        pages = int(match[1]) if match else 0
        report["pages"] = pages
        if pages != 1:
            findings.append(f"Expected one page; rendered PDF has {pages} pages")
        run([binaries["pdftotext"], "-layout", "resume.pdf", "resume.txt"], work, env, log)
        extracted = (work / "resume.txt").read_text()
        if len(re.sub(r"\s", "", extracted)) < 80 or "\ufffd" in extracted:
            findings.append("Insufficient or invalid extractable text")
        tex_log = (work / "resume.log").read_text(errors="replace")
        overflows = [float(size) for size in re.findall(
            r"Overfull \\[hv]box \(([\d.]+)pt too (?:wide|high)\)", tex_log) if float(size) > 0.5]
        if overflows:
            findings.append(f"{len(overflows)} overfull text box(es) exceed 0.5 pt")
        if "Missing character:" in tex_log:
            findings.append("Missing glyphs in the rendered PDF; inspect resume.log")
        run([binaries["pdftotext"], "-bbox", "resume.pdf", "bounds.html"], work, env, log)
        try:
            report["wordsChecked"] = check_bounds(work / "bounds.html", pages)
            if pages == 1:
                report["layout"], layout_findings, report["warnings"] = layout_metrics(
                    work / "bounds.html", extracted)
                findings.extend(layout_findings)
        except (ValueError, ET.ParseError, KeyError, StopIteration) as error:
            findings.append(str(error))
        run([binaries["pdftoppm"], "-f", "1", "-l", str(min(max(pages, 1), 3)),
             "-scale-to", "1800", "-png", "resume.pdf", "preview"], work, env, log)
        if not list(work.glob("preview-*.png")):
            findings.append("The PDF preview could not be rendered")
    except (ValueError, OSError, subprocess.SubprocessError) as error:
        findings.append(str(error))
    copied_products = []
    for pattern in ("resume.pdf", "resume.txt", "bounds.html", "preview-*.png"):
        for path in work.glob(pattern):
            destination = out / path.name
            shutil.copyfile(path, destination)
            copied_products.append((path, destination))
    # The revision root is the canonical location for products. Keep compiler
    # logs and diagnostics in compile/, but remove only byte-identical copies
    # whose outer counterpart was successfully retained.
    for inner, outer in copied_products + [(work / "resume.tex", out / "resume.tex")]:
        if inner.is_file() and outer.is_file() and inner.read_bytes() == outer.read_bytes():
            inner.unlink()
    if (out / "resume.pdf").exists():
        report["hashes"]["resume.pdf"] = digest((out / "resume.pdf").read_bytes())
    report["status"] = "failed" if findings else "passed"
    (out / "quality.json").write_text(json.dumps(report, indent=2) + "\n")
    # Snapshots and products are write-protected; review notes can be added later.
    for path in out.iterdir():
        if path.is_file():
            path.chmod(0o400)
    print(json.dumps({"directory": str(out), **report}, indent=2))
    return 1 if findings else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", help="Complete working LaTeX source")
    parser.add_argument("output", help="New revision directory in a private resume-studio-* system temporary workspace")
    parser.add_argument("--job", required=True, help="Job snapshot to preserve")
    parser.add_argument("--evidence", required=True, help="Approved Markdown bank to snapshot")
    args = parser.parse_args()
    os.umask(0o077)
    try:
        return render(args)
    except (ValueError, OSError) as error:
        print(f"Render refused: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
