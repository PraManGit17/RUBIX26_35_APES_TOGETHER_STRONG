import React, { useState } from 'react';
import { useTrade } from '../context/TradeContext';
import { TrendingUp, TrendingDown, History, MoveLeft, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaperTradingLayout from '../components/PaperTradingLayout';
import Navbar from '../components/Navbar';

const TradeHistory = () => {
  const navigate = useNavigate();
  const { tradeHistory, getTotalPnL } = useTrade();
  const [filterType, setFilterType] = useState('ALL'); // ALL, BUY, SELL

  const filteredTrades = filterType === 'ALL' 
    ? tradeHistory 
    : tradeHistory.filter(t => t.type === filterType);

  const totalBuyValue = tradeHistory
    .filter(t => t.type === 'BUY')
    .reduce((sum, t) => sum + t.total, 0);

  const totalSellValue = tradeHistory
    .filter(t => t.type === 'SELL')
    .reduce((sum, t) => sum + t.total, 0);

  const totalPnL = tradeHistory
    .filter(t => t.type === 'SELL')
    .reduce((sum, t) => sum + (t.pnl || 0), 0);

  const buyCount = tradeHistory.filter(t => t.type === 'BUY').length;
  const sellCount = tradeHistory.filter(t => t.type === 'SELL').length;
  const winningTrades = tradeHistory.filter(t => t.type === 'SELL' && t.pnl > 0).length;
  const losingTrades = tradeHistory.filter(t => t.type === 'SELL' && t.pnl < 0).length;
  const winRate = sellCount > 0 ? ((winningTrades / sellCount) * 100).toFixed(1) : 0;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
    <Navbar />
    <PaperTradingLayout>
      <div className="pt-20">
      <div className="p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-['Outfit']">
              Trade History
            </h1>
            <p className="text-gray-400 text-lg font-['Outfit']">View and analyze all your trading activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total Trades</p>
              <p className="text-2xl font-mono font-bold text-blue-400">{tradeHistory.length}</p>
              <p className="text-xs text-gray-600 mt-2">Buy: {buyCount} | Sell: {sellCount}</p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Win Rate</p>
              <p className={`text-2xl font-mono font-bold ${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                {winRate}%
              </p>
              <p className="text-xs text-gray-600 mt-2">Wins: {winningTrades} | Losses: {losingTrades}</p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total P&L (Closed)</p>
              <p className={`text-2xl font-mono font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '▲' : '▼'} ₹{Math.abs(totalPnL).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </p>
            </div>

            <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total Volume</p>
              <p className="text-2xl font-mono font-bold text-purple-400">
                ₹{(totalBuyValue + totalSellValue).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-3 mb-6">
            {['ALL', 'BUY', 'SELL'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  filterType === type
                    ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                    : 'bg-[#0D0D0D] border border-[#1A1A1A] text-gray-400 hover:border-gray-700'
                }`}
              >
                <Filter size={16} /> {type}
              </button>
            ))}
          </div>

          {/* Trades Table */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-xl overflow-hidden">
            <div className="px-8 py-4 bg-[#080808] border-b border-[#1A1A1A] flex items-center gap-3">
              <History size={18} className="text-blue-400" />
              <h2 className="text-lg font-bold">Trade Records ({filteredTrades.length})</h2>
            </div>

            {filteredTrades.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-4">No trades yet</p>
                <button
                  onClick={() => navigate('/paper-trading')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold transition-all"
                >
                  Start Trading
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#080808] text-[10px] text-gray-500 uppercase tracking-widest border-b border-[#1A1A1A]">
                      <th className="px-8 py-4">Date & Time</th>
                      <th className="px-8 py-4">Type</th>
                      <th className="px-8 py-4">Stock</th>
                      <th className="px-8 py-4">Qty</th>
                      <th className="px-8 py-4">Price</th>
                      <th className="px-8 py-4">Total Value</th>
                      <th className="px-8 py-4 text-right">P&L</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]">
                    {filteredTrades.map((trade, index) => (
                      <tr key={trade.id} className="hover:bg-[#0D0D0D]/50 transition-colors">
                        <td className="px-8 py-4 font-mono text-xs text-gray-400">
                          {formatDate(trade.timestamp)}
                        </td>
                        <td className="px-8 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                            trade.type === 'BUY'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {trade.type === 'BUY' ? (
                              <TrendingUp size={12} />
                            ) : (
                              <TrendingDown size={12} />
                            )}
                            {trade.type}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <div>
                            <p className="font-bold">{trade.symbol}</p>
                            <p className="text-xs text-gray-500">{trade.name}</p>
                          </div>
                        </td>
                        <td className="px-8 py-4 font-mono">{trade.quantity}</td>
                        <td className="px-8 py-4 font-mono">₹{trade.price.toFixed(0)}</td>
                        <td className="px-8 py-4 font-mono">₹{trade.total.toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                        <td className="px-8 py-4 text-right">
                          {trade.type === 'SELL' ? (
                            <span className={`font-mono font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {trade.pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(trade.pnl).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                            </span>
                          ) : (
                            <span className="text-gray-500">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Statistics */}
          {tradeHistory.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total Buy Value</p>
                <p className="text-2xl font-mono font-bold text-blue-400">₹{totalBuyValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
              </div>

              <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Total Sell Value</p>
                <p className="text-2xl font-mono font-bold text-red-400">₹{totalSellValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
              </div>

              <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Average Trade Size</p>
                <p className="text-2xl font-mono font-bold text-yellow-400">
                  ₹{(((totalBuyValue + totalSellValue) / 2) / tradeHistory.length).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </PaperTradingLayout>
    </>
  );
};

export default TradeHistory;
