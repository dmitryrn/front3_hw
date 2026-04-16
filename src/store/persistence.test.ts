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

    const expected = JSON.stringify({
      chats: state.chats,
      activeChat: state.activeChat,
      activeChatId: state.activeChatId,
      messagesByChatId: state.messagesByChatId,
    })
    expect(localStorage.setItem).toHaveBeenCalledWith('chat-state', expected)
    expect(storage['chat-state']).toBe(expected)
  })

  it('loadChatState returns parsed state from localStorage', () => {
    const toSave = {
      chats: [{ id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' }],
      activeChat: { id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' },
      activeChatId: 'chat-1',
      messagesByChatId: { 'chat-1': [] },
    }
    storage['chat-state'] = JSON.stringify(toSave)

    const result = loadChatState()

    expect(localStorage.getItem).toHaveBeenCalledWith('chat-state')
    expect(result).toEqual({
      ...toSave,
      currentChatMessages: [],
      isLoading: false,
      error: null,
      lastFailedPrompt: null,
    })
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

  it('loadChatState normalizes isLoading to false', () => {
    const toSave = {
      chats: [{ id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' }],
      activeChat: { id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' },
      activeChatId: 'chat-1',
      messagesByChatId: { 'chat-1': [] },
    }
    storage['chat-state'] = JSON.stringify(toSave)

    const result = loadChatState()

    expect(result?.isLoading).toBe(false)
  })

  it('loadChatState reconstructs currentChatMessages from messagesByChatId', () => {
    const toSave = {
      chats: [{ id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' }],
      activeChat: { id: 'chat-1', title: 'Test', lastMessageAt: '2026-04-05T10:00:00.000Z' },
      activeChatId: 'chat-1',
      messagesByChatId: { 'chat-1': [{ id: 'msg-1', role: 'user', author: 'Вы', content: 'Hello', createdAt: '2026-04-05T10:00:00.000Z' }] },
    }
    storage['chat-state'] = JSON.stringify(toSave)

    const result = loadChatState()

    expect(result?.currentChatMessages).toEqual(toSave.messagesByChatId['chat-1'])
  })
})
