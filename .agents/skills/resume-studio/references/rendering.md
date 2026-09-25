# Rendering

From the repository root, run
`python3 .agents/skills/resume-studio/scripts/render.py --help` for arguments.
Complete the writing pass and fact check in [SKILL.md](../SKILL.md) before
rendering. Python 3.9+ uses only its standard library.
Executable discovery checks PATH and /Library/TeX/texbin.

Required system tools: pdflatex, pdfinfo, pdftotext, pdftoppm, and macOS
sandbox-exec. Use an existing TeX Live/MacTeX installation with the packages named
in assets/classic.tex and Poppler. Website Bun dependencies are unrelated; no
package installation or web server is needed for rendering.

The renderer is adapted from the existing app's packages/api/src/studio/latex.ts
and the earlier src/server/latex.ts. The classic template is reused from the app,
with one width correction: project headings use 1.0 rather than 1.001 textwidth,
which otherwise creates a 0.56 pt overfull box. Typography, margins, and spacing
are unchanged. Original applications and backups remain intact.

## Checks and outputs

- Complete source of at most 150,000 bytes; two pdfLaTeX passes with a 45-second
  timeout per command. Failure to compile fails the revision.
- pdfinfo must report exactly one page.
- pdftotext -layout must produce at least 80 non-whitespace characters, with no
  replacement characters. Missing glyph warnings fail the revision.
- TeX overfull horizontal/vertical boxes greater than 0.5 pt fail the revision.
- Parse Poppler word bounds; fail unreadable or absent bounds, non-finite
  coordinates, and words outside a page (1 pt right/bottom tolerance, matching
  the old renderer). Visual inspection still catches overlaps and non-text
  clipping that bounding boxes and TeX logs cannot establish.
- Generate preview-1.png from the PDF, plus up to two additional page previews
  to diagnose an overlong draft. A passing revision always has just one page.
- Layout gates, reported under `layout` in quality.json. Page fill comes from
  the template's `RESUME-FILL` marker (TeX's natural content height against the
  page goal): unused height must be 0–0.35 in. Below zero, TeX is squeezing the
  spacing to keep one page, which word bounds cannot detect. From the word
  bounds: no bullet may exceed two lines, and date ranges must use an en dash. A bullet whose last line
  has two words or fewer is reported under `warnings` for the visual review to
  fix or accept. The thresholds are constants at the top of render.py.

Create a private workspace with Python's `tempfile.mkdtemp(prefix="resume-studio-")`
and resolve its path before invoking the renderer. The output must be a new
`<workspace>/applications/<slug>/revisions/<number>` directory. Repository,
existing, and symlinked destinations are refused. It contains immutable
input snapshots, one canonical outer copy of the PDF/text/bounds/preview products,
compile.log, quality.json, and a private compile/ directory for TeX diagnostics.
Byte-identical compile products are pruned after the outer copy is verified;
unique compiler logs and failed diagnostics remain available during the run.
Record failed attempts and findings in Notion; fix the working draft and use
another revision number. Remove the workspace after all required revision files
are saved to Notion and downloaded bytes match their recorded hashes.
The report includes input/PDF hashes and tool versions. Approval and visual review
remain separate actions, never inferred by the script.

## Compiler restrictions

Preserve -no-shell-escape, openin_any=p, openout_any=p, a fixed source-date epoch,
private TeX configuration/cache directories, bounded process runtime, and a
20 MiB per-file output limit. Only TeX source enters the compile directory; the
job and evidence snapshots remain outside it.

On macOS the inherited sandbox blocks networking, reads of user/volume/temp data
outside the compile directory, and writes outside it except devices. Environment
variables are allowlisted; agent credentials are not passed to TeX. System TeX
package reads remain available. This preserves the app's practical restrictions;
it is not a general-purpose hostile-document sandbox.

The conversation and file workflow is portable across coding agents. The current
compiler sandbox is macOS-specific and fails closed on other platforms. Porting
requires an equivalent tested sandbox, not an unsandboxed fallback.

## Regression verification

Run python3 .agents/skills/resume-studio/scripts/verify-render.py from the root.
It copies the skill into an isolated temporary workspace, creates a fictional
application there, exercises real rendering and failure cases, and checks
revision preservation, security, and canonical artifact cleanup. Temporary
artifacts are removed on success. Pass --keep-artifacts to retain the copied
workspace in the system temporary directory for visual inspection. The verifier
neither reads personal candidates nor edits the career bank.
