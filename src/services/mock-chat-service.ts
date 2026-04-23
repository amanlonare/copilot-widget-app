import { StreamChunk } from "@/types/api";

const MOCK_RESPONSES: Record<string, string> = {
  "hello": "Hi there! Welcome to our store. How can I help you find the perfect product today?",
  "hi": "Hey! Looking for anything specific, or just browsing our latest arrivals?",
  "price": "Our prices are very competitive! Many of our best-sellers are currently on sale. Which product are you interested in?",
  "recommend": "I'd love to! Could you tell me a bit more about what you're looking for? (e.g. style, budget, or occasion)",
  "shipping": "We offer free standard shipping on all orders over $50. Typical delivery time is 3-5 business days.",
  "long": "This is a very long story to test the auto-scrolling logic of our chat widget. It will contain many paragraphs and should trigger the scroll-to-bottom behavior unless the user manually scrolls up to read earlier parts of the conversation. Paragraph 1: Once upon a time in a digital kingdom far, far away, there lived a small piece of code named Widget. Paragraph 2: Widget was designed to be helpful, responsive, and aesthetically pleasing. It spent its days greeting visitors and helping them find what they needed. Paragraph 3: But one day, a giant stream of data arrived, threatening to overflow the buffer. Widget had to learn the art of auto-scrolling to keep up. Paragraph 4: And so, Widget became the most reliable companion for any website, handling long responses with grace and ease.",
  "markdown": "Here is some **markdown** for you:\n\n- Item 1\n- Item 2\n\nCheck out [Google](https://google.com)!",
  "default": "That's a great question! Let me check on that for you. Is there anything else you'd like to know about our products?"
};

export class MockChatService {
  static async *streamAssistantReply(userMessage: string): AsyncGenerator<StreamChunk> {
    // Initial "thinking" delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const normalized = userMessage.toLowerCase();
    let fullResponse = MOCK_RESPONSES["default"];
    
    for (const key in MOCK_RESPONSES) {
      if (normalized.includes(key)) {
        fullResponse = MOCK_RESPONSES[key];
        break;
      }
    }

    // Split response into chunks (words or small groups of chars)
    const chunks = fullResponse.split(" ");
    
    for (let i = 0; i < chunks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Delay between chunks
      yield {
        answer: chunks[i] + (i === chunks.length - 1 ? "" : " "),
        done: i === chunks.length - 1,
        session_id: "mock-session-123"
      };
    }
  }

  // Keep for backward compatibility if needed
  static async getAssistantReply(userMessage: string): Promise<string> {
    const generator = this.streamAssistantReply(userMessage);
    let fullText = "";
    for await (const chunk of generator) {
      if (chunk.answer) fullText += chunk.answer;
    }
    return fullText;
  }
}
