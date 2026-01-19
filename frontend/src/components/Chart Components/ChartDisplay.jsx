import React from 'react';
import Chart from 'react-apexcharts';

const ChartDisplay = ({ stockData }) => {
  const options = {
    chart: {
      type: 'line',
      height: 500,
      background: 'transparent',
      toolbar: { show: false },
      fontFamily: 'Syne, sans-serif',
      parentHeightOffset: 0,
    },
    theme: { mode: 'dark' },
    xaxis: {
      type: 'datetime',
      labels: { 
        style: { colors: '#64748b', fontSize: '10px', fontWeight: 600 },
        offsetY: 5,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      opposite: true,
      labels: { 
        style: { colors: '#64748b', fontSize: '10px', fontWeight: 700 },
        formatter: (val) => val.toLocaleString() 
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.03)',
      padding: { bottom: 20, right: 20, left: 10 }, // Fixes date overflow
    },
    plotOptions: {
      candlestick: {
        colors: { upward: '#22c55e', downward: '#ef4444' },
        wick: { useFillColor: true }
      },
      bar: { columnWidth: '50%' }
    },
    stroke: {
      width: [1, 3, 2, 2],
      curve: 'smooth',
      dashArray: [0, 0, 8, 4] 
    },
    colors: ['#22c55e', '#00d2ff', '#ffffff', '#a855f7'], 
    fill: {
      type: ['solid', 'gradient', 'solid', 'solid'],
      gradient: {
        shade: 'dark',
        gradientToColors: ['#22c55e', '#0066ff'],
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100]
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'dark',
      custom: function({ series, dataPointIndex, w }) {
        const o = w.globals.seriesCandleO[0][dataPointIndex];
        const h = w.globals.seriesCandleH[0][dataPointIndex];
        const l = w.globals.seriesCandleL[0][dataPointIndex];
        const c = w.globals.seriesCandleC[0][dataPointIndex];
        
      return `
        <div class="bg-[#050505]/90 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.5)] poppins min-w-[240px] relative overflow-hidden">
          <div class="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-green-500 rounded-tl-md"></div>
          <div class="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500 rounded-br-md"></div>

          <div class="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <span class="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Node_Telemetry</span>
            <span class="text-[10px] text-white/60 font-mono">${w.globals.labels[dataPointIndex]}</span>
          </div>
          
          <div class="space-y-3 mb-5">
            <div class="flex items-baseline justify-between">
              <span class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Market_Index</span>
              <span class="text-lg font-mono font-bold text-white tracking-tighter">₹${c.toLocaleString()}</span>
            </div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-2 bg-white/5 p-3 rounded-xl border border-white/5">
              <div class="flex flex-col"><span class="text-[8px] text-gray-500 font-bold">OPEN</span><span class="text-[11px] text-white font-mono">${o}</span></div>
              <div class="flex flex-col"><span class="text-[8px] text-gray-500 font-bold">HIGH</span><span class="text-[11px] text-green-400 font-mono">${h}</span></div>
              <div class="flex flex-col"><span class="text-[8px] text-gray-500 font-bold">LOW</span><span class="text-[11px] text-red-400 font-mono">${l}</span></div>
              <div class="flex flex-col"><span class="text-[8px] text-gray-500 font-bold">VOL</span><span class="text-[11px] text-white font-mono">STABLE</span></div>
            </div>
          </div>

          <div class="space-y-2 pt-2">
            <div class="text-[9px] text-blue-400/80 font-black uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
              <div class="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div> AI_PROJECTION_LAYERS
            </div>
            
            <div class="flex justify-between items-center bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-lg group transition-all">
              <span class="text-[10px] text-blue-400 font-bold">ALPHA (Balanced)</span>
              <span class="text-xs font-mono text-white">₹${series[1][dataPointIndex]}</span>
            </div>
            
            <div class="flex justify-between items-center px-3 py-1">
              <span class="text-[10px] text-gray-400 font-medium">BETA (Conservative)</span>
              <span class="text-xs font-mono text-white/80">₹${series[2][dataPointIndex]}</span>
            </div>

            <div class="flex justify-between items-center px-3 py-1">
              <span class="text-[10px] text-purple-400 font-medium">GAMMA (Aggressive)</span>
              <span class="text-xs font-mono text-white/80">₹${series[3][dataPointIndex]}</span>
            </div>
          </div>
        </div>
      `;
      }
    },
    legend: { show: false }
  };

  const series = [
    { name: 'Market', type: 'candlestick', data: stockData.map(i => ({ x: new Date(i.time).getTime(), y: [i.open, i.high, i.low, i.close] })) },
    { name: 'Alpha', type: 'area', data: stockData.map(i => ({ x: new Date(i.time).getTime(), y: i.alpha })) },
    { name: 'Beta', type: 'line', data: stockData.map(i => ({ x: new Date(i.time).getTime(), y: i.beta })) },
    { name: 'Gamma', type: 'line', data: stockData.map(i => ({ x: new Date(i.time).getTime(), y: i.gamma })) }
  ];

  return <Chart options={options} series={series} height="100%" width="100%" />;
};

export default ChartDisplay;