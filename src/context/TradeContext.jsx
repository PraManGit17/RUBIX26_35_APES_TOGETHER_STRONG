import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TradeContext = createContext();
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Stock market data - will be populated from API
export let STOCK_MARKET = {};

// Initialize state from localStorage or defaults
const initializeState = () => {
  // Check if we need to reset (you can remove this after first run)
  const needsReset = localStorage.getItem('gammaBalanceVersion') !== '2.0';
  
  if (needsReset) {
    // Clear old data
    localStorage.removeItem('gammaBalance');
    localStorage.removeItem('gammaHoldings');
    localStorage.removeItem('gammaTradeHistory');
    localStorage.setItem('gammaBalanceVersion', '2.0');
  }
  
  const savedBalance = localStorage.getItem('gammaBalance');
  const savedHoldings = localStorage.getItem('gammaHoldings');
  const savedTradeHistory = localStorage.getItem('gammaTradeHistory');
  
  return {
    balance: savedBalance ? parseFloat(savedBalance) : 100000, // Changed to 100000
    holdings: savedHoldings ? JSON.parse(savedHoldings) : [],
    tradeHistory: savedTradeHistory ? JSON.parse(savedTradeHistory) : []
  };
};

export const TradeProvider = ({ children }) => {
  const initialState = initializeState();
  const [balance, setBalance] = useState(initialState.balance);
  const [holdings, setHoldings] = useState(initialState.holdings);
  const [tradeHistory, setTradeHistory] = useState(initialState.tradeHistory);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(
    localStorage.getItem('paperTradingVisited') === 'true'
  );

  // Fetch real-time stock data
  const fetchStockData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/markets/live`);
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match existing format
        const transformedData = {};
        data.stocks.forEach(stock => {
          transformedData[stock.symbol] = {
            name: stock.name,
            symbol: stock.symbol,
            price: stock.price,
            change: stock.change,
            change_percent: stock.change_percent,
            volume: stock.volume,
            high: stock.high,
            low: stock.low,
            open: stock.open,
            bse_code: stock.bse_code,
            yahoo_symbol: stock.yahoo_symbol
          };
        });
        
        setStockData(transformedData);
        STOCK_MARKET = transformedData;
        
        // Update holdings with new prices
        setHoldings(prev => 
          prev.map(holding => {
            const currentStock = transformedData[holding.symbol];
            if (currentStock) {
              const newPrice = currentStock.price;
              return {
                ...holding,
                currentPrice: newPrice,
                pnl: (newPrice - holding.avgPrice) * holding.quantity,
                pnlPercent: ((newPrice - holding.avgPrice) / holding.avgPrice) * 100
              };
            }
            return holding;
          })
        );
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchStockData();
    
    // Update every 30 seconds
    const interval = setInterval(fetchStockData, 30000);
    return () => clearInterval(interval);
  }, [fetchStockData]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('gammaBalance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('gammaHoldings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('gammaTradeHistory', JSON.stringify(tradeHistory));
  }, [tradeHistory]);

  // Buy stocks
  const buyStock = useCallback((symbol, quantity, currentPrice) => {
    const totalCost = quantity * currentPrice;
    
    if (totalCost > balance) {
      return { success: false, message: 'Insufficient balance' };
    }

    if (quantity <= 0) {
      return { success: false, message: 'Invalid quantity' };
    }

    setHoldings(prev => {
      const existingIndex = prev.findIndex(h => h.symbol === symbol);
      let updatedHoldings;

      if (existingIndex > -1) {
        updatedHoldings = [...prev];
        const existing = updatedHoldings[existingIndex];
        const totalQty = existing.quantity + quantity;
        const totalCostBasis = existing.quantity * existing.avgPrice + quantity * currentPrice;
        updatedHoldings[existingIndex] = {
          ...existing,
          quantity: totalQty,
          avgPrice: totalCostBasis / totalQty,
          totalCost: totalCostBasis,
          currentPrice: currentPrice,
          pnl: (currentPrice - (totalCostBasis / totalQty)) * totalQty,
          pnlPercent: ((currentPrice - (totalCostBasis / totalQty)) / (totalCostBasis / totalQty)) * 100
        };
      } else {
        updatedHoldings = [...prev, {
          id: Date.now(),
          symbol,
          name: stockData[symbol]?.name || symbol,
          quantity,
          avgPrice: currentPrice,
          totalCost,
          currentPrice,
          pnl: 0,
          pnlPercent: 0,
          boughtAt: new Date().toISOString()
        }];
      }
      return updatedHoldings;
    });

    setBalance(prev => prev - totalCost);

    setTradeHistory(prev => [...prev, {
      id: Date.now(),
      symbol,
      name: stockData[symbol]?.name || symbol,
      type: 'BUY',
      quantity,
      price: currentPrice,
      total: totalCost,
      timestamp: new Date().toISOString(),
      pnl: 0
    }]);

    return { success: true, message: 'Stock purchased successfully!' };
  }, [balance, stockData]);

  // Sell stocks
  const sellStock = useCallback((symbol, quantity) => {
    const holding = holdings.find(h => h.symbol === symbol);

    if (!holding) {
      return { success: false, message: 'You don\'t own this stock' };
    }

    if (quantity > holding.quantity) {
      return { success: false, message: 'Insufficient quantity to sell' };
    }

    const currentPrice = holding.currentPrice;
    const totalProceeds = quantity * currentPrice;
    const costPerUnit = holding.totalCost / holding.quantity;
    const pnl = (currentPrice - costPerUnit) * quantity;

    setBalance(prev => prev + totalProceeds);

    setHoldings(prev => {
      return prev.map(h => {
        if (h.symbol === symbol) {
          const remainingQty = h.quantity - quantity;
          if (remainingQty === 0) {
            return null;
          }
          return {
            ...h,
            quantity: remainingQty,
            totalCost: h.totalCost - (costPerUnit * quantity),
            pnl: (currentPrice - h.avgPrice) * remainingQty,
            pnlPercent: ((currentPrice - h.avgPrice) / h.avgPrice) * 100
          };
        }
        return h;
      }).filter(Boolean);
    });

    setTradeHistory(prev => [...prev, {
      id: Date.now(),
      symbol,
      name: stockData[symbol]?.name || symbol,
      type: 'SELL',
      quantity,
      price: currentPrice,
      total: totalProceeds,
      timestamp: new Date().toISOString(),
      pnl
    }]);

    return { 
      success: true, 
      message: `Sold ${quantity} units with P&L: ₹${pnl.toFixed(0)}`,
      pnl
    };
  }, [holdings, stockData]);

  // Update stock price
  const updateStockPrice = useCallback((symbol, newPrice) => {
    setHoldings(prev => 
      prev.map(h => {
        if (h.symbol === symbol) {
          return {
            ...h,
            currentPrice: newPrice,
            pnl: (newPrice - h.avgPrice) * h.quantity,
            pnlPercent: ((newPrice - h.avgPrice) / h.avgPrice) * 100
          };
        }
        return h;
      })
    );
  }, []);

  // Get total portfolio value
  const getPortfolioValue = useCallback(() => {
    const holdingsValue = holdings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0);
    return balance + holdingsValue;
  }, [balance, holdings]);

  // Get total P&L
  const getTotalPnL = useCallback(() => {
    return holdings.reduce((sum, h) => sum + h.pnl, 0);
  }, [holdings]);

  // Mark first visit as completed
  const markFirstVisitComplete = useCallback(() => {
    setHasVisitedBefore(true);
    localStorage.setItem('paperTradingVisited', 'true');
  }, []);

  // Reset portfolio (for testing/admin)
  const resetPortfolio = useCallback(() => {
    setBalance(100000);
    setHoldings([]);
    setTradeHistory([]);
    localStorage.setItem('gammaBalance', '100000');
    localStorage.setItem('gammaHoldings', '[]');
    localStorage.setItem('gammaTradeHistory', '[]');
  }, []);

  const value = {
    balance,
    holdings,
    tradeHistory,
    hasVisitedBefore,
    stockData,
    loading,
    buyStock,
    sellStock,
    updateStockPrice,
    getPortfolioValue,
    getTotalPnL,
    markFirstVisitComplete,
    refreshStockData: fetchStockData,
    resetPortfolio
  };

  return (
    <TradeContext.Provider value={value}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (!context) {
    throw new Error('useTrade must be used within TradeProvider');
  }
  return context;
};