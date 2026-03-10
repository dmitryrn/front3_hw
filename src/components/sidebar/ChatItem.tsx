import type { Chat } from '../../types'
import { ActionBtn, Actions, Item, Meta, Title } from './styles'

type ChatItemProps = {
  chat: Chat
  active: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
}

export default function ChatItem({ chat, active, onSelect, onEdit, onDelete }: ChatItemProps) {
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
      <div style={{ minWidth: 0 }}>
        <Title title={chat.title}>
          {chat.title}
        </Title>
        <Meta>{formatDate(chat.lastMessageAt)}</Meta>
      </div>

      <Actions>
        <ActionBtn
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          aria-label="Редактировать"
          title="Редактировать"
        >
          ✎
        </ActionBtn>
        <ActionBtn
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Удалить"
          title="Удалить"
        >
          ⌫
        </ActionBtn>
      </Actions>
    </Item>
  )
}
