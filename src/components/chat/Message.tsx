import ReactMarkdown from 'react-markdown'
import type { ChatMessage } from '../../types'
import styles from './Chat.module.css'

type MessageProps = {
  message: ChatMessage
}

function copyToClipboard(text: string) {
  if (!text) return
  void navigator.clipboard?.writeText(text)
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  const rowCls = [styles.row, isUser ? styles.rowUser : undefined].filter(Boolean).join(' ')
  const bubbleCls = [styles.bubble, isUser ? styles.bubbleUser : undefined].filter(Boolean).join(' ')

  return (
    <div className={rowCls}>
      {isUser ? null : <div className={styles.avatar}>G</div>}

      <div className={styles.bubbleWrap}>
        <div className={styles.meta}>{message.author}</div>
        <div className={bubbleCls}>
          <button className={styles.copy} type="button" onClick={() => copyToClipboard(message.content)}>
            Copy
          </button>
          <div className={styles.md}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
