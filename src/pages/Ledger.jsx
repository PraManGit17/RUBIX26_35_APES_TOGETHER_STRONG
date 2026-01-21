import React from 'react';
import { useTrade } from '../context/TradeContext';
import { History, PieChart, TrendingUp, TrendingDown, MoveLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Ledger = () => {
  const { positions } = useTrade();
  const navigate = useNavigate();

  // Mock closed trades to show how history looks
  const mockHistory = [
    { id: 1, date: '2026-01-18', asset: 'NIFTY 50', type: 'LONG', pnl: 4500, status: 'CLOSED' },
    { id: 2, date: '2026-01-17', asset: 'NIFTY 50', type: 'LONG', pnl: -1200, status: 'CLOSED' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="p-8 pt-24">
      <div className="max-w-[1100px] mx-auto">
        <header className="flex justify-between items-end mb-12 border-b border-[#1A1A1A] pb-8">
          <div>
             <button onClick={() => navigate('/trading-floor')} className="flex items-center gap-2 text-gray-500 hover:text-white mb-4 transition-all">
                <MoveLeft size={16} /> <span className="text-[9px] font-black uppercase tracking-[0.2em]">Live Floor</span>
             </button>
             <h1 className="syne text-4xl font-black italic">PERFORMANCE_LEDGER</h1>
          </div>
          <div className="flex gap-4">
             <div className="bg-[#0D0D0D] border border-[#1A1A1A] px-6 py-3 rounded-xl text-center">
                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Win Rate</p>
                <p className="text-xl font-mono text-green-500">66.7%</p>
             </div>
             <div className="bg-[#0D0D0D] border border-[#1A1A1A] px-6 py-3 rounded-xl text-center">
                <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Profit Factor</p>
                <p className="text-xl font-mono text-blue-500">2.4</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-2">Historical Log</h3>
          {mockHistory.map((trade) => (
            <div key={trade.id} className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-xl flex items-center justify-between hover:border-gray-700 transition-all">
              <div className="flex items-center gap-6">
                <div className={`p-2 rounded-lg ${trade.pnl > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                   {trade.pnl > 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{trade.asset}</p>
                  <p className="text-[10px] text-gray-500 font-mono uppercase">{trade.date} • {trade.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-mono font-bold ${trade.pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                   {trade.pnl > 0 ? '+' : ''}{trade.pnl.toLocaleString()}
                </p>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Settled_INR</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Ledger;