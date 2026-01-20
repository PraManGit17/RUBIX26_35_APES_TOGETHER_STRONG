import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrade, STOCK_MARKET } from '../context/TradeContext';
import { X, TrendingUp, TrendingDown, ShoppingCart, DollarSign, AlertCircle, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart , ComposedChart , Bar,  Cell } from 'recharts';
import Confetti from 'react-dom-confetti';

import Candlestick from '../components/Candlestick';

const StockDetail = () => {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const { balance, holdings, buyStock, sellStock } = useTrade();
  
  const [stock, setStock] = useState(null);
  const [action, setAction] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [confirmedAction, setConfirmedAction] = useState(null);
  const [simulatedPrice, setSimulatedPrice] = useState(null);
  const [lastTradeTime, setLastTradeTime] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const RATE_LIMIT_MS = 2000; // 2 seconds between trades
  const selectedHolding = holdings.find(h => h.symbol === symbol);
  const totalCost = quantity * (simulatedPrice || 0);

//   useEffect(() => {
//   const history = [];
//   // Use the current price as the starting point
//   let prevClose = (simulatedPrice || STOCK_MARKET[symbol]?.price || 1000);
  
//   for (let i = 0; i < 30; i++) {
//     const open = prevClose;
//     const close = open + (Math.random() - 0.5) * 40; // Random movement
//     const high = Math.max(open, close) + Math.random() * 10;
//     const low = Math.min(open, close) - Math.random() * 10;
    
//     history.push({
//       time: `${i * 5}m`,
//       open, 
//       high, 
//       low, 
//       close,
//       // Recharts uses the 'body' array to determine the bar's top and bottom
//       body: [open, close] 
//     });
//     prevClose = close;
//   }
//   setPriceHistory(history);
// }, [symbol]);

  

  // Initialize stock data
  useEffect(() => {
    if (STOCK_MARKET[symbol]) {
      setStock(STOCK_MARKET[symbol]);
      setSimulatedPrice(STOCK_MARKET[symbol].price);
    }
  }, [symbol]);

  // Simulate price fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPrice(prev => {
        const change = (Math.random() - 0.5) * 50;
        const newPrice = Math.max(100, prev + change);
        return newPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Generate price history
  // useEffect(() => {
  //   const history = [];
  //   let price = (simulatedPrice || STOCK_MARKET[symbol]?.price || 1000) * 0.95;
    
  //   for (let i = 0; i < 20; i++) {
  //     price += (Math.random() - 0.5) * 10;
  //     history.push({
  //       time: `${i * 5}m`,
  //       price: Math.max(100, price),
  //     });
  //   }
    
  //   setPriceHistory(history);
  // }, [symbol, simulatedPrice]);

  // Unified Candle History Logic
  useEffect(() => {
    if (!symbol) return;

    const history = [];
    // Use simulatedPrice as a base, or fallback to the static market price
    let prevClose = simulatedPrice || STOCK_MARKET[symbol]?.price || 1000;
    
    // Generate 30 initial candles
    for (let i = 0; i < 30; i++) {
      const open = prevClose;
      const close = open + (Math.random() - 0.5) * 40; 
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;
      
      history.push({
        time: `${i * 5}m`,
        open, 
        high, 
        low, 
        close,
        body: [open, close] // Required for the Candlestick Bar
      });
      prevClose = close;
    }
    setPriceHistory(history);
    // We only want this to run once when the symbol changes
  }, [symbol]);

// Simulate live updates
useEffect(() => {
  const interval = setInterval(() => {
    setSimulatedPrice(prev => {
      const change = (Math.random() - 0.5) * 10;
      const newPrice = Math.max(100, prev + change);

      // Update the most recent candle in history to match the live price
      setPriceHistory(prevHistory => {
        if (prevHistory.length === 0) return prevHistory;
        const newHistory = [...prevHistory];
        const lastIndex = newHistory.length - 1;
        const lastCandle = { ...newHistory[lastIndex] };
        
        lastCandle.close = newPrice;
        lastCandle.high = Math.max(lastCandle.high, newPrice);
        lastCandle.low = Math.min(lastCandle.low, newPrice);
        lastCandle.body = [lastCandle.open, newPrice];
        
        newHistory[lastIndex] = lastCandle;
        return newHistory;
      });

      return newPrice;
    });
  }, 2000);

  return () => clearInterval(interval);
}, []);

  // Handle rate limit cooldown
  useEffect(() => {
    if (isRateLimited && lastTradeTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - lastTradeTime;
        const remaining = Math.max(0, Math.ceil((RATE_LIMIT_MS - elapsed) / 1000));
        
        if (remaining <= 0) {
          setIsRateLimited(false);
          setCooldownSeconds(0);
        } else {
          setCooldownSeconds(remaining);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRateLimited, lastTradeTime]);

  const handleAction = () => {
    // Check rate limiting
    if (isRateLimited) {
      setMessageType('error');
      setMessage(`⏱️ Please wait ${cooldownSeconds}s before the next trade`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    let result;
    
    if (action === 'BUY') {
      result = buyStock(symbol, quantity, simulatedPrice);
    } else {
      result = sellStock(symbol, quantity);
    }

    if (result.success) {
      setLastTradeTime(Date.now());
      setIsRateLimited(true);
      setCooldownSeconds(Math.ceil(RATE_LIMIT_MS / 1000));
      
      setMessageType('success');
      setMessage(result.message);
      setConfirmedAction(action === 'BUY' ? 'buy' : 'sell');
      setShowConfetti(true);
      setQuantity(1);
      
      // Save to localStorage
      localStorage.setItem('lastTradeAction', JSON.stringify({
        symbol,
        action,
        quantity,
        price: simulatedPrice,
        timestamp: new Date().toISOString()
      }));
      
      setTimeout(() => {
        setShowConfetti(false);
        setMessage('');
      }, 2500);
    } else {
      setMessageType('error');
      setMessage(result.message);
      setShowConfetti(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 30,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 0,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6e']
  };

  if (!stock || !simulatedPrice) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit']">
      <Confetti active={showConfetti} config={confirmedAction === 'buy' ? confettiConfig : {...confettiConfig, stagger: 10}} />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#0D0D0D] to-[#1A1A1A] border-b border-[#2A2A2A] backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/paper-trading')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-bold">Back to Trading</span>
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-white">{stock.name}</h1>
            <p className="text-sm text-gray-400">{symbol}</p>
          </div>

          <div className="text-right">
            <p className="text-3xl font-mono font-bold text-cyan-400">₹{simulatedPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Price Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#0D0D0D] border border-[#262626] p-6 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Current Price</p>
              <p className="text-3xl font-mono font-bold text-cyan-400">₹{simulatedPrice.toFixed(2)}</p>
            </div>
            
            <div className="bg-[#0D0D0D] border border-[#262626] p-6 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Your Holdings</p>
              <p className="text-3xl font-mono font-bold text-yellow-400">
                {selectedHolding ? selectedHolding.quantity : 0} units
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#262626] p-6 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Cash Balance</p>
              <p className="text-3xl font-mono font-bold text-green-400">₹{balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            </div>
          </div>

          {/* Price Chart */}
          {/* <div className="bg-[#0D0D0D] border border-[#262626] p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold mb-4 text-white">Price Movement (Last 100 mins)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#666" />
                <YAxis stroke="#666" domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#0D0D0D',
                    border: '1px solid #262626',
                    borderRadius: '8px'
                  }}
                  cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div> */}

          <div className="bg-[#0D0D0D] border border-[#262626] p-6 rounded-xl mb-8">
  <h3 className="text-lg font-bold mb-4 text-white">Live Technical Chart</h3>
  <ResponsiveContainer width="100%" height={350}>
    <ComposedChart data={priceHistory}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
      <XAxis dataKey="time" stroke="#666" tick={{fontSize: 12}} />
      <YAxis 
        domain={['dataMin - 20', 'dataMax + 20']} 
        orientation="right" 
        stroke="#666" 
        tick={{fontSize: 12}}
        tickFormatter={(val) => `₹${val.toFixed(0)}`}
      />
      <Tooltip 
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
              <div className="bg-[#0D0D0D] border border-[#333] p-3 rounded shadow-2xl text-[10px] font-mono">
                <p className="text-green-400">O: {d.open.toFixed(2)}</p>
                <p className="text-white">H: {d.high.toFixed(2)}</p>
                <p className="text-white">L: {d.low.toFixed(2)}</p>
                <p className="text-red-400">C: {d.close.toFixed(2)}</p>
              </div>
            );
          }
          return null;
        }}
      />
      <Bar 
        dataKey="body" 
        shape={<Candlestick />}
        isAnimationActive={false}
      >
        {priceHistory.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={entry.close > entry.open ? '#22c55e' : '#ef4444'} 
          />
        ))}
      </Bar>
    </ComposedChart>
  </ResponsiveContainer>
      </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trading Panel */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Execute Trade</h2>

              {/* Action Selection */}
              <div className="flex gap-3">
                <button
                  onClick={() => setAction('BUY')}
                  className={`flex-1 py-4 rounded-lg font-bold transition-all text-lg ${
                    action === 'BUY'
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-[#0D0D0D] border border-[#262626] text-gray-400 hover:border-green-500'
                  }`}
                >
                  <ShoppingCart className="inline mr-2" size={18} /> Buy
                </button>
                <button
                  onClick={() => setAction('SELL')}
                  className={`flex-1 py-4 rounded-lg font-bold transition-all text-lg ${
                    action === 'SELL'
                      ? selectedHolding && selectedHolding.pnl >= 0
                        ? 'bg-green-500/20 border border-green-500 text-green-400'
                        : 'bg-red-500/20 border border-red-500 text-red-400'
                      : selectedHolding && selectedHolding.pnl >= 0
                        ? 'bg-[#0D0D0D] border border-[#262626] text-gray-400 hover:border-green-500'
                        : 'bg-[#0D0D0D] border border-[#262626] text-gray-400 hover:border-red-500'
                  }`}
                >
                  <TrendingDown className="inline mr-2" size={18} /> Sell
                </button>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#0D0D0D] border border-[#262626] rounded-lg p-4 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Cost/Proceeds */}
              <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">
                  {action === 'BUY' ? 'Total Investment' : 'Total Proceeds'}
                </p>
                <p className="text-2xl font-mono font-bold text-cyan-400">
                  ₹{totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </p>
              </div>

              {/* Warnings */}
              {action === 'SELL' && (
                <div className={`border rounded-lg p-4 flex gap-3 ${
                  selectedHolding 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <AlertCircle size={20} className={`flex-shrink-0 ${
                    selectedHolding ? 'text-blue-400' : 'text-red-400'
                  }`} />
                  <div className={`text-sm ${selectedHolding ? 'text-blue-400' : 'text-red-400'}`}>
                    {selectedHolding ? (
                      <>You own <span className="font-bold">{selectedHolding.quantity}</span> units (Avg: ₹{selectedHolding.avgPrice.toFixed(0)})</>
                    ) : (
                      <>You don't own this stock</>
                    )}
                  </div>
                </div>
              )}

              {action === 'BUY' && totalCost > balance && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                  <div className="text-sm text-red-400">
                    Insufficient balance. Need ₹{(totalCost - balance).toLocaleString('en-IN', {maximumFractionDigits: 0})} more
                  </div>
                </div>
              )}

              {isRateLimited && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
                  <AlertCircle size={20} className="text-yellow-400 flex-shrink-0" />
                  <div className="text-sm text-yellow-400">
                    ⏱️ Trade limit active: Wait <span className="font-bold">{cooldownSeconds}s</span> for next trade
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleAction}
                disabled={
                  isRateLimited ||
                  (action === 'BUY' ? totalCost > balance :
                  action === 'SELL' ? !selectedHolding || quantity > selectedHolding.quantity :
                  true)
                }
                className={`w-full py-5 font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 text-lg ${
                  isRateLimited
                    ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                    : action === 'BUY'
                      ? totalCost > balance
                        ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/50'
                      : !selectedHolding || quantity > selectedHolding.quantity
                        ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                        : selectedHolding && selectedHolding.pnl >= 0
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/50'
                          : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/50'
                }`}
              >
                {action === 'BUY' ? <ShoppingCart size={20} /> : <TrendingDown size={20} />}
                {isRateLimited ? `⏱️ Wait ${cooldownSeconds}s` : `${action} ${quantity} Units @ ₹${simulatedPrice.toFixed(0)}`}
              </button>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg text-sm font-mono border ${
                  messageType === 'success'
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'bg-red-500/20 border-red-500/50 text-red-400'
                }`}>
                  {message}
                </div>
              )}
            </div>

            {/* Stock Info Panel */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Stock Information</h2>

              <div className="space-y-3">
                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Full Name</p>
                  <p className="text-white font-semibold text-lg">{stock.name}</p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Stock Symbol</p>
                  <p className="text-white font-semibold text-lg">{symbol}</p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Sector</p>
                  <p className="text-white font-semibold">Financial Services & Technology</p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Market Cap</p>
                  <p className="text-white font-semibold">₹5,00,000 Crores</p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">52 Week Range</p>
                  <p className="text-white font-semibold">₹{(simulatedPrice * 1.2).toFixed(0)} - ₹{(simulatedPrice * 0.8).toFixed(0)}</p>
                </div>

                {selectedHolding && (
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-3">Your Position</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantity:</span>
                        <span className="font-bold text-white">{selectedHolding.quantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Price:</span>
                        <span className="font-bold text-white">₹{selectedHolding.avgPrice.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Cost:</span>
                        <span className="font-bold text-white">₹{(selectedHolding.quantity * selectedHolding.avgPrice).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                      </div>
                      <div className="border-t border-blue-500/20 pt-2 mt-2 flex justify-between">
                        <span className="text-gray-400">P&L:</span>
                        <span className={`font-bold ${selectedHolding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedHolding.pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(selectedHolding.pnl).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">P&L %:</span>
                        <span className={`font-bold ${selectedHolding.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedHolding.pnlPercent >= 0 ? '▲' : '▼'} {Math.abs(selectedHolding.pnlPercent).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
