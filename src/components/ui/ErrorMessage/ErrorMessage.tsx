import Button from '../Button/Button'
import { Error, ErrorIcon } from '../styles'

type ErrorMessageProps = {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export default function ErrorMessage({ message, actionLabel, onAction }: ErrorMessageProps) {
  return (
    <Error role="alert">
      <ErrorIcon aria-hidden>
        !
      </ErrorIcon>
      <span>{message}</span>
      {actionLabel && onAction ? (
        <Button type="button" variant="ghost" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Error>
  )
}
