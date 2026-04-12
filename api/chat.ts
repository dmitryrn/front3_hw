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
    const { model, maxTokens, messages } = req.body ?? {}

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_completion_tokens: maxTokens,
      }),
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      const message = payload?.error?.message || 'Failed to fetch OpenAI response'
      res.status(response.status).send(message)
      return
    }

    const content = payload?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) {
      res.status(502).send('OpenAI returned an empty response')
      return
    }

    res.status(200).json({ content })
  } catch (error) {
    res.status(500).send(getErrorMessage(error))
  }
}
