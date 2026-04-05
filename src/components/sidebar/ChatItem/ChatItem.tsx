import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react'
import type { Chat } from '../../../types'
import { ActionBtn, Actions, Content, EditInput, Item, Meta, Title } from '../styles'

type ChatItemProps = {
  chat: Chat
  active: boolean
  isEditing: boolean
  editingTitle: string
  onSelect: () => void
  onEdit: () => void
  onEditTitleChange: (value: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: () => void
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}

export default function ChatItem({
  chat,
  active,
  isEditing,
  editingTitle,
  onSelect,
  onEdit,
  onEditTitleChange,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}: ChatItemProps) {
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => onEditTitleChange(e.target.value)

  const preventBlurBeforeClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!isEditing) return
    e.preventDefault()
  }

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        onSelect()
      }}
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
            onEdit()
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
            onDelete()
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
