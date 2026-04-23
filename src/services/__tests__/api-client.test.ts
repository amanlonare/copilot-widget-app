import { describe, it, expect, vi, beforeEach } from "vitest";
import { ApiClient } from "../api-client";

describe("ApiClient.streamMessage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should parse SSE chunks correctly", async () => {
    const mockResponse = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('event: content\ndata: {"chunk": "Hello"}\n\n'));
        controller.enqueue(new TextEncoder().encode('event: content\ndata: {"chunk": " world"}\n\n'));
        controller.enqueue(new TextEncoder().encode('event: metadata\ndata: {"session_id": "123"}\n\n'));
        controller.close();
      },
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      body: mockResponse,
    });

    const generator = ApiClient.streamMessage({ query: "hi" }, new AbortController().signal);
    const chunks = [];
    for await (const chunk of generator) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(3);
    expect(chunks[0].answer).toBe("Hello");
    expect(chunks[1].answer).toBe(" world");
    expect(chunks[2].done).toBe(true);
  });

  it("should handle [DONE] marker", async () => {
    const mockResponse = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    (global.fetch as any).mockResolvedValue({
      ok: true,
      body: mockResponse,
    });

    const generator = ApiClient.streamMessage({ query: "hi" }, new AbortController().signal);
    const chunks = [];
    for await (const chunk of generator) {
      chunks.push(chunk);
    }

    expect(chunks).toHaveLength(1);
    expect(chunks[0].done).toBe(true);
  });
});
