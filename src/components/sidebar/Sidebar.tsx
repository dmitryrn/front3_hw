import type { Chat } from '../../types'
import Button from '../ui/Button'
import SearchInput from './SearchInput'
import ChatList from './ChatList'
import styles from './Sidebar.module.css'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  chats: Chat[]
  activeChatId: string
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onEditChat: (id: string) => void
  onDeleteChat: (id: string) => void
}

export default function Sidebar({
  isOpen,
  onClose,
  searchValue,
  onSearchChange,
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onEditChat,
  onDeleteChat,
}: SidebarProps) {
  const overlayCls = [styles.overlay, isOpen ? styles.overlayOpen : undefined]
    .filter(Boolean)
    .join(' ')
  const sidebarCls = [styles.sidebar, isOpen ? styles.sidebarOpen : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div className={overlayCls} onClick={onClose} aria-hidden />
      <aside className={sidebarCls} aria-label="Боковая панель">
        <div className={styles.top}>
          <Button variant="primary" type="button" onClick={onNewChat}>
            <span className={styles.newChat}>
              <span className={styles.plus} aria-hidden>
                +
              </span>
              Новый чат
            </span>
          </Button>
          <SearchInput value={searchValue} onChange={onSearchChange} />
        </div>
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            onSelectChat(id)
            onClose()
          }}
          onEditChat={onEditChat}
          onDeleteChat={onDeleteChat}
        />
      </aside>
    </>
  )
}
