"use client";

import { SendHorizontal } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSendMessage(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t bg-background p-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 focus-visible:ring-primary"
      />
      <Button
        size="icon"
        onClick={handleSend}
        disabled={!value.trim() || disabled}
        className="transition-all active:scale-95"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
