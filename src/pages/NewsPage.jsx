import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, ArrowUpRight, TrendingUp, Target, Activity, Newspaper, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import Navbar from '../components/Navbar';

const API_BASE_URL = 'http://localhost:5000';

const NewsPage = () => {
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/news-trends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: "Indian stock market",
          days_back: 7
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }

      const result = await response.json();
      setNewsData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch news. Please try again.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Transform backend data to match UI expectations
  const transformBackendData = (apiData) => {
    if (!apiData?.data) return null;

    const backendData = apiData.data;

    // Stock market related images for variety
    const stockImages = [
      "https://images.unsplash.com/photo-1611974715853-2b8ef9597394?q=80&w=500",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500",
      "https://images.unsplash.com/photo-1642790551116-18e150f248e8?q=80&w=500",
      "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=500",
      "https://images.unsplash.com/photo-1559589689-577aabd1db4f?q=80&w=500"
    ];

    // Transform sectors_impacted to include score (calculate from impact)
    const transformedSectors = (backendData.sectors_impacted || []).map(sector => ({
      sector: sector.sector,
      impact: sector.impact,
      reason: sector.reason,
      score: sector.impact === "Negative" ? 30 : sector.impact === "Neutral" ? 50 : 70
    }));

    // Calculate confidence score from sentiment_score (convert -1 to 1 range to 0-100 range)
    // More negative sentiment = lower confidence, more positive = higher confidence
    const baseConfidence = Math.round(((backendData.sentiment_score || 0) + 1) * 50);
    
    // Transform top_opportunities to match UI structure
    const transformedOpportunities = (backendData.top_opportunities || []).map((opp, idx) => ({
      symbol: opp.opportunity.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3) || `OP${idx}`,
      action: "BUY",
      target: "Long-term",
      confidence: Math.max(50, Math.min(95, baseConfidence + (10 - idx * 2))), // Derived from sentiment score
      reason: opp.why,
      stocks: opp.potential_stocks || []
    }));

    // Add rotating images to news_impact_examples
    const transformedNewsImpact = (backendData.news_impact_examples || []).map((news, idx) => ({
      ...news,
      image: stockImages[idx % stockImages.length]
    }));

    return {
      data: {
        ...backendData,
        investment_recommendation: backendData.investment_recommendation || {}
      },
      news_impact_examples: transformedNewsImpact,
      sectors_impacted: transformedSectors,
      top_opportunities: transformedOpportunities,
      overall_market_sentiment: backendData.overall_market_sentiment || "Neutral",
      sentiment_score: backendData.sentiment_score || 0
    };
  };

  // Use fetched data or fallback to empty objects/arrays
  const BACKEND_DATA = newsData ? transformBackendData(newsData) : null;

  const { 
    data = {}, 
    news_impact_examples = [], 
    sectors_impacted = [], 
    top_opportunities = [], 
    overall_market_sentiment = "Neutral"
  } = BACKEND_DATA || {};

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] flex items-center justify-center">
        <div className="text-center">
          <Activity className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
          <p className="text-slate-400 text-lg">Loading market intelligence...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShieldCheck className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Helper to generate a professional mini-trend line for stock picks
  const generateSparklineData = (seed) => {
    const base = seed > 90 ? 70 : 50;
    return [
      { v: base }, { v: base + 5 }, { v: base - 2 }, 
      { v: base + 10 }, { v: base + 8 }, { v: seed - 5 }, { v: seed }
    ];
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-['Outfit'] overflow-x-hidden">
      <Navbar />
      <div className="p-4 lg:p-8 pt-24">
      
      {/* 1. TOP MARQUEE ADVISORY */}
      <div className="mb-10 bg-indigo-600/10 border-y border-indigo-500/20 py-3 relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="animate-marquee-infinite whitespace-nowrap flex items-center gap-12">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">
                <ShieldCheck size={14} /> Intelligence Protocol Alpha
              </span>
              <p className="text-white font-bold text-sm tracking-tight">
                RECO: {data.investment_recommendation?.action} — "{data.investment_recommendation?.reasoning}"
              </p>
              <span className="h-1 w-1 rounded-full bg-indigo-500/50" />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: THE PULSE FEED */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* MARKET SENTIMENT HERO */}
          <div className="relative group bg-[#0D0D0D] border border-white/5 p-10 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,1)] hover:shadow-indigo-500/10 transition-all duration-700 overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex flex-col md:flex-row justify-between items-start relative z-10 gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                    <div className={`h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(0,0,0,0.5)] ${overall_market_sentiment === 'Bearish' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">System Sentiment Analysis</p>
                </div>
                <h1 className={`text-7xl font-black tracking-tighter mb-6 uppercase text-white`}>
                  {overall_market_sentiment} <span className="text-slate-800">Bias</span>
                </h1>
  
              </div>
              
              <div className="bg-black border border-white/5 p-4 rounded-[2.5rem] flex flex-col items-center justify-center min-w-[200px] shadow-2xl">
                <p className="text-6xl font-mono font-black text-white tracking-tighter mb-2">{BACKEND_DATA?.sentiment_score?.toFixed(2) || "0.00"}</p>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Confidence Score</p>
                <Activity size={32} className="mt-6 text-indigo-500 opacity-20 animate-pulse" />
              </div>
            </div>
          </div>

          {/* IMPACT NEWS GRID */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-4 px-4 uppercase text-slate-500">
               <Newspaper size={24} className="text-indigo-400" /> Insight Engine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {news_impact_examples.map((item, idx) => (
                <div key={idx} 
                  className="group bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-[#0D0D0D] hover:border-indigo-500/40 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 flex flex-col cursor-pointer"
                  onClick={() => item.url && window.open(item.url, '_blank')}
                >
                  <div className="h-52 relative overflow-hidden bg-slate-900">
                    <img src={item.image} className="w-full h-full object-cover grayscale opacity-20 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-80" alt="" />
                    <div className="absolute top-6 left-6">
                      <span className="text-[9px] font-black px-4 py-1.5 rounded-full border border-white/10 bg-black/80 backdrop-blur-xl tracking-[0.2em] text-indigo-400 uppercase">
                        {item.impact_on_market?.split(':')[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold leading-snug mb-6 group-hover:text-white transition-colors">
                      {item.news_headline}
                    </h3>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex gap-2">
                          {item.affected_stocks?.map(s => (
                            <span key={s} className="text-[10px] font-black text-slate-500 border border-white/5 px-3 py-1 rounded-lg uppercase tracking-tighter">
                                {s}
                            </span>
                          ))}
                        </div>
                        <ExternalLink size={16} className="text-slate-600 group-hover:text-indigo-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTELLIGENCE PANEL */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* SECTOR BIAS CHART */}
          <div className="bg-[#080808] border border-white/5 p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,1)]">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
              <Target size={16} className="text-indigo-500" /> SYSTEM SECTOR BIAS
            </h4>

            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectors_impacted}
                    cx="50%" cy="50%" innerRadius={85} outerRadius={110}
                    paddingAngle={8} dataKey="score" nameKey="sector" stroke="none"
                  >
                    {sectors_impacted.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.impact.includes('Positive') ? '#6366f1' : '#1e293b'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Aggregate</p>
                <p className="text-3xl font-mono font-black text-white">
                  {Math.round(sectors_impacted.reduce((acc, curr) => acc + curr.score, 0) / sectors_impacted.length)}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {sectors_impacted.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-500 group">
                  <span className="group-hover:text-white transition-colors">{s.sector.split('(')[0]}</span>
                  <span className={s.impact.includes('Positive') ? 'text-indigo-400' : 'text-slate-700'}>{s.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* HIGH CONVICTION ALPHA PICKS with SPARKLINE */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] px-6">Institutional Picks</h3>
            {top_opportunities.map((pick) => (
              <div key={pick.symbol} className="bg-[#0A0A0A] border border-white/5 p-8 rounded-[1.5rem] shadow-[0_15px_35px_rgba(0,0,0,0.8)] hover:border-indigo-500/40 transition-all group active:scale-95">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-center font-black text-2xl text-indigo-400 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {pick.symbol?.[0]}
                    </div>
                    <div>
                      <h4 className="font-black text-2xl tracking-tighter text-white">{pick.symbol}</h4>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${pick.action === 'BUY' ? 'text-emerald-500' : 'text-indigo-400'}`}>{pick.action}</p>
                    </div>
                  </div>
                  <div className="h-10 w-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={generateSparklineData(pick.confidence)}>
                        <Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="p-4 bg-black border border-white/5 text-center rounded-xl shadow-inner">
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-1 tracking-widest">Target</p>
                    <p className="text-xl font-mono font-black text-white">{pick.target}</p>
                  </div>
                  <div className="p-4 bg-black border border-white/5 text-center rounded-xl shadow-inner">
                    <p className="text-[9px] text-slate-600 font-black uppercase mb-1 tracking-widest">Conviction</p>
                    <p className="text-xl font-mono font-black text-indigo-500">{pick.confidence}%</p>
                  </div>
                </div>
                
                {pick.stocks && pick.stocks.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {pick.stocks.map((stock, idx) => (
                      <span key={idx} className="text-[10px] font-bold px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 uppercase tracking-wider">
                        {stock}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-[12px] text-slate-500 leading-relaxed font-medium italic border-l-2 border-indigo-500/30 pl-6">
                    "{pick.reason}"
                </p>
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