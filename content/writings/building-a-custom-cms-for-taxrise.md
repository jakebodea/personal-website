---
title: "Building a Custom CMS for TaxRise"
date: "2026-04-27"
description: "How I turned a WordPress migration into a custom CMS and marketing platform built around raw MDX, better tooling, and a much cleaner operating model"
---

I currently work at TaxRise, and this started as part of rebuilding the company's marketing site.

Getting close to the old WordPress site was the easy part.

The harder part was realizing that a faithful cutover still would not solve the real problem. If the end state was just "the same marketing site, but now in Next.js," I would have improved the stack without really improving the system around it. Marketing would still be bottlenecked. SEO would still feel overly dependent on engineering. Design changes would still get outsourced into a codebase the people closest to the work could not really shape. The site might be more modern, but the operating model would still be wrong.

So this stopped being a migration project pretty quickly.

What I actually built at TaxRise was a custom CMS and marketing platform around raw MDX, Postgres, Cloudflare R2, our own internal auth, and a codebase structured so both humans and LLMs can make useful changes without casually breaking the architecture underneath. The result is a much cleaner system for publishing, editing, reviewing, revising, and evolving the site, and it gave the people closest to the work a lot more control over it.

That is the part I am proud of.

> Media placeholder: public-site montage or strong article/blog visuals

I used Cursor throughout the project. Early on, that meant more autonomous agent-driven work to get the existing site recreated quickly enough to stop debating abstractions and start looking at something real. Later, it became more synchronous AI-assisted building, where the work was less about "generate me a page" and more about product decisions, architecture, refactors, UX, and shaping the codebase into something durable.

That distinction matters.

I do not really want the story here to be "look how well I used coding assistants." The more interesting story is that tools like Cursor make it realistic for one person to take on a project that cuts across infrastructure, design, product, content systems, SEO, and internal tooling, as long as they still know what they are doing. The tool changes the leverage. It does not replace taste.

A small part of the spark for this came from reading [Lee Robinson's writing](https://leerob.com/agents) around agents and AI-assisted building. What I took from that was not "copy this workflow exactly." It was more the general feeling that a lot of work that used to require a much larger surface area of people, tools, and time now does not.

So I started pulling on that thread.

## What I Was Initially Building

At first, this was supposed to be a relatively straightforward 1:1 cutover from the existing WordPress site into a modern stack.

That phase was useful. It gave me a real map of the site, its route structure, its content patterns, and all the places where "just migrate it" hides a deeper systems problem. Once I had the public-facing site rebuilt closely enough, the question changed.

The question was no longer whether the site could exist outside WordPress. Obviously it could.

The question became: if I already own the whole thing now, why would I preserve the worst parts of the old setup?

Why would marketing still need to outsource ordinary website changes?

Why would editorial work still be trapped behind awkward tooling or engineering handoffs?

Why would I stop at a nicer frontend if the real opportunity was to build a better operating system for the site itself?

That was the actual project.

## The First Wrong Answer Was Still A Useful One

One of the reasons this got interesting is that I did not land on the final architecture immediately.

At first, I thought the editorial side might live closer to GitHub. That was partly inspired by the idea of letting editors submit content PRs for review, which is elegant in the right context. If your editors are already technical, content-in-git can feel clean. You get history, review, and a workflow developers already understand.

But once I thought harder about the actual users here, it was obvious that it was the wrong end state.

I did not want regular marketing or legal users to feel like they were pretending to be developers just to publish content. I wanted drafts, previews, revisions, rollbacks, and scoped access. I wanted a cleaner editorial workflow than "please become comfortable with branches and pull requests." And once I was already rebuilding the whole stack, it became pretty obvious that owning that flow directly would be much better than keeping Git as the product.

That was a major pivot.

The best version of this system was not "WordPress, but modern."

It also was not "marketing, but in GitHub."

It was our own stack.

## What I Built Instead

The core of the system is simple:

- raw MDX is the source of truth for content
- content lives in Postgres
- assets live in Cloudflare R2
- the site renders from that system directly
- the admin sits inside the same application, behind our own staff auth
- publishing includes drafts, previews, revisions, and rollbacks
- the codebase is structured so higher-frequency content and presentation work lives in obvious, safer surfaces

That matters more than any one implementation detail.

Instead of treating the site like a hard-coded frontend with a bolted-on editorial workflow, I treated it like a publishing platform with a real public product on top of it.

Today that system is carrying **234 published content entries** across blogs, case studies, articles, glossary pages, legal pages, and IRS notices. That is enough surface area that this stops being a toy internal tool and starts being a real operating system for a serious marketing site.

> Media placeholder: architecture diagram showing admin -> auth -> Postgres MDX -> Next.js render -> R2 assets

The content model is intentionally not a freeform page-builder mess.

That was important to me.

I wanted the system to be powerful, but bounded. Marketing can work inside templates, structured metadata, MDX content, reusable components, assets, previews, and revisions. That gives them a lot of leverage without turning the site into a brittle no-code sprawl where every page becomes its own private little architecture.

Bigger shell, layout, and interaction changes still belong in code. I think that is a good thing. It preserves coherence, keeps quality high, and makes the whole system easier to reason about.

So the platform is open where it should be open, and opinionated where it should be opinionated.

That tradeoff is part of the design.

## The Admin Actually Matters

I care a lot about internal tools not feeling like punishment.

If you are giving non-engineers more leverage, the answer cannot just be "well, technically they can do it now." The actual experience has to be good enough that people want to use it. Otherwise you have not really solved the problem, you have just moved it somewhere else.

So I put real effort into the editorial experience.

There is an admin surface for content types. There are drafts, previews, revisions, and restores. Assets are managed in one place. The editor experience is better than "fill out a bunch of ugly fields and hope the page renders correctly." The whole thing feels like part of the product, not a neglected back office.

I am mostly going to let the screenshots and recordings do that talking when I publish this for real, because I think the visuals make the point better than prose.

> Media placeholder: admin dashboard screenshot or GIF

> Media placeholder: editor draft / preview / publish flow GIF

> Media placeholder: asset manager GIF

The point is not just that I built a CMS. Plenty of people can say that.

The point is that I built one that gives marketing and legal meaningful control while keeping the public site from degrading into generic CMS sludge.

That is a product problem as much as an engineering one.

## The Public Site Was Part Of The Flex Too

I am especially proud of the editorial side of the public experience.

The article and blog pages feel intentional. The reading experience is cleaner. The layouts are more structured. The sticky navigation and table of contents behavior, the presentation of long-form content, the way supporting blocks sit inside the page, the general balance between usefulness and polish, all of that got better as part of this project.

That matters because the CMS is only half the story.

A lot of internal tooling projects quietly assume the public-facing result can be average as long as the system underneath is clever. I am not interested in that tradeoff. If I am going to rebuild the publishing system, I also want the site itself to feel like it deserves the new foundation.

The homepage is still more of a living surface, and that is actually part of the point. Marketing can now shape more of it over time. But the article and blog experience already show what I wanted this system to enable: strong editorial design, good content structure, and a workflow where better presentation does not require heroics every time.

> Media placeholder: blog/article montage

> Media placeholder: current homepage draft

## The More Interesting Part: I Tried To Make The Codebase LLM-Friendly

This is one of the parts I find most interesting now.

I did not just want a nicer publishing backend. I wanted the surrounding codebase to be organized in a way that made low-risk changes more legible and more local. Not because I wanted to chase some abstract best practice, but because AI changes what kind of leverage is available if the system is structured well.

A design-capable non-engineer should not be wandering blind through a messy application trying to change the hero section and accidentally stepping on unrelated architecture hidden three folders away.

If the codebase is organized cleanly, if content concerns are separated from shell concerns, if templates are obvious, if presentation surfaces are isolated, if content rendering has guardrails, then design-capable teammates can do much more with Cursor and a pull request than they could in a chaotic stack.

That is not an accident. That is design.

Regular marketing and legal users now have the admin for routine editorial work: content, SEO, assets, drafts, previews, and revisions.

Design-capable teammates can go further. They can use Cursor against the real codebase, often from plain-English prompts, and produce pretty good PRs for changes that are meaningful but not architecture-threatening. Changing a hero design is no longer this scary outsourced event. It can live in an obvious part of the codebase, get reviewed like normal software, and stay isolated from the deeper system hidden behind it.

That is a very different operating model from "send it to an outside vendor," or "wait for engineering bandwidth," or "touch nothing because the website is fragile."

I like systems that create safe leverage.

This one does.

## What Changed For The Team

The clearest operational outcome is that the people closest to the marketing work now have much more control over the marketing system.

Marketing does not need to outsource ordinary content and SEO changes to engineering.

Legal has a place to work through the same platform instead of depending on weird ad hoc workflows.

Design-capable marketing teammates can meaningfully participate in code-level presentation changes because the codebase is now accessible, cleaner, and much friendlier to LLM-assisted work.

And because the platform is simpler and more direct, I expect the volume of changes pushed through it to go up, not down. That is usually a good sign. Simpler systems get used.

What I like about this outcome is that it is not just "faster publishing."

It is that more of the website's evolution now lives in-house, closer to the people who actually care about it.

## Why I Built It This Way

The biggest reasons were ownership and simplicity.

I wanted the codebase, rendering model, and publishing surface to belong to us. I did not want the website's content operation scattered across WordPress conventions, plugin assumptions, or another pile of rented abstractions. I also did not want to add a stack of SaaS dependencies just to recreate capabilities that were now within reach to build directly.

The better product feel was a major plus, but it was not the only reason.

Control was the main thing.

If the site is strategically important, and if the people closest to the work need more leverage, and if modern tooling makes custom internal products much cheaper to build than they used to be, then "just buy more tooling" stops being the obvious answer.

That is especially true when the thing you are buying still will not fit your workflow as well as something you can now build yourself.

## The Constraint Was Part Of The Design

I do want to be clear about one thing: this is not a freeform everything-tool.

That was intentional.

I do not think the goal of a good marketing platform is to erase engineering or dissolve every boundary between content and code. The goal is to move the high-frequency work into better hands, with better interfaces, under guardrails that preserve quality.

That means:

- the admin is powerful, but bounded by templates and components
- deeper layout and interaction changes still live in code
- the system gives non-engineers more leverage without pretending every website decision should become a CMS field

I think that is a healthier balance than either extreme.

## The Small AI Take I Actually Believe

I am not in the camp that thinks AI means "SaaS is over."

But I do think AI puts a lot of workflow SaaS under real pressure, especially in situations where strong builders can now own more of the stack than they could justify owning even a couple years ago.

A bunch of tools that once felt inevitable now feel optional.

If you can design the workflow yourself, build the internal product yourself, keep the codebase legible, and give the right people leverage without blowing up quality, then the build-vs-buy equation changes. Not for everything. But for more things than people are used to admitting.

This project pushed me further in that direction.

## Why This Project Matters To Me

I like projects that sit at the intersection of system design, product design, and operational leverage.

This was one of those.

It started as a website migration. It became a custom CMS, a better editorial workflow, a cleaner publishing model, a more useful internal tool, a more LLM-friendly codebase, and a better-looking public experience. It also became a very good example of the kind of work I want to keep doing.

Not because it lets me say I replaced WordPress.

Because it let me take a messy real-world constraint, reshape the whole system around it, and end up with something that gives other people more power without making the product worse.

That is the kind of builder I want to be more of: someone who can see the whole system, make the right tradeoffs, build the thing end to end, and still care what it feels like.