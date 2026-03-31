import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import type { ChatSettings, Theme } from './types'
import AuthForm from './components/auth/AuthForm'
import AppLayout from './components/layout/AppLayout'
import Sidebar from './components/sidebar/Sidebar'
import ChatWindow from './components/chat/ChatWindow'
import SettingsPanel from './components/settings/SettingsPanel'
import EmptyState from './components/ui/EmptyState'
import { DEFAULT_SETTINGS } from './mockData'
import {
  createChat,
  deleteChat,
  selectActiveChatId,
  selectChatError,
  selectChatLoading,
  selectChats,
  selectMessagesByChatId,
  selectChat as selectChatAction,
  editChatTitle,
  sendMessage,
} from './store/chatSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'

export default function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const chatRouteMatch = useMatch('/chat/:id')
  const routeChatId = chatRouteMatch?.params.id ?? null
  const [theme, setTheme] = useState<Theme>('light')
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [isAuthed, setIsAuthed] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const chats = useAppSelector(selectChats)
  const activeChatId = useAppSelector(selectActiveChatId)
  const messagesByChatId = useAppSelector(selectMessagesByChatId)
  const isChatLoading = useAppSelector(selectChatLoading)
  const chatError = useAppSelector(selectChatError)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!routeChatId) return
    dispatch(selectChatAction(routeChatId))
  }, [dispatch, routeChatId])

  const visibleChats = useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return chats
    return chats.filter((chat) => {
      const lastMessage = messagesByChatId[chat.id]?.at(-1)?.content.toLowerCase() ?? ''
      return chat.title.toLowerCase().includes(q) || lastMessage.includes(q)
    })
  }, [chats, messagesByChatId, searchValue])

  const routedChat = routeChatId ? chats.find((chat) => chat.id === routeChatId) ?? null : null
  const routedMessages = routeChatId ? messagesByChatId[routeChatId] ?? [] : []
  const sidebarActiveChatId = routeChatId ?? activeChatId

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)
  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)

  const onApiKeyChange = (value: string) => {
    setApiKey(value)
    if (authError) setAuthError(null)
  }

  const onAuthSubmit = () => {
    if (!apiKey.trim()) {
      setAuthError('Поле OpenAI API Key не должно быть пустым')
      return
    }

    setAuthError(null)
    setIsAuthed(true)
  }

  const onNewChat = () => {
    const action = dispatch(createChat())
    navigate(`/chat/${action.payload.id}`)
  }

  const onEditChat = (chatId: string, title: string) => dispatch(editChatTitle({ chatId, title }))

  const onDeleteChat = (chatId: string) => {
    dispatch(deleteChat(chatId))

    if (routeChatId === chatId) {
      navigate('/')
    }
  }

  const onSendMessage = (text: string) => {
    void dispatch(sendMessage({ text, apiKey, settings }))
  }

  const onResetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    setTheme('light')
  }

  if (!isAuthed) {
    return (
      <AuthForm apiKey={apiKey} error={authError} onApiKeyChange={onApiKeyChange} onSubmit={onAuthSubmit} />
    )
  }

  return (
    <>
      <AppLayout
        sidebar={
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            chats={visibleChats}
            activeChatId={sidebarActiveChatId}
            onNewChat={onNewChat}
            onSelectChat={(chatId) => navigate(`/chat/${chatId}`)}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
          />
        }
        chat={
          <Routes>
            <Route
              path="/"
              element={<EmptyState title="Выберите чат" text="Откройте существующий чат слева или создайте новый." />}
            />
            <Route
              path="/chat/:id"
              element={
                routedChat ? (
                  <ChatWindow
                    chatTitle={routedChat.title}
                    messages={routedMessages}
                    isLoading={isChatLoading}
                    error={chatError}
                    onOpenSidebar={openSidebar}
                    onOpenSettings={openSettings}
                    onSendMessage={onSendMessage}
                  />
                ) : (
                  <EmptyState
                    title="Чат не найден"
                    text="Проверьте адрес или выберите другой чат в боковой панели."
                  />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        }
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        theme={theme}
        onClose={closeSettings}
        onChangeSettings={setSettings}
        onChangeTheme={setTheme}
        onSave={closeSettings}
        onReset={onResetSettings}
      />
    </>
  )
}
