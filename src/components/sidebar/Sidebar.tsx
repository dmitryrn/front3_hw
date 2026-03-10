import type { Chat } from '../../types'
import Button from '../ui/Button'
import SearchInput from './SearchInput'
import ChatList from './ChatList'
import { NewChat, Overlay, Plus, SidebarAside, Top } from './styles'

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
  return (
    <>
      <Overlay $open={isOpen} onClick={onClose} aria-hidden />
      <SidebarAside $open={isOpen} aria-label="Боковая панель">
        <Top>
          <Button variant="primary" type="button" onClick={onNewChat}>
            <NewChat>
              <Plus aria-hidden>
                +
              </Plus>
              Новый чат
            </NewChat>
          </Button>
          <SearchInput value={searchValue} onChange={onSearchChange} />
        </Top>
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
      </SidebarAside>
    </>
  )
}
