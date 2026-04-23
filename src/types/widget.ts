export type WidgetPosition = 'bottom-right' | 'bottom-left';

export interface WidgetConfig {
  name: string;
  primaryColor: string;
  greetingMessage: string;
  position: WidgetPosition;
}

export type WidgetStatus = 'idle' | 'opening' | 'open' | 'closing' | 'closed';
