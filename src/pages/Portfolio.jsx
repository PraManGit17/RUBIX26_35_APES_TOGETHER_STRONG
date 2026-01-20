import React, { useState } from 'react';
import { useTrade, STOCK_MARKET } from '../context/TradeContext';
import { TrendingUp, TrendingDown, PieChart, MoveLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-dom-confetti';
import PaperTradingLayout from '../components/PaperTradingLayout';

const Portfolio = () => {
  const navigate = useNavigate();
  const { balance, holdings, sellStock, getPortfolioValue, getTotalPnL } = useTrade();
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedToSell, setSelectedToSell] = useState(null);
  const [sellQuantity, setSellQuantity] = useState(0);

  const portfolioValue = getPortfolioValue();
  const totalPnL = getTotalPnL();
  const pnlPercent = ((totalPnL / (portfolioValue - totalPnL)) * 100).toFixed(2);

  const handleSell = (symbol) => {
    const result = sellStock(symbol, sellQuantity);
    if (result.success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      setSelectedToSell(null);
      setSellQuantity(0);
    }
  };

  const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 30,
    elementCount: 70,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 10,
    width: '10px',
    height: '10px',
    perspective: '500px',
    colors: ['#ff0000', '#ff7700', '#ffff00', '#00ff00', '#0000ff']
  };

  return (
    <PaperTradingLayout>
      <Confetti active={showConfetti} config={confettiConfig} />

      <div className="p-6a lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-['Outfit']">
              Your Portfolio
            </h1>
            <p className="text-gray-400 text-lg font-['Outfit']">Manage your holdings and track your investments</p>
          </div>
          {/* Header */}
          <div className="flex justify-between items-start mb-8 border-b border-[#1A1A1A] pb-8">
            <div>
              <button
                onClick={() => navigate('/paper-trading')}
                className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-all"
              >
                <MoveLeft size={18} /> Back to Trading
              </button>
              <h1 className="text-4xl font-black ">PORTFOLIO OVERVIEW</h1>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total Portfolio Value</p>
              <p className="text-3xl font-mono font-bold text-blue-400">₹{portfolioValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Cash Balance</p>
              <p className="text-2xl font-mono font-bold text-green-400">₹{balance.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Holdings Value</p>
              <p className="text-2xl font-mono font-bold text-purple-400">
                ₹{holdings.reduce((sum, h) => sum + (h.currentPrice * h.quantity), 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total P&L</p>
              <p className={`text-2xl font-mono font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '▲' : '▼'} ₹{Math.abs(totalPnL).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">P&L %</p>
              <p className={`text-2xl font-mono font-bold ${pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {pnlPercent >= 0 ? '▲' : '▼'} {Math.abs(pnlPercent)}%
              </p>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl overflow-hidden">
            <div className="px-8 py-4 bg-[#080808] border-b border-[#1A1A1A] flex items-center gap-3">
              <PieChart size={18} className="text-purple-400" />
              <h2 className="text-lg font-bold">Your Holdings ({holdings.length})</h2>
            </div>

            {holdings.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-4">No holdings yet</p>
                <button
                  onClick={() => navigate('/paper-trading')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-all"
                >
                  Start Trading
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#080808] text-[10px] text-gray-500 uppercase tracking-widest">
                      <th className="px-8 py-4">Stock</th>
                      <th className="px-8 py-4">Qty</th>
                      <th className="px-8 py-4">Avg Price</th>
                      <th className="px-8 py-4">Current Price</th>
                      <th className="px-8 py-4">Total Cost</th>
                      <th className="px-8 py-4">Current Value</th>
                      <th className="px-8 py-4">P&L</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {holdings.map((holding) => {
                      const currentValue = holding.currentPrice * holding.quantity;
                      return (
                        <tr key={holding.id} className="hover:bg-[#0D0D0D]/50 transition-colors group">
                          <td className="px-8 py-4">
                            <div>
                              <p className="font-bold">{holding.symbol}</p>
                              <p className="text-xs text-gray-500">{holding.name}</p>
                            </div>
                          </td>
                          <td className="px-8 py-4 font-mono">{holding.quantity}</td>
                          <td className="px-8 py-4 font-mono text-gray-400">₹{holding.avgPrice.toFixed(0)}</td>
                          <td className="px-8 py-4 font-mono text-white">₹{holding.currentPrice.toFixed(0)}</td>
                          <td className="px-8 py-4 font-mono text-gray-400">₹{holding.totalCost.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                          <td className="px-8 py-4 font-mono text-white">₹{currentValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                          <td className={`px-8 py-4 font-mono font-bold ${holding.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {holding.pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(holding.pnl).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                          </td>
                          <td className="px-8 py-4 text-right">
                            <button
                              onClick={() => setSelectedToSell(holding.symbol)}
                              className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sell Modal */}
          {selectedToSell && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-[#0D0D0D] border border-red-500/30 rounded-xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4">Sell {selectedToSell}</h3>
                
                <div className="bg-[#141414] border border-[#262626] p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-400">Quantity available:</p>
                  <p className="text-2xl font-mono font-bold text-white">
                    {holdings.find(h => h.symbol === selectedToSell)?.quantity || 0}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-400 mb-2">Sell Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={holdings.find(h => h.symbol === selectedToSell)?.quantity || 0}
                    value={sellQuantity}
                    onChange={(e) => setSellQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedToSell(null);
                      setSellQuantity(0);
                    }}
                    className="flex-1 bg-[#1A1A1A] hover:bg-[#262626] text-white py-2 rounded-lg font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSell(selectedToSell)}
                    disabled={sellQuantity <= 0}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white py-2 rounded-lg font-bold transition-all"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PaperTradingLayout>
  );
};

export default Portfolio;
