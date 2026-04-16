const OPENAI_MODELS_URL = 'https://api.openai.com/v1/models'

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return 'Internal server error'
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    res.status(500).send('Missing OPENAI_API_KEY')
    return
  }

  try {
    const response = await fetch(OPENAI_MODELS_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      const message = payload?.error?.message || 'Failed to fetch models'
      res.status(response.status).send(message)
      return
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).send(getErrorMessage(error))
  }
}
