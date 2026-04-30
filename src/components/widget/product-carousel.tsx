"use client";

import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string | number;
  title: string;
  image: string;
  price: string;
  url: string;
  variants?: Array<{ id: string | number }>;
}

interface ProductCarouselProps {
  query: string;
}

export function ProductCarousel({ query }: ProductCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | number | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Using Shopify's predictive search API
        const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product`);
        const data = await response.json();
        
        const rawProducts = data.resources.results.products || [];
        const mapped: Product[] = rawProducts.map((p: any) => ({
          id: p.id,
          title: p.title,
          image: p.image || "/placeholder-product.png",
          price: p.price || "Contact for price",
          url: p.url,
          variants: p.variants || []
        }));
        
        setProducts(mapped);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (query) fetchProducts();
  }, [query]);

  const handleAddToCart = async (variantId: string | number) => {
    try {
      setAddingToCart(variantId);
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      });
      
      if (response.ok) {
        // Trigger a custom event for the store to update its cart count if needed
        document.dispatchEvent(new CustomEvent('cart:updated'));
        alert("Added to cart!");
      }
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        No products found for "{query}".
      </div>
    );
  }

  return (
    <div className="my-2 w-full">
      <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card">
        <div className="flex w-max space-x-4 p-4">
          {products.map((product) => (
            <Card key={product.id} className="w-[180px] overflow-hidden">
              <div className="relative aspect-square w-full bg-muted">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              <CardContent className="p-3">
                <h3 className="line-clamp-1 text-xs font-medium">{product.title}</h3>
                <p className="mt-1 text-xs font-bold text-primary">{product.price}</p>
                <div className="mt-3 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-full text-[10px]"
                    onClick={() => window.open(product.url, '_blank')}
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 w-full text-[10px]"
                    disabled={addingToCart !== null}
                    onClick={() => {
                      const variantId = product.variants?.[0]?.id || product.id;
                      handleAddToCart(variantId);
                    }}
                  >
                    {addingToCart === (product.variants?.[0]?.id || product.id) ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="mr-1 h-3 w-3" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
