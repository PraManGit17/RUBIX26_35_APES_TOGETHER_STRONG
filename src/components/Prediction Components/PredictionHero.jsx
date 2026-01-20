import React, { useState } from 'react'
import { MoveRight, Loader2, Search } from "lucide-react";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparklines, SparklinesLine } from "react-sparklines";
import { indianStocks } from "../../data/stocks.js";
import PredictionResults from "./PredictionResults.jsx";

const API_BASE_URL = 'http://localhost:5000';

const PredictionHero = () => {

  const textRef = useRef(null);
  const textRef1 = useRef(null);
  const buttonRef = useRef(null);
  const bgRef = useRef(null);
  const backRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveringText, setHoveringText] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      textRef.current,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      }
    );

    gsap.fromTo(
      buttonRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.5,
      }
    );

    gsap.fromTo(
      bgRef.current,
      {
        scaleX: 0,
        transformOrigin: 'left center',
      },
      {
        scaleX: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 1,
      }
    );

    gsap.fromTo(
      textRef1.current, {
      y: 5,
      opacity: 0
    },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 1.5,
      }
    )

    gsap.fromTo(
      backRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1.5,
        ease: 'power3.out',
        delay: 1.8,
      }
    );

  }, []);


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Filter stocks based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = indianStocks.filter(stock => 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.bseCode.includes(searchQuery)
      );
      setFilteredStocks(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredStocks([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleStockSelect = async (stock) => {
    setSelectedStock(stock);
    setSearchQuery(stock.name);
    setShowSuggestions(false);
    
    // Auto-submit prediction request
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bse_code: stock.bseCode,
          days: 25
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch prediction: ${response.statusText}`);
      }

      const data = await response.json();
      setPredictionData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch prediction. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDistance = (el) => {
    if (!el) return 9999;
    const rect = el.getBoundingClientRect();
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;
    return Math.hypot(mousePos.x - elX, mousePos.y - elY);
  };

  return (
    <div className='relative z-10 w-full min-h-screen flex flex-col justify-start items-center overflow-x-hidden bg-black'>
      <div className='w-full flex justify-center items-center min-h-screen'>

        <div
          ref={backRef}
          className="absolute inset-0 z-10 py-25 px-4">
        <div className="w-full text-white flex flex-wrap items-center justify-between gap-6 ">
          {indianStocks.map((company, index) => {
            const radius = 100;
            const [opacity, setOpacity] = React.useState(0);
            const finalOpacity = hoveringText ? 0 : opacity;
            const isUp = company.trend === "up";

            return (
              <div
                key={index}
                className="
                  group relative
                  border-2 border-white
                  rounded-lg
                  px-2 py-2
                  flex items-center gap-2
                  backdrop-blur-md
                  bg-white/5
                  transition-all duration-300 ease-out
                  hover:-translate-y-2
                  hover:scale-105
                  hover:z-20
                "
                style={{
                  opacity: finalOpacity,
                }}
                ref={(el) => {
                  if (el) {
                    const dist = getDistance(el);
                    setOpacity(dist < radius ? 1 : 0);

                  }
                }}
              >

                <div
                  className={`
                    absolute 
                    inset-0
                    rounded-lg
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity duration-300
                    ${isUp ? "bg-gradient-to-r from-green-700 via-green-600 to-black" : "bg-gradient-to-r from-red-700 via-red-600 to-black"}
                    `}
                />

                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-5 h-5 object-contain relative z-10"
                />

                <div className="flex flex-col leading-tight relative z-10">
                  {/* <span className="text-sm font-medium">{company.name}</span> */}
                  <span className="text-xs text-white/70">{company.ticker}</span>
                </div>

                {/* Small graph */}
                <div className="w-20 h-8 relative z-10">
                  <Sparklines data={company.sparkline}>
                    <SparklinesLine
                      style={{
                        stroke: isUp ? "#22c55e" : "#ef4444",
                        strokeWidth: 2,
                        fill: "none",
                      }}
                    />
                  </Sparklines>
                </div>
              </div>
            );
          })}
        </div>
        </div>


        <div
          className="relative z-20 flex flex-col items-center justify-center gap-2 text-white "
          onMouseEnter={() => setHoveringText(true)}
          onMouseLeave={() => setHoveringText(false)}
        >
        <div
          ref={textRef}
          className='syne text-5xl max-w-[1200px] text-center flex items-center gap-2'>
          <span>Know the Likely Move Before You</span>
          <span className="relative inline-block px-1 overflow-hidden rounded-xs">
            <span
              ref={bgRef}
              className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-black"
            />

            <span className="relative z-10 text-white">
              Trade
            </span>
          </span>

        </div>

        <div
          ref={buttonRef}
          className='relative mt-10 w-[55%]'>
          <div className="relative">
            <Search className='absolute top-3 left-3 text-gray-400 w-5 h-5' />
            <input
              name='input-stock'
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search Indian stocks (e.g., TCS, Infosys, Reliance)'
              className='py-2 px-10 rounded-md text-white border-2 w-full backdrop-blur-3xl bg-white/10 placeholder:text-gray-300 focus:outline-none focus:border-blue-500 transition-colors'
              disabled={loading}
            />
            {loading && (
              <Loader2 className='absolute top-2.5 right-3 animate-spin text-blue-400' />
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && filteredStocks.length > 0 && (
            <div className="absolute w-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
              {filteredStocks.map((stock, index) => (
                <button
                  key={index}
                  onClick={() => handleStockSelect(stock)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">{stock.name}</p>
                      <p className="text-sm text-gray-400">{stock.ticker} • BSE: {stock.bseCode}</p>
                    </div>
                    <div className={`text-sm ${stock.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.trend === 'up' ? '▲' : '▼'} {Math.abs(stock.changePercent)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        <div ref={textRef1}>
          <div className='poppins text-center text-lg max-w-[700px] mt-8 text-gray-200/60'>
            Search and select an Indian stock to get an instant AI-powered prediction with buy, sell, or hold signal using technical analysis and market news sentiment.
          </div>
        </div>
      </div>
      </div>

      {/* Prediction Results - Inline Display */}
      {predictionData && (
        <div className='w-full max-w-7xl px-4 pb-20 mt-16'>
          <PredictionResults 
            data={predictionData} 
            onClose={() => setPredictionData(null)} 
            inline={true}
          />
        </div>
      )}
    </div>
  )
}

export default PredictionHero