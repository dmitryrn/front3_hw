import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../types'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import { Avatar, Bubble, BubbleWrap, Messages, Meta, Row, Stack } from './styles'

type MessageListProps = {
  messages: ChatMessage[]
  isLoading?: boolean
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <Messages>
      <Stack>
        {messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}

        {isLoading ? (
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

        <div ref={endRef} />
      </Stack>
    </Messages>
  )
}
