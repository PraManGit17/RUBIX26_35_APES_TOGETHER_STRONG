import React, { useState, useEffect } from 'react';
import { useTrade } from '../context/TradeContext';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, BarChart3, Zap, AlertCircle, ChevronRight, Loader2, RefreshCw } from 'lucide-react';
import Confetti from 'react-dom-confetti';
import { useNavigate } from 'react-router-dom';
import PaperTradingLayout from '../components/PaperTradingLayout';
import Navbar from '../components/Navbar';

const PaperTrading = () => {
  const navigate = useNavigate();
  const { 
    balance, 
    holdings, 
    buyStock, 
    sellStock, 
    getPortfolioValue, 
    getTotalPnL, 
    markFirstVisitComplete, 
    hasVisitedBefore,
    stockData,
    loading: stocksLoading,
    refreshStockData
  } = useTrade();
  
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [action, setAction] = useState('BUY');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confirmedAction, setConfirmedAction] = useState(null);
  const [showGuide, setShowGuide] = useState(!hasVisitedBefore);
  const [lastTradeTime, setLastTradeTime] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const RATE_LIMIT_MS = 2000;

  // Set first stock as selected when data loads
  useEffect(() => {
    if (!selectedStock && Object.keys(stockData).length > 0) {
      setSelectedStock(Object.keys(stockData)[0]);
    }
  }, [stockData, selectedStock]);

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

  const currentStock = stockData[selectedStock];
  const totalCost = currentStock ? quantity * currentStock.price : 0;
  const selectedHolding = holdings.find(h => h.symbol === selectedStock);

  const handleAction = () => {
    if (!currentStock) return;

    // Check rate limiting
    if (isRateLimited) {
      setMessageType('error');
      setMessage(`⏱️ Please wait ${cooldownSeconds}s before the next trade`);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    let result;
    
    if (action === 'BUY') {
      result = buyStock(selectedStock, quantity, currentStock.price);
    } else {
      result = sellStock(selectedStock, quantity);
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

  const handleCloseGuide = () => {
    setShowGuide(false);
    markFirstVisitComplete();
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

  return (
    <>
    <Navbar />
    <PaperTradingLayout>
      <div className="p-6 lg:p-8 pt-24">
        <div className="max-w-[1400px] mx-auto">
          <Confetti active={showConfetti} config={confirmedAction === 'buy' ? confettiConfig : {...confettiConfig, stagger: 10}} />
          
          {showGuide && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
              <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-blue-500/30 rounded-2xl p-8 max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <h2 className="text-4xl font-bold mb-6 text-blue-400 font-['Outfit']">Welcome to Paper Trading!</h2>
                
                <div className="space-y-4 text-gray-300 font-['Outfit']">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">How Paper Trading Works:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                      <li>You start with ₹10,00,000 virtual capital</li>
                      <li>Select a stock from the list and enter quantity</li>
                      <li>Click BUY to purchase stocks at current price</li>
                      <li>View your holdings in the Portfolio section</li>
                      <li>SELL stocks to realize profits or losses</li>
                      <li>Track all trades in the Trade History</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Features:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                      <li>Real-time price updates from Yahoo Finance</li>
                      <li>Automatic P&L calculation</li>
                      <li>Portfolio overview with total value</li>
                      <li>Detailed stock view with price charts</li>
                      <li>Celebrate wins with confetti effects!</li>
                      <li>Track your trading performance</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Key Points:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-sm">
                      <li>Click any stock to see detailed charts and analytics</li>
                      <li>Average Price = sum of all purchase costs / total quantity</li>
                      <li>P&L = (Current Price - Average Price) × Quantity</li>
                      <li>You must have holdings to SELL stocks</li>
                      <li>Insufficient balance prevents buying</li>
                    </ul>
                  </div>
                </div>

                <button
                  onClick={handleCloseGuide}
                  className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/50"
                >
                  Start Trading Now!
                </button>
              </div>
            </div>
          )}

          {/* Title Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 font-['Outfit'] text-white">
                Trading Dashboard
              </h1>
              <p className="text-gray-400 text-base font-['Outfit'] leading-relaxed">
                Trade with real-time market data. Auto-updates every 30 seconds.
              </p>
            </div>
            <button
              onClick={refreshStockData}
              disabled={stocksLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={stocksLoading ? 'animate-spin' : ''} />
              <span className="text-sm font-bold">Refresh</span>
            </button>
          </div>

          {/* Header with Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-xl hover:border-green-500/50 transition-all shadow-lg hover:shadow-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 font-['Outfit']">Cash Balance</p>
                  <p className="text-2xl font-mono font-bold text-green-400">₹{balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-xl hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 font-['Outfit']">Portfolio Value</p>
                  <p className="text-2xl font-mono font-bold text-blue-400">₹{getPortfolioValue().toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-xl hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 font-['Outfit']">Total P&L</p>
                  <p className={`text-2xl font-mono font-bold ${getTotalPnL() >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {getTotalPnL() >= 0 ? '+' : ''}₹{getTotalPnL().toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#1A1A1A] p-6 rounded-xl hover:border-yellow-500/50 transition-all shadow-lg hover:shadow-yellow-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 font-['Outfit']">Holdings</p>
                  <p className="text-2xl font-mono font-bold text-yellow-400">{holdings.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {stocksLoading && Object.keys(stockData).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
              <p className="text-gray-400 text-sm">Loading real-time market data...</p>
            </div>
          ) : (
            <>
              {/* Stock Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6 font-['Outfit'] text-white">Available Stocks ({Object.keys(stockData).length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(stockData).map(([key, stock]) => (
                    <button
                      key={key}
                      onClick={() => navigate(`/stock/${key}`)}
                      className="group bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#262626] hover:border-blue-500/50 p-5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer text-left"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-white text-lg font-['Outfit']">{stock.symbol}</p>
                          <p className="text-xs text-gray-500 font-['Outfit'] truncate">{stock.name}</p>
                        </div>
                        <ChevronRight size={18} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-lg font-mono font-bold text-cyan-400">₹{stock.price.toFixed(0)}</p>
                          <p className={`text-xs font-mono ${stock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change_percent >= 0 ? '▲' : '▼'} {Math.abs(stock.change_percent).toFixed(2)}%
                          </p>
                        </div>
                        <ShoppingCart size={16} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PaperTradingLayout>
    </>
  );
};

export default PaperTrading;