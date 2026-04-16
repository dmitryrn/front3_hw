export type OpenAIModel = {
  id: string
  object: string
  created: number
  owned_by: string
}

export type OpenAIModelsResponse = {
  object: string
  data: OpenAIModel[]
}

const ALLOWED_PATTERN = /^gpt-5/

export async function fetchModels(): Promise<string[]> {
  const response = await fetch('/api/models')

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || 'Failed to fetch models')
  }

  const data: OpenAIModelsResponse = await response.json()
  return data.data
    .map((model) => model.id)
    .filter((id) => ALLOWED_PATTERN.test(id))
    .sort()
}
