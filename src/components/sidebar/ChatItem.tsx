import type { Chat } from '../../types'
import styles from './Sidebar.module.css'

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
  const cls = [styles.item, active ? styles.itemActive : undefined].filter(Boolean).join(' ')

  return (
    <div
      className={cls}
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
        <div className={styles.title} title={chat.title}>
          {chat.title}
        </div>
        <div className={styles.meta}>{formatDate(chat.lastMessageAt)}</div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit()
          }}
          aria-label="Редактировать"
          title="Редактировать"
        >
          ✎
        </button>
        <button
          className={styles.actionBtn}
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          aria-label="Удалить"
          title="Удалить"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}
