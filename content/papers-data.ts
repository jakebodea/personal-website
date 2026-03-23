export interface PaperEntry {
  title: string
  date: string
  description: string
  pdfUrl: string
}

export const papers: PaperEntry[] = [
  {
    title: "CouncilGPT-2: Multi-Model Deliberation for Structured Text Generation",
    date: "2026-03-11",
    description: "A Stanford CS224N project exploring whether a council of fine-tuned GPT-2 models can improve structured text generation. The strongest gains show up in sonnet writing, where debate-guided generation substantially improves metrical adherence over single-model and simpler ensemble baselines.",
    pdfUrl: "/papers/council-gpt-2.pdf",
  },
  {
    title: "TTS-Optimized Language Generation via Reinforcement Learning from Synthetic Preference Signals",
    date: "2025-12-05",
    description: "LLMs default to bulleted lists optimized for visual reading, which sound unnatural in voice interfaces. We fine-tune Llama 3.2 1B with GRPO using synthetic preference pairs to produce TTS-friendly prose, achieving a 66.7% reduction in list usage.",
    pdfUrl: "/papers/tts-optimized-language-generation.pdf",
  },
  {
    title: "Support Vector Machines",
    date: "2022-12-06",
    description: "A deep dive into the mathematics behind Support Vector Machines — illustrated with geometric visualizations, graphs, and worked equations — demonstrated through two real-world classification problems: Australian weather prediction and video game rating prediction.",
    pdfUrl: "/papers/support-vector-machines.pdf",
  },
]
