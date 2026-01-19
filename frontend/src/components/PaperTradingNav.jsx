import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, BarChart3, History, Wallet } from 'lucide-react';

const PaperTradingNav = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/paper-trading', label: 'Trading', icon: TrendingUp },
    { path: '/portfolio', label: 'Portfolio', icon: Wallet },
    { path: '/trade-history', label: 'History', icon: History },
  ];

  return (
    <nav className="bg-[#080808] border-b border-[#1A1A1A] sticky top-0 z-40">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center gap-8 h-16">
        <Link 
          to="/paper-trading" 
          className="flex items-center gap-2 font-bold text-lg text-blue-400 hover:text-blue-300"
        >
          <BarChart3 size={24} /> Paper Trading
        </Link>
        
        <div className="flex items-center gap-1 ml-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive(path)
                  ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PaperTradingNav;
