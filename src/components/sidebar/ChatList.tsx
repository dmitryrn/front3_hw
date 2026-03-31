import type { Chat } from '../../types'
import ChatItem from './ChatItem'
import { List } from './styles'

type ChatListProps = {
  chats: Chat[]
  activeChatId: string
  editingChatId: string | null
  editingTitle: string
  onSelectChat: (id: string) => void
  onStartEditChat: (chat: Chat) => void
  onEditTitleChange: (value: string) => void
  onSaveEditChat: () => void
  onCancelEditChat: () => void
  onDeleteChat: (chat: Chat) => void
}

export default function ChatList({
  chats,
  activeChatId,
  editingChatId,
  editingTitle,
  onSelectChat,
  onStartEditChat,
  onEditTitleChange,
  onSaveEditChat,
  onCancelEditChat,
  onDeleteChat,
}: ChatListProps) {
  return (
    <List aria-label="Список чатов">
      {chats.map((c) => (
        <ChatItem
          key={c.id}
          chat={c}
          active={c.id === activeChatId}
          isEditing={c.id === editingChatId}
          editingTitle={c.id === editingChatId ? editingTitle : ''}
          onSelect={() => onSelectChat(c.id)}
          onEdit={() => onStartEditChat(c)}
          onEditTitleChange={onEditTitleChange}
          onSaveEdit={onSaveEditChat}
          onCancelEdit={onCancelEditChat}
          onDelete={() => onDeleteChat(c)}
        />
      ))}
    </List>
  )
}
