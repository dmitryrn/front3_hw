import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import InputArea from './InputArea'

afterEach(() => {
  cleanup()
})

describe('InputArea', () => {
  it('calls onSend with trimmed text when clicking submit', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(<InputArea onSend={onSend} />)

    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), '  hello world  ')
    await user.click(screen.getByRole('button', { name: 'Отправить' }))

    expect(onSend).toHaveBeenCalledWith('hello world')
    expect(onSend).toHaveBeenCalledTimes(1)
  })

  it('calls onSend when pressing Enter with non-empty input', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(<InputArea onSend={onSend} />)

    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), 'message{enter}')

    expect(onSend).toHaveBeenCalledWith('message')
    expect(onSend).toHaveBeenCalledTimes(1)
  })

  it('does not call onSend when pressing Shift+Enter', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(<InputArea onSend={onSend} />)

    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), 'message{shift>}{enter}{/shift}')

    expect(onSend).not.toHaveBeenCalled()
  })

  it('keeps submit button disabled for empty and whitespace-only input', async () => {
    const user = userEvent.setup()

    render(<InputArea onSend={vi.fn()} />)

    const textarea = screen.getByPlaceholderText('Напишите сообщение...')
    const submitButton = screen.getByRole('button', { name: 'Отправить' })

    expect(submitButton).toBeDisabled()

    await user.type(textarea, '   ')

    expect(submitButton).toBeDisabled()
  })

  it('clears the input after successful submit', async () => {
    const user = userEvent.setup()

    render(<InputArea onSend={vi.fn()} />)

    const textarea = screen.getByPlaceholderText('Напишите сообщение...') as HTMLTextAreaElement

    await user.type(textarea, 'message')
    await user.click(screen.getByRole('button', { name: 'Отправить' }))

    expect(textarea.value).toBe('')
  })

  it('shows disabled stop button and prevents sending while loading', async () => {
    const user = userEvent.setup()
    const onSend = vi.fn()

    render(<InputArea onSend={onSend} isLoading />)

    await user.type(screen.getByPlaceholderText('Напишите сообщение...'), 'message{enter}')

    expect(screen.getByRole('button', { name: 'Стоп' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Отправить' })).not.toBeInTheDocument()
    expect(onSend).not.toHaveBeenCalled()
  })
})
