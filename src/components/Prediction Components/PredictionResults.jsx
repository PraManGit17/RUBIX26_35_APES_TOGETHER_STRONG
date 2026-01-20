import React, { useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Calendar, BarChart3, Newspaper, Info, Target, X } from 'lucide-react';
import gsap from 'gsap';

const PredictionResults = ({ data, onClose, inline = false }) => {
  const resultsRef = useRef(null);

  useEffect(() => {
    if (inline && resultsRef.current) {
      // Scroll to results smoothly
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Animate results appearing
      gsap.fromTo(
        resultsRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [inline]);

  if (!data) return null;

  const { 
    company_name,
    symbol,
    bse_code,
    yahoo_symbol,
    direction_prediction,
    fused_signal,
    sentiment_analysis,
    reasoning,
    announcements,
    analysis_metadata 
  } = data;

  const isPredictionIncrease = direction_prediction.prediction === "Increase";
  const signalColor = {
    BUY: 'text-green-500',
    SELL: 'text-red-500',
    HOLD: 'text-yellow-500'
  }[fused_signal.signal] || 'text-gray-500';

  const signalBgColor = {
    BUY: 'bg-green-500/20 border-green-500/50',
    SELL: 'bg-red-500/20 border-red-500/50',
    HOLD: 'bg-yellow-500/20 border-yellow-500/50'
  }[fused_signal.signal] || 'bg-gray-500/20 border-gray-500/50';

  const signalGradient = {
    BUY: 'from-green-900/40 to-green-800/20',
    SELL: 'from-red-900/40 to-red-800/20',
    HOLD: 'from-yellow-900/40 to-yellow-800/20'
  }[fused_signal.signal] || 'from-gray-900/40 to-gray-800/20';

  const sentimentColor = sentiment_analysis.sentiment_score > 0 ? 'text-green-500' : 
                        sentiment_analysis.sentiment_score < 0 ? 'text-red-500' : 'text-yellow-500';

  return (
    <div ref={resultsRef} className="w-full">
      {/* Close Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-300 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
          <span>Close Results</span>
        </button>
      </div>

      <div className="w-full bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 border-2 border-gray-700 rounded-3xl shadow-2xl backdrop-blur-sm">
        {/* Header with Gradient Background */}
        <div className={`p-8 border-b border-gray-700 bg-gradient-to-r ${signalGradient} rounded-t-3xl`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">{company_name}</h2>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="font-mono text-lg">{symbol}</span>
                <span className="text-gray-500">•</span>
                <span>BSE: {bse_code}</span>
                <span className="text-gray-500">•</span>
                <span>Yahoo: {yahoo_symbol}</span>
              </div>
            </div>
            <div className={`px-8 py-4 rounded-2xl border-2 ${signalBgColor} backdrop-blur-sm`}>
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">Trading Signal</p>
                <p className={`text-4xl font-bold ${signalColor} mb-1`}>{fused_signal.signal}</p>
                <p className="text-sm text-gray-400">{fused_signal.strength} Strength</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-6">
          {/* Top Section - Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Direction Prediction */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-2 border-blue-700/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                {isPredictionIncrease ? (
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                ) : (
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <TrendingDown className="w-8 h-8 text-red-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-white">Price Direction</h3>
                  <p className="text-sm text-gray-400">AI Prediction</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Prediction:</span>
                  <span className={`text-2xl font-bold ${isPredictionIncrease ? 'text-green-400' : 'text-red-400'}`}>
                    {direction_prediction.prediction}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Confidence:</span>
                  <span className="text-2xl font-bold text-white">
                    {(direction_prediction.confidence * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-400">Confidence Level</span>
                    <span className="text-xs text-gray-400">{direction_prediction.confidence >= 0.7 ? 'High' : direction_prediction.confidence >= 0.5 ? 'Medium' : 'Low'}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-4 overflow-hidden border border-gray-700">
                    <div
                      className={`h-full transition-all duration-1000 ${isPredictionIncrease ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-gradient-to-r from-red-600 to-red-400'}`}
                      style={{ width: `${direction_prediction.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-2 border-purple-700/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Newspaper className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Market Sentiment</h3>
                  <p className="text-sm text-gray-400">News Analysis</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Overall:</span>
                  <span className={`text-2xl font-bold ${sentimentColor}`}>
                    {sentiment_analysis.overall_sentiment}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Score:</span>
                  <span className={`text-xl font-bold ${sentimentColor}`}>
                    {sentiment_analysis.sentiment_score.toFixed(4)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">News Analyzed:</span>
                  <span className="text-xl font-bold text-blue-400">
                    {sentiment_analysis.news_analyzed}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Positive</p>
                    <p className="text-green-400 font-bold text-lg">{(sentiment_analysis.positive_ratio * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Neutral</p>
                    <p className="text-yellow-400 font-bold text-lg">{(sentiment_analysis.neutral_ratio * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-400 mb-1">Negative</p>
                    <p className="text-red-400 font-bold text-lg">{(sentiment_analysis.negative_ratio * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Summary Card */}
            <div className="bg-gradient-to-br from-orange-900/30 to-yellow-900/30 border-2 border-orange-700/50 rounded-2xl p-6 hover:shadow-lg hover:shadow-orange-500/20 transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-500/20 rounded-xl">
                  <Target className="w-8 h-8 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Quick Summary</h3>
                  <p className="text-sm text-gray-400">AI Recommendation</p>
                </div>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <p className="text-gray-200 leading-relaxed">{reasoning.recommendation_summary}</p>
              </div>
            </div>
          </div>

          {/* Technical Explanation */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white">Technical Analysis</h3>
                <p className="text-sm text-gray-400">Key Factors Driving the Prediction</p>
              </div>
            </div>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5 mb-6">
              <p className="text-gray-200 leading-relaxed text-base">{reasoning.technical_explanation}</p>
            </div>
            
            {/* Top Contributing Factors */}
            <div className="mt-6">
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Top Contributing Factors
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reasoning.top_contributing_factors.map((factor, index) => (
                  <div key={index} className="bg-gray-800/70 border-2 border-gray-700 hover:border-blue-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl font-bold text-blue-400">#{index + 1}</span>
                          <span className="text-lg font-bold text-white">{factor.name}</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{factor.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-400 font-semibold">Importance</span>
                        <span className="text-lg font-bold text-blue-400">{factor.importance.toFixed(1)}%</span>
                      </div>
                      <div className="bg-gray-900 rounded-full h-3 overflow-hidden border border-gray-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000"
                          style={{ width: `${Math.min(factor.importance, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sentiment Context */}
          {reasoning.sentiment_context && (
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Calendar className="w-8 h-8 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">Recent News Impact</h3>
                  <p className="text-sm text-gray-400">Latest Significant Development</p>
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm text-gray-400 font-semibold">{reasoning.sentiment_context.date}</p>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                    reasoning.sentiment_context.impact === 'Positive' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                    reasoning.sentiment_context.impact === 'Negative' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  }`}>
                    {reasoning.sentiment_context.impact} Impact
                  </span>
                </div>
                <p className="text-white text-lg leading-relaxed">{reasoning.sentiment_context.headline}</p>
              </div>
            </div>
          )}

          {/* Recent Announcements */}
          {announcements && announcements.length > 0 && (
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-2 border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                  <Newspaper className="w-8 h-8 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">Recent Company Announcements</h3>
                  <p className="text-sm text-gray-400">Latest {announcements.length} Corporate Updates</p>
                </div>
              </div>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {announcements.map((announcement, index) => (
                  <div key={index} className="bg-gray-900/50 border border-gray-700 hover:border-indigo-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-indigo-500/10">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-400 font-semibold">{announcement.date}</span>
                            <span className="text-gray-600">•</span>
                            <span className="text-sm text-blue-400 font-semibold">{announcement.category}</span>
                          </div>
                          <p className="text-white text-base leading-relaxed mb-3">{announcement.headline}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap ${
                        announcement.sentiment === 'Positive' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                        announcement.sentiment === 'Negative' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                      }`}>
                        {announcement.sentiment}
                      </span>
                    </div>
                    {announcement.link && (
                      <a 
                        href={announcement.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Official Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Analysis Date: {new Date(analysis_metadata.analyzed_at).toLocaleString()}</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                <span>Model Version: {analysis_metadata.model_version}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 1);
        }
      `}</style>
    </div>
  );
};

export default PredictionResults;
