# Notion contract

Read this reference when connecting Resume Studio to Notion, migrating existing
records, or saving a revision. Find the existing hub in Notion; this committed
reference contains no personal identifiers or workspace-specific IDs.

## Structure

The hub has two databases and two ordinary pages:

- **Career Evidence**: one reusable accomplishment, bounded project story, or
  independently tracked metric per record. Properties: `Name`, `Kind`
  (`Experience`, `Project`, `Metric`, `Capability`, `Reference`), `Organization`,
  `Approval` (`Candidate`, `Approved`, `Superseded`), `Observed on`, `Needs review`,
  `Tags`, and `Primary source`. The page body holds full wording, sources,
  ownership, dates/windows, units, uncertainty, and exact approval history.
- **Applications**: one company/role/application attempt per record. Properties:
  `Name`, `Company`, `Role`, `Job URL`, `Started`, `Application stage`
  (`Preparing`, `Applied`, `Interviewing`, `Offer`, `Closed`, `Unknown`), `Resume
  state` (`Draft`, `Checked`, `Approved`), `Latest revision` (URL type),
  `Approved PDF` (FILES type), `Evidence used` relation, `Next action` text, and
  `Next action date`.
- **Profile**: ordinary page for stable approved contact, education, skills, and
  presentation preferences.
- **Archive**: ordinary page for the original full bank, approvals, migration
  records, retired workflow, and rendering-kit history.

Use filtered views for Approved/Candidate/Needs review and Active/All/Needs
attention. Query each view with pagination and fetch full page bodies; do not
treat a view's first page or search snippets as exhaustive. Keep job snapshots,
notes, revisions, and approval records under the owning Application page.
Preserve page IDs when continuing an application; a new attempt gets a new record.
The Application and its child pages provide the context for agents on other machines.

## Read contract

Read all Approved records and the complete Profile page bodies and nested blocks,
then select relevant evidence for the frozen job. Preserve caveats and
attribution. Read the complete immutable Job Snapshot, then the Application's
current summary and numbered revision history.
Treat summary properties as current metadata and older prose as historical. The
Evidence used relation describes current inputs; each revision also stores the
exact dated evidence snapshot used to write it.

## Save contract

Before a write, capture page IDs, URLs, timestamps, and SHA-256 hashes in a source
manifest in the temporary workspace. Attach that manifest to the revision. For a
bank change, show the exact factual Markdown diff and wait
for explicit approval. Re-fetch the page, save only approved text, and verify the
full result plus its approval record.

For an application revision, attach the exact source, PDF, snapshots, manifest, and
quality report. Put notes, questions, match/gap analysis, visual review, and the
adversarial review record in the Notion page content so they are readable without
downloading a bundle. Apply
SKILL.md's question and review completion criteria before setting `Resume state`
to `Checked`; keep unresolved attempts as `Draft` with findings in the record.
Historical revisions retain their original review status and available artifacts.
Fetch the saved revision and download its attachments, using the page's signed file
URLs for binary files when needed. Compare downloaded bytes against the manifest
before declaring the save complete and removing temporary files. If an attachment
or comparison is unavailable, record the gap in the Notion revision, keep it
Draft/incomplete, and retry while the temporary files remain. Keep all numbered
revisions in Notion, including failures. A PDF can be
uploaded while `Resume state` remains `Checked`; set it to `Approved` only with
explicit PDF approval and the exact approved artifact recorded. Do not infer
`Application stage` from a resume build or upload.
