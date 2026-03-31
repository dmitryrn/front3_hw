import type { ChatState } from '../types'

const CHAT_STORAGE_KEY = 'chat-state'

export function loadChatState(): ChatState | undefined {
  if (typeof window === 'undefined') return undefined

  const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
  if (!raw) return undefined

  try {
    return JSON.parse(raw) as ChatState
  } catch {
    return undefined
  }
}

export function saveChatState(state: ChatState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}
