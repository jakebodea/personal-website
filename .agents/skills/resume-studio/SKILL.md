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
   nested blocks, caveats, attribution, and approval history. Approved imported
   text retains its qualifications: `Approval=Approved` authorizes source context,
   not an explicitly uncertain subclaim. Header/Profile caveats and
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

Organizational migration and reformatting of existing approved text may proceed
under the user's authorization without an approval loop when facts are unchanged.
New factual changes still require the exact before/after diff and explicit
approval.

For GitHub or other current evidence, read [evidence-refresh.md](references/evidence-refresh.md).
Record query windows, visibility, raw responses, attribution, and caveats in the
Evidence Inbox; verified observations still require exact bank approval.

## Question pass

Before drafting, build an evidence-linked Match/Gap Report for the frozen job.
Mark requirements Supported, Partial, or Unsupported as evidence coverage, not
underlying ability. Treat absence from the bank as **not documented**; ask whether
relevant experience exists instead of assuming it does not.

Ask every question whose answer could materially improve evidence, example
selection, positioning, or the user's intended emphasis. Look for overlooked
projects, personal contribution versus team scope, technical depth, outcomes and
measurement context, recent work, and transferable experience. This pass applies
even when every requirement already has a supported example.

Keep a short question list in Application notes, derived from the Match/Gap Report,
sources, user goals, and later critic findings. Prioritize the most consequential
topic first, one focused topic at a time unless the user requests a batch. Ground
it in the posting or known work and say what the answer could improve. Phrase it
neutrally, distinguishing confirmed work from a Candidate hint; invite verification
of experience, ownership, and outcomes rather than presupposing them.

For each topic, record the answer/source or its pending/declined status and a
supported fallback. Reuse prior dispositions instead of rephrasing the same
question; reopen only for a distinct unresolved fact or materially changed context.
Add opportunities found during drafting, layout repair, or critique to the same
list. Keep new reusable facts Candidate under the evidence boundary above.
Continue independent work using confirmed material while waiting. Complete the
pass only when every material topic identified from the Match/Gap Report, sources,
user goals, and late findings is on the list and was asked or resolved from sources,
with a supported fallback or omission recorded for unresolved answers. An
unanswered question never supplies a claim.

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

## Adversarial review

Before presenting a new or wording-revised resume as Checked, read and run
[adversarial-review.md](references/adversarial-review.md) after the writing pass.
Use lower-capability subagents to challenge the evidence, job fit, and writing;
the main agent owns the response, factual decisions, and revisions. Exchange
specific objections and revisions until the reference's completion criteria are
met, or report the unresolved issues with a provisional draft. A single critique
followed by an unchecked rewrite does not complete this step.

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
creating a new revision. Recheck changed wording through the writing and critic
passes; the final review must identify the exact rendered revision and hashes.

A passing quality gate and visual review, plus either completed adversarial review
or a recorded explicit user waiver of independent review, make a Checked draft.
Preserve incomplete attempts as Draft with their unresolved issues.
Upload the exact TeX/PDF, source manifest, bank/job snapshots, quality report,
visual review, and adversarial review record to that numbered
Notion revision. Verify each upload exists before reporting it saved. When the
connector permits downloading the uploaded bytes, compare their hashes with the
manifest; if it exposes metadata or existence only, report that limit and retain
the local originals until a byte-level round trip is verified. Explicit PDF
approval is a separate final lock: save the exact approval, file hashes, and
revision identity. Page locks or a generated PDF do not establish approval, and
creating a PDF does not change Application stage to Applied.

The renderer requires macOS, Python, TeX, and Poppler. It does not require the
website, a custom UI, a local database, or a synchronization daemon.
