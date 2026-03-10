import styles from './Chat.module.css'

type TypingIndicatorProps = {
  isVisible?: boolean
}

export default function TypingIndicator({ isVisible = true }: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <span className={styles.typing} aria-label="Ассистент печатает">
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  )
}
