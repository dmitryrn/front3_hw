import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Message as ChatMessage } from '../../types'
import { Avatar, Bubble, BubbleWrap, CopyButton, Markdown, Meta, Row } from './styles'

type MessageProps = {
  message: ChatMessage
}

export default function Message({ message }: MessageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const isUser = message.role === 'user'
  const variant = isUser ? 'user' : 'assistant'

  useEffect(() => {
    if (!isCopied) return

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false)
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [isCopied])

  const copyToClipboard = async () => {
    if (!message.content || !navigator.clipboard) return

    await navigator.clipboard.writeText(message.content)
    setIsCopied(true)
  }

  return (
    <Row $variant={variant}>
      {isUser ? null : <Avatar>G</Avatar>}

      <BubbleWrap>
        <Meta>{message.author}</Meta>
        <Bubble $variant={variant}>
          {!isUser ? (
            <CopyButton type="button" onClick={() => void copyToClipboard()}>
              {isCopied ? 'Скопировано' : 'Копировать'}
            </CopyButton>
          ) : null}
          <Markdown $variant={variant}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Markdown>
        </Bubble>
      </BubbleWrap>
    </Row>
  )
}
