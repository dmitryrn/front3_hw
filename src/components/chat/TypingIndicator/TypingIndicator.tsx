import { Dot, Typing } from '../styles'

type TypingIndicatorProps = {
  isVisible?: boolean
}

export default function TypingIndicator({ isVisible = true }: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <Typing aria-label="Ассистент печатает">
      <Dot />
      <Dot />
      <Dot />
    </Typing>
  )
}
