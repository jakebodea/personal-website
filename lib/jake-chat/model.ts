export const JAKE_CHAT_MODEL = "openai/gpt-oss-120b"

export const JAKE_CHAT_FALLBACK_MODELS = [
  "openai/gpt-oss-20b",
  "deepseek/deepseek-v4-flash",
  "xiaomi/mimo-v2.5",
]

export const JAKE_CHAT_GATEWAY_OPTIONS = {
  models: JAKE_CHAT_FALLBACK_MODELS,
  tags: ["feature:jake-chat"],
}
