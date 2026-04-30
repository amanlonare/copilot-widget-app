"use client";

import { Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface WidgetHeaderProps {
  name: string;
  onClose: () => void;
  primaryColor?: string;
}

export function WidgetHeader({ name, onClose, primaryColor }: WidgetHeaderProps) {
  return (
    <CardHeader 
      className="flex flex-row items-center justify-between space-y-0 py-4 text-primary-foreground"
      style={{ backgroundColor: primaryColor || 'hsl(var(--primary))' }}
    >
      <div className="flex flex-col gap-1">
        <CardTitle className="text-lg font-bold">{name}</CardTitle>
        <CardDescription className="text-xs text-primary-foreground/70">
          AI Shopping Assistant
        </CardDescription>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 text-primary-foreground hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
}
