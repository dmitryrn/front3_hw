import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './chatSlice'
import { loadChatState, saveChatState } from './persistence'

const persistedChatState = loadChatState()

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  preloadedState: persistedChatState ? { chat: persistedChatState } : undefined,
})

store.subscribe(() => {
  saveChatState(store.getState().chat)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
