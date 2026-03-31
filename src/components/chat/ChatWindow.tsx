import type { Message } from '../../types'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import ErrorMessage from '../ui/ErrorMessage'
import InputArea from './InputArea'
import MessageList from './MessageList'
import { BurgerButton, Header, Title, TitleRow, Window } from './styles'

type ChatWindowProps = {
  chatTitle: string
  messages: Message[]
  isLoading?: boolean
  error?: string | null
  onOpenSidebar: () => void
  onOpenSettings: () => void
  onSendMessage: (text: string) => void
}

export default function ChatWindow({
  chatTitle,
  messages,
  isLoading,
  error,
  onOpenSidebar,
  onOpenSettings,
  onSendMessage,
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

      {error ? <ErrorMessage message={error} /> : null}

      {hasMessages ? <MessageList messages={messages} /> : <EmptyState />}

      <InputArea isLoading={isLoading} onSend={onSendMessage} />
    </Window>
  )
}
