import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ChatWindow from './ChatWindow'

afterEach(() => {
  cleanup()
})

describe('ChatWindow', () => {
  it('renders retry action for API errors and calls retry handler', async () => {
    const user = userEvent.setup()
    const onRetryMessage = vi.fn()

    render(
      <ChatWindow
        chatTitle="Тестовый чат"
        messages={[]}
        error="Network error"
        canRetry
        onOpenSidebar={vi.fn()}
        onOpenSettings={vi.fn()}
        onSendMessage={vi.fn()}
        onRetryMessage={onRetryMessage}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Network error')

    await user.click(screen.getByRole('button', { name: 'Повторить' }))

    expect(onRetryMessage).toHaveBeenCalledTimes(1)
  })

  it('renders error without retry button when retry is unavailable', () => {
    render(
      <ChatWindow
        chatTitle="Тестовый чат"
        messages={[]}
        error="Network error"
        onOpenSidebar={vi.fn()}
        onOpenSettings={vi.fn()}
        onSendMessage={vi.fn()}
        onRetryMessage={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Network error')
    expect(screen.queryByRole('button', { name: 'Повторить' })).not.toBeInTheDocument()
  })
})
