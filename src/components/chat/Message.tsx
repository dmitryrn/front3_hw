import ReactMarkdown from 'react-markdown'
import type { ChatMessage } from '../../types'
import { Avatar, Bubble, BubbleWrap, CopyButton, Markdown, Meta, Row } from './styles'

type MessageProps = {
  message: ChatMessage
}

function copyToClipboard(text: string) {
  if (!text) return
  void navigator.clipboard?.writeText(text)
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'
  const variant = isUser ? 'user' : 'assistant'

  return (
    <Row $variant={variant}>
      {isUser ? null : <Avatar>G</Avatar>}

      <BubbleWrap>
        <Meta>{message.author}</Meta>
        <Bubble $variant={variant}>
          <CopyButton type="button" onClick={() => copyToClipboard(message.content)}>
            Copy
          </CopyButton>
          <Markdown $variant={variant}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Markdown>
        </Bubble>
      </BubbleWrap>
    </Row>
  )
}
