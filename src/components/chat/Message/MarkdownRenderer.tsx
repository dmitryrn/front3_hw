import ReactMarkdown from 'react-markdown'
import { Highlight, themes } from 'prism-react-renderer'

type MarkdownRendererProps = {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        code({ className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : 'text'
          const code = String(children).replace(/\n$/, '')

          if (match) {
            return (
              <Highlight theme={themes.nightOwl} code={code} language={language}>
                {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={highlightClassName} style={{ ...style, padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            )
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
