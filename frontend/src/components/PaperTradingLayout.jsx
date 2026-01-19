import React from 'react';
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaperTradingLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/paper-trading', label: 'Dashboard', icon: TrendingUp },
    { path: '/portfolio', label: 'Portfolio', icon: DollarSign },
    { path: '/trade-history', label: 'History', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit']">
      {/* Main Layout with Sidebar */}
      <div className="flex ">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 bg-gradient-to-b from-[#0D0D0D] to-[#050505] border-r border-blue-500/20 flex-col p-6 gap-4 fixed left-0  h-[calc(100vh-80px)] animate-in fade-in slide-in-from-left-4 duration-500">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div>
                <h1 className='text-white font-bold text-lg font-["Outfit"]'>Gamma</h1>
                <p className='text-[10px] text-cyan-400/70 font-["Space_Mono"]'>Trading</p>
              </div>
            </div>
            <hr className="border-blue-500/20 mt-4" />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2 flex-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive(path)
                    ? 'bg-blue-500/20 border border-blue-500 text-blue-400 shadow-lg shadow-blue-500/20'
                    : 'border border-transparent text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {isActive(path) && (
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="border-t border-blue-500/20 pt-4">
            <p className='text-xs text-gray-500 text-center font-["Space_Mono"]'>
              © 2026 Gamma Trading
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-64 pt-0 animate-in fade-in duration-500">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PaperTradingLayout;
