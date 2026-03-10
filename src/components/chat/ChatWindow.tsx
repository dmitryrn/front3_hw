import type { ChatMessage } from '../../types'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import InputArea from './InputArea'
import MessageList from './MessageList'
import styles from './Chat.module.css'

type ChatWindowProps = {
  chatTitle: string
  messages: ChatMessage[]
  isTypingVisible?: boolean
  onOpenSidebar: () => void
  onOpenSettings: () => void
  onSendMessage: (text: string) => void
}

export default function ChatWindow({
  chatTitle,
  messages,
  isTypingVisible,
  onOpenSidebar,
  onOpenSettings,
  onSendMessage,
}: ChatWindowProps) {
  const hasMessages = messages.length > 0

  return (
    <section className={styles.window} aria-label="Чат">
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <Button
            className={styles.burger}
            type="button"
            variant="ghost"
            iconOnly
            onClick={onOpenSidebar}
            aria-label="Открыть меню"
          >
            ☰
          </Button>
          <h2 className={styles.title} title={chatTitle}>
            {chatTitle}
          </h2>
        </div>
        <Button type="button" variant="ghost" iconOnly onClick={onOpenSettings} aria-label="Настройки">
          ⚙
        </Button>
      </header>

      {hasMessages ? <MessageList messages={messages} isTypingVisible={isTypingVisible} /> : <EmptyState />}

      <InputArea onSend={onSendMessage} />
    </section>
  )
}
