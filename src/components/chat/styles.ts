import styled, { keyframes } from 'styled-components'
import Button from '../ui/Button'

export const Window = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);

  :root[data-theme='dark'] & {
    background: rgba(0, 0, 0, 0.22);
  }
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

export const Title = styled.h2`
  font-size: 14px;
  margin: 0;
  font-weight: 650;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const BurgerButton = styled(Button)`
  display: none;

  @media (max-width: 800px) {
    display: inline-grid;
  }
`

export const Messages = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px;
`

export const Stack = styled.div`
  display: grid;
  gap: 10px;
`

export const Row = styled.div<{ $variant: 'user' | 'assistant' }>`
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 10px;
  align-items: start;

  ${(p) =>
    p.$variant === 'user'
      ? `
    grid-template-columns: 1fr;
    justify-items: end;
  `
      : ''}
`

export const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: linear-gradient(180deg, rgba(43, 122, 106, 0.18), rgba(43, 122, 106, 0.06));
  display: grid;
  place-items: center;
  color: var(--color-text);
  font-weight: 700;
  font-size: 12px;
`

export const BubbleWrap = styled.div`
  min-width: 0;
`

export const Meta = styled.div`
  font-size: 12px;
  color: var(--color-muted);
  margin: 0 0 4px;
`

export const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 120ms ease;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.75);
  color: var(--color-text);
  border-radius: 10px;
  padding: 6px 8px;
  cursor: pointer;

  :root[data-theme='dark'] & {
    background: rgba(0, 0, 0, 0.35);
  }
`

export const Bubble = styled.div<{ $variant: 'user' | 'assistant' }>`
  border-radius: 16px;
  border: 1px solid var(--color-border);
  padding: 10px 12px;
  background: var(--color-assistant-bubble);
  color: var(--color-assistant-text);
  box-shadow: var(--shadow-sm);
  position: relative;

  ${(p) =>
    p.$variant === 'user'
      ? `
    background: var(--color-user-bubble);
    color: var(--color-user-text);
    border-color: rgba(0, 0, 0, 0.12);
  `
      : ''}

  &:hover ${CopyButton} {
    opacity: 1;
  }
`

export const Markdown = styled.div<{ $variant: 'user' | 'assistant' }>`
  font-size: 14px;

  p {
    margin: 0 0 8px;
  }

  p:last-child {
    margin-bottom: 0;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.08);
  }

  ${(p) =>
    p.$variant === 'user'
      ? `
    code {
      background: rgba(255, 255, 255, 0.22);
    }
  `
      : ''}

  pre {
    margin: 10px 0;
    padding: 10px 12px;
    border-radius: 14px;
    background: rgba(0, 0, 0, 0.08);
    overflow: auto;
  }

  :root[data-theme='dark'] & pre {
    background: rgba(0, 0, 0, 0.3);
  }

  pre code {
    padding: 0;
    background: transparent;
  }
`

export const Typing = styled.span`
  display: inline-flex;
  gap: 6px;
  align-items: center;
`

const pulse = keyframes`
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  50% {
    transform: translateY(-2px);
    opacity: 0.95;
  }
`

export const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(29, 27, 22, 0.45);
  animation: ${pulse} 1s infinite ease-in-out;

  :root[data-theme='dark'] & {
    background: rgba(240, 243, 243, 0.5);
  }

  &:nth-child(2) {
    animation-delay: 120ms;
  }

  &:nth-child(3) {
    animation-delay: 240ms;
  }
`

export const InputWrap = styled.div`
  border-top: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  padding: 12px 12px;

  :root[data-theme='dark'] & {
    background: rgba(0, 0, 0, 0.22);
  }
`

export const Composer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: end;
`

export const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 14px;
  padding: 10px 12px;
  font: inherit;
  line-height: 1.4;
  resize: none;
  max-height: 160px;
  overflow: auto;
`

export const Buttons = styled.div`
  display: flex;
  gap: 8px;
`
