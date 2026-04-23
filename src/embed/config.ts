export interface CopilotWidgetConfig {
  apiBaseUrl: string;       // Required - orchestrator URL
  shopId?: string;          // Optional tenant identifier
  theme?: "light" | "dark"; // Optional theme override
  position?: "bottom-right" | "bottom-left"; // Widget position
  initialGreeting?: string; // Custom first message
}

/**
 * Reads the runtime configuration from window.CopilotWidgetConfig
 * and returns it with safe defaults.
 */
export function getConfig(): CopilotWidgetConfig {
  if (typeof window === "undefined") {
    return {
      apiBaseUrl: "/api",
      theme: "light",
      position: "bottom-right",
    };
  }

  const cfg = (window as any).CopilotWidgetConfig ?? {};
  
  return {
    apiBaseUrl: cfg.apiBaseUrl ?? "/api",
    shopId: cfg.shopId,
    theme: cfg.theme ?? "light",
    position: cfg.position ?? "bottom-right",
    initialGreeting: cfg.initialGreeting,
  };
}
