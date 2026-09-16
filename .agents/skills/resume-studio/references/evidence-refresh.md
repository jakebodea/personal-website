# Refresh career evidence

Improve the evidence by finding recent, relevant, defensible facts. Do not optimize
for larger numbers. Counts can rise or fall; preserve either result and its date.
No source response or ordinary chat answer writes itself into the approved bank.

## GitHub

1. Resolve the user's account from an existing profile link and authenticated
   account; ask only if they disagree or identity is unclear. Use a read-only
   GitHub connector or the existing authenticated gh CLI. Never print tokens.
2. Record capture time and exact UTC windows. Start with the preceding 90 days
   and 365 days for context, plus a current public repository snapshot.
   [github-evidence.graphql](github-evidence.graphql) is a reusable read-only query:

       gh api graphql -F query=@.agents/skills/resume-studio/references/github-evidence.graphql \
         -f login=ACCOUNT -f recentFrom=UTC_START_90_DAYS \
         -f yearFrom=UTC_START_365_DAYS -f to=UTC_CAPTURE_TIME \
         -f mergedQuery='is:pr is:merged author:ACCOUNT merged:START_DATE..END_DATE'

   Substitute actual values. Save the query, variables, and full JSON response
   into a new private dated source folder. gh reads credentials from its own
   configuration; no app integration, new database, or model proxy is needed.
   On unavailable access, record the limitation and continue with dated supported
   evidence; do not report missing access as zero activity.
3. Inspect errors and pagination. Contributions are defined by GitHub and scoped
   to the selected interval. The repository list is owned, public, non-fork
   repositories; its totalCount is not "all repositories." The recent PR search
   counts PRs merged in its date range, while contribution totals describe PR
   contributions in the contribution window; these are different measures.
   Follow cursors for any list used as an exhaustive set. The commit breakdown
   is capped at 100 repositories. Search nodes are examples, not the total.
4. Separate accessible repository data from restricted contribution counts.
   Do not add restricted counts to calendar totals without verifying whether
   they are already included. Preserve visibility and token-scope limitations.
   A private contribution is not an open-source contribution.
5. Follow a few relevant repositories or merged PRs to inspect the actual work,
   release notes, documentation, tests, and attribution. Prefer shipped features,
   substantive external contributions, maintained releases, adoption, or measured
   improvements over raw commit totals. Keep repo identifiers/links and dates
   beside each candidate. Do not infer sole authorship from repo ownership,
   skill proficiency from a language label, or original work from forks.
   Distinguish a PR's author from individual code authors and agent-assisted
   work; ask about the user's contribution when that affects the claim. Merged
   code is not proof of production deployment. A PR's self-reported benchmark
   remains a reported measurement until its context is confirmed or reproduced.

Counts need precise labels: a star is not a user, a fork is not deployment,
a commit is not a shipped feature, and generated code/commit volume is not proof
of individual expertise or business impact. Do not calculate "growth" without a
comparable earlier observation. Never modify history or project settings to
inflate contribution statistics.

GitHub's contribution graph has eligibility rules and may lag recent work:
[contribution troubleshooting](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/troubleshooting-missing-contributions).
Use [GitHub's current GraphQL reference](https://docs.github.com/en/graphql/reference)
when adapting the query.

## Other relevant sources

Use existing authorized access and inspect a small set tied to known projects:

- Local repository tests, coverage artifacts, CI runs, and releases: record the
  commit, tool, command, scope, and timestamp. Distinguish an old report from a
  check actually rerun now; read test commands before executing side effects.
- Package registries and project analytics: preserve the time window, unit,
  filters, exclusions, and whether a count means downloads, events, or users.
- Product outcomes: inspect available reports or saved queries, and ask the user
  for missing ownership, measurement, or causal context. Do not treat an entire
  team's or company's output as the user's individual result.

Read-only exploration of available evidence is allowed; connecting new accounts,
publishing content, contacting people, or altering services is not implied.

## Propose, then save

Write candidate notes explaining the fact, source, date/window, visibility,
attribution, and caveats. Separate useful resume evidence from background
activity context. Preserve old snapshots when refreshing a metric; do not
overwrite a historically correct observation with a differently scoped number.

Show the exact proposed bank diff using SKILL.md's approval process. Stable
contact, education, and skills sections remain unchanged unless new evidence
justifies a specific approved update. Even verified API counts need approval
before entering the bank, and publication is a separate decision.
