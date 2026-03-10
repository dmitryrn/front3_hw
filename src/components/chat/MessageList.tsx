import type { ChatMessage } from '../../types'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import styles from './Chat.module.css'

type MessageListProps = {
  messages: ChatMessage[]
  isTypingVisible?: boolean
}

export default function MessageList({ messages, isTypingVisible }: MessageListProps) {
  return (
    <div className={styles.messages}>
      <div className={styles.stack}>
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}

        {isTypingVisible ? (
          <div className={styles.row}>
            <div className={styles.avatar}>G</div>
            <div className={styles.bubbleWrap}>
              <div className={styles.meta}>GigaChat</div>
              <div className={styles.bubble}>
                <TypingIndicator isVisible />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
