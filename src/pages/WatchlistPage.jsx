import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { STOCK_MARKET } from '../context/TradeContext';
import { Star, TrendingUp, TrendingDown, ArrowRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';

const WatchlistPage = () => {
  const { watchlist, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();

  // Get full data for items in watchlist
  const favoriteStocks = watchlist.map(symbol => STOCK_MARKET[symbol]).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-10 font-['Outfit']">
      <Navbar/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black mb-2 tracking-tighter">MY WATCHLIST</h1>
        <p className="text-gray-500 mb-8">Tracking {watchlist.length} key assets</p>

        {favoriteStocks.length === 0 ? (
          <div className="border-2 border-dashed border-[#1A1A1A] rounded-3xl p-20 text-center">
            <Search className="mx-auto text-gray-700 mb-4" size={48} />
            <p className="text-gray-400">Your watchlist is empty.</p>
            <button 
              onClick={() => navigate('/markets')}
              className="mt-4 text-cyan-400 font-bold hover:underline"
            >
              Browse Markets
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteStocks.map((stock) => (
              <div 
                key={stock.symbol}
                className="bg-[#0D0D0D] border border-[#1A1A1A] p-5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleWatchlist(stock.symbol)}
                    className="text-yellow-500 hover:scale-110 transition-transform"
                  >
                    <Star size={20} fill="#eab308" />
                  </button>
                  <div onClick={() => navigate(`/stock/${stock.symbol}`)} className="cursor-pointer">
                    <h3 className="font-bold text-lg leading-none">{stock.symbol}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1 tracking-widest">{stock.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-mono font-bold">₹{stock.price.toLocaleString()}</p>
                    <p className={`text-[10px] font-bold ${stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent}%
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/stock/${stock.symbol}`)}
                    className="p-2 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;