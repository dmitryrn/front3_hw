import type { ChatMessage } from '../../types'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import { Avatar, Bubble, BubbleWrap, Messages, Meta, Row, Stack } from './styles'

type MessageListProps = {
  messages: ChatMessage[]
  isTypingVisible?: boolean
}

export default function MessageList({ messages, isTypingVisible }: MessageListProps) {
  return (
    <Messages>
      <Stack>
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}

        {isTypingVisible ? (
          <Row $variant="assistant">
            <Avatar>G</Avatar>
            <BubbleWrap>
              <Meta>GigaChat</Meta>
              <Bubble $variant="assistant">
                <TypingIndicator isVisible />
              </Bubble>
            </BubbleWrap>
          </Row>
        ) : null}
      </Stack>
    </Messages>
  )
}
