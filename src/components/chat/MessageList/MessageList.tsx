import { useEffect, useRef } from 'react'
import type { Message as ChatMessage } from '../../../types'
import Message from '../Message/Message'
import { Messages, Stack } from '../styles'

type MessageListProps = {
  messages: ChatMessage[]
}

export default function MessageList({ messages }: MessageListProps) {
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

        <div ref={endRef} />
      </Stack>
    </Messages>
  )
}
