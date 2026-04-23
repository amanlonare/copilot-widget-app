export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface WidgetState {
  isOpen: boolean;
  messages: ChatMessage[];
  isSubmitting: boolean;
  isStreaming: boolean;
}
