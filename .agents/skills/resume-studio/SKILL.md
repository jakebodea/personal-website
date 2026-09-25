---
name: resume-studio
description: Tailor truthful one-page LaTeX resumes from approved Claims and Career Evidence in Notion. Use for Resume Studio, evidence refreshes, application tailoring, and numbered PDF revisions.
---

# Resume Studio

Notion holds the facts; this skill is the workflow. Every resume bullet cites an
Approved row in the Claims database, every number and qualifier is checked by
script, and every page passes the same layout gates. Tailoring is selection and
ordering from the Profile's Baseline, not rewriting.

Find the existing "Resume Studio" hub in the connected Notion workspace (ask for
its URL if identity is unclear). Read [notion.md](references/notion.md) for the
schema. Never seed a new bank, keep a local registry, or use the legacy
`.resume-studio/` tree as a record. Private material stays out of the public repo
and site; work happens in a private system temporary directory.

## Truth rules

- **Claims are the only source of resume wording.** Cite rows with Status =
  Approved. Use the Claim text or its Short variant, adjusting only grammar and
  tense. Keep every Qualifier phrase and never use a Never-say phrase.
- **Record bodies state current truth.** Superseded wording lives in a History
  toggle at the bottom of the page. Approval state lives in properties, never prose.
- **New facts need exact-text approval.** An interview answer, silence, PDF
  approval, or critic suggestion is not approval. Draft a Candidate claim (and
  Candidate evidence if needed), show Jake the exact text, and set Approved only
  after an explicit yes, recording the quote in `Confirmed by`.
- **Freshness.** `Dated` claims keep their date or past tense. `Live` claims need
  `Confirmed on` within 90 days; otherwise ask Jake or phrase them with the date.
- Keep formal titles, ownership, dates, units, and attribution exact. The Profile
  sets title-translation limits (never add seniority) and all layout rules.
- Reorganizing records without changing facts needs no approval; say what moved.

## Pipeline

Each stage has one gate. Do not start the next stage until its gate passes.

| Stage | Output | Gate |
| --- | --- | --- |
| 0 Intake | Application row (`Variant`, `Job URL`) and an immutable Job Snapshot child page | Snapshot text and hash recorded |
| 1 Load | `profile.md`, `claims.json`, `bank.md`, `manifest.json` in the temp workspace | Every query has `has_more: false`; all Approved claims exported |
| 2 Match and questions | Match/Gap table and a short question list in the Application | Every Partial or Unsupported requirement has a question or a recorded fallback |
| 3 Compose | `draft.tex` from the Baseline with slots filled | `check-claims.py` passes |
| 4 Review | Writing pass and critic findings with responses | No material finding open |
| 5 Render | Numbered revision with `quality.json` | `render.py` passes and the preview is visually inspected |
| 6 Save | Notion revision page with attachments; `Claims used` set | Every attachment present (see Save) |
| 7 Approve | Jake's explicit approval of that exact PDF | Quote, revision number, and PDF hash recorded |

### 1 Load

- Profile: fetch the full page, including the Baseline and History.
- Claims: query the Claims data source with SQL (`userDefined:ID`, `Claim`,
  `Short`, `Qualifier`, `Never say`, `Role`, `Freshness`, `Confirmed on`,
  `Status`) and save the raw JSON as `claims.json`.
- Evidence: fetch the Approved Career Evidence pages linked from the claims you
  may use (plus Context records such as "Who Jake is" for positioning), save each
  fetch result in `fetches/`, and run `scripts/compact-bank.py fetches bank.md`.
- Record page IDs, URLs, capture times, and SHA-256 hashes in `manifest.json`.

### 2 Match and questions

Mark each job requirement Supported, Partial, or Unsupported by claim coverage,
not by ability. Absence from the bank means "not documented": ask whether the
experience exists. Ask one focused topic at a time, most consequential first,
grounded in the posting, and say what the answer could improve. Record each
answer, decline, or fallback in the Application notes, and reuse earlier answers
instead of re-asking. Continue with confirmed material while waiting. An
unanswered question never supplies a claim.

### 3 Compose

Start from the Profile's Baseline (or, until one exists, from
[assets/classic.tex](assets/classic.tex) following the Profile's composition
rules). Set the Application's `Variant` and apply its rules: which second project,
which bullet leads each role, which skills categories. End every `\resumeItem`
line with its citation, for example `% claim: CL-9` or `% claim: CL-4, CL-6`.
Use `% claim: profile` only for Education and Skills content taken from the
Profile. Write every URL with the template's `\link{url}{text}` macro (blue,
underlined) so recruiters can spot links at a glance. Then run:

    python3 .agents/skills/resume-studio/scripts/check-claims.py draft.tex claims.json

It fails on a missing citation, a non-Approved claim, a number absent from the
cited claims, a missing qualifier, or banned wording.

### 4 Review

Writing pass: plain verbs, concrete actions, no filler or keyword stuffing, no
claim made stronger while made shorter. Then run
[adversarial-review.md](references/adversarial-review.md). Any wording change
reruns `check-claims.py` and the affected critic checks.

### 5 Render

Read [rendering.md](references/rendering.md). Render into the next unused
revision number; never overwrite. `render.py` fails on more than one page,
overflow, missing glyphs, a bullet longer than two lines, hyphenated date ranges,
content TeX had to squeeze to fit, or more than 0.35 in of unused page height,
and warns about short last lines. Keep the template's `RESUME-FILL` line. Read the extracted text and look at the preview yourself. A layout fix is
a new revision; if it changes wording, return to stage 3.

### 6 Save

Create the numbered revision page under the Application with the Match/Gap
table, questions, writing and critic records, visual findings, and the claim
IDs used. Attach the TeX, PDF, `claims.json`, `bank.md`, Job Snapshot,
`manifest.json`, and `quality.json`. Fetch the page and confirm each attachment
is present with the expected filename. When the connector can download binary
files, also compare SHA-256 hashes with the manifest; otherwise record
"byte verification unavailable". Set `Claims used`, `Latest revision`, and
`Baseline hash`, then delete the temporary workspace. Keep failed and superseded
revisions.

### 7 Approve

`Resume state`: Draft until stage 5 passes, Checked after stage 6, Approved only
after Jake explicitly approves that exact PDF. Creating a PDF never changes
`Application stage`.

## Evidence refresh

For GitHub or other new observations, read
[evidence-refresh.md](references/evidence-refresh.md). New observations become
Candidate evidence and Candidate claims until Jake approves their exact text.

The renderer requires macOS, Python 3.9+, TeX, and Poppler. The scripts use only
the Python standard library.
