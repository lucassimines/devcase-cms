export type CursorAgentRun = {
  id: string
  agentId: string
  status: string
  result?: string
}

export type CreateCursorAgentResponse = {
  agent: { id: string }
  run: CursorAgentRun
}
