
import React from 'react'
import { MoveRight } from "lucide-react";


const HeroSection = () => {
  return (
    <div className='relative z-10  h-screen w-full flex justify-center items-center overflow-hidden '>

      <div className="relative z-10 text-white w-full h-screen flex flex-col items-center">
      
        <div className='syne text-5xl max-w-[1200px] text-center mt-55 flex items-center gap-2'>
          <span>Because Investing Shouldn't Feel Like</span> 
          <span className='bg-gradient-to-r from-green-900 via-green-700 rounded-xs  to-black text-white px-1'>
             Gambling
          </span>
        </div>

        <div className='poppins text-center text-xl max-w-[850px] mt-8 text-gray-200/60'>
          Markets move fast. Charts are confusing. Advice is everywhere — and rarely clear
        </div>

        <div className='poppins text-center text-lg max-w-[750px] mt-2 text-gray-200/60'>
          <span className='text-white font-bold'>Gamma</span> cuts through the noise by translating market data into straightforward signals you can actually use
        </div>

        <div className='flex items-center justify-between w-[20%] py-2 mt-12 text-lg'>
          <button className='urbanist-semibold bg-white rounded-md w-35 px-5 py-2 text-black'>Use Copilot</button>
          <button className='urbanist  border-white w-35 text-white'>
            <div className='flex items-center justify-between w-full mb-2 px-2'>
              <div className='ml-2'>Explore</div>
              <MoveRight className='w-5 h-5 mt-1'/>
            </div>

            <div className='w-full h-0.5 rounded-2xl bg-white'></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
