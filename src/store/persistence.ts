import type { ChatState } from '../types'

const CHAT_STORAGE_KEY = 'chat-state'

export function loadChatState(): ChatState | undefined {
  if (typeof window === 'undefined') return undefined

  const raw = window.localStorage.getItem(CHAT_STORAGE_KEY)
  if (!raw) return undefined

  try {
    const parsed = JSON.parse(raw) as Partial<ChatState>
    const activeChatId = parsed.activeChatId ?? ''
    const messagesByChatId = parsed.messagesByChatId ?? {}
    return {
      chats: parsed.chats ?? [],
      activeChat: parsed.activeChat ?? null,
      activeChatId,
      currentChatMessages: messagesByChatId[activeChatId] ?? [],
      messagesByChatId,
      isLoading: false,
      error: null,
      lastFailedPrompt: null,
    }
  } catch {
    return undefined
  }
}

export function saveChatState(state: ChatState) {
  if (typeof window === 'undefined') return
  const toSave = {
    chats: state.chats,
    activeChat: state.activeChat,
    activeChatId: state.activeChatId,
    messagesByChatId: state.messagesByChatId,
  }
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave))
}
