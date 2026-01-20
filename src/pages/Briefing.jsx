import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Target, Zap, MoveLeft, ArrowRight } from "lucide-react";

const Briefing = () => {
  const navigate = useNavigate();

  // The assets available in your Gamma network
  const assets = [
    { id: 'NIFTY50', name: 'NIFTY 50 Index', trend: 'Bullish', volatility: 'Low' },
    { id: 'RELIANCE', name: 'Reliance Industries', trend: 'Neutral', volatility: 'Medium' },
    { id: 'TATA', name: 'Tata Motors', trend: 'High Growth', volatility: 'High' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-16">
      <div className="max-w-[900px] mx-auto">
        <header className="mb-16 border-b border-white/5 pb-10">
          <h1 className="syne text-5xl font-black mb-4 tracking-tighter italic">PROTOCOL_BRIEFING</h1>
          <p className="text-gray-500 poppins text-sm max-w-xl leading-relaxed">
            Welcome to the Gamma Intelligence onboarding. Select an asset node below to enter the live trading environment. Your global virtual balance will remain synchronized across all nodes.
          </p>
        </header>

        {/* Protocol Knowledge Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0D0D0D] p-6 rounded-xl border border-white/5">
             <ShieldCheck className="text-blue-500 mb-4" />
             <h4 className="text-xs font-bold uppercase mb-2">01. Risk Rule</h4>
             <p className="text-[10px] text-gray-500">Max 2% capital risk per trade.</p>
          </div>
          <div className="bg-[#0D0D0D] p-6 rounded-xl border border-white/5">
             <Target className="text-green-500 mb-4" />
             <h4 className="text-xs font-bold uppercase mb-2">02. Reward Law</h4>
             <p className="text-[10px] text-gray-500">Target minimum 1:2 R/R ratio.</p>
          </div>
          <div className="bg-[#0D0D0D] p-6 rounded-xl border border-white/5">
             <Zap className="text-yellow-500 mb-4" />
             <h4 className="text-xs font-bold uppercase mb-2">03. Execution</h4>
             <p className="text-[10px] text-gray-500">Commit strategy only after validation.</p>
          </div>
        </div>

        {/* ASSET SELECTION ZONE */}
        <div className="space-y-4">
          <h3 className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-6">Select Deployment Node</h3>
          <div className="grid grid-cols-1 gap-4">
            {assets.map((asset) => (
              <div 
                key={asset.id}
                onClick={() => navigate(`/trading-floor?symbol=${asset.id}`)}
                className="group bg-[#0D0D0D] border border-white/5 p-6 rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center font-black text-xs group-hover:bg-blue-500 group-hover:text-black transition-all">
                    {asset.id.substring(0,2)}
                  </div>
                  <div>
                    <h4 className="syne text-lg font-bold">{asset.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-mono tracking-widest">{asset.trend} Protocol • Volatility: {asset.volatility}</p>
                  </div>
                </div>
                <ArrowRight className="text-gray-800 group-hover:text-white transition-all transform group-hover:translate-x-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Briefing;