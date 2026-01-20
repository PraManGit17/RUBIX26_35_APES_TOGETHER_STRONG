import React from 'react';
import { Zap, ShieldCheck, ArrowUpRight, TrendingDown, TrendingUp, Target, Activity, Info, AlertTriangle } from 'lucide-react';
import { BACKEND_DATA } from '../data/marketNews';

const NewsPage = () => {
  const { data, news_impact_examples, sectors_impacted, top_opportunities, overall_market_sentiment } = BACKEND_DATA;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] p-4 lg:p-8">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: NEWS & TRENDS (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* MARKET SENTIMENT HERO */}
          <div className="bg-gradient-to-r from-[#0D0D0D] to-[#151515] border border-[#1A1A1A] p-8 rounded-[2rem] relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Institutional Sentiment</p>
                <h1 className={`text-5xl font-black tracking-tighter ${overall_market_sentiment === 'Bearish' ? 'text-red-500' : 'text-green-500'}`}>
                  {overall_market_sentiment.toUpperCase()}
                </h1>
                <p className="text-gray-400 mt-4 text-sm max-w-xl leading-relaxed">
                  {data.beginner_friendly_summary}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-mono font-black text-white">{BACKEND_DATA.sentiment_score}</p>
                <p className="text-[10px] font-bold text-gray-600 uppercase">Sentiment Score</p>
              </div>
            </div>
            {/* Background Graphic */}
            <Activity className="absolute -right-10 -bottom-10 opacity-[0.03] text-white" size={300} />
          </div>

          {/* NEWS FEED */}
          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-widest flex items-center gap-3 text-gray-400 uppercase">
              <Zap size={18} className="text-yellow-500" /> Impact Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news_impact_examples.map((item, idx) => (
                <div key={idx} className="group bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500">
                  <div className="h-40 relative">
                    <img src={item.image || "https://images.unsplash.com/photo-1611974715853-2b8ef9597394?q=80&w=500"} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${item.impact_on_market.includes('Positive') ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-gray-500/30 bg-black text-gray-400'}`}>
                        {item.impact_on_market.split(':')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg leading-tight mb-4 group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => window.open(item.url, '_blank')}>
                      {item.news_headline}
                    </h3>
                    <div className="flex gap-2">
                      {item.affected_stocks.map(s => (
                        <span key={s} className="text-[10px] font-black text-cyan-500/60 uppercase">#{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTELLIGENCE & PICKS (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* INVESTMENT ADVISORY */}
          <div className="bg-cyan-500 p-8 rounded-[2rem] text-black">
            <ShieldCheck size={32} className="mb-6" />
            <h3 className="text-2xl font-black tracking-tighter leading-none mb-2">RECO: {data.investment_recommendation.action}</h3>
            <p className="text-xs font-bold uppercase opacity-60 mb-4 tracking-widest">Risk: {data.investment_recommendation.risk_level}</p>
            <p className="text-sm font-medium leading-relaxed">
              {data.investment_recommendation.reasoning}
            </p>
          </div>

          {/* ALPHA PICKS */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest px-2">High Conviction Picks</h3>
            {top_opportunities.map((pick) => (
              <div key={pick.symbol} className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-2xl group hover:bg-[#111111] transition-all">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black border border-[#222] flex items-center justify-center font-black text-cyan-500">{pick.symbol[0]}</div>
                    <h4 className="font-black text-xl">{pick.symbol}</h4>
                  </div>
                  <span className="text-[10px] font-black bg-green-500/10 text-green-500 px-2 py-1 rounded border border-green-500/20">{pick.action}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Target</p>
                    <p className="text-md font-mono font-bold text-white">{pick.target}</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-[9px] text-gray-500 font-bold uppercase">Conviction</p>
                    <p className="text-md font-mono font-bold text-cyan-400">{pick.confidence}%</p>
                  </div>
                </div>
                <p className="text-s text-gray-500 italic">"{pick.reason}"</p>
              </div>
            ))}
          </div>

          {/* SECTOR PERFORMANCE */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-3xl">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Target size={14} /> Sector Impact Heat
            </h4>
            <div className="space-y-5">
              {sectors_impacted.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                    <span className="text-gray-400">{s.sector}</span>
                    <span className={s.impact.includes('Positive') ? 'text-green-500' : 'text-red-500'}>{s.impact}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${s.impact.includes('Positive') ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${s.score}%` }}></div>
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