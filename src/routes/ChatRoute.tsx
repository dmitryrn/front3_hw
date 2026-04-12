import type { Chat, Message } from '../types'
import ChatWindow from '../components/chat/ChatWindow/ChatWindow'
import EmptyState from '../components/ui/EmptyState/EmptyState'

type ChatRouteProps = {
  chat: Chat | null
  messages: Message[]
  isLoading?: boolean
  error?: string | null
  onOpenSidebar: () => void
  onOpenSettings: () => void
  onSendMessage: (text: string) => void
}

export default function ChatRoute({
  chat,
  messages,
  isLoading,
  error,
  onOpenSidebar,
  onOpenSettings,
  onSendMessage,
}: ChatRouteProps) {
  if (!chat) {
    return <EmptyState title="Чат не найден" text="Проверьте адрес или выберите другой чат в боковой панели." />
  }

  return (
    <ChatWindow
      chatTitle={chat.title}
      messages={messages}
      isLoading={isLoading}
      error={error}
      onOpenSidebar={onOpenSidebar}
      onOpenSettings={onOpenSettings}
      onSendMessage={onSendMessage}
    />
  )
}
