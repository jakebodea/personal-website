export type FollowUp =
  | {
      id: string
      type: "button"
      title: string
      prompt: string
    }
  | {
      id: string
      type: "select"
      title: string
      promptTemplate: string
      options: Array<{
        label: string
        value: string
      }>
      customLabel: string | null
    }
