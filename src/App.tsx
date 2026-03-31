import { useEffect, useMemo, useState } from 'react'
import type { AuthScope, ChatSettings, Theme } from './types'
import AuthForm from './components/auth/AuthForm'
import AppLayout from './components/layout/AppLayout'
import Sidebar from './components/sidebar/Sidebar'
import ChatWindow from './components/chat/ChatWindow'
import SettingsPanel from './components/settings/SettingsPanel'
import { DEFAULT_SETTINGS } from './mockData'
import {
  selectActiveChat,
  createChat,
  deleteChat,
  selectActiveChatId,
  selectChatError,
  selectChatLoading,
  selectChats,
  selectCurrentChatMessages,
  selectChat as selectChatAction,
  sendMessage,
} from './store/chatSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'

export default function App() {
  const dispatch = useAppDispatch()
  const [theme, setTheme] = useState<Theme>('light')
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const initialAuthed =
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('authed') === '1'

  const [isAuthed, setIsAuthed] = useState(initialAuthed)
  const [credentials, setCredentials] = useState('')
  const [scope, setScope] = useState<AuthScope>('GIGACHAT_API_PERS')
  const [authError, setAuthError] = useState<string | null>(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const chats = useAppSelector(selectChats)
  const activeChat = useAppSelector(selectActiveChat)
  const activeChatId = useAppSelector(selectActiveChatId)
  const messages = useAppSelector(selectCurrentChatMessages)
  const isChatLoading = useAppSelector(selectChatLoading)
  const chatError = useAppSelector(selectChatError)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const visibleChats = useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return chats
    return chats.filter((c) => c.title.toLowerCase().includes(q))
  }, [chats, searchValue])

  const openSidebar = () => setIsSidebarOpen(true)
  const closeSidebar = () => setIsSidebarOpen(false)
  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)

  const onCredentialsChange = (value: string) => {
    setCredentials(value)
    if (authError) setAuthError(null)
  }

  const onAuthSubmit = () => {
    if (!credentials.trim()) {
      setAuthError('Поле Credentials не должно быть пустым')
      return
    }

    setAuthError(null)
    setIsAuthed(true)
  }

  const onNewChat = () => dispatch(createChat())

  const onEditChat = (chatId: string) => {
    // mock handler
    console.log('edit chat', chatId)
  }

  const onDeleteChat = (chatId: string) => dispatch(deleteChat(chatId))

  const onSendMessage = (text: string) => {
    void dispatch(sendMessage(text))
  }

  const onResetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    setTheme('light')
  }

  if (!isAuthed) {
    return (
        <AuthForm
          credentials={credentials}
          scope={scope}
          error={authError}
          onCredentialsChange={onCredentialsChange}
          onScopeChange={setScope}
          onSubmit={onAuthSubmit}
        />
    )
  }

  const safeChatTitle = activeChat?.title ?? 'Чат'

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
            activeChatId={activeChatId}
            onNewChat={onNewChat}
            onSelectChat={(chatId) => dispatch(selectChatAction(chatId))}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
          />
        }
        chat={
          <ChatWindow
            chatTitle={safeChatTitle}
            messages={messages}
            isLoading={isChatLoading}
            error={chatError}
            onOpenSidebar={openSidebar}
            onOpenSettings={openSettings}
            onSendMessage={onSendMessage}
          />
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
