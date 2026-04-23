import { WidgetShell } from "@/components/widget/widget-shell";
import { Button } from "@@/components/ui/button";
import { ShoppingBag, Star, Zap, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Mock Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-white/80 px-8 py-4 backdrop-blur-md">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
          StyleCommerce
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-primary transition-colors">Shop</a>
          <a href="#" className="hover:text-primary transition-colors">Collections</a>
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <Button variant="outline" size="sm" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Cart (0)
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Summer Collection 2026
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Elevate Your <span className="text-primary italic">Everyday</span> Aesthetic.
            </h1>
            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Experience the next generation of curated fashion essentials. Premium quality meet timeless design for the modern minimalist.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <Button size="lg" className="h-14 px-8 text-lg shadow-xl hover:shadow-primary/20 transition-all">
                Shop the Collection
              </Button>
              <Button variant="ghost" size="lg" className="h-14 px-8 text-lg">
                View Lookbook
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-8">
              <div className="flex flex-col gap-1">
                <div className="flex text-amber-400">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <div className="text-sm font-semibold text-slate-900">5,000+ Happy Customers</div>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Zap className="h-5 w-5 text-indigo-500" />
                Next Day Delivery
              </div>
            </div>
          </div>
          
          <div className="relative aspect-square rounded-3xl bg-slate-200 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 font-medium">
              Hero Product Image Placeholder
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Premium Materials</h3>
              <p className="text-slate-600">Sourced from the finest sustainable suppliers across the globe.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Fast Shipping</h3>
              <p className="text-slate-600">Distributed from local hubs to ensure you get your style faster.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Lifetime Warranty</h3>
              <p className="text-slate-600">We stand behind every piece we ship. Quality guaranteed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-8 text-center text-sm">
        <div className="mx-auto max-w-7xl">
          <p>© 2026 StyleCommerce. All rights reserved.</p>
        </div>
      </footer>

      {/* The AI Copilot Widget */}
      <WidgetShell />
    </main>
  );
}
