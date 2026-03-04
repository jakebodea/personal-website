export interface PaperEntry {
  title: string
  date: string
  description: string
  pdfUrl: string
}

export const papers: PaperEntry[] = [
  {
    title: "TTS-Optimized Language Generation via Reinforcement Learning from Synthetic Preference Signals",
    date: "2025-12-05",
    description: "LLMs default to bulleted lists optimized for visual reading, which sound unnatural in voice interfaces. We fine-tune Llama 3.2 1B with GRPO using synthetic preference pairs to produce TTS-friendly prose, achieving a 66.7% reduction in list usage.",
    pdfUrl: "/papers/tts-optimized-language-generation.pdf",
  },
]
