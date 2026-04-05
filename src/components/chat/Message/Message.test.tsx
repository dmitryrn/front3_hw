import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Message as ChatMessage } from '../../../types'
import Message from './Message'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

function makeMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'msg-1',
    role: 'assistant',
    author: 'gpt-5-mini',
    content: 'Ответ ассистента',
    createdAt: '2026-04-05T10:00:00.000Z',
    ...overrides,
  }
}

describe('Message', () => {
  it('copies assistant message content to clipboard', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<Message message={makeMessage()} />)

    await user.click(screen.getByRole('button', { name: 'Копировать' }))

    expect(writeText).toHaveBeenCalledWith('Ответ ассистента')
  })

  it('shows copied state after successful copy', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<Message message={makeMessage()} />)

    await user.click(screen.getByRole('button', { name: 'Копировать' }))

    expect(screen.getByRole('button', { name: 'Скопировано' })).toBeInTheDocument()
  })

  it('resets copied state after timeout', async () => {
    vi.useFakeTimers()

    const writeText = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })

    render(<Message message={makeMessage()} />)

    screen.getByRole('button', { name: 'Копировать' }).click()

    await act(async () => {
      await Promise.resolve()
    })

    await act(async () => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('button', { name: 'Копировать' })).toBeInTheDocument()
  })

  it('shows typing indicator and hides copy button for pending assistant message', () => {
    render(<Message message={makeMessage({ content: '' })} />)

    expect(screen.getByLabelText('Ассистент печатает')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Копировать' })).not.toBeInTheDocument()
  })

  it('does not render copy button for user message', () => {
    render(<Message message={makeMessage({ role: 'user', author: 'Вы', content: 'Мой текст' })} />)

    expect(screen.queryByRole('button', { name: 'Копировать' })).not.toBeInTheDocument()
  })
})
