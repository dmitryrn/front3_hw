import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Chat } from '../../types'
import Sidebar from './Sidebar'

afterEach(() => {
  cleanup()
})

function makeChat(id: string, title: string, lastMessageAt = '2026-04-05T10:00:00.000Z'): Chat {
  return { id, title, lastMessageAt }
}

function renderSidebar(overrides: Partial<React.ComponentProps<typeof Sidebar>> = {}) {
  const props: React.ComponentProps<typeof Sidebar> = {
    isOpen: true,
    onClose: vi.fn(),
    searchValue: '',
    onSearchChange: vi.fn(),
    chats: [
      makeChat('chat-1', 'Alpha project'),
      makeChat('chat-2', 'Beta ideas', '2026-04-06T10:00:00.000Z'),
    ],
    activeChatId: 'chat-1',
    onNewChat: vi.fn(),
    onSelectChat: vi.fn(),
    onEditChat: vi.fn(),
    onDeleteChat: vi.fn(),
    ...overrides,
  }

  return {
    ...render(<Sidebar {...props} />),
    props,
  }
}

describe('Sidebar', () => {
  it('calls onSearchChange when typing in search field', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()

    renderSidebar({ onSearchChange })

    await user.type(screen.getByRole('searchbox', { name: 'Поиск по чатам' }), 'beta')

    expect(onSearchChange).toHaveBeenNthCalledWith(1, 'b')
    expect(onSearchChange).toHaveBeenNthCalledWith(2, 'e')
    expect(onSearchChange).toHaveBeenNthCalledWith(3, 't')
    expect(onSearchChange).toHaveBeenNthCalledWith(4, 'a')
  })

  it('shows confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup()

    renderSidebar()

    await user.click(screen.getAllByRole('button', { name: 'Удалить' })[0]!)

    const dialog = screen.getByRole('dialog')

    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText('Удалить чат?')).toBeInTheDocument()
    expect(within(dialog).getByText(/Alpha project/)).toBeInTheDocument()
  })

  it('closes confirmation dialog without deleting on cancel', async () => {
    const user = userEvent.setup()
    const onDeleteChat = vi.fn()

    renderSidebar({ onDeleteChat })

    await user.click(screen.getAllByRole('button', { name: 'Удалить' })[0]!)
    await user.click(screen.getByRole('button', { name: 'Отмена' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(onDeleteChat).not.toHaveBeenCalled()
  })

  it('calls onDeleteChat with selected chat id after confirmation', async () => {
    const user = userEvent.setup()
    const onDeleteChat = vi.fn()

    renderSidebar({ onDeleteChat })

    await user.click(screen.getAllByRole('button', { name: 'Удалить' })[1]!)

    const dialog = screen.getByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }))

    expect(onDeleteChat).toHaveBeenCalledWith('chat-2')
    expect(onDeleteChat).toHaveBeenCalledTimes(1)
  })
})
