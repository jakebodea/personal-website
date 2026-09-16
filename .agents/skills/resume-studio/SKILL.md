---
name: resume-studio
description: Tailor truthful one-page LaTeX resumes from approved Career Evidence in Notion. Use for Resume Studio, evidence refreshes, application tailoring, and numbered PDF revisions.
---

# Resume Studio

Notion is the canonical home for Career Evidence and Applications. This skill is
the authoritative workflow; do not follow a live Notion Agent Workflow or create
a competing bank. Use the private `.resume-studio/` workspace for dated exports,
source manifests, drafts, and revision artifacts. Keep private material out of
the public site and Git.

## Start

1. Read `.resume-studio/notion.md` for the current hub, database IDs, and links.
   On a fresh checkout, ask once for the hub URL; do not seed an empty bank.
2. Read [notion.md](references/notion.md) for the schema and read/save contract.
3. Fetch the full Approved Career Evidence set and the complete Profile, including
   nested blocks, caveats,
   attribution, and approval history. Approved imported text retains its
   qualifications: `Approval=Approved` authorizes it as source context but does
   not authorize an explicitly uncertain subclaim. Header/Profile caveats and
   editorial `Reference` records still govern interpretation and cannot authorize
   facts. Read the immutable Job Snapshot and current Application record for an
   existing application. A view snippet or local Markdown copy is not a complete
   bank.
4. Capture source page IDs, URLs, capture time, and SHA-256 hashes in a manifest
   before replacing any local export or declaring an upload saved. Continue an
   application by its Notion page ID, never by guessing a latest local folder.

Use available Notion tools first and the authorized UI only as fallback. If access
fails, request the relevant page/export rather than silently using stale data.
For database views, use view-mode queries with pagination, then fetch every
returned page body and nested block needed for the task.

## Evidence boundary

- Use only Approved evidence and the approved Profile for reusable claims. Keep
  formal titles, ownership, dates, measurement windows, units, attribution,
  uncertainty, and technical scope accurate. Do not invent metrics, seniority,
  responsibilities, tools, outcomes, or AI experience.
- Application-only answers, clarifications, and observations remain Candidate
  material until the exact bank change is approved. They may be used only for
  that application when the user has explicitly authorized that exception; they
  must never silently become approved bank facts.
- Before any factual bank mutation, show the exact Markdown before/after diff
  and obtain explicit approval. Re-fetch the current page before saving, apply
  only the approved text, preserve the prior wording and approval record, and
  verify the full saved result. A PDF approval, interview answer, silence, or
  continued conversation is not bank approval.
- Keep contact information, education, and Technical Skills stable. Tailor the
  middle/application-specific content to the frozen job snapshot. Functional
  titles may be used only where the bank authorizes them; preserve formal titles
  in the bank.
- Build an evidence-linked Match/Gap Report for the frozen job: mark each
  requirement Supported, Partial, or Unsupported based on current evidence
  coverage, never as a score of underlying ability. Ask focused material-gap
  questions only where an answer could change a factual claim. Select the
  strongest supported middle sections and bullets while preserving stable
  sections; when an optional gap is skipped, use supported adjacent evidence
  instead of inventing coverage.

Organizational migration and reformatting of existing approved text may proceed
under the user's authorization without an approval loop when facts are unchanged.
New factual changes still require the exact before/after diff and explicit
approval.

For GitHub or other current evidence, read [evidence-refresh.md](references/evidence-refresh.md).
Record query windows, visibility, raw responses, attribution, and caveats in the
Evidence Inbox; verified observations still require exact bank approval.

## Writing pass

After tailoring and every wording revision, including layout shortening, run this
repo writing pass before rendering:

- Replace filler and inflated language with concrete actions and plain verbs.
- Write concrete bullets around approved actions and results only. Remove
  formulaic praise, repeated formulas, and keyword stuffing. Keep precise
  technical terms, qualifiers, ownership, attribution, causality, and approved
  facts; do not strengthen a claim while making it shorter.
- Preserve the dense classic section structure and one-page target.
- Recheck each substantive sentence against the approved evidence and record the
  writing pass plus fact check in the revision review.

## Render, review, and save

Export the current bank, Profile, and Job Snapshot into `.resume-studio/` with
source URLs, IDs, capture timestamps, and hashes. Preserve the existing local
`career-evidence.md` before replacing it. It is a snapshot, never an editable
canonical bank.

Start drafts from [assets/classic.tex](assets/classic.tex), the canonical template.
Do not create a second working template. Read [rendering.md](references/rendering.md)
when compiling or troubleshooting. Run `scripts/render.py` into the next unused
numbered revision directory and retain every passed, failed, and superseded
revision. Run the required macOS, one-page, extractable-text, and overflow checks;
read extracted text and inspect the actual rendered PDF preview. Repair layout by
creating a new revision.

A passing quality gate is a reviewable draft. Upload the exact TeX/PDF, source
manifest, bank/job snapshots, quality report, and visual review to that numbered
Notion revision. Verify each upload exists before reporting it saved. When the
connector permits downloading the uploaded bytes, compare their hashes with the
manifest; if it exposes metadata or existence only, report that limit and retain
the local originals until a byte-level round trip is verified. Explicit PDF
approval is a separate final lock: save the exact approval, file hashes, and
revision identity. Page locks or a generated PDF do not establish approval, and
creating a PDF does not change Application stage to Applied.

The renderer requires macOS, Python, TeX, and Poppler. It does not require the
website, a custom UI, a local database, or a synchronization daemon.
