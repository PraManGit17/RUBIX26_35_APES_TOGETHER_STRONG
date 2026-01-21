import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTrade } from '../context/TradeContext';
import { initialData } from '../data/mockData';
import { Activity, Wallet, BarChart3, Clock, ShieldCheck, Zap, Globe, Cpu } from "lucide-react";
import ChartDisplay from '../components/Chart Components/ChartDisplay';
import RiskCalculator from '../components/Calculator/RiskCalculator';
import Navbar from '../components/Navbar';

const TradingFloor = () => {
  const { balance, positions } = useTrade();
  const location = useLocation();
  
  // URL Parameter Detection for Multiple Stocks
  const queryParams = new URLSearchParams(location.search);
  const activeSymbol = queryParams.get('symbol') || 'NIFTY 50';
  
  const currentPrice = initialData[initialData.length - 1].close;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased">
      <Navbar />
      <div className="pt-20">
      
      {/* 1. TOP UTILITY BAR (Global HUD) */}
      <nav className="border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="text-green-500" size={18} />
            <span className="syne font-black tracking-tighter text-lg">GAMMA_OS</span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Global_Liquidity</span>
              <span className="text-sm font-mono font-bold text-white">₹{balance.toLocaleString()}</span>
            </div>
            <div className="flex flex-col border-l border-white/10 pl-4">
              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Active_Node</span>
              <span className="text-sm font-mono font-bold text-blue-500">{activeSymbol}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-green-500 font-mono tracking-tighter">LIVE_MARKET_FEED</span>
          </div>
          <div className="flex items-center gap-1">
             {[1, 2, 3, 4].map(i => <div key={i} className={`h-1 w-6 rounded-full ${i === 2 ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-white/10'}`} />)}
          </div>
        </div>
      </nav>

      <main className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto">
        
        {/* ROW 1: THE INTELLIGENCE HUB (Chart) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#0D0D0D] border border-white/5 rounded-3xl p-6 shadow-2xl relative group overflow-hidden">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><BarChart3 size={18} /></div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Analysis_Terminal</h3>
                  <p className="text-lg font-bold syne">{activeSymbol} <span className="text-green-500 text-xs ml-2">₹{currentPrice.toLocaleString()}</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold uppercase transition-all">Telemetry</button>
                <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold uppercase transition-all">Alpha_Projections</button>
              </div>
            </div>
            
            <div className="h-[480px] w-full relative z-10">
               <ChartDisplay stockData={initialData} />
            </div>
          </div>

          {/* ROW 1 SIDEBAR: PROTOCOL BRIEF */}
          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-6 rounded-3xl">
                <ShieldCheck className="text-blue-500 mb-4" size={24} />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Protocol_Instruction</h4>
                <p className="text-xs text-gray-400 leading-relaxed poppins">
                  You are currently operating in the <span className="text-white font-bold">Paper-Simulation Node</span>. All executions utilize virtual liquidity. Ensure your Stop-Loss is mathematically aligned with the 2% risk protocol before commitment.
                </p>
             </div>
             <div className="bg-[#0D0D0D] border border-white/5 p-6 rounded-3xl flex-1 flex flex-col justify-center items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                   <Globe className="text-gray-600 animate-spin-slow" size={28} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Network_Status</p>
                  <p className="text-sm font-mono text-green-500">OPTIMIZED_LATENCY</p>
                </div>
             </div>
          </div>
        </section>

        {/* ROW 2: RISK LAB (Stacked below the chart for vertical flow) */}
        <section className="bg-[#0D0D0D] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order_Entry_Module</span>
          </div>
          <RiskCalculator currentPrice={currentPrice} />
        </section>

        {/* ROW 3: LIVE POSITIONS (Portfolio Management) */}
        <section className="bg-[#0D0D0D] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 py-5 border-b border-white/5 bg-[#121212] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-gray-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-200">Active_Deployments</h3>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-gray-500 uppercase font-bold">Total_PnL</span>
                <span className="text-sm font-mono text-green-500">+₹0.00</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#080808] text-[9px] text-gray-500 uppercase tracking-widest">
                  <th className="px-8 py-5">Node_ID</th>
                  <th className="px-8 py-5">Entry_Value</th>
                  <th className="px-8 py-5">Units</th>
                  <th className="px-8 py-5 text-right">Market_PnL</th>
                </tr>
              </thead>
              <tbody className="text-sm font-mono border-t border-white/5 divide-y divide-white/5">
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center text-gray-600 italic poppins text-xs tracking-wide">
                      Waiting for order commitment... Use the Risk Lab to initiate deployment.
                    </td>
                  </tr>
                ) : (
                  positions.map(p => {
                    const pnl = (currentPrice - p.entry) * p.units;
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5 text-white font-bold">{activeSymbol}</td>
                        <td className="px-8 py-5 text-gray-400">₹{p.entry.toLocaleString()}</td>
                        <td className="px-8 py-5 text-gray-400">{p.units} Units</td>
                        <td className={`px-8 py-5 text-right font-black ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(pnl).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
};

export default TradingFloor;