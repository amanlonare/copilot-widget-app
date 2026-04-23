import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWidgetState } from "../use-widget-state";
import { ApiClient } from "../../services/api-client";

// Mock the ApiClient
vi.mock("../../services/api-client", () => ({
  ApiClient: {
    streamMessage: vi.fn(),
  },
}));

describe("useWidgetState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should transition states correctly during streaming", async () => {
    const mockStream = async function* () {
      yield { answer: "Hello", done: false };
      yield { answer: " world", done: false };
      yield { answer: "", done: true };
    };

    (ApiClient.streamMessage as any).mockReturnValue(mockStream());

    const { result } = renderHook(() => useWidgetState());

    // Send message
    await act(async () => {
      result.current.sendMessage("hi");
    });

    await waitFor(() => {
      expect(result.current.state.messages).toHaveLength(2);
      expect(result.current.state.messages[1].content).toBe("Hello world");
    }, { timeout: 2000 });

    expect(result.current.state.isSubmitting).toBe(false);
    expect(result.current.state.isStreaming).toBe(false);
  });
});
