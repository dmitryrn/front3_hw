export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type OpenAIChatRequest = {
  apiKey: string
  model: string
  maxTokens: number
  messages: OpenAIMessage[]
}

type StreamHandlers = {
  onChunk: (chunk: string) => void
}

function getApiKeyError() {
  return 'Введите OpenAI API key'
}

function processSseEvent(event: string, onChunk: (chunk: string) => void) {
  const lines = event
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('data:'))

  for (const line of lines) {
    const data = line.slice(5).trim()
    if (!data || data === '[DONE]') continue

    const parsed = JSON.parse(data) as {
      choices?: Array<{ delta?: { content?: string } }>
    }

    const chunk = parsed.choices?.[0]?.delta?.content
    if (chunk) onChunk(chunk)
  }
}

export async function streamOpenAIChat(request: OpenAIChatRequest, handlers: StreamHandlers) {
  const apiKey = request.apiKey.trim()
  if (!apiKey) {
    throw new Error(getApiKeyError())
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: request.model,
      messages: request.messages,
      max_completion_tokens: request.maxTokens,
      stream: true,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Не удалось получить ответ OpenAI')
  }

  if (!response.body) {
    throw new Error('Пустой ответ от OpenAI')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() ?? ''

    for (const event of events) {
      processSseEvent(event, handlers.onChunk)
    }
  }

  if (buffer.trim()) {
    processSseEvent(buffer, handlers.onChunk)
  }
}
