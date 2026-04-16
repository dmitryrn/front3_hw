import { memo, type ChangeEvent, type KeyboardEvent, type MouseEvent } from 'react'
import type { Chat } from '../../../types'
import { ActionBtn, Actions, Content, EditInput, Item, Meta, Title } from '../styles'

type ChatItemProps = {
  chat: Chat
  active: boolean
  isEditing: boolean
  editingTitle: string
  onSelectChat: (id: string) => void
  onEditChat: (chat: Chat) => void
  onEditTitleChange: (value: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDeleteChat: (chat: Chat) => void
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}

function ChatItem({
  chat,
  active,
  isEditing,
  editingTitle,
  onSelectChat,
  onEditChat,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
  onDeleteChat,
}: ChatItemProps) {
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => onEditTitleChange(e.target.value)
  const selectChat = () => onSelectChat(chat.id)

  const preventBlurBeforeClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!isEditing) return
    e.preventDefault()
  }

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()

    if (e.key === 'Enter') {
      e.preventDefault()
      onSaveEdit()
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      onCancelEdit()
    }
  }

  return (
    <Item
      $active={active}
      role="button"
      tabIndex={0}
      aria-current={active || undefined}
      onClick={selectChat}
    >
      <Content>
        {isEditing ? (
          <EditInput
            type="text"
            value={editingTitle}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            onClick={(e) => e.stopPropagation()}
            autoFocus
            aria-label="Название чата"
          />
        ) : (
          <Title title={chat.title}>{chat.title}</Title>
        )}
        <Meta>{formatDate(chat.lastMessageAt)}</Meta>
      </Content>

      <Actions>
        <ActionBtn
          type="button"
          onMouseDown={preventBlurBeforeClick}
          onClick={(e) => {
            e.stopPropagation()
            if (isEditing) {
              onSaveEdit()
              return
            }
            onEditChat(chat)
          }}
          aria-label={isEditing ? 'Сохранить' : 'Редактировать'}
          title={isEditing ? 'Сохранить' : 'Редактировать'}
        >
          {isEditing ? '✓' : '✎'}
        </ActionBtn>
        <ActionBtn
          type="button"
          onMouseDown={preventBlurBeforeClick}
          onClick={(e) => {
            e.stopPropagation()
            if (isEditing) {
              onCancelEdit()
              return
            }
            onDeleteChat(chat)
          }}
          aria-label={isEditing ? 'Отменить' : 'Удалить'}
          title={isEditing ? 'Отменить' : 'Удалить'}
        >
          {isEditing ? '✕' : '⌫'}
        </ActionBtn>
      </Actions>
    </Item>
  )
}

function areEqual(prevProps: ChatItemProps, nextProps: ChatItemProps) {
  return (
    prevProps.chat === nextProps.chat &&
    prevProps.active === nextProps.active &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.editingTitle === nextProps.editingTitle
  )
}

export default memo(ChatItem, areEqual)
