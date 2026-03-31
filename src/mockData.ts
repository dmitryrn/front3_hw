import type { Chat, ChatSettings, Message } from './types'

export const DEFAULT_SETTINGS: ChatSettings = {
  model: 'GigaChat',
  temperature: 0.7,
  topP: 0.95,
  maxTokens: 2048,
  systemPrompt: 'Ты полезный ассистент. Отвечай кратко и по делу.',
}

export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'План проекта: MVP и сроки', lastMessageAt: '2026-03-09T10:30:00.000Z' },
  { id: 'c2', title: 'Идеи для интерфейса чата', lastMessageAt: '2026-03-08T18:12:00.000Z' },
  { id: 'c3', title: 'Вопросы по React и TypeScript', lastMessageAt: '2026-03-07T09:05:00.000Z' },
  { id: 'c4', title: 'Заметки: работа со стилями', lastMessageAt: '2026-03-06T16:40:00.000Z' },
  { id: 'c5', title: 'Черновик system prompt', lastMessageAt: '2026-03-05T12:20:00.000Z' },
]

export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      role: 'assistant',
      author: 'GigaChat',
      createdAt: '2026-03-09T10:00:00.000Z',
      content: 'Давайте соберем MVP. Что важнее всего: **скорость** или *качество*?',
    },
    {
      id: 'm2',
      role: 'user',
      author: 'Вы',
      createdAt: '2026-03-09T10:01:00.000Z',
      content: 'Скорость. Нужно уложиться в 2 недели.',
    },
    {
      id: 'm3',
      role: 'assistant',
      author: 'GigaChat',
      createdAt: '2026-03-09T10:02:00.000Z',
      content: `Ок. Предлагаю:\n\n+- Экран авторизации\n+- Список чатов\n+- Окно чата\n\n+И начнем с моковых данных.`,
    },
    {
      id: 'm4',
      role: 'user',
      author: 'Вы',
      createdAt: '2026-03-09T10:05:00.000Z',
      content: 'Покажи пример форматирования markdown с кодом.',
    },
    {
      id: 'm5',
      role: 'assistant',
      author: 'GigaChat',
      createdAt: '2026-03-09T10:06:00.000Z',
      content: `Вот блок кода:\n\n\`\`\`ts\ntype Message = { variant: "user" | "assistant"; content: string }\n\`\`\`\n\nИ **жирный** текст.`,
    },
    {
      id: 'm6',
      role: 'user',
      author: 'Вы',
      createdAt: '2026-03-09T10:10:00.000Z',
      content: 'Отлично, спасибо!',
    },
  ],
  c2: [
    {
      id: 'm7',
      role: 'assistant',
      author: 'GigaChat',
      createdAt: '2026-03-08T18:00:00.000Z',
      content: 'Нужна боковая панель и область сообщений. На мобилке — бургер.',
    },
    {
      id: 'm8',
      role: 'user',
      author: 'Вы',
      createdAt: '2026-03-08T18:01:00.000Z',
      content: 'Хочу чтобы сообщения пользователя были справа.',
    },
    {
      id: 'm9',
      role: 'assistant',
      author: 'GigaChat',
      createdAt: '2026-03-08T18:02:00.000Z',
      content: 'Сделаем variant="user" и variant="assistant".',
    },
    {
      id: 'm10',
      role: 'user',
      author: 'Вы',
      createdAt: '2026-03-08T18:04:00.000Z',
      content: 'И кнопку Copy по hover.',
    },
    {
      id: 'm11',
      role: 'assistant',
      author: 'GigaChat',
      createdAt: '2026-03-08T18:05:00.000Z',
      content: 'Да, с `navigator.clipboard.writeText`.',
    },
    {
      id: 'm12',
      role: 'user',
      author: 'Вы',
      createdAt: '2026-03-08T18:06:00.000Z',
      content: 'Ок.',
    },
  ],
  c3: [],
  c4: [],
  c5: [],
}
