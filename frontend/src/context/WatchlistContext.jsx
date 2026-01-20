import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    // Initialize from LocalStorage
    const saved = localStorage.getItem('gammaWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gammaWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol) => {
    setWatchlist((prev) => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol) 
        : [...prev, symbol]
    );
  };

const isFavorite = (symbol) => watchlist.includes(symbol);

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, isFavorite }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);