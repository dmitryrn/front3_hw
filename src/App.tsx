import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import type { ChatSettings, Theme } from './types'
import AppLayout from './components/layout/AppLayout/AppLayout'
import { DEFAULT_SETTINGS } from './settings'
import {
  createChat,
  deleteChat,
  selectActiveChatId,
  selectChatError,
  selectChatLoading,
  selectLastFailedPrompt,
  selectChats,
  selectMessagesByChatId,
  selectChat as selectChatAction,
  editChatTitle,
  sendMessage,
} from './store/chatSlice'
import { useAppDispatch, useAppSelector } from './store/hooks'

const Sidebar = lazy(() => import('./components/sidebar/Sidebar/Sidebar'))
const SettingsPanel = lazy(() => import('./components/settings/SettingsPanel/SettingsPanel'))
const HomeRoute = lazy(() => import('./routes/HomeRoute'))
const ChatRoute = lazy(() => import('./routes/ChatRoute'))

function SidebarFallback() {
  return <aside aria-hidden>Загрузка боковой панели...</aside>
}

function PanelFallback() {
  return null
}

function RouteFallback() {
  return <div>Загрузка...</div>
}

export default function App() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const chatRouteMatch = useMatch('/chat/:id')
  const routeChatId = chatRouteMatch?.params.id ?? null
  const [theme, setTheme] = useState<Theme>('light')
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const chats = useAppSelector(selectChats)
  const activeChatId = useAppSelector(selectActiveChatId)
  const messagesByChatId = useAppSelector(selectMessagesByChatId)
  const isChatLoading = useAppSelector(selectChatLoading)
  const chatError = useAppSelector(selectChatError)
  const lastFailedPrompt = useAppSelector(selectLastFailedPrompt)

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

  const openSidebar = useCallback(() => setIsSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const openSettings = useCallback(() => setIsSettingsOpen(true), [])
  const closeSettings = useCallback(() => setIsSettingsOpen(false), [])

  const onNewChat = useCallback(() => {
    const action = dispatch(createChat())
    navigate(`/chat/${action.payload.id}`)
  }, [dispatch, navigate])

  const onEditChat = useCallback(
    (chatId: string, title: string) => dispatch(editChatTitle({ chatId, title })),
    [dispatch],
  )

  const onDeleteChat = useCallback((chatId: string) => {
    dispatch(deleteChat(chatId))

    if (routeChatId === chatId) {
      navigate('/')
    }
  }, [dispatch, navigate, routeChatId])

  const onSendMessage = useCallback((text: string) => {
    void dispatch(sendMessage({ text, settings }))
  }, [dispatch, settings])

  const onRetryMessage = useCallback(() => {
    if (!lastFailedPrompt) return
    void dispatch(sendMessage({ text: lastFailedPrompt, settings }))
  }, [dispatch, lastFailedPrompt, settings])

  const onResetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setTheme('light')
  }, [])

  const handleSelectChat = useCallback((chatId: string) => navigate(`/chat/${chatId}`), [navigate])

  return (
    <>
        <AppLayout
          sidebar={
            <Suspense fallback={<SidebarFallback />}>
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                chats={visibleChats}
                activeChatId={sidebarActiveChatId}
                onNewChat={onNewChat}
                onSelectChat={handleSelectChat}
                onEditChat={onEditChat}
                onDeleteChat={onDeleteChat}
              />
            </Suspense>
          }
          chat={
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<HomeRoute />} />
                <Route
                  path="/chat/:id"
                  element={
                    <ChatRoute
                      chat={routedChat}
                      messages={routedMessages}
                      isLoading={isChatLoading}
                      error={chatError}
                      canRetry={Boolean(lastFailedPrompt)}
                      onOpenSidebar={openSidebar}
                      onOpenSettings={openSettings}
                      onSendMessage={onSendMessage}
                      onRetryMessage={onRetryMessage}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          }
        />

      <Suspense fallback={<PanelFallback />}>
        {isSettingsOpen ? (
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
        ) : null}
      </Suspense>
    </>
  )
}
