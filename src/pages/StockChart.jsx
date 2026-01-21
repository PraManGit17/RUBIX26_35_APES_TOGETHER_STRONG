import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft, TrendingUp, ShieldCheck, History, ArrowUpRight, Target, Activity } from "lucide-react";
import { initialData } from '../data/mockData';
import ChartDisplay from '../components/Chart Components/ChartDisplay';
import Navbar from '../components/Navbar';

const StockChart = () => {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('1M');

  // Logic for switching data based on buttons
  const activeData = useMemo(() => {
    switch(timeframe) {
      case '1H': return initialData.slice(-5);
      case '1D': return initialData.slice(-10);
      case '1W': return initialData.slice(-15);
      default: return initialData;
    }
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Navbar />
      <main className="max-w-[1450px] mx-auto p-6 lg:p-12 pt-24">
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 items-end">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-all group">
                <MoveLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
              </button>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400 poppins">NSE: NIFTY 50</span>
            </div>
            <h1 className="syne text-6xl font-extrabold tracking-tighter flex items-baseline gap-4">
              17,758.45 
              <span className="text-green-500 text-xl poppins font-bold flex items-center bg-green-500/10 px-3 py-1 rounded-lg">
                <ArrowUpRight size={20} className="mr-1" /> +0.48%
              </span>
            </h1>
          </div>
          <div className="flex gap-4 lg:col-span-2 justify-end">
            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl flex flex-col justify-center backdrop-blur-sm">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest poppins mb-1 font-bold">Day High</span>
              <span className="text-xl font-bold tabular-nums tracking-tight">17,812.00</span>
            </div>
            <div className="bg-white/5 border border-white/10 px-8 py-4 rounded-3xl flex flex-col justify-center backdrop-blur-sm">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest poppins mb-1 font-bold">Day Low</span>
              <span className="text-xl font-bold tabular-nums tracking-tight">17,690.45</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart Card */}
          <div className="lg:col-span-9 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 flex gap-2 z-10">
              {['1H', '1D', '1W', '1M'].map((t) => (
                <button 
                  key={t} 
                  onClick={() => setTimeframe(t)}
                  className={`px-5 py-2 rounded-2xl text-[11px] font-black poppins transition-all duration-300 ${
                    timeframe === t 
                    ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                    : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="mb-10">
              <h3 className="syne text-xl font-bold flex items-center gap-3">
                <Activity size={20} className="text-green-500" /> Market Intelligence Terminal
              </h3>
            </div>

            <div className="w-full h-[520px]">
               <ChartDisplay stockData={activeData} />
            </div>
          </div>

          {/* AI Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-md">
               <TrendingUp className="text-green-500 mb-6" size={32} />
               <p className="text-gray-400 text-xs uppercase tracking-widest poppins mb-2 font-bold opacity-60">AI Logic Projection</p>
               <h2 className="text-4xl syne font-black text-green-500 mb-6">Strong Buy</h2>
               <div className="space-y-4">
                 <div className="flex justify-between text-xs poppins font-bold uppercase tracking-tighter">
                   <span className="text-gray-500">Confidence Score</span>
                   <span className="text-white">92.4%</span>
                 </div>
                 <div className="w-full bg-white/10 h-2 rounded-full">
                   <div className="bg-green-500 h-full w-[92%] shadow-[0_0_15px_rgba(34,197,94,0.6)] rounded-full" />
                 </div>
               </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 p-8 rounded-[2.5rem] space-y-8 shadow-xl">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-500 shadow-inner"><Target size={22}/></div>
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest poppins font-black opacity-50">Target Price</h4>
                  <p className="text-2xl syne font-black tracking-tighter">18,120.00</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-500 shadow-inner"><ShieldCheck size={22}/></div>
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest poppins font-black opacity-50">System SL</h4>
                  <p className="text-2xl syne font-black tracking-tighter">17,450.00</p>
                </div>
              </div>
              <div className="flex items-center gap-5 border-t border-white/5 pt-8">
                <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-500 shadow-inner"><History size={22}/></div>
                <div>
                  <h4 className="text-[10px] text-gray-500 uppercase tracking-widest poppins font-black opacity-50">Model Yield</h4>
                  <p className="text-2xl syne font-black text-green-500 tracking-tighter">+12.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockChart;