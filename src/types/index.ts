export type Theme = 'light' | 'dark'

export type AuthScope =
  | 'GIGACHAT_API_PERS'
  | 'GIGACHAT_API_B2B'
  | 'GIGACHAT_API_CORP'

export type Chat = {
  id: string
  title: string
  lastMessageAt: string
}

export type MessageVariant = 'user' | 'assistant'

export type Message = {
  id: string
  role: MessageVariant
  author: string
  content: string
  createdAt: string
}

export type ChatMessage = Message

export type ChatState = {
  chats: Chat[]
  activeChat: Chat | null
  activeChatId: string
  currentChatMessages: Message[]
  messagesByChatId: Record<string, Message[]>
  isLoading: boolean
  error: string | null
}

export type ChatAction =
  | { type: 'chat/createChat'; payload: { id: string } }
  | { type: 'chat/selectChat'; payload: string }
  | { type: 'chat/deleteChat'; payload: string }
  | { type: 'chat/editChatTitle'; payload: { chatId: string; title: string } }
  | { type: 'chat/sendMessageStarted'; payload: { chatId: string; message: Message } }
  | { type: 'chat/sendMessageSucceeded'; payload: { chatId: string; message: Message } }
  | { type: 'chat/sendMessageFailed'; payload: string }
  | { type: 'chat/clearError' }

export type ModelId = 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max'

export type ChatSettings = {
  model: ModelId
  temperature: number
  topP: number
  maxTokens: number
  systemPrompt: string
}
