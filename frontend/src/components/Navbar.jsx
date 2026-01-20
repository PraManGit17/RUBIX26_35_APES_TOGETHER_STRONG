import { MoveRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [openTrading, setOpenTrading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenTrading(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 w-full py-3 z-20 px-30
        flex items-center justify-between
        transition-all duration-300 ease-out

        ${scrolled
          ? 'backdrop-blur-lg bg-white/0 '
          : 'bg-transparent'
        }
      `}
    >



      <div className="relative flex items-center justify-between w-[55%]  py-1">
        <Link to="/" className="flex gap-3 relative">
          <img
            src="/logos/gamma.png"
            className="absolute top-0 left-8 z-0 w-12 h-12 scale-130 rotate-10 opacity-40"
          />
          <div className="relative z-10 text-3xl text-white font-bold syne">
            gamma
          </div>
        </Link>

        <div className="urbanist text-md flex items-center gap-12 pt-2 text-white py-2">
          <Link to="/" className="hover:cursor-pointer">
            Overview
          </Link>
          <Link to="/predictions" className="hover:cursor-pointer">
            Predictions
          </Link>
          <Link to="/" className="hover:cursor-pointer">
            Sentiments
          </Link>
          <Link to="/chart" className="hover:cursor-pointer">
            Compare
          </Link>


          <div className="relative group">
            {/* Trading Link */}
            <Link to="/paper-trading" className="hover:cursor-pointer">
              Trading
            </Link>

            {/* Smooth Dropdown */}
            <div
              className="
      absolute top-10 left-0
      bg-black text-white flex flex-col gap-3
      px-4 py-3 rounded-md shadow-lg min-w-[170px]
    z-50

      opacity-0 invisible
      translate-y-0.5 scale-95
      transition-all duration-300 ease-out

      group-hover:opacity-100 group-hover:visible
      group-hover:translate-y-0 group-hover:scale-100
    "
            >
              <Link to="/calculator" className="hover:cursor-pointer hover:text-gray-300">
                Calculator
              </Link>
              <Link to="/news" className="hover:cursor-pointer hover:text-gray-300">
                News
              </Link>
              <Link to="/markets" className="hover:cursor-pointer hover:text-gray-300">
                Market
              </Link>
              <Link to="/watchlist" className="hover:cursor-pointer hover:text-gray-300">
                WatchList
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-10 pt-2 text-md text-white'>
        <button className='urbanist'>Extension</button>
        <button className='urbanist'>Sign in</button>
        <button className='flex items-center  justify-between urbanist-semibold bg-white rounded-md w-35 px-3 py-1.5  text-black'>
          Get Started
          <MoveRight className='w-5 h-5 mt-0.5' />
        </button>
      </div>

    </div>
  )
}