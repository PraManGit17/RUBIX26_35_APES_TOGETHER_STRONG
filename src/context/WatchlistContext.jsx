// Updated WatchlistContext.jsx with API integration
import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch watchlist from database on mount
  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/watchlist`);
      const data = await response.json();
      
      if (data.success) {
        setWatchlist(data.stocks || []);
      } else {
        setError('Failed to fetch watchlist');
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (symbol) => {
    const isCurrentlyFavorite = watchlist.includes(symbol);
    
    try {
      if (isCurrentlyFavorite) {
        // Remove from watchlist
        const response = await fetch(`${API_BASE_URL}/watchlist/${symbol}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        
        if (data.success) {
          setWatchlist(prev => prev.filter(s => s !== symbol));
        }
      } else {
        // Add to watchlist
        const response = await fetch(`${API_BASE_URL}/watchlist`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symbol }),
        });
        const data = await response.json();
        
        if (data.success) {
          setWatchlist(prev => [...prev, symbol]);
        }
      }
    } catch (err) {
      console.error('Error toggling watchlist:', err);
      setError(err.message);
    }
  };

  const isFavorite = (symbol) => watchlist.includes(symbol);

  const clearWatchlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/watchlist/clear`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        setWatchlist([]);
      }
    } catch (err) {
      console.error('Error clearing watchlist:', err);
      setError(err.message);
    }
  };

  return (
    <WatchlistContext.Provider value={{ 
      watchlist, 
      toggleWatchlist, 
      isFavorite, 
      clearWatchlist,
      loading,
      error,
      refreshWatchlist: fetchWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);