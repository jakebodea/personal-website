# Adversarial resume review

Run this loop before delivering a new or wording-revised resume as Checked. It aims
to find defensible improvements and missed questions; agreement is useful only when the
objections have been checked against evidence. Reviewers cannot approve bank
changes, approve a PDF for the user, or submit an application.

## Independent critics

Use three critics with these assignments:

| Critic | Challenge |
| --- | --- |
| Evidence | Unsupported claims, stronger-than-source wording, ambiguous attribution, stale measurements, and lost qualifications |
| Job fit | Weak coverage, stronger examples elsewhere in the bank, transferable experience, and questions that could uncover better evidence |
| Writing | Vague or inflated bullets, repetition, weak ordering, keyword stuffing, and clarity or density problems for a reader |

Select a model below the main agent's capability tier, using the runtime's exposed
model choices. Prefer `gpt-5.6-luna` in Codex when it meets that criterion; use an
available lightweight equivalent elsewhere. Honor an explicit user model override
and record if it changes this preference. Record the main model when exposed,
the chosen critic model, and the runtime's basis for treating it as a lower tier;
if that comparison is unavailable, disclose the uncertainty.
Set the model explicitly when spawning; merely reducing reasoning effort is not
a lower model tier. Keep orchestration and final decisions with the main agent.

Start each critic with a fresh context and only its assignment and review packet,
so the first critiques are independent of the main agent's rationale and each
other. Give them read-only access to the exact draft, frozen job, Match/Gap Report,
approved evidence/Profile snapshots with full caveats, and source index. They may
read further approved source material to check omissions. Label application-only
answers, Candidates, pending questions, and user preferences distinctly. Include
the PDF/text/preview when available; reviewers must state which artifacts they
actually inspected. Include the source manifest already captured by SKILL.md and
identify each packet by its draft and evidence/Profile/job snapshot hashes. New
answers or source changes adopted during the task create a new packet and invalidate
affected checks; historical frozen records remain unchanged. Keep private review
material in the private workspace.

If a lower-tier model or subagent execution is unavailable, report the limitation,
perform the available local checks, and preserve a provisional Draft. Record the
actual model and reviewers used; never claim an independent or lower-tier pass
that did not run. Partial or timed-out results count as incomplete, not a pass;
retry within the review budget or record the missing scope. Local fallback means
the main agent's source/fact, writing, render, and visual checks from SKILL.md.
The user can explicitly waive independent review; record the waiver and remaining
checks before marking Checked, without calling the critic review completed.

## Challenge, respond, recheck

1. **Challenge.** Each critic returns specific findings with an issue ID, whether
   it is material or optional, the exact draft passage or omission, the source/job
   reference, and a proposed correction or user question. A material issue could
   change truthfulness, meaningful job coverage, or readability. An empty finding
   set must identify the reviewed draft and review scope, not just say "looks good."
2. **Respond.** The main agent adjudicates each finding against the sources and
   user intent. Record a fix, a source-backed rejection, a deferred optional
   preference, or a question for the user. Use the Question pass in SKILL.md for
   newly surfaced opportunities. A critic's suggestion is not career evidence.
   Revise the draft and repeat the writing/fact check where wording changes.
3. **Recheck.** Reuse the same critics and frozen sources. Send the current draft
   identity, changed passages, and finding-by-finding responses with references;
   keep the full packet available. Each critic identifies the packet it checked
   and marks prior findings resolved, still open, or not reviewed, citing the
   revised passage or evidence. Give new findings new IDs. Verify fixes and
   source-backed rejections, and check changes for new problems; unchanged checks
   can carry forward only against unchanged packet components. Retain dissent
   when evidence does not resolve it; majority vote does not settle a fact.
4. **Close or surface the disagreement.** The default review budget is three
   critic passes per delivery: initial critiques and up to two rechecks, at most
   nine critic turns including retries. Honor a smaller user-specified budget and
   report any review scope it leaves incomplete. Close only when all three
   critics have reviewed the same final content and each material finding is
   resolved, with the originating critic confirming the resolution. Optional
   tradeoffs may remain if the main agent records the rationale. Material question
   findings must also meet SKILL.md's Question-pass completion criteria. If a critic is
   missing, needed facts remain unresolved, or disagreement persists at the
   limit, report those issues and present a provisional Draft with next steps.
   Do not keep restarting the loop to obtain an agreement label.

A first pass with no findings may close without manufactured edits. After any
wording change, a prior pass cannot stand in for the required recheck. When the
render step changes wording, send the final text back through the affected checks
and obtain each critic's confirmation of that final version. Formatting-only
changes still require the main agent's PDF inspection; identify any content review
carried forward by an identical text hash and the new rendered artifact hashes.

## Review record

Save the adversarial review in the final Notion revision alongside its main review,
including:

- Model selection basis, actual critic models and roles, passes, reviewed
  draft/revision identities and hashes, and which text/PDF/preview artifacts each
  inspected.
- Findings, main-agent responses, changes, source-backed rejections, questions and
  their disposition, plus each critic's final recheck result.
- Final TeX/PDF hashes, unresolved findings, optional tradeoffs, and whether the
  review completed, was incomplete, or was explicitly waived by the user.

Keep factual bank approval and user PDF approval separate from critic agreement.
Historical revisions retain the review records they actually had; do not invent
retrospective critic passes.
