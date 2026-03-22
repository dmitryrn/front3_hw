import { useEffect, useMemo, useRef, useState } from 'react'
import type { AuthScope, Chat, ChatMessage, ChatSettings, Theme } from './types'
import AuthForm from './components/auth/AuthForm'
import AppLayout from './components/layout/AppLayout'
import Sidebar from './components/sidebar/Sidebar'
import ChatWindow from './components/chat/ChatWindow'
import SettingsPanel from './components/settings/SettingsPanel'
import { DEFAULT_SETTINGS, MOCK_CHATS, MOCK_MESSAGES } from './mockData'

function nowIso() {
  return new Date().toISOString()
}

function id(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`
}

function buildMockAssistantReply(text: string) {
  return `Моковый ответ ассистента на сообщение: "${text}"`
}

export default function App() {
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

  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS)
  const [activeChatId, setActiveChatId] = useState(MOCK_CHATS[0]?.id ?? '')
  const [messagesByChatId, setMessagesByChatId] = useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingChatId, setLoadingChatId] = useState('')
  const replyTimeoutIdRef = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    return () => {
      if (replyTimeoutIdRef.current !== null) {
        window.clearTimeout(replyTimeoutIdRef.current)
      }
    }
  }, [])

  const visibleChats = useMemo(() => {
    const q = searchValue.trim().toLowerCase()
    if (!q) return chats
    return chats.filter((c) => c.title.toLowerCase().includes(q))
  }, [chats, searchValue])

  const activeChat = useMemo(() => chats.find((c) => c.id === activeChatId) ?? null, [chats, activeChatId])
  const messages = messagesByChatId[activeChatId] ?? []
  const isChatLoading = isLoading && loadingChatId === activeChatId

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

  const onNewChat = () => {
    const newId = id('chat')
    const newChat: Chat = { id: newId, title: 'Новый чат', lastMessageAt: nowIso() }
    setChats((prev) => [newChat, ...prev])
    setMessagesByChatId((prev) => ({ ...prev, [newId]: [] }))
    setActiveChatId(newId)
  }

  const onEditChat = (chatId: string) => {
    // mock handler
    console.log('edit chat', chatId)
  }

  const onDeleteChat = (chatId: string) => {
    const nextActiveId =
      activeChatId === chatId ? chats.find((c) => c.id !== chatId)?.id ?? '' : activeChatId

    setChats((prev) => prev.filter((c) => c.id !== chatId))
    setMessagesByChatId((prev) => {
      const next = { ...prev }
      delete next[chatId]
      return next
    })

    if (nextActiveId !== activeChatId) setActiveChatId(nextActiveId)
  }

  const onSendMessage = (text: string) => {
    if (!activeChatId || isLoading) return

    const chatId = activeChatId

    const msg: ChatMessage = {
      id: id('msg'),
      role: 'user',
      author: 'Вы',
      content: text,
      createdAt: nowIso(),
    }

    setMessagesByChatId((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? []), msg],
    }))

    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, lastMessageAt: msg.createdAt } : c)))
    setIsLoading(true)
    setLoadingChatId(chatId)

    replyTimeoutIdRef.current = window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: id('msg'),
        role: 'assistant',
        author: 'GigaChat',
        content: buildMockAssistantReply(text),
        createdAt: nowIso(),
      }

      setMessagesByChatId((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] ?? []), assistantMessage],
      }))
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, lastMessageAt: assistantMessage.createdAt } : c)),
      )
      setIsLoading(false)
      setLoadingChatId('')
      replyTimeoutIdRef.current = null
    }, 1000 + Math.floor(Math.random() * 1000))
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
            onSelectChat={setActiveChatId}
            onEditChat={onEditChat}
            onDeleteChat={onDeleteChat}
          />
        }
        chat={
          <ChatWindow
            chatTitle={safeChatTitle}
            messages={messages}
            isLoading={isChatLoading}
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
