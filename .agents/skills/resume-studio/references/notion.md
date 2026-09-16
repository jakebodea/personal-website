# Notion contract

Read this reference when connecting Resume Studio to Notion, migrating existing
records, or saving a revision. `.resume-studio/notion.md` contains private links
and IDs; this committed reference contains no personal identifiers.

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
Preserve page IDs when continuing an application; a new attempt gets a new record
and dated local slug.

## Read contract

Read all Approved records and the complete Profile page bodies and nested blocks,
then select relevant evidence for the frozen job. Preserve caveats and
attribution. Read the complete immutable Job Snapshot, then the Application's
current summary and numbered revision history.
Treat summary properties as current metadata and older prose as historical. The
Evidence used relation describes current inputs; each revision also stores the
exact dated evidence snapshot used to write it.

## Save contract

Before a write, capture page IDs, URLs, timestamps, and SHA-256 hashes in a local
source manifest. For a bank change, show the exact factual Markdown diff and wait
for explicit approval. Re-fetch the page, save only approved text, and verify the
full result plus its approval record.

For an application revision, upload source, PDF, snapshots, manifest, quality
report, and visual review as exact artifacts. Verify that every attachment exists
before declaring the save complete. If uploaded bytes can be downloaded, compare
their hashes with the local files; if only metadata or existence is available,
record that limitation and retain the local originals until a byte-level round
trip is verified. Keep all numbered revisions, including failures. A PDF can be
uploaded while `Resume state` remains `Checked`; set it to `Approved` only with
explicit PDF approval and the exact approved artifact recorded. Do not infer
`Application stage` from a resume build or upload.
