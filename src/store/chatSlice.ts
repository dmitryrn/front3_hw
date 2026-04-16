import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { streamOpenAIChat } from '../api/openai'
import type { AppDispatch, RootState } from './index'
import type { Chat, ChatAction, ChatSettings, ChatState, Message } from '../types'

import { streamControl } from './streamControl'

function nowIso() {
  return new Date().toISOString()
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`
}

const DEFAULT_CHAT_TITLE = 'Новый чат'
const FALLBACK_CHAT_PREFIX = 'Диалог'
const MIN_GENERATED_TITLE_LENGTH = 3
const MAX_GENERATED_TITLE_LENGTH = 36

function getDefaultChatTitle(chats: Chat[]) {
  return chats.length === 0 ? DEFAULT_CHAT_TITLE : `${FALLBACK_CHAT_PREFIX} ${chats.length + 1}`
}

function truncateTitle(value: string) {
  if (value.length <= MAX_GENERATED_TITLE_LENGTH) return value
  return `${value.slice(0, MAX_GENERATED_TITLE_LENGTH - 1).trimEnd()}...`
}

function getGeneratedChatTitle(text: string, chats: Chat[]) {
  const normalizedText = text.replace(/\s+/g, ' ').trim()

  if (normalizedText.length < MIN_GENERATED_TITLE_LENGTH) {
    return getDefaultChatTitle(chats)
  }

  return truncateTitle(normalizedText)
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message
  return 'Не удалось получить ответ ассистента'
}

function buildRequestMessages(settings: ChatSettings, history: Message[], userMessage: Message) {
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = []

  if (settings.systemPrompt.trim()) {
    messages.push({ role: 'system', content: settings.systemPrompt.trim() })
  }

  for (const message of [...history, userMessage]) {
    messages.push({
      role: message.role,
      content: message.content,
    })
  }

  return messages
}

function updateMessageContent(messages: Message[], messageId: string, content: string) {
  return messages.map((message) => (message.id === messageId ? { ...message, content } : message))
}

function getCurrentChatMessages(messagesByChatId: Record<string, Message[]>, activeChatId: string) {
  return messagesByChatId[activeChatId] ?? []
}

function getActiveChat(chats: Chat[], activeChatId: string) {
  return chats.find((chat) => chat.id === activeChatId) ?? null
}

const initialActiveChatId = ''

export const initialChatState: ChatState = {
  chats: [],
  activeChat: null,
  activeChatId: initialActiveChatId,
  currentChatMessages: [],
  messagesByChatId: {},
  isLoading: false,
  error: null,
  lastFailedPrompt: null,
}

export function createChatSlice(initialState: ChatState) {
  return createSlice({
    name: 'chat',
    initialState,
    reducers: {
    createChat: {
      reducer(state, action: PayloadAction<{ id: string }>) {
        const newId = action.payload.id
        const newChat: Chat = {
          id: newId,
          title: getDefaultChatTitle(state.chats),
          lastMessageAt: nowIso(),
        }

        state.chats.unshift(newChat)
        state.messagesByChatId[newId] = []
         state.activeChat = newChat
         state.activeChatId = newId
          state.currentChatMessages = []
          state.isLoading = false
          state.error = null
          state.lastFailedPrompt = null
        },
      prepare() {
        return { payload: { id: id('chat') } }
      },
    },
    selectChat(state, action: PayloadAction<string>) {
      state.activeChatId = action.payload
      state.activeChat = getActiveChat(state.chats, action.payload)
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, action.payload)
      state.isLoading = false
      state.error = null
      state.lastFailedPrompt = null
    },
    deleteChat(state, action: PayloadAction<string>) {
      const chatId = action.payload
      const deletedActiveChat = state.activeChatId === chatId
      const nextActiveChatId =
        deletedActiveChat
          ? state.chats.find((chat) => chat.id !== chatId)?.id ?? ''
          : state.activeChatId

      state.chats = state.chats.filter((chat) => chat.id !== chatId)
      delete state.messagesByChatId[chatId]
      state.activeChatId = nextActiveChatId
      state.activeChat = getActiveChat(state.chats, nextActiveChatId)
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, nextActiveChatId)
      state.isLoading = false
      state.error = null
      state.lastFailedPrompt = null
    },
    editChatTitle(state, action: PayloadAction<{ chatId: string; title: string }>) {
      const { chatId, title } = action.payload
      state.chats = state.chats.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
      state.activeChat = getActiveChat(state.chats, state.activeChatId)
    },
    sendMessageStarted(state, action: PayloadAction<{ chatId: string; userMessage: Message; assistantMessage: Message }>) {
      const { chatId, userMessage, assistantMessage } = action.payload
      const currentMessages = state.messagesByChatId[chatId] ?? []
      const shouldGenerateTitle = currentMessages.length === 0

      state.messagesByChatId[chatId] = [...currentMessages, userMessage, assistantMessage]
      state.chats = state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title: shouldGenerateTitle ? getGeneratedChatTitle(userMessage.content, state.chats) : chat.title,
              lastMessageAt: userMessage.createdAt,
            }
          : chat,
      )
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, state.activeChatId)
      state.activeChat = getActiveChat(state.chats, state.activeChatId)
      state.isLoading = true
      state.error = null
      state.lastFailedPrompt = null
    },
    updateAssistantMessage(state, action: PayloadAction<{ chatId: string; messageId: string; content: string }>) {
      const { chatId, messageId, content } = action.payload
      const currentMessages = state.messagesByChatId[chatId] ?? []
      state.messagesByChatId[chatId] = updateMessageContent(currentMessages, messageId, content)
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, state.activeChatId)
    },
    sendMessageSucceeded(state, action: PayloadAction<{ chatId: string; messageId: string; content: string }>) {
      const { chatId, messageId, content } = action.payload
      const currentMessages = state.messagesByChatId[chatId] ?? []
      const completedMessages = updateMessageContent(currentMessages, messageId, content)
      const message = completedMessages.find((item) => item.id === messageId)

      state.messagesByChatId[chatId] = completedMessages
      state.chats = state.chats.map((chat) =>
        chat.id === chatId && message ? { ...chat, lastMessageAt: message.createdAt } : chat,
      )
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, state.activeChatId)
      state.activeChat = getActiveChat(state.chats, state.activeChatId)
      state.isLoading = false
      state.error = null
    },
    sendMessageFailed(state, action: PayloadAction<{ chatId: string; messageId: string; error: string; failedText: string }>) {
      const { chatId, messageId, error, failedText } = action.payload
      const currentMessages = state.messagesByChatId[chatId] ?? []
      const failedMessage = currentMessages.find((message) => message.id === messageId)

      state.messagesByChatId[chatId] = failedMessage?.content
        ? currentMessages
        : currentMessages.filter((message) => message.id !== messageId)
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, state.activeChatId)
      state.isLoading = false
      state.error = error
      state.lastFailedPrompt = failedText
    },
    sendMessageCancelled(state, action: PayloadAction<{ chatId: string; messageId: string }>) {
      const { chatId, messageId } = action.payload
      const currentMessages = state.messagesByChatId[chatId] ?? []
      const cancelledMessage = currentMessages.find((message) => message.id === messageId)

      // Keep partial messages, drop empty assistant placeholders
      state.messagesByChatId[chatId] = cancelledMessage?.content
        ? currentMessages
        : currentMessages.filter((message) => message.id !== messageId)
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, state.activeChatId)
      state.isLoading = false
      state.error = null
    },
    clearError(state) {
      state.error = null
      state.lastFailedPrompt = null
    },
    },
  })
}

const chatSlice = createChatSlice(initialChatState)

export const {
  clearError,
  createChat,
  deleteChat,
  editChatTitle,
  selectChat,
  sendMessageCancelled,
  sendMessageFailed,
  sendMessageStarted,
  sendMessageSucceeded,
  updateAssistantMessage,
} = chatSlice.actions

export const stopGeneration = () => () => {
  streamControl.stop()
}

export const sendMessage =
  ({ text, settings }: { text: string; settings: ChatSettings }) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const { activeChatId, isLoading, messagesByChatId } = getState().chat

    if (!activeChatId || isLoading) return

    const history = messagesByChatId[activeChatId] ?? []

    const userMessage: Message = {
      id: id('msg'),
      role: 'user',
      author: 'Вы',
      content: text,
      createdAt: nowIso(),
    }

    const assistantMessage: Message = {
      id: id('msg'),
      role: 'assistant',
      author: settings.model,
      content: '',
      createdAt: nowIso(),
    }

    dispatch(sendMessageStarted({ chatId: activeChatId, userMessage, assistantMessage }))

    const controller = streamControl.start()

    try {
      let assistantContent = ''

      await streamOpenAIChat(
        {
          model: settings.model,
          temperature: settings.temperature,
          topP: settings.topP,
          maxTokens: settings.maxTokens,
          frequencyPenalty: settings.frequencyPenalty,
          presencePenalty: settings.presencePenalty,
          messages: buildRequestMessages(settings, history, userMessage),
        },
        {
          onChunk: (chunk) => {
            assistantContent += chunk
            dispatch(
              updateAssistantMessage({
                chatId: activeChatId,
                messageId: assistantMessage.id,
                content: assistantContent,
              }),
            )
          },
        },
        controller.signal,
      )

      dispatch(
        sendMessageSucceeded({
          chatId: activeChatId,
          messageId: assistantMessage.id,
          content: assistantContent,
        }),
      )
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        dispatch(
          sendMessageCancelled({
            chatId: activeChatId,
            messageId: assistantMessage.id,
          }),
        )
        return
      }
      console.error('Failed to send message', error)
      dispatch(
        sendMessageFailed({
          chatId: activeChatId,
          messageId: assistantMessage.id,
          error: getErrorMessage(error),
          failedText: text,
        }),
      )
    } finally {
      streamControl.clear()
    }
  }

export const selectChatState = (state: RootState) => state.chat
export const selectChats = (state: RootState) => state.chat.chats
export const selectActiveChat = (state: RootState) => state.chat.activeChat
export const selectActiveChatId = (state: RootState) => state.chat.activeChatId
export const selectCurrentChatMessages = (state: RootState) => state.chat.currentChatMessages
export const selectMessagesByChatId = (state: RootState) => state.chat.messagesByChatId
export const selectChatLoading = (state: RootState) => state.chat.isLoading
export const selectChatError = (state: RootState) => state.chat.error
export const selectLastFailedPrompt = (state: RootState) => state.chat.lastFailedPrompt

export type ChatSliceAction = ChatAction

export default chatSlice.reducer
