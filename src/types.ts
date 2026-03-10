export type Theme = 'light' | 'dark'

export type AuthScope =
  | 'GIGACHAT_API_PERS'
  | 'GIGACHAT_API_B2B'
  | 'GIGACHAT_API_CORP'

export type Chat = {
  id: string
  title: string
  lastMessageAt: string
}

export type MessageVariant = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  variant: MessageVariant
  author: string
  content: string
  createdAt: string
}

export type ModelId = 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max'

export type ChatSettings = {
  model: ModelId
  temperature: number
  topP: number
  maxTokens: number
  systemPrompt: string
}
