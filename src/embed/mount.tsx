import React from "react";
import { createRoot } from "react-dom/client";
import { WidgetShell } from "../components/widget/widget-shell";
import { CopilotWidgetConfig } from "./config";
import { injectVersionMeta } from "./version";

// @ts-ignore - tsup will handle this raw import
import styles from "./styles.txt";

const ROOT_ID = "copilot-widget-root";

/**
 * Mounts the widget into a Shadow DOM container on the host page.
 */
export function mountWidget(config: CopilotWidgetConfig): void {
  if (typeof document === "undefined") return;

  // 1. Guard against double-mounting
  if (document.getElementById(ROOT_ID)) {
    console.warn("[CopilotWidget] Widget already mounted. Skipping.");
    return;
  }

  // 2. Inject Version Meta
  injectVersionMeta();

  // 3. Create host container
  const host = document.createElement("div");
  host.id = ROOT_ID;
  
  // Style the host container to fill the viewport and FORCE visibility
  host.setAttribute('style', `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 2147483647 !important;
    pointer-events: none !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    background: transparent !important;
  `);

  document.body.appendChild(host);

  // 4. Attach Shadow Root
  const shadow = host.attachShadow({ mode: "open" });

  // 5. Inject Styles
  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  shadow.appendChild(styleTag);

  // 6. Create React mount point
  const mountPoint = document.createElement("div");
  mountPoint.id = "copilot-mount-point";
  Object.assign(mountPoint.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none", // Clicks pass through by default
  });
  shadow.appendChild(mountPoint);

  // 7. Mount React
  const root = createRoot(mountPoint);
  root.render(
    <React.StrictMode>
      <WidgetShell />
    </React.StrictMode>
  );
}

/**
 * Cleanly removes the widget from the host page.
 */
export function unmountWidget(): void {
  const host = document.getElementById(ROOT_ID);
  if (host) {
    host.remove();
    console.log("[CopilotWidget] Widget unmounted.");
  } else {
    console.warn("[CopilotWidget] No widget found to unmount.");
  }
}
