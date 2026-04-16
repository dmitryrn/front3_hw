export type Theme = 'light' | 'dark'

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
  lastFailedPrompt: string | null
}

export type ChatAction =
  | { type: 'chat/createChat'; payload: { id: string } }
  | { type: 'chat/selectChat'; payload: string }
  | { type: 'chat/deleteChat'; payload: string }
  | { type: 'chat/editChatTitle'; payload: { chatId: string; title: string } }
  | { type: 'chat/sendMessageStarted'; payload: { chatId: string; userMessage: Message; assistantMessage: Message } }
  | { type: 'chat/updateAssistantMessage'; payload: { chatId: string; messageId: string; content: string } }
  | { type: 'chat/sendMessageSucceeded'; payload: { chatId: string; messageId: string; content: string } }
  | { type: 'chat/sendMessageFailed'; payload: { chatId: string; messageId: string; error: string; failedText: string } }
  | { type: 'chat/clearError' }

export type ModelId = string

export type ChatSettings = {
  model: ModelId
  temperature: number
  topP: number
  maxTokens: number
  frequencyPenalty: number
  presencePenalty: number
  systemPrompt: string
}
