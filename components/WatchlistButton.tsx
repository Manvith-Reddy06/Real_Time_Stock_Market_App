"use client";

import React from 'react';

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ symbol, company, isInWatchlist }) => {
  const handleWatchlistToggle = () => {
    // This will eventually contain logic to add/remove from watchlist
    console.log(`Toggling watchlist status for ${company} (${symbol}). Current status: ${isInWatchlist}`);
  };

  return (
    <button
      onClick={handleWatchlistToggle}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;
