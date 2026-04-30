"use client";

import { useWidgetState } from "@/hooks/use-widget-state";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WidgetLauncher } from "./widget-launcher";
import { WidgetHeader } from "./widget-header";
import { MessageList } from "./message-list";
import { ChatInput } from "./chat-input";

export function WidgetShell() {
  const { state, toggleOpen, sendMessage } = useWidgetState({
    useMock: typeof window !== 'undefined' ? (window as any).CopilotWidgetConfig?.useMock : false
  });

  return (
    <div className="relative h-full w-full pointer-events-none">
      <div className="pointer-events-auto">
        <WidgetLauncher 
          isOpen={state.isOpen} 
          onClick={toggleOpen} 
          primaryColor={state.config.primaryColor}
        />
      </div>
      
      <div
        className={cn(
          "absolute bottom-20 right-4 w-[calc(100vw-2rem)] sm:w-[400px] transition-all duration-500 ease-in-out transform origin-bottom-right",
          state.isOpen 
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" 
            : "translate-y-4 opacity-0 scale-95 pointer-events-none"
        )}
      >
        <Card className="flex h-[600px] flex-col overflow-hidden shadow-2xl border-primary/20 glass-morphism">
          <WidgetHeader name={state.config.botName} onClose={toggleOpen} primaryColor={state.config.primaryColor} />
          
          <div className="flex-1 min-h-0">
            <MessageList messages={state.messages} welcomeMessage={state.config.welcomeMessage} />
          </div>
          
          {(state.isSubmitting || state.isStreaming) && (
            <div className="px-4 py-2 text-xs text-muted-foreground animate-pulse italic">
              {state.isSubmitting ? "Assistant is thinking..." : "Assistant is typing..."}
            </div>
          )}
          
          <ChatInput onSendMessage={sendMessage} disabled={state.isSubmitting || state.isStreaming} />
        </Card>
      </div>
    </div>
  );
}
