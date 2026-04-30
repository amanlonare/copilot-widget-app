export interface CitationModel {
  source_id: string;
  snippet: string;
  source_title?: string;
  score?: number;
}

import { CommerceAction } from "./chat";

export interface ChatRequest {
  query: string;
  user_id?: string;
  session_id?: string;
  metadata?: Record<string, any>;
  context?: {
    recent_actions?: CommerceAction[];
  };
}

export interface ChatResponse {
  answer: string;
  citations?: CitationModel[];
  fallback_flag?: boolean;
  session_id?: string;
  trace_metadata?: Record<string, any>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface StreamChunk {
  answer: string;
  action?: CommerceAction;
  session_id?: string;
  done?: boolean;
}
