import type { ChatSettings } from './types'

export const DEFAULT_SETTINGS: ChatSettings = {
  model: 'gpt-5-mini',
  temperature: 0.7,
  topP: 0.95,
  maxTokens: 2048,
  systemPrompt: 'Ты полезный ассистент. Отвечай кратко и по делу.',
}
