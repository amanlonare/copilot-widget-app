console.log("[CopilotWidget] Script entry point reached");

import { getConfig } from "./config";
import { mountWidget, unmountWidget } from "./mount";

/**
 * Auto-initialize the widget on script load.
 * Reads configuration from window.CopilotWidgetConfig
 */
const init = () => {
  console.log("[CopilotWidget] Initializing...");
  try {
    const config = getConfig();
    mountWidget(config);

    // Expose public API for manual control if needed
    (window as any).CopilotWidget = {
      mount: () => mountWidget(getConfig()),
      unmount: unmountWidget,
      reinit: () => {
        unmountWidget();
        mountWidget(getConfig());
      },
    };
  } catch (err) {
    console.error("[CopilotWidget] Initialization failed:", err);
  }
};

if (typeof window !== "undefined") {
  console.log("[CopilotWidget] Window detected, state:", document.readyState);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // Already loaded or interactive
    init();
  }
}
