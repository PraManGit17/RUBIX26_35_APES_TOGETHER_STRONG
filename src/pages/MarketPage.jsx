import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { STOCK_MARKET } from '../context/TradeContext';
import { Star, Search, TrendingUp, TrendingDown, ChevronRight, Filter } from 'lucide-react';

const MarketPage = () => {
  const navigate = useNavigate();
  const { toggleWatchlist, isFavorite } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, GAINERS, LOSERS

  // Logic to filter and search stocks
  const marketStocks = Object.values(STOCK_MARKET).filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'GAINERS') return matchesSearch && stock.change_percent > 0;
    if (filter === 'LOSERS') return matchesSearch && stock.change_percent < 0;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10 font-['Outfit']">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search symbols or companies..."
              className="w-full bg-[#0D0D0D] border border-[#1A1A1A] py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-cyan-500/50 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex bg-[#0D0D0D] p-1 rounded-xl border border-[#1A1A1A]">
            {['ALL', 'GAINERS', 'LOSERS'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${
                  filter === f ? 'bg-white text-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Market Table */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 p-6 border-b border-[#1A1A1A] text-[10px] font-black tracking-widest text-gray-500 uppercase">
            <div className="col-span-1">Fav</div>
            <div className="col-span-5">Asset</div>
            <div className="col-span-3 text-right">Price</div>
            <div className="col-span-3 text-right">24h Change</div>
          </div>

          <div className="divide-y divide-[#1A1A1A]">
            {marketStocks.map((stock) => (
              <div 
                key={stock.symbol}
                className="grid grid-cols-12 p-6 items-center hover:bg-white/[0.02] transition-colors group cursor-pointer"
                onClick={() => navigate(`/stock/${stock.symbol}`)}
              >
                <div className="col-span-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Don't navigate when clicking star
                      toggleWatchlist(stock.symbol);
                    }}
                    className="hover:scale-125 transition-transform"
                  >
                    <Star 
                      size={18} 
                      className={isFavorite(stock.symbol) ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} 
                    />
                  </button>
                </div>

                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center font-black text-xs border border-white/5">
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-base leading-none group-hover:text-cyan-400 transition-colors">{stock.symbol}</h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">{stock.name}</p>
                  </div>
                </div>

                <div className="col-span-3 text-right font-mono font-bold">
                  ₹{stock.price.toLocaleString()}
                </div>

                <div className="col-span-3 text-right flex flex-col items-end">
                  <div className={`flex items-center gap-1 font-bold text-sm ${stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change_percent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(stock.change_percent)}%
                  </div>
                  <div className={`text-[10px] font-medium opacity-50`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {marketStocks.length === 0 && (
          <div className="py-20 text-center text-gray-600 font-medium">
            No assets found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPage;