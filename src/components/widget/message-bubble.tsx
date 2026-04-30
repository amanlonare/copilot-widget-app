"use client";

import { cn } from "@/lib/utils";
import { ChatMessage } from "@/types/chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import { ActionWidget } from "./action-widget";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 p-1",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
            AI
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2",
          isAssistant
            ? "rounded-tl-none bg-muted text-foreground"
            : "rounded-tr-none bg-primary text-primary-foreground"
        )}
      >
        <div className="markdown-prose leading-relaxed">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="ml-4 list-disc mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="ml-4 list-decimal mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{children}</a>,
              code: ({ children }) => <code className="bg-background/20 px-1 rounded text-xs font-mono">{children}</code>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        
        {isAssistant && message.actions?.map((action, idx) => (
          <ActionWidget key={`${message.id}-action-${idx}`} action={action} />
        ))}
      </div>
      {!isAssistant && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
            ME
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
