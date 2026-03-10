import type { Chat } from '../../types'
import ChatItem from './ChatItem'
import styles from './Sidebar.module.css'

type ChatListProps = {
  chats: Chat[]
  activeChatId: string
  onSelectChat: (id: string) => void
  onEditChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export default function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  onEditChat,
  onDeleteChat,
}: ChatListProps) {
  return (
    <div className={styles.list} aria-label="Список чатов">
      {chats.map((c) => (
        <ChatItem
          key={c.id}
          chat={c}
          active={c.id === activeChatId}
          onSelect={() => onSelectChat(c.id)}
          onEdit={() => onEditChat(c.id)}
          onDelete={() => onDeleteChat(c.id)}
        />
      ))}
    </div>
  )
}
