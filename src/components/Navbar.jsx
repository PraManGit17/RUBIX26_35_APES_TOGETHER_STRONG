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
        fixed top-0 left-0 w-full py-3 z-20 px-30
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
          <img src="/logos/gamma.png" className='absolute top-0 left-8 z-0 w-12 h-12 scale-130 rotate-10 opacity-40' />
          <div className='relative z-10 text-3xl text-white font-bold syne'>gamma</div>
        </Link>

        <div className='urbanist text-md flex items-center gap-10 pt-2 text-white'>
          <Link to='/predictions' className='hover:text-cyan-400 transition-colors'>Analyze Stock</Link>
          <Link to='/news' className='hover:text-cyan-400 transition-colors'>News & Trends</Link>
          <Link to='/calculator' className='hover:text-cyan-400 transition-colors'>Calculator</Link>
          <Link to='/analysis' className='hover:text-cyan-400 transition-colors'>Market Analysis</Link>
          <Link to='/paper-trading' className='hover:text-cyan-400 transition-colors'>Paper Trading</Link>
          <Link to='/markets' className='hover:text-cyan-400 transition-colors'>Markets</Link>
          <Link to='/watchlist' className='hover:text-cyan-400 transition-colors'>Watchlist</Link>
        </div>
      </div>


    </div>
  )
}