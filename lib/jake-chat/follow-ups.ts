import type { FollowUp } from "@/lib/jake-chat/types"

export const initialFollowUps: FollowUp[] = [
  {
    id: "work",
    type: "button",
    title: "your work",
    prompt: "what kind of work do you care about most?",
  },
  {
    id: "projects",
    type: "button",
    title: "what you've built",
    prompt: "what have you built, and which project should i look at first?",
  },
  {
    id: "ai",
    type: "button",
    title: "ai background",
    prompt: "what is your background in ai and machine learning?",
  },
  {
    id: "years-at",
    type: "select",
    title: "ask about...",
    promptTemplate:
      "what did you do at {{value}}, and what does it say about your experience?",
    options: [
      { label: "TaxRise", value: "TaxRise" },
      { label: "Stanford", value: "Stanford" },
      { label: "Ventris", value: "Ventris Medical" },
      { label: "Beckman", value: "Beckman Coulter Diagnostics" },
    ],
    customLabel: "somewhere else",
  },
]

export const fallbackFollowUps: FollowUp[] = [
  {
    id: "representative",
    type: "button",
    title: "best signal",
    prompt: "what is the best signal on this site for what you're good at?",
  },
  {
    id: "contact",
    type: "button",
    title: "reach out",
    prompt: "what would be a good reason to reach out to you?",
  },
  {
    id: "compare",
    type: "select",
    title: "compare...",
    promptTemplate:
      "compare your experience with {{value}} to the rest of your background.",
    options: [
      { label: "product work", value: "product work" },
      { label: "ml engineering", value: "machine learning engineering" },
      { label: "teaching", value: "teaching" },
    ],
    customLabel: null,
  },
]

export function fillPromptTemplate(template: string, value: string) {
  const trimmedValue = value.trim()
  const trimmedTemplate = template.trim()

  if (!trimmedTemplate) {
    return trimmedValue
  }

  if (!trimmedTemplate.includes("{{value}}")) {
    return `${trimmedTemplate} ${trimmedValue}`.trim()
  }

  return trimmedTemplate.replaceAll("{{value}}", trimmedValue)
}
