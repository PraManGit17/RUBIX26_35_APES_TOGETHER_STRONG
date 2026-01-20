import React, { useState } from 'react';
import { ShieldCheck, Target, Wallet, Activity, ArrowRight, Zap } from "lucide-react";

const RiskCalculator = ({ currentPrice = 18580 }) => {
  const [entry, setEntry] = useState(currentPrice);
  const [target, setTarget] = useState(currentPrice * 1.05);
  const [stopLoss, setStopLoss] = useState(currentPrice * 0.98);
  const [budget, setBudget] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(2);

  // Strict 12-digit validation handler
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value.length <= 12) {
      setter(Number(value));
    }
  };

  // Professional Calculations
  const reward = target - entry;
  const risk = entry - stopLoss;
  const ratio = risk > 0 ? (reward / risk).toFixed(2) : "0.00";
  const positionSize = risk > 0 ? Math.floor((budget * (riskPercent / 100)) / risk) : 0;
  const totalInvestment = (positionSize * entry).toFixed(0);

  return (
    <div className="bg-[#0D0D0D] border border-[#262626] rounded-xl p-8 w-full max-w-[1100px] font-sans antialiased text-white shadow-2xl">
      
      {/* Header: Institutional Grade */}
      <div className="flex items-center justify-between mb-10 border-b border-[#262626] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-[#1A1A1A] border border-[#333] rounded-lg text-gray-400">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight uppercase">Order Execution & Risk Analysis</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Verified Safety Protocol Active</p>
          </div>
        </div>
        <div className="text-right tabular-nums">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Market Latency</p>
          <p className="text-xs text-green-500 font-mono">14ms / Stable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column: Input Strategy */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trade Parameters</h3>
            
            {/* Entry Input */}
            <div className="group">
              <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-tighter">Entry Position (INR)</p>
              <div className="flex items-center bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 focus-within:border-gray-500 transition-all">
                <span className="text-gray-600 font-mono mr-3">₹</span>
                <input 
                  type="number" 
                  value={entry} 
                  onChange={handleInputChange(setEntry)}
                  className="bg-transparent text-lg font-mono outline-none w-full text-white placeholder-gray-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Profit Target */}
              <div>
                <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-tighter">Limit Price (Profit)</p>
                <div className="flex items-center bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 focus-within:border-green-900 transition-all">
                  <input 
                    type="number" 
                    value={target} 
                    onChange={handleInputChange(setTarget)}
                    className="bg-transparent text-md font-mono outline-none w-full text-green-500"
                  />
                </div>
              </div>
              {/* Stop Loss */}
              <div>
                <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-tighter">Stop Price (Loss)</p>
                <div className="flex items-center bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 focus-within:border-red-900 transition-all">
                  <input 
                    type="number" 
                    value={stopLoss} 
                    onChange={handleInputChange(setStopLoss)}
                    className="bg-transparent text-md font-mono outline-none w-full text-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Budget Input */}
            <div className="bg-[#141414] border border-[#262626] p-5 rounded-lg">
              <p className="text-[10px] text-gray-500 font-bold mb-3 uppercase tracking-widest flex items-center gap-2">
                <Wallet size={12}/> Capital Allocation
              </p>
              <div className="flex items-center border-b border-[#333] pb-2">
                 <input 
                  type="number" 
                  value={budget} 
                  onChange={handleInputChange(setBudget)}
                  className="bg-transparent text-xl font-mono outline-none w-full text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calculations HUD */}
        <div className="flex flex-col justify-between space-y-8 bg-[#111] p-8 rounded-xl border border-[#262626]">
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Risk Assessment</h3>
            
            {/* Main Ratio Card */}
            <div className="bg-[#1A1A1A] border border-[#333] p-8 rounded-lg text-center shadow-inner">
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-2">Reward to Risk Ratio</p>
              <div className="flex items-center justify-center gap-6">
                <p className={`text-5xl font-mono font-bold tracking-tighter ${ratio >= 2 ? 'text-green-500' : 'text-yellow-600'}`}>
                  {ratio}
                </p>
                <div className={`px-2 py-1 border text-[9px] font-bold uppercase tracking-widest ${ratio >= 2 ? 'border-green-500/50 text-green-500' : 'border-yellow-600/50 text-yellow-600'}`}>
                   {ratio >= 2 ? 'Favorable' : 'High Risk'}
                </div>
              </div>
            </div>

            {/* Position Sizing Output */}
            <div className="grid grid-cols-2 gap-6 pt-4">
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">Units to Acquire</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight">{positionSize.toLocaleString()}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1">Total Exposure</p>
                  <p className="text-2xl font-mono font-bold text-white tracking-tight">₹{(Number(totalInvestment) / 1000).toFixed(2)}k</p>
               </div>
            </div>
          </div>

          <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#E5E5E5] transition-all flex items-center justify-center gap-3">
            Commit Strategy <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;