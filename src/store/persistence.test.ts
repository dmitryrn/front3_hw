import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadChatState, saveChatState } from './persistence'
import type { ChatState } from '../types'

describe('persistence', () => {
  let storage: Record<string, string>

  beforeEach(() => {
    storage = {}
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage[key] = value
      }),
    })
  })

  it('saveChatState writes state to localStorage', () => {
    const state: ChatState = {
      chats: [],
      activeChat: null,
      activeChatId: '',
      currentChatMessages: [],
      messagesByChatId: {},
      isLoading: false,
      error: null,
      lastFailedPrompt: null,
    }

    saveChatState(state)

    expect(localStorage.setItem).toHaveBeenCalledWith('chat-state', JSON.stringify(state))
    expect(storage['chat-state']).toBe(JSON.stringify(state))
  })

  it('loadChatState returns parsed state from localStorage', () => {
    const state: ChatState = {
      chats: [{ id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' }],
      activeChat: { id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' },
      activeChatId: 'chat-1',
      currentChatMessages: [],
      messagesByChatId: { 'chat-1': [] },
      isLoading: false,
      error: null,
      lastFailedPrompt: null,
    }
    storage['chat-state'] = JSON.stringify(state)

    const result = loadChatState()

    expect(localStorage.getItem).toHaveBeenCalledWith('chat-state')
    expect(result).toEqual(state)
  })

  it('loadChatState returns undefined for invalid JSON', () => {
    storage['chat-state'] = 'not valid json {'

    const result = loadChatState()

    expect(result).toBeUndefined()
  })

  it('loadChatState returns undefined when localStorage is empty', () => {
    const result = loadChatState()

    expect(result).toBeUndefined()
  })
})
