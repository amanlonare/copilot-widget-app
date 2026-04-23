/**
 * Injects a version identifier into the host page's <head> when the widget script loads.
 * This makes it easy to diagnose which widget version is running on a site.
 */

// tsup replaces this at build time via esbuildOptions define
declare const __WIDGET_VERSION__: string;

export const WIDGET_VERSION = typeof __WIDGET_VERSION__ !== "undefined" ? __WIDGET_VERSION__ : "0.0.0";

/**
 * Injects <meta name="copilot-widget-version" content="x.y.z"> into document.head.
 * Idempotent check prevents duplicate tags.
 */
export function injectVersionMeta(): void {
  if (typeof document === "undefined") return;
  
  if (document.querySelector('meta[name="copilot-widget-version"]')) {
    return;
  }

  if (!document.head) return;
  
  const meta = document.createElement("meta");
  meta.name = "copilot-widget-version";
  meta.content = WIDGET_VERSION;
  document.head.appendChild(meta);
}
