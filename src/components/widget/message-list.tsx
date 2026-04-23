"use client";

import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { ChatMessage } from "@/types/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useAutoScroll(messages);

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="flex flex-col gap-4 px-4 py-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {messages.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No messages yet. Say hello!
          </div>
        )}
        <div ref={scrollRef} className="h-0" aria-hidden="true" />
      </div>
    </ScrollArea>
  );
}
