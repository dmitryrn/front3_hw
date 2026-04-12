import ReactMarkdown from 'react-markdown'

type MarkdownRendererProps = {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return <ReactMarkdown>{content}</ReactMarkdown>
}
