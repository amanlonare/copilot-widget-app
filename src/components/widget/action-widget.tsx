"use client";

import { CommerceAction } from "@/types/chat";
import { ProductCarousel } from "./product-carousel";
import { CartConfirmation } from "./cart-confirmation";

interface ActionWidgetProps {
  action: CommerceAction;
}

export function ActionWidget({ action }: ActionWidgetProps) {
  if (!action) return null;

  switch (action.type) {
    case "product_search":
      return <ProductCarousel query={action.payload.query} />;
      
    case "add_to_cart":
      return (
        <CartConfirmation 
          variantId={action.payload.variant_id} 
          status={action.status} 
        />
      );

    default:
      console.warn("Unknown action type:", action.type);
      return null;
  }
}
