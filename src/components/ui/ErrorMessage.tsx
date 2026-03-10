import { Error, ErrorIcon } from './styles'

type ErrorMessageProps = {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <Error role="alert">
      <ErrorIcon aria-hidden>
        !
      </ErrorIcon>
      <span>{message}</span>
    </Error>
  )
}
