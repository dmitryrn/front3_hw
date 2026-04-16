import type { Middleware } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import chatReducer, {
  createChat,
  deleteChat,
  editChatTitle,
  sendMessageCancelled,
  sendMessageFailed,
  sendMessageSucceeded,
} from './chatSlice'
import { loadChatState, saveChatState } from './persistence'

const persistedChatState = loadChatState()

const persistActions = new Set<string>([
  createChat.type,
  deleteChat.type,
  editChatTitle.type,
  sendMessageSucceeded.type,
  sendMessageFailed.type,
  sendMessageCancelled.type,
])

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
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistenceMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
