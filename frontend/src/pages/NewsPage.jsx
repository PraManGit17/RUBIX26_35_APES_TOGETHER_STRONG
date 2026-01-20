import React from 'react';
import { Newspaper, Zap, TrendingUp, ShieldCheck, ArrowUpRight, TrendingDown, Target, Activity } from 'lucide-react';
import { NEWS_DATA, STOCK_PICKS } from '../data/marketNews';

const NewsPage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] p-4 lg:p-8">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: LIVE PULSE (Main Feed) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              LIVE MARKET PULSE
            </h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/20 rounded-full">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-green-500 uppercase">Synced 2026</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {NEWS_DATA.map((news) => (
              <div key={news.id} className="group relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl overflow-hidden hover:border-cyan-500/40 transition-all duration-500 flex flex-col h-full">
                {/* News Image Backdrop */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={news.image} 
                    alt="" 
                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 opacity-40 group-hover:opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`text-[9px] font-black px-2 py-1 rounded border tracking-widest ${
                      news.sentiment === 'BULLISH' ? 'border-green-500/50 text-green-400 bg-green-500/10' : 'border-red-500/50 text-red-400 bg-red-500/10'
                    }`}>
                      {news.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 -mt-10 relative z-10 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#0D0D0D]">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-mono text-gray-500">{news.timestamp}</span>
                      <TrendingUp size={14} className={news.sentiment === 'BULLISH' ? "text-green-500" : "text-red-500 opacity-20"} />
                    </div>
                    <h3 className="text-xl font-bold leading-tight mb-3 group-hover:text-cyan-400 transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 opacity-80 group-hover:opacity-100">
                      {news.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/5">
                    {news.impactedSectors.map(sector => (
                      <span key={sector} className="text-[9px] font-bold text-cyan-500/60 uppercase tracking-widest">
                        #{sector}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ALPHA INTELLIGENCE (Recommendations) */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3 mb-4">
            ALPHA SCORES
          </h2>

          <div className="space-y-4">
            {STOCK_PICKS.map((pick) => (
              <div key={pick.symbol} className="relative bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl p-5 hover:bg-[#111111] transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                      pick.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {pick.symbol[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg leading-none">{pick.symbol}</h4>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${pick.isUp ? 'text-green-500/60' : 'text-red-500/60'}`}>
                        {pick.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center gap-1 text-sm font-mono font-bold ${pick.isUp ? 'text-green-400' : 'text-red-400'}`}>
                      {pick.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {pick.trend}
                    </div>
                    <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 tracking-tighter">Day Trend</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5 p-3 bg-black/40 rounded-xl border border-white/5">
                  <div className="border-r border-white/5">
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Target</p>
                    <p className="text-base font-mono font-bold text-white">{pick.target}</p>
                  </div>
                  <div className="pl-2">
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Conviction</p>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-mono font-bold text-cyan-400">{pick.confidence}%</span>
                      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full" style={{ width: `${pick.confidence}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 italic leading-relaxed line-clamp-2">
                  "{pick.reason}"
                </p>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={16} className="text-white/20" />
                </div>
              </div>
            ))}
          </div>

          {/* MARKET STATS WIDGET */}
          <div className="p-6 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl relative overflow-hidden">
            <Activity className="absolute -right-6 -bottom-6 text-cyan-500/10" size={120} />
            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Target size={14} /> 2026 SECTOR HEAT
            </h4>
            <div className="space-y-3">
              {[
                { name: 'EV Tech', val: 82, color: 'bg-green-500' },
                { name: 'Sovereign AI', val: 94, color: 'bg-cyan-500' },
                { name: 'Private Banks', val: 65, color: 'bg-blue-500' }
              ].map(s => (
                <div key={s.name}>
                  <div className="flex justify-between text-[10px] font-bold mb-1">
                    <span className="text-gray-400 uppercase">{s.name}</span>
                    <span className="text-white">{s.val}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewsPage;