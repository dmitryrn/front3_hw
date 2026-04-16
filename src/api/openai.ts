export type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type OpenAIChatRequest = {
  model: string
  temperature: number
  topP: number
  maxTokens: number
  frequencyPenalty: number
  presencePenalty: number
  messages: OpenAIMessage[]
}

type StreamHandlers = {
  onChunk: (chunk: string) => void
}

function processSseEvent(event: string, onChunk: (chunk: string) => void) {
  const lines = event
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('data:'))

  for (const line of lines) {
    let data = line.slice(5).trim()
    while (data.startsWith('data:')) {
      data = data.slice(5).trim()
    }

    if (!data || data === '[DONE]') continue

    let parsed: {
      choices?: Array<{ delta?: { content?: string } }>
    }

    try {
      parsed = JSON.parse(data) as {
        choices?: Array<{ delta?: { content?: string } }>
      }
    } catch (error) {
      console.error('Failed to parse OpenAI SSE chunk', { data, event, error })
      throw error
    }

    const chunk = parsed.choices?.[0]?.delta?.content
    if (chunk) onChunk(chunk)
  }
}

export async function streamOpenAIChat(request: OpenAIChatRequest, handlers: StreamHandlers, signal?: AbortSignal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
    signal,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Не удалось получить ответ OpenAI')
  }

  if (!response.body) {
    throw new Error('Пустой ответ от сервера')
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
