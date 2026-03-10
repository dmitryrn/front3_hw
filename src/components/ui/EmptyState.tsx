import styles from './ui.module.css'

type EmptyStateProps = {
  title?: string
  text?: string
}

export default function EmptyState({
  title = 'Начните новый диалог',
  text = 'Выберите чат слева или создайте новый, чтобы начать переписку.',
}: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyCard}>
        <h2 className={styles.emptyTitle}>{title}</h2>
        <p className={styles.emptyText}>{text}</p>
      </div>
    </div>
  )
}
