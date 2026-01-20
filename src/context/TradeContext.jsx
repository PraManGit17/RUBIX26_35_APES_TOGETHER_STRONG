import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TradeContext = createContext();

// Stock market data with current prices
export const STOCK_MARKET = {
  NIFTY50: { name: 'NIFTY 50', symbol: 'NIFTY50', price: 25800, change: 1.2, change_percent: 0.58 },
  TCS: { name: 'Tata Consultancy Services', symbol: 'TCS', price: 3850, change: 45, change_percent: 1.19 },
  INFY: { name: 'Infosys Limited', symbol: 'INFY', price: 2780, change: -15, change_percent: -0.54 },
  RELIANCE: { name: 'Reliance Industries', symbol: 'RELIANCE', price: 2950, change: 25, change_percent: 0.85 },
  HDFC: { name: 'HDFC Bank', symbol: 'HDFC', price: 1850, change: -10, change_percent: -0.54 },
  ICICIBANK: { name: 'ICICI Bank', symbol: 'ICICIBANK', price: 1125, change: 15, change_percent: 1.35 },
  BAJAJFINSV: { name: 'Bajaj Finserv', symbol: 'BAJAJFINSV', price: 1680, change: 8, change_percent: 0.48 },
  WIPRO: { name: 'Wipro Limited', symbol: 'WIPRO', price: 490, change: -5, change_percent: -1.01 },
  SBIN: { name: 'State Bank of India', symbol: 'SBIN', price: 620, change: 10, change_percent: 1.64 },
  LT: { name: 'Larsen and Toubro', symbol: 'LT', price: 3580, change: 35, change_percent: 0.98 },
};

// Initialize state from localStorage or defaults
const initializeState = () => {
  const savedBalance = localStorage.getItem('gammaBalance');
  const savedHoldings = localStorage.getItem('gammaHoldings');
  const savedTradeHistory = localStorage.getItem('gammaTradeHistory');
  
  return {
    balance: savedBalance ? parseFloat(savedBalance) : 1000000,
    holdings: savedHoldings ? JSON.parse(savedHoldings) : [],
    tradeHistory: savedTradeHistory ? JSON.parse(savedTradeHistory) : []
  };
};

export const TradeProvider = ({ children }) => {
  const initialState = initializeState();
  const [balance, setBalance] = useState(initialState.balance); // Virtual 10 Lakhs
  const [holdings, setHoldings] = useState(initialState.holdings); // Current stock holdings
  const [tradeHistory, setTradeHistory] = useState(initialState.tradeHistory); // Buy/Sell history
  const [hasVisitedBefore, setHasVisitedBefore] = useState(
    localStorage.getItem('paperTradingVisited') === 'true'
  );

  // Save balance to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gammaBalance', balance.toString());
  }, [balance]);

  // Save holdings to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gammaHoldings', JSON.stringify(holdings));
  }, [holdings]);

  // Save trade history to localStorage whenever it changes
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

    // Check if stock already exists in holdings
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
          name: STOCK_MARKET[symbol]?.name || symbol,
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

    // Record trade
    setTradeHistory(prev => [...prev, {
      id: Date.now(),
      symbol,
      name: STOCK_MARKET[symbol]?.name || symbol,
      type: 'BUY',
      quantity,
      price: currentPrice,
      total: totalCost,
      timestamp: new Date().toISOString(),
      pnl: 0
    }]);

    return { success: true, message: 'Stock purchased successfully!' };
  }, [balance]);

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

    // Update holdings
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

    // Record trade
    setTradeHistory(prev => [...prev, {
      id: Date.now(),
      symbol,
      name: STOCK_MARKET[symbol]?.name || symbol,
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
  }, [holdings]);

  // Update stock prices
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

  const value = {
    balance,
    holdings,
    tradeHistory,
    hasVisitedBefore,
    buyStock,
    sellStock,
    updateStockPrice,
    getPortfolioValue,
    getTotalPnL,
    markFirstVisitComplete
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