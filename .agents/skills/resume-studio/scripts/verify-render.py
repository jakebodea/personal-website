#!/usr/bin/env python3
"""Real renderer regressions with fictional data only.

The verifier runs a copied skill in an isolated temporary workspace. Artifacts
are removed unless --keep-artifacts is explicitly requested.
"""

import hashlib
import importlib.util
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

SOURCE_SCRIPT = Path(__file__).resolve()
SOURCE_SKILL = SOURCE_SCRIPT.parent.parent
SOURCE_ROOT = SOURCE_SCRIPT.parents[4]

BODY = r"""
\begin{document}
\begin{center}
  {\Huge \scshape Avery Example} \\ \vspace{1pt}
  Example City $\cdot$ avery@example.invalid \\
  \small FICTIONAL RENDER TEST -- NOT A REAL PERSON OR APPLICATION
\end{center}

\section{Experience}
\resumeSubHeadingListStart
  \resumeSubheading{Fictional Harbor Systems}{2022 -- 2025}{Software Engineer}{Example City}
  \resumeItemListStart
    \resumeItem{Built a shared operations workspace that brought intake, document review, and case assignment into one interface, helping a fictional service team follow each request from arrival through resolution.}
    \resumeItem{Implemented typed API contracts and validation for customer records, working with a designer and another engineer to clarify error states and make incomplete submissions easier to correct.}
    \resumeItem{Replaced a manual release checklist with automated integration checks for the team's core workflows; documented known limitations and kept a recovery procedure available during each rollout.}
    \resumeItem{Investigated intermittent synchronization failures using structured logs, reproduced the failure with a small test case, and added retry handling that preserved the original record when a request failed.}
  \resumeItemListEnd
  \resumeSubheading{Fictional Cedar Workshop}{2020 -- 2022}{Junior Software Engineer}{Example City}
  \resumeItemListStart
    \resumeItem{Developed accessible forms and reusable interface components for an internal scheduling tool, pairing with a senior engineer on keyboard navigation, validation messages, and responsive layouts.}
    \resumeItem{Collaborated with support staff to trace recurring scheduling errors, translate observed behavior into reproducible examples, and verify fixes against the original reports before releasing changes.}
    \resumeItem{Maintained relational data migrations and API documentation, describing assumptions and rollback steps so teammates could review changes without reconstructing their implementation history.}
  \resumeItemListEnd
  \resumeSubheading{Fictional Maple Analytics}{2018 -- 2020}{Data Analyst Intern}{Example City}
  \resumeItemListStart
    \resumeItem{Built weekly reporting queries for a fictional operations team, replacing a spreadsheet export with a scheduled job that recorded its inputs and run time for later review.}
    \resumeItem{Cleaned and documented a shared customer table, adding column descriptions and validation queries that flagged duplicate or incomplete records before monthly reporting.}
    \resumeItem{Presented findings to a small review group with clear caveats about sample size, then updated the analysis after questions about seasonal effects in the underlying data.}
  \resumeItemListEnd
\resumeSubHeadingListEnd

\section{Projects}
\resumeSubHeadingListStart
  \resumeProjectHeading{Fictional Library Queue}{Python, SQL}{2025}
  \resumeItemListStart
    \resumeItem{Created a small queue-management prototype that modeled reservations, cancellations, and returns with explicit state transitions and a readable history of changes.}
    \resumeItem{Wrote integration checks for duplicate requests and interrupted updates, then documented the prototype's constraints and the evidence needed before expanding its use.}
  \resumeItemListEnd
  \resumeProjectHeading{Fictional Field Notes}{TypeScript, HTML, CSS}{2024}
  \resumeItemListStart
    \resumeItem{Designed an offline note-taking experiment with searchable entries and clear synchronization states, using sample data to explore how editing conflicts should be presented.}
    \resumeItem{Reviewed the interface with keyboard-only navigation and large text settings, then corrected focus order and labels based on observed usability problems.}
  \resumeItemListEnd
  \resumeProjectHeading{Fictional Recipe Scaler}{TypeScript}{2023}
  \resumeItemListStart
    \resumeItem{Built a small recipe tool that converts units and scales ingredient amounts, with tests for rounding rules and a plain explanation of each conversion it applies.}
  \resumeItemListEnd
\resumeSubHeadingListEnd

\section{Education}
\resumeSubHeadingListStart
  \resumeSubheadingWithDesc{Fictional Example University}{Example City}{B.S. in Computer Science}{2016 -- 2020}
\resumeSubHeadingListEnd

\section{Technical Skills}
\small{\textbf{Languages:} Python, TypeScript, SQL, HTML, CSS \\
\textbf{Practices:} API design, integration testing, accessible interfaces, relational data modeling}
\end{document}
"""


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main(keep_artifacts=False):
    os.umask(0o077)
    real_applications = SOURCE_ROOT / ".resume-studio/applications"
    before_entries = set(real_applications.iterdir()) if real_applications.is_dir() else set()
    # Resolve the temporary directory before passing paths to the production
    # renderer, which deliberately refuses symlinked output destinations.
    workspace = Path(tempfile.mkdtemp(prefix="resume-studio-verify-")).resolve()
    try:
        skill = workspace / ".agents/skills/resume-studio"
        shutil.copytree(SOURCE_SKILL, skill)
        script = skill / "scripts/render.py"
        applications = workspace / "applications"
        applications.mkdir(parents=True, exist_ok=True, mode=0o700)
        # A fixed slug: mkdtemp suffixes can contain underscores, which the
        # renderer's revision-path rule rejects.
        app = applications / "fictional-render-test"
        app.mkdir(mode=0o700)
        (app / "job-snapshot.md").write_text(
            "# FICTIONAL TEST JOB\n\nFictional Example Co seeks a software engineer "
            "with API, testing, accessibility, and relational data experience.\n")
        (app / "fictional-evidence.md").write_text(
            "# FICTIONAL TEST DATA ONLY\n\nThe resume body below is invented solely "
            "for renderer verification. It describes no real person's career.\n\n" + BODY)
        template = (script.parent.parent / "assets/classic.tex").read_text()
        source = template.split(r"\begin{document}")[0] + BODY
        results = []

        def invoke(text, number, output=None):
            draft = app / "draft.tex"
            draft.write_text(text)
            destination = output or app / "revisions" / number
            process = subprocess.run(
                [sys.executable, str(script), str(draft), str(destination),
                 "--job", str(app / "job-snapshot.md"),
                 "--evidence", str(app / "fictional-evidence.md")],
                capture_output=True, text=True, timeout=180, check=False)
            quality = destination / "quality.json"
            report = json.loads(quality.read_text()) if quality.exists() else None
            return process, destination, report

        def expect(name, text, number, finding=None):
            process, destination, report = invoke(text, number)
            if finding is None:
                assert process.returncode == 0 and report["status"] == "passed", (name, process.stdout, process.stderr)
                assert report["pages"] == 1 and (destination / "preview-1.png").is_file()
            else:
                assert process.returncode != 0 and report["status"] == "failed", (name, report)
                assert any(finding in item for item in report["findings"]), (name, report)
            results.append({"test": name, "passed": True, "revision": number})
            return destination

        first = expect("one page, extractable text, bounds, and preview", source, "001")
        assert "FICTIONAL RENDER TEST" in (first / "resume.txt").read_text()
        assert (first / "resume.tex").read_text() == source
        assert (first / "career-evidence.md").read_bytes() == (app / "fictional-evidence.md").read_bytes()
        assert not (first / "compile/resume.pdf").exists()
        assert not (first / "compile/resume.txt").exists()
        assert not (first / "compile/bounds.html").exists()
        assert not list((first / "compile").glob("preview-*.png"))
        # Simulated lock is clearly fictional; it is not a real user approval.
        locked = app / "final/001"
        locked.parent.mkdir(mode=0o700)
        shutil.copytree(first, locked)
        (locked / "approval.md").write_text("# FICTIONAL preservation fixture\n\nSimulated lock for a renderer test, not user approval.\n")
        protected = {path: sha(path) for base in (first, locked) for path in base.rglob("*") if path.is_file()}
        process, _, _ = invoke(source, "001")
        assert process.returncode != 0 and "File exists" in process.stderr
        expect("new revision leaves earlier revision and simulated lock intact",
               source.replace("Avery Example", "Avery Fictional"), "002")
        assert all(sha(path) == value for path, value in protected.items())
        results.append({"test": "overwrite refused; prior source/PDF/lock bytes preserved", "passed": True})

        def append_tex(extra):
            return source.replace(r"\end{document}", extra + "\n" + r"\end{document}")

        expect("two pages rejected", append_tex(r"\newpage FICTIONAL second page."), "003", "Expected one page")
        failed = expect("compilation error rejected", append_tex(r"\undefinedFixtureCommand"), "004", "failed")
        assert (failed / "compile.log").is_file() and (failed / "compile/resume.log").is_file()
        results.append({"test": "failed compiler diagnostics retained", "passed": True})
        expect("no extractable text rejected", r"\documentclass{article}\begin{document}\null\end{document}",
               "005", "extractable text")
        expect("overfull text rejected", append_tex(r"\noindent\hbox{" + "FICTIONAL" * 70 + "}"),
               "006", "overfull text box")
        maple_start = source.index(r"\resumeSubheading{Fictional Maple Analytics}")
        maple_end = source.index(r"\resumeItemListEnd", maple_start) + len(r"\resumeItemListEnd")
        expect("underfilled page rejected", source[:maple_start] + source[maple_end:],
               "010", "Bottom white space")
        expect("hyphenated date range rejected", source.replace("2022 -- 2025", "2022 - 2025"),
               "011", "en dash")
        long_bullet = ("Built a shared operations workspace that brought intake, document review, "
                       "and case assignment into one interface")
        expect("three-line bullet rejected",
               source.replace(long_bullet, long_bullet + ", with extra fictional detail about "
                              "queues, audit notes, reviewer handoffs, escalation paths, and "
                              "weekly summaries for a fictional service team"),
               "012", "exceed 2 lines")
        sentinel = app / "private-sentinel.tex"
        sentinel.write_text("FICTIONAL_PRIVATE_SENTINEL")
        expect("TeX private file input rejected", append_tex(r"\input{" + str(sentinel) + "}"),
               "007", "failed")
        escape = app / "shell-escape-must-not-exist"
        expect("shell escape remains disabled",
               append_tex(r"\immediate\write18{touch " + str(escape) + "}"), "008")
        assert not escape.exists()
        process, _, _ = invoke(source, "009", workspace / "public/fictional-render-must-not-exist")
        assert process.returncode != 0 and not (workspace / "public/fictional-render-must-not-exist").exists()
        results.append({"test": "public output path refused", "passed": True})
        repo_output = SOURCE_ROOT / ".resume-studio/applications/fictional-render-test/revisions/009"
        process, _, _ = invoke(source, "009", repo_output)
        assert process.returncode != 0 and not repo_output.exists()
        results.append({"test": "repository output path refused", "passed": True})
        process, destination, _ = invoke(source + "%" * 150_001, "009")
        assert process.returncode != 0 and not destination.exists() and "150 KB" in process.stderr
        results.append({"test": "source size limit enforced", "passed": True})

        spec = importlib.util.spec_from_file_location("resume_renderer", script)
        renderer = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(renderer)
        bounds = app / "off-page-bounds.html"
        bounds.write_text('<html xmlns="http://www.w3.org/1999/xhtml"><page width="612" height="792">'
                          '<word xMin="-4" yMin="10" xMax="40" yMax="20">FICTIONAL</word></page></html>')
        try:
            renderer.check_bounds(bounds, 1)
            raise AssertionError("Off-page words accepted")
        except ValueError as error:
            assert "page boundary" in str(error)
        results.append({"test": "off-page word bounds rejected", "passed": True})
        widow = app / "widow-bounds.html"
        words = [("•", 28, 137, 32), ("Fictional", 37, 139, 80), ("bullet", 82, 139, 110),
                 ("text", 37, 151, 60), ("continues", 62, 151, 100), ("here", 102, 151, 120),
                 ("today.", 37, 163, 70)]
        widow.write_text('<html xmlns="http://www.w3.org/1999/xhtml"><page width="612" height="792">'
                         + "".join(f'<word xMin="{x1}" yMin="{y - 9}" xMax="{x2}" yMax="{y}">{text}</word>'
                                   for text, x1, y, x2 in words) + "</page></html>")
        metrics, _, warnings = renderer.layout_metrics(widow, "")
        assert metrics["linesPerBullet"] == [3] and metrics["widows"] == ["today."], metrics
        assert any("short last line" in warning for warning in warnings), warnings
        results.append({"test": "bullet lines and widows measured from bounds", "passed": True})
        claims = app / "fictional-claims.json"
        claims.write_text(json.dumps({"results": [
            {"userDefined:ID": 1, "Claim": "Cut fictional login latency from ~8 seconds to ~2 seconds",
             "Never say": "single-handedly", "Status": "Approved"},
            {"userDefined:ID": 2, "Claim": "Manager-reported savings of ~10 hours/week per fictional agent",
             "Qualifier": "manager-reported", "Status": "Approved"},
            {"userDefined:ID": 3, "Claim": "Pending fictional claim about 40 reviewers", "Status": "Candidate"}]}))
        cited = app / "fictional-cited.tex"
        checker = [sys.executable, str(skill / "scripts/check-claims.py"), str(cited), str(claims)]
        cited.write_text("\\resumeItem{Cut login latency from ~8s to ~2s.} % claim: CL-1\n"
                         "\\resumeItem{Manager-reported savings of 10 hours/week per agent.} % claim: CL-2\n"
                         "\\resumeItem{Graduate coursework in AI.} % claim: profile\n")
        assert subprocess.run(checker, capture_output=True, timeout=30).returncode == 0
        cited.write_text("\\resumeItem{Saved 10 hours/week per agent.} % claim: CL-2\n"
                         "\\resumeItem{Single-handedly cut reviewers from 40.} % claim: CL-1, CL-3\n"
                         "\\resumeItem{Kept 99\\% uptime.}\n")
        process = subprocess.run(checker, capture_output=True, text=True, timeout=30)
        issues = [issue for item in json.loads(process.stdout)["results"] for issue in item["issues"]]
        assert process.returncode == 1 and all(any(expected in issue for issue in issues) for expected in (
            "qualifier 'manager-reported'", "CL-3 is Candidate", "banned wording",
            "numbers not found in cited claims: 40", "missing '% claim:'")), issues
        results.append({"test": "claim checker enforces citations, numbers, and qualifiers", "passed": True})
        # Exercise the actual inherited OS sandbox separately from TeX's openin_any.
        sandbox = renderer.tex_command("/bin/cat", first / "compile")[:3]
        read = subprocess.run(sandbox + ["/bin/cat", str(sentinel)], capture_output=True, timeout=10)
        assert read.returncode != 0 and b"FICTIONAL_PRIVATE_SENTINEL" not in read.stdout
        results.append({"test": "OS sandbox denies private reads outside compile directory", "passed": True})
        (app / "verification.json").write_text(json.dumps(results, indent=2) + "\n")
        kept = workspace if keep_artifacts else None
        if keep_artifacts:
            workspace = None
        after_entries = set(real_applications.iterdir()) if real_applications.is_dir() else set()
        assert after_entries == before_entries, "verification touched real application directories"
        print(json.dumps({"application": str(app), "checks": len(results), "passed": True,
                          "preview": str(app / "revisions/001/preview-1.png"),
                          "artifactsKept": bool(kept)}, indent=2))
    finally:
        if workspace is not None:
            shutil.rmtree(workspace)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--keep-artifacts", action="store_true",
                        help="retain the isolated copied workspace in the system temporary directory")
    main(parser.parse_args().keep_artifacts)
