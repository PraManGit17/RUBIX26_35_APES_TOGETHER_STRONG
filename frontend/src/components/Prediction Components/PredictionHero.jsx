import React, { useState } from 'react'
import { MoveRight } from "lucide-react";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparklines, SparklinesLine } from "react-sparklines";
import { stocks } from "../../data/stocks.js";


const PredictionHero = () => {

  const textRef = useRef(null);
  const textRef1 = useRef(null);
  const buttonRef = useRef(null);
  const bgRef = useRef(null);
  const backRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveringText, setHoveringText] = useState(false);

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

  const getDistance = (el) => {
    if (!el) return 9999;
    const rect = el.getBoundingClientRect();
    const elX = rect.left + rect.width / 2;
    const elY = rect.top + rect.height / 2;
    return Math.hypot(mousePos.x - elX, mousePos.y - elY);
  };

  return (
    <div className='relative z-10  h-screen w-full flex justify-center items-center overflow-hidden '>
      <div
        ref={backRef}
        className="absolute inset-0 z-10 py-25 px-4">
        <div className="w-full text-white flex flex-wrap items-center justify-between gap-6 ">
          {stocks.map((company, index) => {
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
          <input
            name='input-stock'
            type='text'
            placeholder='Search any stock or ticker (eg. APPL)'
            className='py-2 px-3 rounded-md text-white border-2 w-full backdrop-blur-3xl bg-white/10 placeholder:text-gray-300'
          />
          <MoveRight className='absolute top-2.5 right-3' />
        </div>

        <div ref={textRef1}>
          <div className='poppins text-center text-lg max-w-[700px] mt-8 text-gray-200/60'>
            Type a stock ticker to get a clear buy, sell, or hold signal using recent price trends, indicators, and market news sentiment.
          </div>
        </div>




      </div>
    </div>
  )
}

export default PredictionHero
