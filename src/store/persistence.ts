import type { ChatState } from '../types'

const CHAT_STORAGE_KEY = 'chat-state'

export function loadChatState(): ChatState | undefined {
  if (typeof window === 'undefined') return undefined

  const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
  if (!raw) return undefined

  try {
    const parsed = JSON.parse(raw) as Partial<ChatState>
    return {
      chats: parsed.chats ?? [],
      activeChat: parsed.activeChat ?? null,
      activeChatId: parsed.activeChatId ?? '',
      currentChatMessages: parsed.currentChatMessages ?? [],
      messagesByChatId: parsed.messagesByChatId ?? {},
      isLoading: parsed.isLoading ?? false,
      error: parsed.error ?? null,
      lastFailedPrompt: parsed.lastFailedPrompt ?? null,
    }
  } catch {
    return undefined
  }
}

export function saveChatState(state: ChatState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}
