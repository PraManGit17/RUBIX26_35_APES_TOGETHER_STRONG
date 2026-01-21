import React, { useState } from 'react';
import { ShieldCheck, Target, Wallet, TrendingUp, TrendingDown, ArrowRight, Loader2, DollarSign, AlertCircle, Award, BarChart3, X } from "lucide-react";
import { indianStocks } from "../../data/stocks.js";

const API_BASE_URL = 'http://localhost:5000';

const RiskRewardCalculator = () => {
  const [investmentAmount, setInvestmentAmount] = useState(50000);
  const [riskTolerance, setRiskTolerance] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get all Yahoo symbols from indianStocks
      const tickers = indianStocks.map(stock => stock.yahooSymbol);

      const response = await fetch(`${API_BASE_URL}/api/v1/risk-reward/best-opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tickers: tickers,
          investment_amount: investmentAmount,
          risk_tolerance: riskTolerance,
          top_n: 5
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch opportunities: ${response.statusText}`);
      }

      // Get response as text first to handle NaN values
      const textResponse = await response.text();
      
      // Replace NaN with null to make it valid JSON
      const sanitizedResponse = textResponse.replace(/:\s*NaN/g, ': null')
                                            .replace(/:\s*Infinity/g, ': null')
                                            .replace(/:\s*-Infinity/g, ': null');
      
      // Parse the sanitized JSON
      const data = JSON.parse(sanitizedResponse);
      
      // Filter out opportunities with invalid data
      if (data.top_opportunities) {
        data.top_opportunities = data.top_opportunities.filter(opp => 
          opp.current_price && 
          opp.target_price && 
          opp.stop_loss_price && 
          !isNaN(opp.opportunity_score)
        );
      }
      
      if (data.all_opportunities) {
        data.all_opportunities = data.all_opportunities.filter(opp => 
          opp.current_price && 
          opp.target_price && 
          opp.stop_loss_price && 
          !isNaN(opp.opportunity_score)
        );
      }
      
      // Check if we have any valid opportunities
      if (data.top_opportunities && data.top_opportunities.length === 0) {
        throw new Error('No valid opportunities found. Some stocks may have insufficient data.');
      }
      
      setResults(data);
      
      // Scroll to results after they load
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      setError(err.message || 'Failed to calculate opportunities. Please try again.');
      console.error('Risk-Reward calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const riskLevels = [
    { value: 'low', label: 'Low Risk', color: 'from-emerald-600 to-emerald-800', icon: ShieldCheck },
    { value: 'medium', label: 'Medium Risk', color: 'from-indigo-600 to-indigo-800', icon: Target },
    { value: 'high', label: 'High Risk', color: 'from-red-600 to-red-800', icon: TrendingUp },
  ];

  return (
    <div className="w-full">
      {/* Input Section - Always centered */}
      <div className="w-full max-w-6xl mx-auto min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="bg-black border-2 border-white/20 rounded-3xl p-10 w-full shadow-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-white/5 rounded-2xl">
            <BarChart3 className="w-10 h-10 text-slate-400" />
          </div>
          <div>
            <h2 className="text-4xl font-black tracking-tight text-white uppercase">Calculator</h2>
            <p className="text-slate-500 text-base mt-1 font-medium">Configure your investment parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Investment Amount */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <Wallet className="w-5 h-5" />
              Investment Amount
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-2xl font-bold">₹</span>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full bg-[#0A0A0A] border-2 border-white/20 rounded-2xl pl-12 pr-5 py-5 text-white text-3xl font-mono font-bold focus:outline-none focus:border-indigo-500/70 transition-colors"
                placeholder="50000"
                min="1000"
                step="1000"
              />
            </div>
            <p className="text-sm text-slate-600 font-medium">Enter the amount you want to invest per opportunity</p>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5" />
              Risk Tolerance
            </label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className="w-full bg-[#0A0A0A] border-2 border-white/20 rounded-2xl px-5 py-5 text-white text-xl font-bold focus:outline-none focus:border-indigo-500/70 transition-colors appearance-none cursor-pointer"
            >
              <option value="low" className="bg-black">Low Risk</option>
              <option value="medium" className="bg-black">Medium Risk</option>
              <option value="high" className="bg-black">High Risk</option>
            </select>
            <p className="text-sm text-slate-600 font-medium">Select your comfort level with market volatility</p>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={loading || investmentAmount < 1000}
          className="w-full mt-8 py-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-900 text-white font-black uppercase tracking-wider text-lg rounded-2xl transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/50"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xl">Analyzing Opportunities...</span>
            </>
          ) : (
            <>
              <BarChart3 className="w-6 h-6" />
              <span className="text-xl">Find Best Opportunities</span>
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-6 px-6 py-4 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 text-base flex items-center gap-3">
            <AlertCircle className="w-6 h-6" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        </div>
      </div>

      {/* Results Section - Appears below with spacing, requires scrolling */}
      {results && (
        <div className="bg-black border border-white/10 rounded-2xl p-6 max-w-4xl mx-auto mt-32 mb-20">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider font-bold">Analyzed</p>
              <p className="text-2xl font-black text-white">{results.analyzed_count}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider font-bold">Top Picks</p>
              <p className="text-2xl font-black text-white">{results.top_opportunities.length}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider font-bold">Risk Level</p>
              <p className="text-2xl font-black text-white capitalize">{results.criteria.risk_tolerance}</p>
            </div>
            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-4">
              <p className="text-[10px] text-slate-600 mb-1 uppercase tracking-wider font-bold">Per Stock</p>
              <p className="text-2xl font-black text-white">₹{(results.criteria.investment_per_stock / 1000).toFixed(0)}k</p>
            </div>
          </div>

          {/* Top Opportunities Header */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-black text-white uppercase tracking-wider">Top 5 Opportunities</h3>
            <span className="ml-auto px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400">
              Best Picks
            </span>
          </div>

          {/* Opportunities List */}
          <div className="space-y-6">
            {results.top_opportunities.map((opportunity, index) => {
              const stock = indianStocks.find(s => s.yahooSymbol === opportunity.ticker);
              const stockName = stock ? stock.name : opportunity.ticker.replace('.NS', '');
              
              // Rank-based colors and styles
              const rankColors = [
                { bg: 'from-yellow-500/10 to-yellow-600/10', border: 'border-yellow-500/50', badge: 'bg-gradient-to-r from-yellow-500 to-yellow-600', text: 'text-yellow-400', ring: 'ring-2 ring-yellow-500/20' },
                { bg: 'from-gray-300/10 to-gray-400/10', border: 'border-gray-400/50', badge: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'text-gray-300', ring: 'ring-2 ring-gray-400/20' },
                { bg: 'from-orange-600/10 to-orange-700/10', border: 'border-orange-600/50', badge: 'bg-gradient-to-r from-orange-600 to-orange-700', text: 'text-orange-400', ring: 'ring-2 ring-orange-600/20' },
                { bg: 'from-indigo-500/10 to-indigo-600/10', border: 'border-indigo-500/40', badge: 'bg-gradient-to-r from-indigo-500 to-indigo-600', text: 'text-indigo-400', ring: 'ring-2 ring-indigo-500/20' },
                { bg: 'from-purple-500/10 to-purple-600/10', border: 'border-purple-500/40', badge: 'bg-gradient-to-r from-purple-500 to-purple-600', text: 'text-purple-400', ring: 'ring-2 ring-purple-500/20' },
              ];
              const rankStyle = rankColors[index] || rankColors[4];
              
              return (
                <div
                  key={index}
                  className={`relative bg-gradient-to-br ${rankStyle.bg} border ${rankStyle.border} ${rankStyle.ring} hover:scale-[1.02] rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-2xl`}
                >
                  {/* Rank Badge - Top Left Corner */}
                  <div className="absolute -top-3 -left-3 z-10">
                    <div className={`${rankStyle.badge} rounded-full p-3 shadow-lg`}>
                      <span className="text-white font-black text-lg">#{index + 1}</span>
                    </div>
                  </div>

                  {/* "TOP PICK" label for #1 */}
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1.5 rounded-full shadow-lg animate-pulse">
                        <span className="text-black font-black text-xs uppercase tracking-wider">★ Top Pick ★</span>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex items-start justify-between mb-5 mt-2">
                    <div className="flex items-center gap-4 ml-8">
                      <div>
                        <h4 className="text-xl font-black text-white tracking-tight">{stockName}</h4>
                        <p className="text-sm text-slate-400 font-mono mt-0.5">{opportunity.ticker}</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-black/50 border border-emerald-500/40 rounded-xl backdrop-blur-sm">
                      <p className="text-[10px] text-slate-500 mb-0.5 uppercase tracking-wider font-bold">Score</p>
                      <p className="text-2xl font-black text-emerald-400 font-mono">{opportunity.opportunity_score.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* PROFIT & LOSS - HIGHLIGHTED SECTION */}
                  <div className="mb-5 bg-gradient-to-r from-emerald-500/5 via-black/50 to-red-500/5 border-2 border-white/20 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                    {/* Glowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-red-500/10 animate-pulse" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-yellow-400" />
                        <h5 className="text-sm font-black text-white uppercase tracking-wider">Profit & Loss Potential</h5>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Potential Profit - Large and Prominent */}
                        <div className="bg-emerald-500/10 border-2 border-emerald-500/40 rounded-xl p-5 hover:scale-105 transition-transform">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Potential Profit</p>
                          </div>
                          <p className="text-4xl font-black text-emerald-400 font-mono mb-1">+₹{opportunity.potential_profit_amount.toFixed(2)}</p>
                          <p className="text-xs text-emerald-300/70 font-semibold">
                            {((opportunity.potential_profit_amount / opportunity.investment_amount) * 100).toFixed(1)}% Return
                          </p>
                        </div>

                        {/* Potential Loss - Large and Prominent */}
                        <div className="bg-red-500/10 border-2 border-red-500/40 rounded-xl p-5 hover:scale-105 transition-transform">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="w-5 h-5 text-red-400" />
                            <p className="text-xs text-red-300 font-bold uppercase tracking-wider">Potential Loss</p>
                          </div>
                          <p className="text-4xl font-black text-red-400 font-mono mb-1">-₹{opportunity.potential_loss_amount.toFixed(2)}</p>
                          <p className="text-xs text-red-300/70 font-semibold">
                            {((opportunity.potential_loss_amount / opportunity.investment_amount) * 100).toFixed(1)}% Risk
                          </p>
                        </div>
                      </div>

                      {/* Visual Profit/Loss Bar - Enhanced */}
                      <div className="mt-4">
                        <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-2">
                          <span className="text-red-400 font-black">Max Loss: ₹{opportunity.potential_loss_amount.toFixed(0)}</span>
                          <span className="text-white font-black">Entry: ₹{opportunity.current_price.toFixed(2)}</span>
                          <span className="text-emerald-400 font-black">Max Profit: ₹{opportunity.potential_profit_amount.toFixed(0)}</span>
                        </div>
                        <div className="relative h-4 bg-black/50 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                          <div className="absolute inset-0 flex">
                            <div className="bg-gradient-to-r from-red-600 to-red-500 shadow-lg" style={{ width: '40%' }} />
                            <div className="bg-yellow-400 w-1 shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Information - Enhanced */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <div className="bg-black/50 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-[10px] text-slate-500 mb-2 uppercase tracking-wider font-bold">Current</p>
                      <p className="text-lg font-black text-white font-mono">₹{opportunity.current_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-[10px] text-emerald-300 mb-2 uppercase tracking-wider font-bold">Target</p>
                      <p className="text-lg font-black text-emerald-400 font-mono">₹{opportunity.target_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-[10px] text-red-300 mb-2 uppercase tracking-wider font-bold">Stop Loss</p>
                      <p className="text-lg font-black text-red-400 font-mono">₹{opportunity.stop_loss_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-[10px] text-indigo-300 mb-2 uppercase tracking-wider font-bold">R/R Ratio</p>
                      <p className="text-lg font-black text-indigo-400 font-mono">{opportunity.risk_reward_ratio}</p>
                    </div>
                  </div>

                  {/* Investment Details - Enhanced */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-black/30 rounded-xl p-4 border border-white/10">
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Shares</p>
                      <p className="text-base font-black text-white">{opportunity.shares_purchasable}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Investment</p>
                      <p className="text-base font-black text-white">₹{opportunity.investment_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">ATR ({opportunity.data_period_days}d)</p>
                      <p className="text-base font-black text-indigo-400">{opportunity.atr_value?.toFixed(2) || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* All Opportunities (if different from top) */}
          {results.all_opportunities.length > results.top_opportunities.length && (
            <div className="mt-6">
              <h3 className="text-sm font-black text-slate-600 mb-3 uppercase">Other Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.all_opportunities
                  .filter(opp => !results.top_opportunities.find(top => top.ticker === opp.ticker))
                  .map((opportunity, index) => {
                    const stock = indianStocks.find(s => s.yahooSymbol === opportunity.ticker);
                    const stockName = stock ? stock.name : opportunity.ticker.replace('.NS', '');
                    
                    return (
                      <div
                        key={index}
                        className="bg-[#0A0A0A] border border-white/10 rounded-lg p-4 hover:border-indigo-500/20 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="text-sm font-black text-white">{stockName}</h5>
                            <p className="text-xs text-slate-600 font-mono">{opportunity.ticker}</p>
                          </div>
                          <span className="px-2 py-1 bg-black border border-white/10 rounded text-xs font-black text-slate-400">
                            {opportunity.opportunity_score.toFixed(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-slate-600 uppercase tracking-wider font-bold text-[9px]">Price</p>
                            <p className="text-white font-black">₹{opportunity.current_price.toFixed(0)}</p>
                          </div>
                          <div>
                            <p className="text-slate-600 uppercase tracking-wider font-bold text-[9px]">R/R</p>
                            <p className="text-indigo-400 font-black">{opportunity.risk_reward_ratio}</p>
                          </div>
                          <div>
                            <p className="text-slate-600 uppercase tracking-wider font-bold text-[9px]">Shares</p>
                            <p className="text-white font-black">{opportunity.shares_purchasable}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskRewardCalculator;
