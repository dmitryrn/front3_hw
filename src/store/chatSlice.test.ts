import { describe, expect, it } from 'vitest'
import type { Chat, ChatState, Message } from '../types'
import {
  createChat,
  createChatSlice,
  deleteChat,
  editChatTitle,
  selectChat,
  sendMessageCancelled,
  sendMessageFailed,
  sendMessageStarted,
  sendMessageSucceeded,
} from './chatSlice'

function makeChat(id: string, title: string, lastMessageAt = '2026-04-05T10:00:00.000Z'): Chat {
  return { id, title, lastMessageAt }
}

function makeMessage(
  id: string,
  role: Message['role'],
  content: string,
  createdAt = '2026-04-05T10:00:00.000Z',
): Message {
  return {
    id,
    role,
    content,
    createdAt,
    author: role === 'user' ? 'Вы' : 'gpt-5-mini',
  }
}

function makeState(overrides: Partial<ChatState> = {}): ChatState {
  const firstChat = makeChat('chat-1', 'Первый чат')
  const secondChat = makeChat('chat-2', 'Второй чат', '2026-04-05T11:00:00.000Z')
  const firstMessages = [makeMessage('msg-1', 'user', 'Привет')]
  const secondMessages = [makeMessage('msg-2', 'assistant', 'Здравствуйте')]

    return {
      chats: [firstChat, secondChat],
      activeChat: firstChat,
    activeChatId: firstChat.id,
    currentChatMessages: firstMessages,
    messagesByChatId: {
      [firstChat.id]: firstMessages,
      [secondChat.id]: secondMessages,
      },
      isLoading: false,
      error: null,
      lastFailedPrompt: null,
      ...overrides,
    }
}

function makeReducer(initialState: ChatState) {
  return createChatSlice(initialState).reducer
}

describe('chatSlice reducer', () => {
  it('createChat adds a new chat, activates it, and creates empty messages array', () => {
    const initialState = makeState({ error: 'old error' })
    const reducer = makeReducer(initialState)

    const nextState = reducer(undefined, {
      type: createChat.type,
      payload: { id: 'chat-3' },
    })

    expect(nextState).toEqual({
      ...initialState,
      chats: [
        {
          id: 'chat-3',
          title: 'Диалог 3',
          lastMessageAt: expect.any(String),
        },
        ...initialState.chats,
      ],
      activeChatId: 'chat-3',
      activeChat: {
        id: 'chat-3',
        title: 'Диалог 3',
        lastMessageAt: expect.any(String),
      },
      currentChatMessages: [],
      messagesByChatId: {
        ...initialState.messagesByChatId,
        'chat-3': [],
      },
      error: null,
      lastFailedPrompt: null,
    })
  })

  it('createChat resets isLoading', () => {
    const initialState = makeState({ isLoading: true })
    const reducer = makeReducer(initialState)

    const nextState = reducer(undefined, {
      type: createChat.type,
      payload: { id: 'chat-3' },
    })

    expect(nextState.isLoading).toBe(false)
  })

  it('deleteChat removes the active chat and switches to the next available chat', () => {
    const initialState = makeState({ isLoading: true, error: 'old error' })
    const reducer = makeReducer(initialState)

    const nextState = reducer(undefined, deleteChat('chat-1'))

    expect(nextState).toEqual({
      ...initialState,
      chats: [initialState.chats[1]],
      activeChatId: 'chat-2',
      activeChat: initialState.chats[1],
      currentChatMessages: initialState.messagesByChatId['chat-2'],
      messagesByChatId: {
        'chat-2': initialState.messagesByChatId['chat-2'],
      },
      isLoading: false,
      error: null,
      lastFailedPrompt: null,
    })
  })

  it('deleteChat resets active chat state when the last chat is removed', () => {
    const onlyChat = makeChat('chat-1', 'Один чат')
    const onlyMessage = makeMessage('msg-1', 'user', 'Сообщение')
    const initialState = makeState({
      chats: [onlyChat],
      activeChat: onlyChat,
      activeChatId: onlyChat.id,
      currentChatMessages: [onlyMessage],
      messagesByChatId: { [onlyChat.id]: [onlyMessage] },
      isLoading: true,
    })
    const reducer = makeReducer(
      initialState,
    )

    const nextState = reducer(undefined, deleteChat('chat-1'))

    expect(nextState).toEqual({
      ...initialState,
      chats: [],
      activeChatId: '',
      activeChat: null,
      currentChatMessages: [],
      messagesByChatId: {},
      isLoading: false,
      lastFailedPrompt: null,
    })
  })

  it('selectChat switches active chat and resets isLoading', () => {
    const initialState = makeState({ isLoading: true })
    const reducer = makeReducer(initialState)

    const nextState = reducer(undefined, selectChat('chat-2'))

    expect(nextState.activeChatId).toBe('chat-2')
    expect(nextState.currentChatMessages).toEqual(initialState.messagesByChatId['chat-2'])
    expect(nextState.isLoading).toBe(false)
  })

  it('deleteChat resets isLoading even when deleting a non-active chat', () => {
    const initialState = makeState({ activeChatId: 'chat-2', isLoading: true })
    const reducer = makeReducer(initialState)

    const nextState = reducer(undefined, deleteChat('chat-1'))

    expect(nextState.isLoading).toBe(false)
  })

  it('editChatTitle updates the matching chat and activeChat title', () => {
    const secondChat = makeChat('chat-2', 'Второй чат')
    const initialState = makeState({
      chats: [makeChat('chat-1', 'Первый чат'), secondChat],
      activeChat: secondChat,
      activeChatId: secondChat.id,
      currentChatMessages: [],
    })
    const reducer = makeReducer(
      initialState,
    )

    const nextState = reducer(undefined, editChatTitle({ chatId: 'chat-2', title: 'Новое название' }))

    expect(nextState).toEqual({
      ...initialState,
      chats: [initialState.chats[0], { ...secondChat, title: 'Новое название' }],
      activeChat: { ...secondChat, title: 'Новое название' },
    })
  })

  it('sendMessageStarted appends user and assistant messages and generates title for empty chat', () => {
    const emptyChat = makeChat('chat-2', 'Второй чат')
    const userMessage = makeMessage('msg-user', 'user', '   План интеграции API   ', '2026-04-05T12:00:00.000Z')
    const assistantMessage = makeMessage('msg-assistant', 'assistant', '', '2026-04-05T12:00:01.000Z')
    const initialState = makeState({
      chats: [makeChat('chat-1', 'Первый чат'), emptyChat],
      activeChat: emptyChat,
      activeChatId: emptyChat.id,
      currentChatMessages: [],
      messagesByChatId: {
        'chat-1': [makeMessage('msg-1', 'user', 'Привет')],
        'chat-2': [],
      },
      error: 'old error',
    })
    const reducer = makeReducer(
      initialState,
    )

    const nextState = reducer(undefined, sendMessageStarted({ chatId: 'chat-2', userMessage, assistantMessage }))

    expect(nextState).toEqual({
      ...initialState,
      chats: [
        initialState.chats[0],
        {
          ...emptyChat,
          title: 'План интеграции API',
          lastMessageAt: userMessage.createdAt,
        },
      ],
      activeChat: {
        ...emptyChat,
        title: 'План интеграции API',
        lastMessageAt: userMessage.createdAt,
      },
      currentChatMessages: [userMessage, assistantMessage],
      messagesByChatId: {
        ...initialState.messagesByChatId,
        'chat-2': [userMessage, assistantMessage],
      },
      isLoading: true,
      error: null,
      lastFailedPrompt: null,
    })
  })

  it('sendMessageSucceeded updates assistant content and clears loading state', () => {
    const assistantMessage = makeMessage('msg-assistant', 'assistant', '', '2026-04-05T12:00:01.000Z')
    const initialState = makeState({
      chats: [makeChat('chat-1', 'Первый чат', '2026-04-05T10:00:00.000Z')],
      activeChat: makeChat('chat-1', 'Первый чат', '2026-04-05T10:00:00.000Z'),
      activeChatId: 'chat-1',
      currentChatMessages: [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      messagesByChatId: {
        'chat-1': [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      },
      isLoading: true,
      error: 'old error',
    })
    const reducer = makeReducer(
      initialState,
    )

    const nextState = reducer(
      undefined,
      sendMessageSucceeded({
        chatId: 'chat-1',
        messageId: 'msg-assistant',
        content: 'Готово',
      }),
    )

    expect(nextState).toEqual({
      ...initialState,
      chats: [{ ...initialState.chats[0], lastMessageAt: '2026-04-05T12:00:01.000Z' }],
      activeChat: { ...initialState.activeChat!, lastMessageAt: '2026-04-05T12:00:01.000Z' },
      currentChatMessages: [initialState.currentChatMessages[0]!, { ...assistantMessage, content: 'Готово' }],
      messagesByChatId: {
        'chat-1': [initialState.messagesByChatId['chat-1'][0]!, { ...assistantMessage, content: 'Готово' }],
      },
      isLoading: false,
      error: null,
      lastFailedPrompt: null,
    })
  })

  it('sendMessageFailed removes empty assistant placeholder and stores error', () => {
    const assistantMessage = makeMessage('msg-assistant', 'assistant', '', '2026-04-05T12:00:01.000Z')
    const initialState = makeState({
      chats: [makeChat('chat-1', 'Первый чат')],
      activeChat: makeChat('chat-1', 'Первый чат'),
      activeChatId: 'chat-1',
      currentChatMessages: [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      messagesByChatId: {
        'chat-1': [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      },
      isLoading: true,
    })
    const reducer = makeReducer(
      initialState,
    )

    const nextState = reducer(
      undefined,
        sendMessageFailed({
          chatId: 'chat-1',
          messageId: 'msg-assistant',
          error: 'Network error',
          failedText: 'Привет',
        }),
      )

    expect(nextState).toEqual({
      ...initialState,
      currentChatMessages: [initialState.currentChatMessages[0]!],
      messagesByChatId: {
        'chat-1': [initialState.messagesByChatId['chat-1'][0]!],
      },
      isLoading: false,
      error: 'Network error',
      lastFailedPrompt: 'Привет',
    })
  })

  it('sendMessageCancelled removes empty assistant placeholder and clears loading state', () => {
    const assistantMessage = makeMessage('msg-assistant', 'assistant', '', '2026-04-05T12:00:01.000Z')
    const initialState = makeState({
      chats: [makeChat('chat-1', 'Первый чат')],
      activeChat: makeChat('chat-1', 'Первый чат'),
      activeChatId: 'chat-1',
      currentChatMessages: [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      messagesByChatId: {
        'chat-1': [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      },
      isLoading: true,
    })
    const reducer = makeReducer(initialState)

    const nextState = reducer(
      undefined,
      sendMessageCancelled({ chatId: 'chat-1', messageId: 'msg-assistant' }),
    )

    expect(nextState).toEqual({
      ...initialState,
      currentChatMessages: [initialState.currentChatMessages[0]!],
      messagesByChatId: {
        'chat-1': [initialState.messagesByChatId['chat-1'][0]!],
      },
      isLoading: false,
      error: null,
    })
  })

  it('sendMessageCancelled keeps partial assistant message and clears loading state', () => {
    const assistantMessage = makeMessage('msg-assistant', 'assistant', 'partial...', '2026-04-05T12:00:01.000Z')
    const initialState = makeState({
      chats: [makeChat('chat-1', 'Первый чат')],
      activeChat: makeChat('chat-1', 'Первый чат'),
      activeChatId: 'chat-1',
      currentChatMessages: [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      messagesByChatId: {
        'chat-1': [makeMessage('msg-user', 'user', 'Привет'), assistantMessage],
      },
      isLoading: true,
    })
    const reducer = makeReducer(initialState)

    const nextState = reducer(
      undefined,
      sendMessageCancelled({ chatId: 'chat-1', messageId: 'msg-assistant' }),
    )

    expect(nextState).toEqual({
      ...initialState,
      isLoading: false,
      error: null,
    })
  })
})
