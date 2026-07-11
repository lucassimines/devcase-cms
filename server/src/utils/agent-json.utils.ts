export function extractJson(content: string) {
  const trimmed = content.trim()
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)

  return fenced?.[1]?.trim() ?? trimmed
}
