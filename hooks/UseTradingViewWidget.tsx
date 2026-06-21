"use client";
import { useRef, useEffect } from "react";

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height: number | string = 600,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // 1. Clear the container completely. 
    // This prevents duplicate scripts during React 18 Strict Mode
    // and ensures a fresh slate if the scriptUrl or config changes.
    containerRef.current.innerHTML = "";

    // 2. Dynamically create the inner widget div.
    // By doing this inside the hook instead of the React component, 
    // we prevent React from tracking and conflicting with this DOM node
    // when TradingView mutates it (e.g. replacing it with an iframe).
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    widgetDiv.style.height = `${height}px`;
    widgetDiv.style.width = "100%";

    // 3. Create the script element.
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify(config);

    // 4. Append both directly to the ref container.
    containerRef.current.appendChild(widgetDiv);
    containerRef.current.appendChild(script);

  }, [scriptUrl, config, height]);

  return containerRef;
};

export default useTradingViewWidget;