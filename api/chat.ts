const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return 'Internal server error'
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).send('Missing OPENAI_API_KEY')
    return
  }

  try {
    const { model, temperature, topP, maxTokens, frequencyPenalty, presencePenalty, messages } = req.body ?? {}

    const isReasoningModel =
      model?.startsWith('gpt-5') ||
      /\bo1\b/.test(model) ||
      /\bo3\b/.test(model) ||
      /\bo4\b/.test(model)

    const body: Record<string, unknown> = {
      model,
      messages,
      max_completion_tokens: maxTokens,
      stream: true,
    }

    if (!isReasoningModel) {
      body.temperature = temperature
      body.top_p = topP
      body.frequency_penalty = frequencyPenalty
      body.presence_penalty = presencePenalty
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      const message = payload?.error?.message || 'Failed to fetch OpenAI response'
      res.status(response.status).send(message)
      return
    }

    if (!response.body) {
      res.status(502).send('OpenAI returned an empty response')
      return
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')

    const reader = response.body.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      res.write(Buffer.from(value))
    }

    res.end()
  } catch (error) {
    res.status(500).send(getErrorMessage(error))
  }
}
