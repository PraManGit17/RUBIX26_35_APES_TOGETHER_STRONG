import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrade } from '../context/TradeContext';
import { X, TrendingUp, TrendingDown, ShoppingCart, DollarSign, AlertCircle, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ComposedChart, Bar, Cell } from 'recharts';
import Confetti from 'react-dom-confetti';
import Candlestick from '../components/Candlestick';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const StockDetail = () => {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const { balance, holdings, buyStock, sellStock, stockData } = useTrade();
  
  const [stock, setStock] = useState(null);
  const [action, setAction] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [confirmedAction, setConfirmedAction] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [lastTradeTime, setLastTradeTime] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [timeframe, setTimeframe] = useState('1d');
  const [interval, setInterval] = useState('5m');
  const [loadingHistory, setLoadingHistory] = useState(true);

  const RATE_LIMIT_MS = 2000;
  const selectedHolding = holdings.find(h => h.symbol === symbol);
  const totalCost = quantity * (currentPrice || 0);

  // Fetch historical data
  const fetchHistoricalData = async (period = '1d', int = '5m') => {
    try {
      setLoadingHistory(true);
      const response = await fetch(`${API_BASE_URL}/markets/history/${symbol}?period=${period}&interval=${int}`);
      const data = await response.json();
      
      if (data.success) {
        // Transform to candlestick format
        const candles = data.candles.map(candle => ({
          time: new Date(candle.timestamp).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          timestamp: candle.timestamp,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume,
          body: [candle.open, candle.close]
        }));
        
        setPriceHistory(candles);
        if (candles.length > 0) {
          setCurrentPrice(candles[candles.length - 1].close);
        }
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Initialize stock data
  useEffect(() => {
    if (stockData[symbol]) {
      setStock(stockData[symbol]);
      setCurrentPrice(stockData[symbol].price);
    }
  }, [symbol, stockData]);

  // Fetch historical data on mount and when timeframe changes
  useEffect(() => {
    fetchHistoricalData(timeframe, interval);
  }, [symbol, timeframe, interval]);

  // Update current price from stockData
  useEffect(() => {
    if (stockData[symbol]) {
      setCurrentPrice(stockData[symbol].price);
      
      // Update the last candle with live price
      setPriceHistory(prev => {
        if (prev.length === 0) return prev;
        const newHistory = [...prev];
        const lastCandle = { ...newHistory[newHistory.length - 1] };
        lastCandle.close = stockData[symbol].price;
        lastCandle.high = Math.max(lastCandle.high, stockData[symbol].price);
        lastCandle.low = Math.min(lastCandle.low, stockData[symbol].price);
        lastCandle.body = [lastCandle.open, stockData[symbol].price];
        newHistory[newHistory.length - 1] = lastCandle;
        return newHistory;
      });
    }
  }, [stockData, symbol]);

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
    if (!currentPrice) return;

    if (isRateLimited) {
      setMessageType('error');
      setMessage(`⏱️ Please wait ${cooldownSeconds}s before the next trade`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    let result;
    
    if (action === 'BUY') {
      result = buyStock(symbol, quantity, currentPrice);
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
      
      setTimeout(() => {
        setShowConfetti(false);
        setMessage('');
      }, 3000);
    } else {
      setMessageType('error');
      setMessage(result.message);
      setShowConfetti(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    
    // Set appropriate interval based on timeframe
    const intervalMap = {
      '1d': '5m',
      '5d': '15m',
      '1mo': '1d',
      '3mo': '1d',
      '6mo': '1wk',
      '1y': '1wk',
    };
    setInterval(intervalMap[newTimeframe] || '1d');
  };

  if (!stock || !currentPrice) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
      </div>
    );
  }

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

  const priceChange = currentPrice - stock.open;
  const priceChangePercent = ((priceChange / stock.open) * 100).toFixed(2);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10 font-['Outfit']">
      <Confetti active={showConfetti} config={confirmedAction === 'buy' ? confettiConfig : {...confettiConfig, stagger: 10}} />
      
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/paper-trading')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tighter">{stock.symbol}</h1>
            <p className="text-gray-500 text-sm mt-1">{stock.name}</p>
          </div>
          <button
            onClick={() => fetchHistoricalData(timeframe, interval)}
            disabled={loadingHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={loadingHistory ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            {/* Price Info */}
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-6 mb-6">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-5xl font-mono font-black">₹{currentPrice.toFixed(2)}</p>
                  <p className={`text-lg font-mono mt-2 ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)} ({priceChangePercent}%)
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>High: ₹{stock.high.toFixed(2)}</p>
                  <p>Low: ₹{stock.low.toFixed(2)}</p>
                  <p>Volume: {(stock.volume / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </div>

            {/* Timeframe Buttons */}
            <div className="flex gap-2 mb-4">
              {['1d', '5d', '1mo', '3mo', '6mo', '1y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeChange(tf)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    timeframe === tf
                      ? 'bg-cyan-500 text-black'
                      : 'bg-[#0D0D0D] border border-[#1A1A1A] text-gray-400 hover:text-white'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Candlestick Chart */}
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Price Chart</h3>
              {loadingHistory ? (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="animate-spin text-cyan-400" size={48} />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#666" 
                      tick={{ fontSize: 10 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#666" 
                      tick={{ fontSize: 10 }}
                      domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <Tooltip 
  contentStyle={{ 
    backgroundColor: '#0D0D0D', 
    border: '1px solid #1A1A1A',
    borderRadius: '8px'
  }}
  formatter={(value, name, props) => {
    // Handle array values (body field)
    if (Array.isArray(value)) {
      return null; // Don't show the body field
    }
    // Handle numeric values
    if (typeof value === 'number') {
      return `₹${value.toFixed(2)}`;
    }
    return value;
  }}
  labelFormatter={(label) => `Time: ${label}`}
  content={({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-2">{data.time}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Open:</span>
            <span className="font-mono text-white">₹{data.open.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">High:</span>
            <span className="font-mono text-green-400">₹{data.high.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Low:</span>
            <span className="font-mono text-red-400">₹{data.low.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Close:</span>
            <span className="font-mono text-white">₹{data.close.toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4 pt-1 border-t border-[#1A1A1A]">
            <span className="text-gray-500">Volume:</span>
            <span className="font-mono text-cyan-400">{(data.volume / 1000).toFixed(0)}K</span>
          </div>
        </div>
      </div>
    );
  }}
/>
                    <Bar
                      dataKey="body"
                      shape={(props) => <Candlestick {...props} />}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Trading Panel */}
          <div className="space-y-6">
            {/* Message */}
            {message && (
              <div className={`p-4 rounded-xl border ${
                messageType === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Balance Info */}
            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Available Balance</p>
              <p className="text-3xl font-mono font-bold text-green-400">₹{balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            </div>

            {/* Holdings */}
            {selectedHolding && (
              <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-4">Your Holdings</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Quantity</span>
                    <span className="font-mono font-bold">{selectedHolding.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Avg Price</span>
                    <span className="font-mono font-bold">₹{selectedHolding.avgPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Current Value</span>
                    <span className="font-mono font-bold">₹{(selectedHolding.quantity * currentPrice).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="border-t border-[#1A1A1A] pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">P&L</span>
                      <span className={`font-mono font-bold text-lg ${selectedHolding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedHolding.pnl >= 0 ? '+' : ''}₹{selectedHolding.pnl.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                        <span className="text-xs ml-2">({selectedHolding.pnlPercent.toFixed(2)}%)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trading Form */}
            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-4">Trade</h3>
              
              {/* Action Toggle */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setAction('BUY')}
                  className={`py-3 rounded-lg font-bold transition-all ${
                    action === 'BUY'
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <TrendingUp className="inline mr-2" size={16} />
                  BUY
                </button>
                <button
                  onClick={() => setAction('SELL')}
                  className={`py-3 rounded-lg font-bold transition-all ${
                    action === 'SELL'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  disabled={!selectedHolding}
                >
                  <TrendingDown className="inline mr-2" size={16} />
                  SELL
                </button>
              </div>

              {/* Quantity Input */}
              <div className="mb-4">
                <label className="text-xs text-gray-500 uppercase font-bold tracking-widest block mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 font-mono text-lg focus:border-cyan-500 outline-none"
                  min="1"
                  max={action === 'SELL' && selectedHolding ? selectedHolding.quantity : undefined}
                />
                {action === 'SELL' && selectedHolding && (
                  <p className="text-xs text-gray-500 mt-2">
                    Available: {selectedHolding.quantity} units
                  </p>
                )}
              </div>

              {/* Total Cost */}
              <div className="bg-[#050505] border border-[#1A1A1A] rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Total {action === 'BUY' ? 'Cost' : 'Proceeds'}</span>
                  <span className="font-mono font-bold text-xl">₹{totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
                </div>
              </div>

              {/* Execute Button */}
              <button
                onClick={handleAction}
                disabled={isRateLimited || (action === 'SELL' && !selectedHolding)}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                  action === 'BUY'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/50'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRateLimited 
                  ? `Wait ${cooldownSeconds}s...` 
                  : action === 'BUY' 
                    ? 'Execute Buy Order' 
                    : 'Execute Sell Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;