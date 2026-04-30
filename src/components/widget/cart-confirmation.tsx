"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartConfirmationProps {
  variantId: string | number;
  status?: "pending" | "success" | "error";
}

export function CartConfirmation({ variantId, status: initialStatus = "pending" }: CartConfirmationProps) {
  const [status, setStatus] = useState<"pending" | "success" | "error">(initialStatus);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If the status is already success/error (e.g. from a past session), don't re-add
    if (initialStatus !== "pending") return;

    async function addToCart() {
      try {
        setStatus("pending");
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
        });
        
        if (response.ok) {
          setStatus("success");
          document.dispatchEvent(new CustomEvent('cart:updated'));
        } else {
          const data = await response.json();
          throw new Error(data.description || "Failed to add to cart");
        }
      } catch (err: any) {
        console.error("Cart error:", err);
        setError(err.message);
        setStatus("error");
      }
    }

    addToCart();
  }, [variantId, initialStatus]);

  return (
    <div className="my-2 flex items-center gap-3 rounded-lg border bg-muted/30 p-3 text-sm animate-in fade-in zoom-in-95">
      {status === "pending" && (
        <>
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Adding item to your cart...</span>
        </>
      )}
      
      {status === "success" && (
        <>
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div className="flex flex-col">
            <span className="font-medium text-foreground">Added to cart!</span>
            <Button 
              variant="link" 
              className="h-auto p-0 text-xs text-primary justify-start"
              onClick={() => window.location.href = '/cart'}
            >
              <ShoppingBag className="mr-1 h-3 w-3" />
              Go to checkout
            </Button>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="h-5 w-5 text-destructive" />
          <div className="flex flex-col">
            <span className="font-medium text-destructive">Failed to add item</span>
            <span className="text-[10px] text-muted-foreground">{error || "The item might be out of stock."}</span>
          </div>
        </>
      )}
    </div>
  );
}
