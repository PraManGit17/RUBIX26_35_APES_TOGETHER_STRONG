
import React from 'react'
import { MoveRight } from "lucide-react";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const HeroSection = () => {
  const textRef = useRef(null);
  const textRef1 = useRef(null);
  const buttonRef = useRef(null);
  const bgRef = useRef(null);


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
      textRef1.current, {
      y: 60,
      opacity: 0
    },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3,
      }
    )

    gsap.fromTo(
      buttonRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.8,
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

  }, []);



  return (
    <div className='relative z-10  h-screen w-full flex justify-center items-center overflow-hidden '>

      <div className="relative z-10 text-white w-full h-screen flex flex-col items-center">

        <div
          ref={textRef}
          className='syne text-5xl max-w-[1200px] text-center mt-55 flex items-center gap-2'>
          <span>Because Investing Shouldn't Feel Like</span>

          {/* <span className='bg-gradient-to-r from-green-900 via-green-700 rounded-xs  to-black text-white px-1'>
            Gambling
          </span> */}

          <span className="relative inline-block px-1 overflow-hidden rounded-xs">
            {/* animated background */}
            <span
              ref={bgRef}
              className="absolute inset-0 bg-gradient-to-r from-green-900 via-green-700 to-black"
            />

            {/* text */}
            <span className="relative z-10 text-white">
              Gambling
            </span>
          </span>

        </div>



        <div ref={textRef1}>
          <div className='poppins text-center text-xl max-w-[850px] mt-8 text-gray-200/60'>
            Markets move fast. Charts are confusing. Advice is everywhere — and rarely clear
          </div>

          <div className='poppins text-center text-lg max-w-[750px] mt-2 text-gray-200/60'>
            <span className='text-white font-bold'>Gamma</span> cuts through the noise by translating market data into straightforward signals you can actually use
          </div>
        </div>

        <div
          ref={buttonRef}
          className='flex items-center justify-between w-[24%] py-2 mt-12 text-lg  mr-20'>

          <button className='urbanist-semibold bg-white rounded-md w-35 px-5 py-2 text-black'>Use Copilot</button>
          <button className='urbanist  border-white w-35 text-white'>
            <div className='flex items-center justify-between w-full mb-2 px-2'>
              <div className='ml-2'>Explore</div>
              <MoveRight className='w-5 h-5 mt-1' />
            </div>

            <div className='w-full h-0.5 rounded-2xl bg-white'></div>
          </button>
        </div>


      </div>
    </div>
  )
}

export default HeroSection
