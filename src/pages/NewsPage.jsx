import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck, ArrowUpRight, TrendingDown, TrendingUp, Target, Activity, Info, AlertTriangle, RefreshCw, Calendar } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const NewsPage = () => {
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [daysBack, setDaysBack] = useState(7);

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
          days_back: daysBack
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-cyan-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Analyzing market trends...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchNews}
            className="px-6 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!newsData || !newsData.data) {
    return null;
  }

  const { data, success } = newsData;
  const {
    overall_market_sentiment,
    sentiment_score,
    beginner_friendly_summary,
    investment_recommendation,
    key_trends,
    news_impact_examples,
    sectors_impacted,
    top_opportunities,
    risks_to_watch,
    sample_news,
    metadata
  } = data;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] p-4 lg:p-8">
      {/* Header with Refresh and Days Filter */}
      <div className="max-w-[1500px] mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Market Intelligence</h1>
          <p className="text-gray-500 text-sm">
            Last updated: {new Date(metadata?.analysis_timestamp).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={daysBack}
            onChange={(e) => setDaysBack(Number(e.target.value))}
            className="bg-[#0D0D0D] border border-[#1A1A1A] text-white px-4 py-2 rounded-xl font-semibold focus:outline-none focus:border-cyan-500"
          >
            <option value={3}>Last 3 days</option>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: NEWS & TRENDS (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* MARKET SENTIMENT HERO */}
          <div className="bg-gradient-to-r from-[#0D0D0D] to-[#151515] border border-[#1A1A1A] p-8 rounded-[2rem] relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Institutional Sentiment</p>
                <h1 className={`text-5xl font-black tracking-tighter ${overall_market_sentiment === 'Bearish' ? 'text-red-500' : 'text-green-500'}`}>
                  {overall_market_sentiment?.toUpperCase()}
                </h1>
                <p className="text-gray-400 mt-4 text-sm max-w-xl leading-relaxed">
                  {beginner_friendly_summary}
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-mono font-black text-white">{sentiment_score?.toFixed(2)}</p>
                <p className="text-[10px] font-bold text-gray-600 uppercase">Sentiment Score</p>
              </div>
            </div>
            {/* Background Graphic */}
            <Activity className="absolute -right-10 -bottom-10 opacity-[0.03] text-white" size={300} />
          </div>

          {/* KEY TRENDS */}
          <div className="space-y-4">
            <h2 className="text-xl font-black tracking-widest flex items-center gap-3 text-gray-400 uppercase">
              <TrendingUp size={18} className="text-cyan-500" /> Key Market Trends
            </h2>
            <div className="space-y-3">
              {key_trends?.map((trend, idx) => (
                <div key={idx} className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
                  <p className="text-gray-300 leading-relaxed">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NEWS FEED */}
          <div className="space-y-6">
            <h2 className="text-xl font-black tracking-widest flex items-center gap-3 text-gray-400 uppercase">
              <Zap size={18} className="text-yellow-500" /> Impact Analysis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news_impact_examples?.slice(0, 6).map((item, idx) => (
                <div key={idx} className="group bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500">
                  <div className="h-40 relative bg-gradient-to-br from-gray-900 to-black">
                    <img src="https://images.unsplash.com/photo-1611974715853-2b8ef9597394?q=80&w=500" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" alt="" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${
                        item.impact_on_market.includes('Positive') ? 'border-green-500/30 bg-green-500/10 text-green-400' : 
                        item.impact_on_market.includes('Negative') ? 'border-red-500/30 bg-red-500/10 text-red-400' :
                        'border-gray-500/30 bg-black text-gray-400'
                      }`}>
                        {item.impact_on_market.split(':')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg leading-tight mb-4 group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => window.open(item.url, '_blank')}>
                      {item.news_headline}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {item.affected_stocks?.map(s => (
                        <span key={s} className="text-[10px] font-black text-cyan-500/60 uppercase">#{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAMPLE NEWS */}
          <div className="space-y-4">
            <h2 className="text-xl font-black tracking-widest flex items-center gap-3 text-gray-400 uppercase">
              <Info size={18} className="text-blue-500" /> Latest News
            </h2>
            <div className="space-y-3">
              {sample_news?.slice(0, 8).map((news, idx) => (
                <div key={idx} className="bg-[#0D0D0D] border border-[#1A1A1A] p-5 rounded-2xl hover:border-cyan-500/30 transition-all cursor-pointer group" onClick={() => window.open(news.url, '_blank')}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-md mb-2 group-hover:text-cyan-400 transition-colors">{news.title}</h4>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span className="font-semibold">{news.source}</span>
                        <span>{new Date(news.published_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ArrowUpRight size={20} className="text-gray-600 group-hover:text-cyan-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RISKS TO WATCH */}
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl">
            <h2 className="text-xl font-black tracking-widest flex items-center gap-3 text-red-400 uppercase mb-4">
              <AlertTriangle size={18} /> Risks to Watch
            </h2>
            <ul className="space-y-3">
              {risks_to_watch?.map((risk, idx) => (
                <li key={idx} className="text-gray-300 flex gap-3">
                  <span className="text-red-500 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: INTELLIGENCE & PICKS (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* INVESTMENT ADVISORY */}
          <div className="bg-cyan-500 p-8 rounded-[2rem] text-black">
            <ShieldCheck size={32} className="mb-6" />
            <h3 className="text-2xl font-black tracking-tighter leading-none mb-2">RECO: {investment_recommendation?.action}</h3>
            <p className="text-xs font-bold uppercase opacity-60 mb-4 tracking-widest">Risk: {investment_recommendation?.risk_level}</p>
            <p className="text-sm font-medium leading-relaxed mb-4">
              {investment_recommendation?.reasoning}
            </p>
            <div className="pt-4 border-t border-black/20">
              <p className="text-xs font-bold uppercase opacity-60 mb-1">Time Horizon</p>
              <p className="text-sm font-bold">{investment_recommendation?.time_horizon}</p>
            </div>
          </div>

          {/* ALPHA PICKS */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest px-2">High Conviction Picks</h3>
            {top_opportunities?.map((pick, idx) => (
              <div key={idx} className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-2xl group hover:bg-[#111111] transition-all">
                <div className="mb-4">
                  <h4 className="font-black text-lg mb-2 text-cyan-400">{pick.opportunity}</h4>
                  <p className="text-sm text-gray-400 mb-3">{pick.why}</p>
                  <div className="flex flex-wrap gap-2">
                    {pick.potential_stocks?.map((stock, sidx) => (
                      <span key={sidx} className="text-[10px] font-bold bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-full border border-cyan-500/20">
                        {stock}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SECTOR PERFORMANCE */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-3xl">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Target size={14} /> Sector Impact Heat
            </h4>
            <div className="space-y-5">
              {sectors_impacted?.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] font-bold mb-2 uppercase">
                    <span className="text-gray-400">{s.sector}</span>
                    <span className={s.impact.includes('Positive') ? 'text-green-500' : 'text-red-500'}>{s.impact}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{s.reason}</p>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${s.impact.includes('Positive') ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: '60%' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* METADATA */}
          <div className="bg-[#0D0D0D] border border-[#1A1A1A] p-6 rounded-2xl">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Analysis Metadata</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total News Analyzed</span>
                <span className="font-bold text-cyan-400">{metadata?.total_news_analyzed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confidence Level</span>
                <span className="font-bold text-green-400">{data?.confidence_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Sources</span>
                <span className="font-bold">{metadata?.news_sources?.length || 0}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsPage;