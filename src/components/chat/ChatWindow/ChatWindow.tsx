import type { Message } from '../../../types'
import Button from '../../ui/Button/Button'
import ErrorBoundary from '../../ui/ErrorBoundary/ErrorBoundary'
import EmptyState from '../../ui/EmptyState/EmptyState'
import ErrorMessage from '../../ui/ErrorMessage/ErrorMessage'
import InputArea from '../InputArea/InputArea'
import MessageList from '../MessageList/MessageList'
import { BurgerButton, Header, InputError, Messages, Title, TitleRow, Window } from '../styles'

type ChatWindowProps = {
  chatTitle: string
  messages: Message[]
  isLoading?: boolean
  error?: string | null
  canRetry?: boolean
  onOpenSidebar: () => void
  onOpenSettings: () => void
  onSendMessage: (text: string) => void
  onRetryMessage: () => void
  onStopGeneration?: () => void
}

export default function ChatWindow({
  chatTitle,
  messages,
  isLoading,
  error,
  canRetry = false,
  onOpenSidebar,
  onOpenSettings,
  onSendMessage,
  onRetryMessage,
  onStopGeneration,
}: ChatWindowProps) {
  const hasMessages = messages.length > 0

  return (
    <Window aria-label="Чат">
      <Header>
        <TitleRow>
          <BurgerButton type="button" variant="ghost" iconOnly onClick={onOpenSidebar} aria-label="Открыть меню">
            ☰
          </BurgerButton>
          <Title title={chatTitle}>{chatTitle}</Title>
        </TitleRow>
        <Button type="button" variant="ghost" iconOnly onClick={onOpenSettings} aria-label="Настройки">
          ⚙
        </Button>
      </Header>

      <ErrorBoundary
        resetKey={`${chatTitle}:${messages.length}`}
        fallback={
          <Messages>
            <ErrorMessage message="Не удалось отрисовать сообщения. Откройте другой чат или попробуйте снова позже." />
          </Messages>
        }
      >
        {hasMessages ? <MessageList messages={messages} /> : <EmptyState />}
      </ErrorBoundary>

      <InputArea isLoading={isLoading} onSend={onSendMessage} onStop={onStopGeneration} />

      {error ? (
        <InputError>
          <ErrorMessage message={error} actionLabel={canRetry ? 'Повторить' : undefined} onAction={canRetry ? onRetryMessage : undefined} />
        </InputError>
      ) : null}
    </Window>
  )
}
