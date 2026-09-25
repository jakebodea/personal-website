# Notion contract

Read this reference when connecting Resume Studio to Notion, loading a bank, or
saving a revision. Find the existing hub by title; this public file contains no
personal identifiers or workspace-specific IDs.

## Structure

The "Resume Studio" hub holds three databases and two pages.

**Claims**: one row per resume-ready fact. Every bullet rests on these; the
wording on the page may differ.

| Property | Type | Meaning |
| --- | --- | --- |
| `Claim` | title | The fact, in Jake's approved words |
| `ID` | unique ID, prefix `CL` | Cited in TeX as `CL-12`; SQL exports it as `userDefined:ID` = 12 |
| `Short` | text | Compressed variant; never adds facts or numbers |
| `Qualifier` | text | Must-keep phrases, semicolon-separated |
| `Never say` | text | Banned phrases, semicolon-separated |
| `Role` | select | TaxRise, Beckman Coulter, Ventris Medical, Stanford, Personal, Education, Eligibility |
| `Evidence` | relation | Supporting Career Evidence records |
| `Freshness` | select | Fixed, Dated (keep the date or past tense), Live (confirm within 90 days) |
| `Confirmed on` / `Confirmed by` | date / text | When and how Jake approved the exact text |
| `Status` | select | Candidate, Approved, Retired |

**Career Evidence**: the facts behind claims, with sources and caveats.
`Kind` is Role, Project, Metric, or Context. Context records (strengths essays,
"Who Jake is", GitHub refreshes, historical drafts, superseded clarifications)
inform positioning and are never cited. `Approval` is Candidate, Approved, or
Superseded. Other properties: `Organization`, `Observed on`, `Needs review`,
`Tags`, `Primary source`, and the `Claims` back-relation. The page body states
current truth; superseded wording goes in a `History` toggle at the bottom.

**Applications**: one row per application attempt. Properties: `Name`,
`Company`, `Role`, `Job URL`, `Started`, `Variant` (ML/AI, Product/Full-stack,
Agent engineering, Defense), `Application stage`, `Resume state` (Draft,
Checked, Approved), `Latest revision`, `Approved PDF`, `Claims used`,
`Evidence used`, `Baseline hash`, `Next action`, and `Next action date`. The Job
Snapshot, notes, and numbered revision pages are children of the row.

**Profile** page: contact details, education, employment status, eligibility,
title rules, composition and format rules, the Baseline resume, and the skills
inventory, with a History toggle.

**Archive** page: the original bank, approvals, migration records, and retired
workflow material.

## Read contract

- Query databases with SQL or view mode and follow pagination until
  `has_more` is false. A search snippet or a view's first page is not the bank.
- Load every Approved claim, the full Profile, and the Approved evidence pages
  that the chosen claims link to. Read Context records for positioning only.
- Read the immutable Job Snapshot and the Application's revision history when
  continuing an application, identified by its page ID.

## Write contract

- **Facts** (a new or changed claim or evidence statement): create it as
  Candidate, show Jake the exact text, and set it Approved only after an explicit
  yes. Record the quote in `Confirmed by` (claims) or an Approval history section
  (evidence).
- **Reorganization** (moving text, retyping, adding History toggles, fixing
  cross-references) needs no approval if no fact changes.
- **Retiring**: set a claim to Retired, or evidence to Superseded, with a line
  pointing to what replaced it. Never delete records.
- **Revisions**: follow Save in SKILL.md. Attachment presence with the expected
  filenames is the gate. Byte-hash verification runs when the connector can
  download binaries; otherwise the revision records that it was unavailable.
  Do not keep temporary files as a fallback record.
- Notion turns bare domains such as `example.com` into links, so a later
  search-and-replace edit must match the stored link text. Fetch before editing.
