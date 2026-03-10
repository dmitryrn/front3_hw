import type { ChatMessage } from '../../types'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import InputArea from './InputArea'
import MessageList from './MessageList'
import { BurgerButton, Header, Title, TitleRow, Window } from './styles'

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

      {hasMessages ? <MessageList messages={messages} isTypingVisible={isTypingVisible} /> : <EmptyState />}

      <InputArea onSend={onSendMessage} />
    </Window>
  )
}
