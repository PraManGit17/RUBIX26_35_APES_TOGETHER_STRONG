import React, { useState } from 'react';
import { ShieldCheck, Target, Wallet, TrendingUp, ArrowRight, Loader2, DollarSign, AlertCircle, Award, BarChart3, X } from "lucide-react";
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
    } catch (err) {
      setError(err.message || 'Failed to calculate opportunities. Please try again.');
      console.error('Risk-Reward calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const riskLevels = [
    { value: 'low', label: 'Low Risk', color: 'from-green-600 to-green-800', icon: ShieldCheck },
    { value: 'medium', label: 'Medium Risk', color: 'from-yellow-600 to-yellow-800', icon: Target },
    { value: 'high', label: 'High Risk', color: 'from-red-600 to-red-800', icon: TrendingUp },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Input Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-700 rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Risk-Reward Analyzer</h2>
            <p className="text-gray-400 mt-1">Find the best investment opportunities based on your risk profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Investment Amount */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
              <Wallet className="w-4 h-4" />
              Investment Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-xl pl-10 pr-4 py-4 text-white text-xl font-mono focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="50000"
                min="1000"
                step="1000"
              />
            </div>
            <p className="text-xs text-gray-500">Enter the amount you want to invest per opportunity</p>
          </div>

          {/* Risk Tolerance */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Risk Tolerance
            </label>
            <div className="grid grid-cols-3 gap-3">
              {riskLevels.map((level) => {
                const Icon = level.icon;
                return (
                  <button
                    key={level.value}
                    onClick={() => setRiskTolerance(level.value)}
                    className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all ${
                      riskTolerance === level.value
                        ? 'border-white shadow-lg scale-105'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-${riskTolerance === level.value ? '30' : '10'} transition-opacity`} />
                    <div className="relative z-10">
                      <Icon className={`w-6 h-6 mb-2 mx-auto ${riskTolerance === level.value ? 'text-white' : 'text-gray-400'}`} />
                      <p className={`text-xs font-bold text-center ${riskTolerance === level.value ? 'text-white' : 'text-gray-400'}`}>
                        {level.label.replace(' Risk', '')}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">Select your comfort level with market volatility</p>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={loading || investmentAmount < 1000}
          className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Opportunities...
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              Find Best Opportunities
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 px-4 py-3 bg-red-500/10 border-2 border-red-500/50 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-2 border-blue-700/50 rounded-2xl p-6">
              <p className="text-sm text-gray-400 mb-2">Opportunities Found</p>
              <p className="text-3xl font-bold text-white">{results.analyzed_count}</p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-700/50 rounded-2xl p-6">
              <p className="text-sm text-gray-400 mb-2">Top Picks</p>
              <p className="text-3xl font-bold text-white">{results.top_opportunities.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-2 border-purple-700/50 rounded-2xl p-6">
              <p className="text-sm text-gray-400 mb-2">Risk Level</p>
              <p className="text-3xl font-bold text-white capitalize">{results.criteria.risk_tolerance}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-2 border-orange-700/50 rounded-2xl p-6">
              <p className="text-sm text-gray-400 mb-2">Per Stock Investment</p>
              <p className="text-3xl font-bold text-white">₹{(results.criteria.investment_per_stock / 1000).toFixed(0)}k</p>
            </div>
          </div>

          {/* Top Opportunities Header */}
          <div className="flex items-center gap-3 pt-4">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Top Investment Opportunities</h3>
          </div>

          {/* Opportunities List */}
          <div className="space-y-4">
            {results.top_opportunities.map((opportunity, index) => {
              // Find stock name from ticker
              const stock = indianStocks.find(s => s.yahooSymbol === opportunity.ticker);
              const stockName = stock ? stock.name : opportunity.ticker.replace('.NS', '');
              
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 border-2 border-gray-700 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl font-bold text-white text-xl">
                        #{index + 1}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white">{stockName}</h4>
                        <p className="text-sm text-gray-400 font-mono">{opportunity.ticker}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl">
                        <p className="text-xs text-gray-400 mb-1">Opportunity Score</p>
                        <p className="text-2xl font-bold text-green-400">{opportunity.opportunity_score.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price Information */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-2">Current Price</p>
                      <p className="text-xl font-bold text-white font-mono">₹{opportunity.current_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-2">Target Price</p>
                      <p className="text-xl font-bold text-green-400 font-mono">₹{opportunity.target_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-2">Stop Loss</p>
                      <p className="text-xl font-bold text-red-400 font-mono">₹{opportunity.stop_loss_price.toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-2">Risk/Reward</p>
                      <p className="text-xl font-bold text-blue-400 font-mono">{opportunity.risk_reward_ratio}</p>
                    </div>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-semibold">Shares to Buy</p>
                      <p className="text-lg font-bold text-white">{opportunity.shares_purchasable}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-semibold">Investment</p>
                      <p className="text-lg font-bold text-white">₹{opportunity.investment_amount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-semibold">Potential Profit</p>
                      <p className="text-lg font-bold text-green-400">₹{opportunity.potential_profit_amount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-semibold">Potential Loss</p>
                      <p className="text-lg font-bold text-red-400">₹{opportunity.potential_loss_amount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-semibold">ATR ({opportunity.data_period_days}d)</p>
                      <p className="text-lg font-bold text-purple-400">{opportunity.atr_value.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Visual Profit/Loss Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Loss: ₹{opportunity.potential_loss_amount.toFixed(0)}</span>
                      <span>Current: ₹{opportunity.current_price.toFixed(2)}</span>
                      <span>Profit: ₹{opportunity.potential_profit_amount.toFixed(0)}</span>
                    </div>
                    <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div className="absolute inset-0 flex">
                        <div className="bg-gradient-to-r from-red-600 to-red-500" style={{ width: '40%' }} />
                        <div className="bg-gray-700 w-1" />
                        <div className="bg-gradient-to-r from-green-500 to-green-600" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* All Opportunities (if different from top) */}
          {results.all_opportunities.length > results.top_opportunities.length && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-400 mb-4">Other Opportunities Analyzed</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.all_opportunities
                  .filter(opp => !results.top_opportunities.find(top => top.ticker === opp.ticker))
                  .map((opportunity, index) => {
                    const stock = indianStocks.find(s => s.yahooSymbol === opportunity.ticker);
                    const stockName = stock ? stock.name : opportunity.ticker.replace('.NS', '');
                    
                    return (
                      <div
                        key={index}
                        className="bg-gray-900/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="text-lg font-bold text-white">{stockName}</h5>
                            <p className="text-xs text-gray-500 font-mono">{opportunity.ticker}</p>
                          </div>
                          <span className="px-3 py-1 bg-gray-800 rounded-lg text-sm font-bold text-gray-400">
                            {opportunity.opportunity_score.toFixed(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <p className="text-gray-500">Price</p>
                            <p className="text-white font-bold">₹{opportunity.current_price.toFixed(0)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">R/R</p>
                            <p className="text-blue-400 font-bold">{opportunity.risk_reward_ratio}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Shares</p>
                            <p className="text-white font-bold">{opportunity.shares_purchasable}</p>
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
