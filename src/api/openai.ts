export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type OpenAIChatRequest = {
  model: string
  maxTokens: number
  messages: OpenAIMessage[]
}

type OpenAIChatResponse = {
  content: string
}

export async function requestOpenAIChat(request: OpenAIChatRequest) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Не удалось получить ответ OpenAI')
  }

  return (await response.json()) as OpenAIChatResponse
}
