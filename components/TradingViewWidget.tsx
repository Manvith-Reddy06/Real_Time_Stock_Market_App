'use client';
import useTradingViewWidget from '@/hooks/UseTradingViewWidget';
// TradingViewWidget.jsx
import React, {  useRef, memo } from 'react';
import { cn } from "@/lib/utils";

interface TradingViewWidgetProps{
    title?:string;
    scriptUrl:string;
    config: Record<string,unknown>;
    height?: number;
    className?: string;
} 

function TradingViewWidget({title,scriptUrl,config,height=600,className}:TradingViewWidgetProps) {
  const containerRef = useTradingViewWidget(scriptUrl,config,height);

  

  return (
    <div className='w-full'>
      {title && <h3 className='font-semibold text-2xl'>{title}</h3>}
      <div className={cn("tradingview-widget-container", className)} ref={containerRef}>
        <div className="tradingview-widget-container__widget" style={{ height, width: "100%" }}></div>
      </div>

    </div> 
  );
}

export default memo(TradingViewWidget);
