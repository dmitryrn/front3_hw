import type { RefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '../../ui/Button/Button'
import { Buttons, Composer, InputWrap, Textarea } from '../styles'

type InputAreaProps = {
  isLoading?: boolean
  onSend: (text: string) => void
}

function getMaxHeight(textarea: HTMLTextAreaElement) {
  const cs = window.getComputedStyle(textarea)
  const lineHeight = Number.parseFloat(cs.lineHeight || '0') || 20
  const paddingTop = Number.parseFloat(cs.paddingTop || '0') || 0
  const paddingBottom = Number.parseFloat(cs.paddingBottom || '0') || 0
  return lineHeight * 5 + paddingTop + paddingBottom
}

function useAutosize(ref: RefObject<HTMLTextAreaElement | null>, value: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const maxHeight = getMaxHeight(el)
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }, [ref, value])
}

export default function InputArea({ isLoading = false, onSend }: InputAreaProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useAutosize(textareaRef, value)

  const canSend = useMemo(() => value.trim().length > 0 && !isLoading, [isLoading, value])

  const send = () => {
    const text = value.trim()
    if (!text || isLoading) return
    onSend(text)
    setValue('')
  }

  return (
    <InputWrap>
      <Composer>
        <Textarea
          ref={textareaRef}
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

        <Buttons>
          <Button type="button" variant="ghost" iconOnly aria-label="Прикрепить">
            ⊕
          </Button>

          {isLoading ? (
            <Button type="button" variant="ghost" disabled iconOnly aria-label="Стоп">
              ■
            </Button>
          ) : (
            <Button type="button" variant="primary" disabled={!canSend} onClick={send}>
              Отправить
            </Button>
          )}
        </Buttons>
      </Composer>
    </InputWrap>
  )
}
