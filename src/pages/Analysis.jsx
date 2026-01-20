import React from 'react';
import { 
  CloudLightning, 
  Gauge, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Zap, 
  ArrowUpRight,
  Target,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

// Ensure your data is exported correctly from the data file
import { ANALYSIS_DATA } from '../data/analysisData';

const Analysis = () => {
  const { 
    india_vix, 
    market_breadth, 
    market_status, 
    market_weather, 
    nifty50, 
    sector_performance, 
    timestamp 
  } = ANALYSIS_DATA;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-['Outfit'] p-4 lg:p-8 selection:bg-indigo-500/30">
      <div className="max-w-[1400px] mx-auto">
        
        {/* 1. TOP SECTION: SYSTEM STATUS & MARKET WEATHER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Market Weather Panel */}
          <div className="lg:col-span-8 bg-[#0A0A0A] border border-slate-800/50 rounded-[2rem] p-10 relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group">
            <div className="absolute -top-24 -right-24 p-8 opacity-10 group-hover:opacity-20 transition-all duration-700 rotate-12">
              <CloudLightning size={400} className="text-indigo-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <span className="flex items-center gap-2 px-4 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] backdrop-blur-md">
                   {market_status} PHASE
                </span>
                <span className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                  <Clock size={14} className="text-indigo-500" /> SYNCED: {timestamp}
                </span>
              </div>

              <h1 className="text-6xl font-black tracking-tighter mb-6">
                MARKET <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{market_weather.condition.toUpperCase()}</span>
              </h1>
              
              <p className="text-slate-400 text-xl leading-relaxed max-w-2xl mb-10 font-light">
                {market_weather.summary}
              </p>

              <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-transparent border-l-4 border-indigo-500 rounded-r-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-indigo-400" />
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Protocol Advisory</p>
                </div>
                <p className="text-slate-300 text-sm font-medium leading-relaxed">
                  {market_weather.beginner_tip}
                </p>
              </div>
            </div>
          </div>

          {/* VIX Momentum Panel */}
          <div className="lg:col-span-4 bg-[#0A0A0A] border border-slate-800/50 rounded-[2rem] p-10 flex flex-col justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group hover:border-indigo-500/30 transition-all duration-500">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-3xl shadow-inner group-hover:shadow-indigo-500/20 transition-all">
                <Gauge size={32} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Momentum</p>
                <p className="text-lg font-mono font-bold text-slate-200">+{india_vix.change_percent}%</p>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">India VIX Index</p>
              <div className="flex items-baseline gap-4">
                <p className="text-6xl font-mono font-black tracking-tighter text-white">{india_vix.current_level}</p>
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
              </div>
              <p className="text-xs font-bold text-indigo-400/80 mt-4 uppercase tracking-[0.1em] border-t border-slate-800 pt-4">
                Interpretation: <span className="text-white">{india_vix.interpretation}</span>
              </p>
            </div>
          </div>
        </div>

        {/* 2. ANALYTICS GRID: METRICS & HEATMAPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Nifty Performance Card */}
          <div className="bg-[#0A0A0A] border border-slate-800/50 rounded-[2.5rem] p-8 flex items-center justify-between shadow-2xl hover:shadow-indigo-500/10 transition-all group">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Index • NIFTY 50</p>
              <p className="text-4xl font-mono font-black text-white">₹{nifty50.current_price.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-zinc-500 font-black text-xl mb-1 group-hover:text-indigo-400 transition-colors">
                 {nifty50.change_percent}%
              </div>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{nifty50.trend} MOMENTUM</p>
            </div>
          </div>

          {/* Market Breadth Panel */}
          <div className="bg-[#0A0A0A] border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl group hover:border-slate-700 transition-all">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <Activity size={18} className="text-cyan-400" /> System Breadth
              </h3>
              <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-1000" 
                style={{ width: `${(market_breadth.positive_count / market_breadth.total_count) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{market_breadth.ratio}</p>
              <span className="text-[9px] font-black px-2 py-1 bg-slate-800 rounded text-slate-300 uppercase">
                {market_breadth.summary}
              </span>
            </div>
          </div>

          {/* Sector movers (Glassmorphism) */}
          <div className="bg-gradient-to-br from-[#0D0D0D] to-[#050505] border border-slate-800/50 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
             <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                  <BarChart3 size={18} className="text-cyan-400" /> Intelligence
                </h3>
             </div>
             <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all cursor-default">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Alpha Sector</p>
                  <p className="text-sm font-bold text-slate-100">{sector_performance.top_sector}</p>
                </div>
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-slate-800/50 transition-all cursor-default">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Drifting</p>
                  <p className="text-sm font-bold text-slate-400">{sector_performance.lagging_sector}</p>
                </div>
             </div>
             <Target size={120} className="absolute -right-12 -bottom-12 text-indigo-500/[0.03] group-hover:text-indigo-500/[0.06] transition-all duration-700" />
          </div>

        </div>

        {/* 3. TERMINAL FOOTER */}
        <div className="mt-20 py-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-indigo-500 fill-indigo-500" />
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">
              Automated Analysis Module • {timestamp}
            </p>
          </div>
          <div className="flex gap-8">
            <span className="text-[9px] font-black text-slate-700 uppercase hover:text-indigo-400 cursor-pointer transition-colors">Documentation</span>
            <span className="text-[9px] font-black text-slate-700 uppercase hover:text-indigo-400 cursor-pointer transition-colors">Privacy Protocol</span>
            <span className="text-[9px] font-black text-slate-700 uppercase hover:text-indigo-400 cursor-pointer transition-colors">v2.0.4-Stable</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analysis;