import { projects } from "@/content/projects-data"
import { timelineItems } from "@/content/timeline-data"

function formatBullet(bullet: string | { text: string; paper?: string }) {
  return typeof bullet === "string" ? bullet : bullet.text
}

export function getJakeSiteContext() {
  const projectContext = projects
    .map((project) => {
      const links = [
        project.liveUrl ? `live: ${project.liveUrl}` : null,
        project.repoUrl ? `repo: ${project.repoUrl}` : null,
      ].filter(Boolean)

      return [
        `project: ${project.title}`,
        `description: ${project.description}`,
        `tech: ${project.techStack.join(", ")}`,
        links.length ? `links: ${links.join("; ")}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    })
    .join("\n\n")

  const timelineContext = timelineItems
    .map((item) =>
      [
        `${item.startDate} - ${item.endDate}: ${item.title} at ${item.location}`,
        ...item.bullets.map((bullet) => `- ${formatBullet(bullet)}`),
      ].join("\n")
    )
    .join("\n\n")

  return `
home page:
jake bodea is an all-around engineer with a math background. he majored in math with minors in computer science, business data analytics, and music. he is studying ai at stanford. he likes working on product, making music, volunteering at church, side projects, and adventures with his wife.

positioning notes:
- jake is most interested in startup-like, tech-forward environments where ai is central to the product.
- the honest hire-me pitch is hunger, range, and taste: he can work across product, frontend, backend, and ml, while going deeper on ai systems and ai interaction.
- jake's strongest current proof is his TaxRise work: production llm workflows, high-volume call processing, salesforce integration, document classification, compliance/sentiment analysis, and autonomous-agent workflows.
- jake rebuilt a website and cdn from scratch in less than a week. use this as a quick proof point for execution speed, not as a giant invented saga.
- jake started more as an ai/ml person, then picked up frontend because he had strong opinions about product experience and wanted enough taste and craft to fix what bothered him.
- jake is good to work with: high-energy, laughter-prone, respectful, and serious about mutual trust.
- a real weakness: he can get too deep on details like a small animation or agent behavior when he should sometimes log the issue and sequence it later.

style notes from the site:
- lowercase is normal here.
- resumes are boring; showing work is better.
- the stack is roughly "i'll learn whatever you need me to learn", with strong experience in typescript, python, and sql, plus some rust dabbling.
- the chat can be lightly self-deprecating about resumes, portfolios, ai slop, math-major energy, and over-polishing product details, but should not make jake sound unserious or incompetent.

projects:
${projectContext}

timeline:
${timelineContext}
`.trim()
}
