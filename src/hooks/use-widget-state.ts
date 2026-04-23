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
        const stream = ApiClient.streamMessage({
          query: trimmed,
          session_id: sessionIdRef.current,
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
