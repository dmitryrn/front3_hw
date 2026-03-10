import styles from './ui.module.css'

type ErrorMessageProps = {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className={styles.error} role="alert">
      <span className={styles.errorIcon} aria-hidden>
        !
      </span>
      <span>{message}</span>
    </div>
  )
}
