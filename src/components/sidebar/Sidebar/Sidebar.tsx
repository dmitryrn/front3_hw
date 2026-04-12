import { useCallback, useState } from 'react'
import type { Chat } from '../../../types'
import Button from '../../ui/Button/Button'
import SearchInput from '../SearchInput/SearchInput'
import ChatList from '../ChatList/ChatList'
import {
  ConfirmActions,
  ConfirmCard,
  ConfirmOverlay,
  ConfirmText,
  ConfirmTitle,
  NewChat,
  Overlay,
  Plus,
  SidebarAside,
  Top,
} from '../styles'

type SidebarProps = {
  isOpen: boolean
  onClose: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  chats: Chat[]
  activeChatId: string
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onEditChat: (id: string, title: string) => void
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
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [pendingDeleteChat, setPendingDeleteChat] = useState<Chat | null>(null)

  const beginEditChat = useCallback((chat: Chat) => {
    setEditingChatId(chat.id)
    setEditingTitle(chat.title)
  }, [])

  const cancelEditChat = useCallback(() => {
    setEditingChatId(null)
    setEditingTitle('')
  }, [])

  const saveEditChat = useCallback(() => {
    if (!editingChatId) return

    const nextTitle = editingTitle.trim()
    if (!nextTitle) return

    onEditChat(editingChatId, nextTitle)
    cancelEditChat()
  }, [cancelEditChat, editingChatId, editingTitle, onEditChat])

  const requestDeleteChat = useCallback((chat: Chat) => {
    cancelEditChat()
    setPendingDeleteChat(chat)
  }, [cancelEditChat])

  const confirmDeleteChat = useCallback(() => {
    if (!pendingDeleteChat) return
    onDeleteChat(pendingDeleteChat.id)
    setPendingDeleteChat(null)
  }, [onDeleteChat, pendingDeleteChat])

  const handleSelectChat = useCallback(
    (id: string) => {
      onSelectChat(id)
      onClose()
    },
    [onClose, onSelectChat],
  )

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
          editingChatId={editingChatId}
          editingTitle={editingChatId ? editingTitle : ''}
          onSelectChat={handleSelectChat}
          onStartEditChat={beginEditChat}
          onEditTitleChange={setEditingTitle}
          onSaveEditChat={saveEditChat}
          onCancelEditChat={cancelEditChat}
          onDeleteChat={requestDeleteChat}
        />
      </SidebarAside>

      {pendingDeleteChat ? (
        <ConfirmOverlay role="dialog" aria-modal="true" aria-labelledby="delete-chat-title">
          <ConfirmCard>
            <ConfirmTitle id="delete-chat-title">Удалить чат?</ConfirmTitle>
            <ConfirmText>
              Чат <strong>{pendingDeleteChat.title}</strong> будет удален без возможности восстановления.
            </ConfirmText>
            <ConfirmActions>
              <Button type="button" variant="ghost" onClick={() => setPendingDeleteChat(null)}>
                Отмена
              </Button>
              <Button type="button" variant="primary" onClick={confirmDeleteChat}>
                Удалить
              </Button>
            </ConfirmActions>
          </ConfirmCard>
        </ConfirmOverlay>
      ) : null}
    </>
  )
}
