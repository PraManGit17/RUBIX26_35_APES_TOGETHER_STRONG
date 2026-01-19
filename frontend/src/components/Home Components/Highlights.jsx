import { TrendingUp } from 'lucide-react'
import React from 'react'

const Highlights = () => {
  return (

    <div className='relative text-white h-screen flex flex-col items-center justify-center overflow-hidden'>

      <div className="inset-0 z-10 overflow-hidden">
        <div class="grid-bg" />
      </div>


      <div className='relative z-10 rounded-3xl w-full flex items-center justify-center gap-8 text-8xl'>
        <div to='/' className='flex gap-3 relative'>
          <img src="/logos/gamma.png" className='absolute top-4 left-32 z-0  scale-200 rotate-10 opacity-40' />
          <div className='text-white font-bold syne'>gamma</div>
        </div>
        <div className='syne'>Highlights</div>
      </div>

      {/* <div className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'>
        <div className='w-[45%] h-full flex flex-col mt-20 py-17 px-12'>

          <div className='syne text-5xl'>Built for decisions, not speculation.</div>

          <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
            <span className='text-white font-bold'>Gamma </span>
            analyzes recent price behavior and technical patterns to predict short-term stock direction.
          </div>

          <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
            Every signal is generated using a lightweight machine learning model trained on historical price movement
          </div>
          <button className='flex items-center justify-center gap-5 urbanist-semibold bg-white rounded-md w-40 px-4 py-2 text-black mt-20'>
            Checkout
            <TrendingUp className='w-5 h-5 mt-0.5' />
          </button>
        </div>

        <div className='w-[50%] h-full flex flex-col items-center justify-center'>

          <div className='w-[90%] h-[450px] rounded-3xl p-4 bg-gradient-to-r from-white/90 via-gray-200 to-gray-200/90 border-b-2 border-black'>
            <div className='w-full h-[400px] rounded-2xl bg-black flex items-center justify-center overflow-hidden'>
              <img src='/images/predictions.png' className='object-cover opacity-80' />
            </div>
          </div>

          <div className='w-full h-[35px] bg-gradient-to-r from-white/80 via-gray-200 to-gray-200/90 rounded-bl-4xl
          rounded-br-4xl'></div>
        </div>
      </div> */}


      {/* <div className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'>
        <div className='w-[45%] h-full flex flex-col mt-20 py-17 px-12'>
          <div className='syne text-5xl'>Because emotion drives volatility.</div>
          <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
            <span className='text-white font-bold'>Gamma </span>
            continuously scans recent financial news and classifies market mood as Positive or Negative.
          </div>

          <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
            <span className='text-white font-bold'>Gamma </span>
            scrapes recent financial headlines related to a stock and evaluates overall sentiment.
          </div>

          <button className='flex items-center justify-center gap-5 urbanist-semibold bg-white rounded-md w-40 px-4 py-2 text-black mt-10'>
            Checkout
            <TrendingUp className='w-5 h-5 mt-0.5' />
          </button>
        </div>

        <div className='w-[50%] h-full flex flex-col items-center justify-center'>

          <div className='w-[90%] h-[450px] rounded-3xl p-4 bg-gradient-to-r from-white/90 via-gray-200 to-gray-200/90 border-b-2 border-black'>
            <div className='relative w-full h-[400px] rounded-2xl flex items-center justify-center overflow-hidden'>
              <img src='/images/news.png' className='object-cover absolute top-0' />
            </div>
          </div>

          <div className='w-full h-[35px] bg-gradient-to-r from-white/80 via-gray-200 to-gray-200/90 rounded-bl-4xl
          rounded-br-4xl'></div>
        </div>

      </div>    */}

      {/* <div className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'>
        <div className='w-[45%] h-full flex flex-col mt-20 py-17 px-12'>
          <div className='syne text-5xl'>Compare opinions, Trust performance</div>
          <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
            <span className='text-white font-bold'>Gamma </span>
            runs the same stock data through multiple LLMs and Gamma's own ML-based prediction engine.
          </div>

          <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
            Displays each model's Buy / Sell / Hold recommendation side-by-side for direct comparison.
          </div>

          <button className='flex items-center justify-center gap-5 urbanist-semibold bg-white rounded-md w-40 px-4 py-2 text-black mt-10'>
            Checkout
            <TrendingUp className='w-5 h-5 mt-0.5' />
          </button>
        </div>


        <div className='w-[50%] h-full flex flex-col items-center justify-center'>

          <div className='w-[90%] h-[450px] rounded-3xl p-4 bg-gradient-to-r from-white/90 via-gray-200 to-gray-200/90 border-b-2 border-black'>
            <div className='w-full h-[400px] rounded-2xl bg-black flex items-center justify-center'>
              <img src='/images/comparision.png' className='object-cover' />
            </div>
          </div>

          <div className='w-full h-[35px] bg-gradient-to-r from-white/80 via-gray-200 to-gray-200/90 rounded-bl-4xl
          rounded-br-4xl'></div>
        </div>

      </div> */}

    </div>
  )
}

export default Highlights
