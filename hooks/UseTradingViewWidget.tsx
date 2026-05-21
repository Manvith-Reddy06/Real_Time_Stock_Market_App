"use client";
import { useRef, useEffect } from "react";
import React from "react";

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600,
) => {
  // small letter at start as it is a hook
  const containerRef = useRef<HTMLDivElement | null>(null);
  // apply changes to this containerRef

  useEffect(() => {
    //if container doesnt have any value
    if (!containerRef.current) return;
    // return when the trading view is akready loaded
    if (containerRef.current.dataset.loaded) return;
    containerRef.current!.innerHTML = `
  <div class="tradingview-widget-container__widget" style="width:100%; height:${height}px;"></div>`;
    const script = document.createElement("script");
    script.src =scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);
    //change the dataset to loaded after all the changes
    containerRef.current.dataset.loaded='true';

    // if you donot do a cleanup
    // old scripts remain in the DOM
    // duplicate TradingView widgets can appear
    // memory leaks can happen
    // re-rendering may append multiple scripts again
    // dataset.loaded stays "true" even after component removal

    return() => {
        if(containerRef.current){
            containerRef.current.innerHTML='';
            delete containerRef.current.dataset.loaded ;
        }
    }

    // return 
  }, [scriptUrl,config,height]);

  return containerRef;
};

export default useTradingViewWidget;
