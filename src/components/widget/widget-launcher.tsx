"use client";

import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WidgetLauncherProps {
  isOpen: boolean;
  onClick: () => void;
  primaryColor?: string;
}

export function WidgetLauncher({ isOpen, onClick, primaryColor }: WidgetLauncherProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "launcher-button absolute bottom-4 right-4 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
        isOpen ? "bg-muted-foreground" : ""
      )}
      style={!isOpen ? { backgroundColor: primaryColor || 'hsl(var(--primary))' } : {}}
    >
      {isOpen ? (
        <X className="h-6 w-6 text-white" />
      ) : (
        <MessageSquare className="h-6 w-6 text-white" />
      )}
    </Button>
  );
}
