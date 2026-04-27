import { ChatRequest, ChatResponse, ApiError, StreamChunk } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || "http://localhost:8000";
const REQUEST_TIMEOUT = 15000; // 15 seconds

export class ApiClient {
  static async *streamMessage(request: ChatRequest, signal?: AbortSignal): AsyncGenerator<StreamChunk> {
    const timeoutController = new AbortController();
    const id = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT);

    // Merge signals if both exist
    const combinedSignal = signal ? signal : timeoutController.signal;

    try {
      const response = await fetch(`${BASE_URL}/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
        },
        body: JSON.stringify(request),
        signal: combinedSignal,
      });

      clearTimeout(id);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.detail || "An unexpected error occurred",
          status: response.status,
          code: "HTTP_ERROR",
        } as ApiError;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw {
          message: "Response body is not readable",
          code: "STREAM_ERROR",
        } as ApiError;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let currentEvent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) {
            currentEvent = ""; // Reset event on empty line
            continue;
          }

          if (trimmed.startsWith("event: ")) {
            currentEvent = trimmed.replace("event: ", "");
            continue;
          }

          if (trimmed.startsWith("data: ")) {
            const jsonStr = trimmed.replace("data: ", "");
            
            if (jsonStr === "[DONE]") {
              yield { answer: "", done: true };
              return;
            }

            try {
              const data = JSON.parse(jsonStr);
              
              if (currentEvent === "content") {
                yield { answer: data.chunk, done: false };
              } else if (currentEvent === "metadata") {
                yield { 
                  answer: "", 
                  session_id: data.session_id,
                  done: true 
                };
              } else if (currentEvent === "error") {
                throw { message: data.detail, code: "STREAM_ERROR" };
              }
            } catch (e: any) {
              if (e?.code === "STREAM_ERROR") throw e;
              console.warn("Failed to parse SSE chunk:", jsonStr);
            }
          }
        }
      }
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === "AbortError") {
        throw { message: "Request timed out.", code: "TIMEOUT" } as ApiError;
      }
      throw error;
    }
  }
}
