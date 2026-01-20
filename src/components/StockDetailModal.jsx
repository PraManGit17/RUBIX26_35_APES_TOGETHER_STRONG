import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Confetti from 'react-dom-confetti';

const StockDetailModal = ({ stock, onClose, onBuy, onSell, balance, holdings }) => {
  const [action, setAction] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [confirmedAction, setConfirmedAction] = useState(null);

  const selectedHolding = holdings.find(h => h.symbol === stock.symbol);
  const totalCost = quantity * stock.price;

  // Generate price history chart data
  useEffect(() => {
    const history = [];
    let price = stock.price * 0.95;
    
    for (let i = 0; i < 20; i++) {
      price += (Math.random() - 0.5) * 10;
      history.push({
        time: `${i * 5}m`,
        price: Math.max(100, price),
        realPrice: stock.price
      });
    }
    
    setPriceHistory(history);
  }, [stock]);

  const handleAction = () => {
    let result;
    
    if (action === 'BUY') {
      result = onBuy(stock.symbol, quantity, stock.price);
    } else {
      result = onSell(stock.symbol, quantity);
    }

    if (result.success) {
      setMessageType('success');
      setMessage(result.message);
      setConfirmedAction(action === 'BUY' ? 'buy' : 'sell');
      setShowConfetti(true);
      setQuantity(1);
      
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto py-8">
      <Confetti active={showConfetti} config={confirmedAction === 'buy' ? confettiConfig : {...confettiConfig, stagger: 10}} />
      
      <div className="bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-2xl max-w-4xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A] bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{stock.name}</h2>
            <p className="text-sm text-gray-400 mt-1">{stock.symbol}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#262626] rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8">
          {/* Price Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#141414] border border-[#262626] p-6 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Current Price</p>
              <p className="text-3xl font-mono font-bold text-cyan-400">₹{stock.price.toFixed(2)}</p>
            </div>
            
            <div className="bg-[#141414] border border-[#262626] p-6 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">24h Change</p>
              <p className={`text-3xl font-mono font-bold ${stock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change_percent >= 0 ? '▲' : '▼'} {Math.abs(stock.change_percent).toFixed(2)}%
              </p>
            </div>

            <div className="bg-[#141414] border border-[#262626] p-6 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Your Holdings</p>
              <p className="text-3xl font-mono font-bold text-yellow-400">
                {selectedHolding ? selectedHolding.quantity : 0} units
              </p>
            </div>
          </div>

          {/* Price Chart */}
          <div className="bg-[#141414] border border-[#262626] p-6 rounded-xl mb-8">
            <h3 className="text-lg font-bold mb-4 text-white">Price Movement</h3>
            <ResponsiveContainer width="100%" height={300}>
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trading Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Trading</h3>

              {/* Action Selection */}
              <div className="flex gap-3">
                <button
                  onClick={() => setAction('BUY')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    action === 'BUY'
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-[#0D0D0D] border border-[#262626] text-gray-400 hover:border-green-500'
                  }`}
                >
                  <ShoppingCart className="inline mr-2" size={16} /> Buy
                </button>
                <button
                  onClick={() => setAction('SELL')}
                  className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                    action === 'SELL'
                      ? 'bg-red-500/20 border border-red-500 text-red-400'
                      : 'bg-[#0D0D0D] border border-[#262626] text-gray-400 hover:border-red-500'
                  }`}
                >
                  <TrendingDown className="inline mr-2" size={16} /> Sell
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
                  className="w-full bg-[#0D0D0D] border border-[#262626] rounded-lg p-3 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                <div className={`border rounded-lg p-3 flex gap-3 ${
                  selectedHolding 
                    ? 'bg-blue-500/10 border-blue-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <AlertCircle size={18} className={`flex-shrink-0 mt-0.5 ${
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
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-3">
                  <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-400">
                    Insufficient balance. Need ₹{(totalCost - balance).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleAction}
                disabled={
                  action === 'BUY' ? totalCost > balance :
                  action === 'SELL' ? !selectedHolding || quantity > selectedHolding.quantity :
                  true
                }
                className={`w-full py-4 font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 text-lg ${
                  action === 'BUY'
                    ? totalCost > balance
                      ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/50'
                    : !selectedHolding || quantity > selectedHolding.quantity
                      ? 'bg-gray-600/30 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/50'
                }`}
              >
                {action === 'BUY' ? <ShoppingCart size={20} /> : <TrendingDown size={20} />}
                {action} {quantity} Units
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
              <h3 className="text-lg font-bold text-white mb-4">Stock Information</h3>

              <div className="space-y-3">
                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Full Name</p>
                  <p className="text-white font-semibold">{stock.name}</p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Sector</p>
                  <p className="text-white font-semibold">Financial Services</p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Market Cap</p>
                  <p className="text-white font-semibold">₹5,00,000 Cr</p>
                </div>

                <div className="bg-[#0D0D0D] border border-[#262626] p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">52 Week High/Low</p>
                  <p className="text-white font-semibold">₹{(stock.price * 1.2).toFixed(0)} / ₹{(stock.price * 0.8).toFixed(0)}</p>
                </div>

                {selectedHolding && (
                  <>
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 p-4 rounded-lg">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Your Investment</p>
                      <div className="space-y-1">
                        <p className="text-white"><span className="text-gray-400">Quantity:</span> <span className="font-bold">{selectedHolding.quantity}</span> units</p>
                        <p className="text-white"><span className="text-gray-400">Avg Price:</span> ₹<span className="font-bold">{selectedHolding.avgPrice.toFixed(0)}</span></p>
                        <p className="text-white"><span className="text-gray-400">Total Cost:</span> ₹<span className="font-bold">{(selectedHolding.quantity * selectedHolding.avgPrice).toLocaleString('en-IN', {maximumFractionDigits: 0})}</span></p>
                        <p className={`text-white ${selectedHolding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <span className="text-gray-400">P&L:</span> {selectedHolding.pnl >= 0 ? '▲' : '▼'} <span className="font-bold">₹{Math.abs(selectedHolding.pnl).toFixed(0)}</span>
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailModal;
