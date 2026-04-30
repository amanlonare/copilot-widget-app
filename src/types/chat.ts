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

export interface WidgetConfig {
  botName: string;
  primaryColor: string;
  welcomeMessage: string;
  shopDomain: string;
}

export interface WidgetState {
  isOpen: boolean;
  messages: ChatMessage[];
  isSubmitting: boolean;
  isStreaming: boolean;
  config: WidgetConfig;
}
