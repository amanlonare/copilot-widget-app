"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChatMessage, WidgetState } from "@/types/chat";
import { ApiClient } from "@/services/api-client";
import { MockChatService } from "@/services/mock-chat-service";
import { v4 as uuidv4 } from "uuid";

interface UseWidgetStateOptions {
  useMock?: boolean;
}

export function useWidgetState(options: UseWidgetStateOptions = {}) {
  const [state, setState] = useState<WidgetState>({
    isOpen: false,
    messages: [],
    isSubmitting: false,
    isStreaming: false,
    config: {
      botName: "Copilot",
      primaryColor: "#000000",
      welcomeMessage: "Hi! How can I help you today?",
      shopDomain: "dev-copilot-store.myshopify.com",
    },
  });
  
  // Persist session ID and AbortController throughout component lifecycle
  const sessionIdRef = useRef<string | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Fetch settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const shop = state.config.shopDomain;
        
        // Determine base URL from Shopify Liquid configuration
        const rawBaseUrl = typeof window !== 'undefined' && (window as any).CopilotWidgetConfig?.apiBaseUrl 
          ? (window as any).CopilotWidgetConfig.apiBaseUrl 
          : '';
        
        // Clean the base URL
        const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
        const url = `${baseUrl}/api/widget/settings?shop=${shop}&t=${Date.now()}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Only update if we actually got valid configuration back
          if (data && (data.bot_name || data.primary_color)) {
            setState((prev) => ({
              ...prev,
              config: {
                ...prev.config,
                botName: data.bot_name || prev.config.botName,
                primaryColor: data.primary_color || prev.config.primaryColor,
                welcomeMessage: data.welcome_message || prev.config.welcomeMessage,
              },
            }));
          }
        }
      } catch (err) {
        // Silent fail in production to maintain UX
      }
    };
    fetchSettings();
  }, []);

  const toggleOpen = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || state.isSubmitting || state.isStreaming) return;

    // Abort previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: trimmed,
      createdAt: new Date(),
    };

    const assistantPlaceholderId = uuidv4();
    const assistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage, assistantMessage],
      isSubmitting: true,
      isStreaming: false,
    }));

    try {
      let accumulatedAnswer = "";
      
      if (options.useMock) {
        const stream = MockChatService.streamAssistantReply(trimmed);
        
        for await (const chunk of stream) {
          // Check if we've been aborted
          if (abortControllerRef.current?.signal.aborted) break;

          setState(prev => {
            if (prev.isSubmitting) {
              return { ...prev, isSubmitting: false, isStreaming: true };
            }
            return prev;
          });

          if (chunk.answer) {
            accumulatedAnswer += chunk.answer;
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map(m => 
                m.id === assistantPlaceholderId ? { ...m, content: accumulatedAnswer } : m
              ),
            }));
          }

          if (chunk.done) break;
        }
      } else {
        // Collect context from previous actions to help LLM resolve variant IDs (Stateless Context)
        const recentActions = state.messages
          .flatMap(m => m.actions || [])
          .slice(-10); // Last 10 actions for context

        const stream = ApiClient.streamMessage({
          query: trimmed,
          session_id: sessionIdRef.current,
          context: {
            recent_actions: recentActions
          }
        }, abortControllerRef.current.signal);

        for await (const chunk of stream) {
          // Transition from submitting to streaming on first chunk
          setState(prev => {
            if (prev.isSubmitting) {
              return { ...prev, isSubmitting: false, isStreaming: true };
            }
            return prev;
          });

          if (chunk.session_id) sessionIdRef.current = chunk.session_id;

          if (chunk.answer) {
            accumulatedAnswer += chunk.answer;
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map(m => 
                m.id === assistantPlaceholderId ? { ...m, content: accumulatedAnswer } : m
              ),
            }));
          }

          if (chunk.action) {
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map(m => 
                m.id === assistantPlaceholderId 
                  ? { ...m, actions: [...(m.actions || []), chunk.action!] } 
                  : m
              ),
            }));
          }

          if (chunk.done) break;
        }
      }

      setState((prev) => ({ ...prev, isSubmitting: false, isStreaming: false }));
      abortControllerRef.current = null;
    } catch (error: any) {
      if (error.name === "AbortError") return;

      console.error("Streaming failed:", error);
      setState((prev) => ({
        ...prev,
        messages: prev.messages.map(m => 
          m.id === assistantPlaceholderId 
            ? { ...m, content: "I encountered an error while thinking. Please try again." } 
            : m
        ),
        isSubmitting: false,
        isStreaming: false,
      }));
    }
  }, [state.isSubmitting, state.isStreaming, options.useMock]);

  return {
    state,
    toggleOpen,
    sendMessage,
  };
}
