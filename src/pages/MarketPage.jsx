import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { Star, Search, TrendingUp, TrendingDown, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const API_BASE_URL = 'http://localhost:5000/api/v1';

const MarketPage = () => {
  const navigate = useNavigate();
  const { toggleWatchlist, isFavorite } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, GAINERS, LOSERS
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Fetch market data
  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/markets/live`);
      const data = await response.json();
      
      if (data.success) {
        setStocks(data.stocks);
        setLastUpdate(new Date(data.timestamp));
      } else {
        setError(data.error || 'Failed to fetch market data');
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMarketData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Logic to filter and search stocks
  const marketStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'GAINERS') return matchesSearch && stock.change_percent > 0;
    if (filter === 'LOSERS') return matchesSearch && stock.change_percent < 0;
    return matchesSearch;
  });

  // Format time ago
  const getTimeAgo = () => {
    if (!lastUpdate) return '';
    const seconds = Math.floor((new Date() - lastUpdate) / 1000);
    if (seconds < 60) return `Updated ${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `Updated ${minutes}m ago`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit']">
      <Navbar />
      <div className="p-6 lg:p-10 pt-24">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header with Refresh */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">LIVE MARKETS</h1>
            <p className="text-gray-500 text-sm mt-1">{getTimeAgo()}</p>
          </div>
          <button
            onClick={fetchMarketData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="text-sm font-bold">Refresh</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-400" size={20} />
            <div className="flex-1">
              <p className="text-red-400 text-sm font-medium">Failed to load market data</p>
              <p className="text-red-400/70 text-xs mt-1">{error}</p>
            </div>
            <button 
              onClick={fetchMarketData}
              className="text-red-400 text-xs font-bold hover:underline"
            >
              Retry
            </button>
          </div>
        )}

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

        {/* Loading State */}
        {loading && stocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
            <p className="text-gray-400 text-sm">Loading market data...</p>
          </div>
        ) : (
          <>
            {/* Market Table */}
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl">
              <div className="grid grid-cols-12 p-6 border-b border-[#1A1A1A] text-[10px] font-black tracking-widest text-gray-500 uppercase">
                <div className="col-span-1">Fav</div>
                <div className="col-span-4">Asset</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-right">24h Change</div>
                <div className="col-span-2 text-right">Volume</div>
                <div className="col-span-1 text-right">Sector</div>
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
                          e.stopPropagation();
                          // Use yahooSymbol if available, otherwise append .NS to symbol
                          const watchlistSymbol = stock.yahooSymbol || `${stock.symbol}.NS`;
                          toggleWatchlist(watchlistSymbol);
                        }}
                        className="hover:scale-125 transition-transform"
                      >
                        <Star 
                          size={18} 
                          className={isFavorite(stock.yahooSymbol || `${stock.symbol}.NS`) ? "text-yellow-500 fill-yellow-500" : "text-gray-700"} 
                        />
                      </button>
                    </div>

                    <div className="col-span-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-black flex items-center justify-center font-black text-xs border border-white/5">
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-base leading-none group-hover:text-cyan-400 transition-colors">{stock.symbol}</h4>
                        <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-wider">{stock.name}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-right font-mono font-bold">
                      ₹{stock.price.toLocaleString()}
                    </div>

                    <div className="col-span-2 text-right flex flex-col items-end">
                      <div className={`flex items-center gap-1 font-bold text-sm ${stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change_percent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(stock.change_percent).toFixed(2)}%
                      </div>
                      <div className={`text-[10px] font-medium opacity-50`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <div className="text-sm font-mono">
                        {(stock.volume / 1000000).toFixed(2)}M
                      </div>
                    </div>

                    <div className="col-span-1 text-right">
                      <div className="text-[9px] text-gray-500 font-medium uppercase">
                        {stock.sector?.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {marketStocks.length === 0 && !loading && (
              <div className="py-20 text-center text-gray-600 font-medium">
                No assets found matching "{searchQuery}"
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default MarketPage;