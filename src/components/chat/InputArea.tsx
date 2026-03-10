import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '../ui/Button'
import styles from './Chat.module.css'

type InputAreaProps = {
  onSend: (text: string) => void
}

function getMaxHeight(textarea: HTMLTextAreaElement) {
  const cs = window.getComputedStyle(textarea)
  const lineHeight = Number.parseFloat(cs.lineHeight || '0') || 20
  const paddingTop = Number.parseFloat(cs.paddingTop || '0') || 0
  const paddingBottom = Number.parseFloat(cs.paddingBottom || '0') || 0
  return lineHeight * 5 + paddingTop + paddingBottom
}

function useAutosize(textarea: HTMLTextAreaElement | null, value: string) {
  useEffect(() => {
    if (!textarea) return
    textarea.style.height = 'auto'
    const maxHeight = getMaxHeight(textarea)
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [textarea, value])
}

export default function InputArea({ onSend }: InputAreaProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useAutosize(textareaRef.current, value)

  const canSend = useMemo(() => value.trim().length > 0, [value])

  const send = () => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
  }

  return (
    <div className={styles.inputWrap}>
      <div className={styles.composer}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Напишите сообщение..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            if (e.shiftKey) return
            e.preventDefault()
            send()
          }}
        />

        <div className={styles.buttons}>
          <Button type="button" variant="ghost" iconOnly aria-label="Прикрепить">
            ⊕
          </Button>
          <Button type="button" variant="ghost" disabled iconOnly aria-label="Стоп">
            ■
          </Button>
          <Button type="button" variant="primary" disabled={!canSend} onClick={send}>
            Отправить
          </Button>
        </div>
      </div>
    </div>
  )
}
