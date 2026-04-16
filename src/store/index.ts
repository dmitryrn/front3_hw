import type { Middleware } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import chatReducer, {
  createChat,
  deleteChat,
  editChatTitle,
  selectChat,
  sendMessageCancelled,
  sendMessageFailed,
  sendMessageSucceeded,
} from './chatSlice'
import { loadChatState, saveChatState } from './persistence'
import { streamControl } from './streamControl'

const persistedChatState = loadChatState()

const persistActions = new Set<string>([
  createChat.type,
  deleteChat.type,
  editChatTitle.type,
  sendMessageSucceeded.type,
  sendMessageFailed.type,
  sendMessageCancelled.type,
])

const stopGenerationActions = new Set<string>([
  createChat.type,
  selectChat.type,
  deleteChat.type,
])

const streamControlMiddleware: Middleware = () => (next) => (action) => {
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const type = (action as { type: string }).type
    if (stopGenerationActions.has(type)) {
      streamControl.stop()
    }
  }
  return next(action)
}

const persistenceMiddleware: Middleware = (api) => (next) => (action) => {
  const result = next(action)
  if (typeof action === 'object' && action !== null && 'type' in action && persistActions.has((action as { type: string }).type)) {
    saveChatState(api.getState().chat)
  }
  return result
}

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  preloadedState: persistedChatState ? { chat: persistedChatState } : undefined,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(streamControlMiddleware, persistenceMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
