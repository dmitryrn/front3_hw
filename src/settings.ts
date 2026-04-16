import type { ChatSettings } from './types'

export const DEFAULT_SETTINGS: ChatSettings = {
  model: 'gpt-5-mini',
  temperature: 1,
  topP: 0.95,
  maxTokens: 2048,
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: 'Ты полезный ассистент. Отвечай кратко и по делу.',
}
