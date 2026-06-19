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

style notes from the site:
- lowercase is normal here.
- resumes are boring; showing work is better.
- the stack is roughly "i'll learn whatever you need me to learn", with strong experience in typescript, python, and sql, plus some rust dabbling.

projects:
${projectContext}

timeline:
${timelineContext}
`.trim()
}
