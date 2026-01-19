import { MoveRight } from 'lucide-react';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`
        fixed top-0 left-0 w-full py-5 z-20 px-30
        flex items-center justify-between
        transition-all duration-300 ease-out

        ${scrolled
          ? 'backdrop-blur-lg bg-white/0 '
          : 'bg-transparent'
        }
      `}
    >

      <div className='relative flex items-center justify-between w-[55%]'>
        <Link to='/' className='flex gap-3 relative'>
          <img src="/logos/gamma.png" className='absolute top-0 left-8 z-0 w-12 h-12 scale-130 rotate-10 opacity-35' />
          <div className='relative z-10 text-3xl text-white font-bold syne'>gamma</div>
        </Link>

        <div className='urbanist text-md flex items-center gap-12 pt-2 text-white'>
          <Link to='/' className='hover:cursor-pointer'>Overview</Link>
          <Link to='/' className='hover:cursor-pointer'>Insights</Link>
          <Link to='/' className='hover:cursor-pointer'>Sentiments</Link>
          <Link to='/' className='hover:cursor-pointer'>Backtest</Link>
          <Link to='/' className='hover:cursor-pointer'>Copilot</Link>
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
