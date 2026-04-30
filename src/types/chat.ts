export type MessageRole = 'user' | 'assistant';

export interface CommerceAction {
  type: 'product_search' | 'add_to_cart' | 'unknown';
  status: 'pending' | 'success' | 'error';
  payload: any;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  actions?: CommerceAction[];
  createdAt: Date;
}

export interface WidgetState {
  isOpen: boolean;
  messages: ChatMessage[];
  isSubmitting: boolean;
  isStreaming: boolean;
}
