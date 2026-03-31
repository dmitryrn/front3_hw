import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from './index'
import { MOCK_CHATS, MOCK_MESSAGES } from '../mockData'
import type { Chat, ChatAction, ChatState, Message } from '../types'

function nowIso() {
  return new Date().toISOString()
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`
}

function buildMockAssistantReply(text: string) {
  return `Моковый ответ ассистента на сообщение: "${text}"`
}

function getCurrentChatMessages(messagesByChatId: Record<string, Message[]>, activeChatId: string) {
  return messagesByChatId[activeChatId] ?? []
}

function getActiveChat(chats: Chat[], activeChatId: string) {
  return chats.find((chat) => chat.id === activeChatId) ?? null
}

const initialActiveChatId = MOCK_CHATS[0]?.id ?? ''

const initialState: ChatState = {
  chats: MOCK_CHATS,
  activeChat: getActiveChat(MOCK_CHATS, initialActiveChatId),
  activeChatId: initialActiveChatId,
  currentChatMessages: getCurrentChatMessages(MOCK_MESSAGES, initialActiveChatId),
  messagesByChatId: MOCK_MESSAGES,
  isLoading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    createChat(state) {
      const newId = id('chat')
      const newChat: Chat = { id: newId, title: 'Новый чат', lastMessageAt: nowIso() }

      state.chats.unshift(newChat)
      state.messagesByChatId[newId] = []
      state.activeChat = newChat
      state.activeChatId = newId
      state.currentChatMessages = []
      state.error = null
    },
    selectChat(state, action: PayloadAction<string>) {
      state.activeChatId = action.payload
      state.activeChat = getActiveChat(state.chats, action.payload)
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, action.payload)
      state.error = null
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

      if (deletedActiveChat) {
        state.isLoading = false
      }

      state.error = null
    },
    editChatTitle(state, action: PayloadAction<{ chatId: string; title: string }>) {
      const { chatId, title } = action.payload
      state.chats = state.chats.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
      state.activeChat = getActiveChat(state.chats, state.activeChatId)
    },
    sendMessageStarted(state, action: PayloadAction<{ chatId: string; message: Message }>) {
      const { chatId, message } = action.payload
      state.messagesByChatId[chatId] = [...(state.messagesByChatId[chatId] ?? []), message]
      state.chats = state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, lastMessageAt: message.createdAt } : chat,
      )
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, state.activeChatId)
      state.isLoading = true
      state.error = null
    },
    sendMessageSucceeded(state, action: PayloadAction<{ chatId: string; message: Message }>) {
      const { chatId, message } = action.payload
      state.messagesByChatId[chatId] = [...(state.messagesByChatId[chatId] ?? []), message]
      state.chats = state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, lastMessageAt: message.createdAt } : chat,
      )
      state.currentChatMessages = getCurrentChatMessages(state.messagesByChatId, state.activeChatId)
      state.isLoading = false
      state.error = null
    },
    sendMessageFailed(state, action: PayloadAction<string>) {
      state.isLoading = false
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const {
  clearError,
  createChat,
  deleteChat,
  editChatTitle,
  selectChat,
  sendMessageFailed,
  sendMessageStarted,
  sendMessageSucceeded,
} = chatSlice.actions

export const sendMessage =
  (text: string) => async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const { activeChatId, isLoading } = getState().chat

    if (!activeChatId || isLoading) return

    const userMessage: Message = {
      id: id('msg'),
      role: 'user',
      author: 'Вы',
      content: text,
      createdAt: nowIso(),
    }

    dispatch(sendMessageStarted({ chatId: activeChatId, message: userMessage }))

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 1000 + Math.floor(Math.random() * 1000)))

      const assistantMessage: Message = {
        id: id('msg'),
        role: 'assistant',
        author: 'GigaChat',
        content: buildMockAssistantReply(text),
        createdAt: nowIso(),
      }

      dispatch(sendMessageSucceeded({ chatId: activeChatId, message: assistantMessage }))
    } catch {
      dispatch(sendMessageFailed('Не удалось получить ответ ассистента'))
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

export type ChatSliceAction = ChatAction

export default chatSlice.reducer
