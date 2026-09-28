---
name: resume-studio
description: Tailor truthful one-page LaTeX resumes from approved Claims and Career Evidence in Notion. Use for Resume Studio, evidence refreshes, application tailoring, and numbered PDF revisions.
---

# Resume Studio

Notion holds Jake's professional facts; this skill turns them into the best
one-page resume for a job. Read every Approved fact, map it to the posting, and
write bullets in the posting's own vocabulary wherever the fact honestly supports
it, in Jake's format (the Profile's Baseline and rules) and general resume best
practice. Many screeners match the posting's keywords against the resume text, so
wording is free; meaning is not. Every bullet still cites the claims it rests on,
a script checks numbers, qualifiers, and banned phrases, and every page passes the
same layout gates.

Find the existing "Resume Studio" hub in the connected Notion workspace (ask for
its URL if identity is unclear). Read [notion.md](references/notion.md) for the
schema. Never seed a new bank, keep a local registry, or use the legacy
`.resume-studio/` tree as a record. Private material stays out of the public repo
and site; work happens in a private system temporary directory.

## Truth rules

- **Claims are the facts; the wording is yours.** Cite rows with Status =
  Approved, and use their Career Evidence for detail and context. Rephrase freely,
  including in the posting's terms, as long as the bullet says what the cited
  claims support and nothing more: no extra scope, scale, tools, or ownership
  ("contributed" is not "built"; a proof of concept is not a production system).
  Numbers come only from cited claims. Keep every Qualifier phrase and never use a
  Never-say phrase.
- **Record bodies state current truth.** Superseded wording lives in a History
  toggle at the bottom of the page. Approval state lives in properties, never prose.
- **New facts need Jake's yes.** Silence, PDF approval, or a critic suggestion is
  not approval. Write the new claim's text, show it to Jake, and save it as
  Approved only after an explicit yes, recording the quote in `Confirmed by`. When
  a new fact extends an existing claim, revise that claim instead of adding a
  near-duplicate.
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
- Claims: export every row of the Claims data source (`userDefined:ID`, `Claim`,
  `Short`, `Qualifier`, `Never say`, `Role`, `Freshness`, `Confirmed on`,
  `Status`) and save it as `claims.json`. Use SQL, or the database's view mode
  when the SQL quota is exhausted; follow every cursor.
- Evidence: fetch the Approved Career Evidence pages linked from the claims you
  may use (plus Context records such as "Who Jake is" for positioning), save each
  fetch result verbatim in `fetches/` (never add notes to a saved source), and run
  `scripts/compact-bank.py fetches bank.md`.
- Record page IDs, URLs, capture times, and SHA-256 hashes in `manifest.json`.

### 2 Match and questions

Mark each job requirement Supported, Partial, or Unsupported by claim coverage,
not by ability. Also list the posting's hard terms (tools, techniques, domain
words, in its exact spelling, with acronyms) and, for each, the claims that
honestly support it; these become the keyword targets for Compose. Absence from the bank means "not documented": ask whether the
experience exists. Keep each question to one focused topic, most consequential
first, grounded in the posting, and say what the answer could improve. Record each
answer, decline, or fallback in the Application notes, and reuse earlier answers
instead of re-asking. Continue with confirmed material while waiting. An
unanswered question never supplies a claim.

Ask through the runtime's structured question tool (`AskUserQuestion` in Claude
Code), not as chat prose, in batches of up to four ordered by consequence. Give
each question concrete options drawn from the posting and the bank, plus "No" and
"Skip for now"; Jake adds detail through the free-text answer. Put every
definition or piece of context a question needs inside the question text: chat
written before the tool call may not be visible while the prompt is open. When a
term needs a longer explanation, explain it in chat and wait for the answer there
instead of using the tool. A tool answer is
still not approval: turn a useful answer into Candidate text and confirm it
separately. When the tool is unavailable, such as in an unattended subagent,
record the questions in the Application and return them to the caller.

### 3 Compose

Start from the Profile's Baseline (or, until one exists, from
[assets/classic.tex](assets/classic.tex) following the Profile's composition
rules). Set the Application's `Variant` and apply its rules: which second project,
which bullet leads each role, which skills categories. Pick the claims that best
answer the posting, not just the Baseline's, and write each bullet to use the
posting's terms where its claims support them. Put supported terms that no bullet
carries into Technical Skills from the Profile inventory, spelled as the posting
spells them. Then fill in a coverage table (term, where it appears: bullet,
Skills, or missing with the reason) for the review record. End every `\resumeItem`
line with its citation, for example `% claim: CL-9` or `% claim: CL-4, CL-6`.
Use `% claim: profile` only for Education and Skills content taken from the
Profile. Write every URL with the template's `\link{url}{text}` macro (blue,
underlined) so recruiters can spot links at a glance. Then run:

    python3 .agents/skills/resume-studio/scripts/check-claims.py draft.tex claims.json

It fails on a missing citation, a non-Approved claim, a number absent from the
cited claims, a missing qualifier, or banned wording.

### 4 Review

Writing pass: resume best practice. Strong action verb first, then what was
built, then scope or result; plain words, no filler, and keywords worked into
real sentences rather than stuffed. No claim made stronger while made shorter,
and no work repeated across bullets. Then run
[adversarial-review.md](references/adversarial-review.md). Any wording change
reruns `check-claims.py` and the affected critic checks. Fixes made after the
final recheck need the confirmation step in that reference; otherwise the resume
stays a Draft.

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
`manifest.json`, and `quality.json`. Name the PDF
`Jake_Bodea_Resume_{Employer}.pdf`, where `{Employer}` is the Application's
`Company` with words joined by underscores and other punctuation dropped
(`Jake_Bodea_Resume_Haven.pdf`, `Jake_Bodea_Resume_Scale_AI.pdf`), so Jake can
upload it to an application form as is. Every revision of an application uses
that same PDF name; the revision page and `manifest.json` carry the revision
number and hash. Name the other files `{employer}-rev-{NNN}-{file}` in lowercase
(`haven-rev-012-claims.json`), and upload the TeX as `.tex.txt` because Notion
rejects `.tex`. Also paste the final TeX body into a `latex` code block on the
revision page: the connector cannot download uploaded files, so this is how a
later revision starts from this one. Fetch the page and confirm each attachment is present with the
expected filename. When the connector can download binary
files, also compare SHA-256 hashes with the manifest; otherwise record
"byte verification unavailable". Set `Claims used`, `Latest revision`, and
`Baseline hash`, then delete the temporary workspace. Keep failed and superseded
revisions.

### 7 Approve

`Resume state`: Draft until stage 5 passes, Checked after stage 6, Approved only
after Jake explicitly approves that exact PDF. On approval, attach the same bytes,
under the same `Jake_Bodea_Resume_{Employer}.pdf` name, to `Approved PDF`.
Creating a PDF never changes `Application stage`.

## Evidence refresh

For GitHub or other new observations, read
[evidence-refresh.md](references/evidence-refresh.md). New observations become
Candidate evidence and Candidate claims until Jake approves their exact text.

The renderer requires macOS, Python 3.9+, TeX, and Poppler. The scripts use only
the Python standard library.
