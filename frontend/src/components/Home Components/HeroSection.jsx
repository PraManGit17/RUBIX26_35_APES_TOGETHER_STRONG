
import React from 'react'
import { MoveRight } from "lucide-react";
import { useEffect, useRef } from 'react';
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);


const HeroSection = () => {
  const textRef = useRef(null);
  const textRef1 = useRef(null);
  const buttonRef = useRef(null);
  const bgRef = useRef(null);
  const coinRef = useRef(null);
  const logosRef = useRef([]);

  // useEffect(() => {
  //   gsap.fromTo(
  //     textRef.current,
  //     {
  //       y: 60,
  //       opacity: 0,
  //     },
  //     {
  //       y: 0,
  //       opacity: 1,
  //       duration: 1.2,
  //       ease: 'power3.out',
  //     }
  //   );

  //   gsap.fromTo(
  //     textRef1.current, {
  //     y: 60,
  //     opacity: 0
  //   },
  //     {
  //       y: 0,
  //       opacity: 1,
  //       duration: 1.2,
  //       ease: 'power3.out',
  //       delay: 0.3,
  //     }
  //   )

  //   gsap.fromTo(
  //     buttonRef.current,
  //     {
  //       opacity: 0,
  //     },
  //     {
  //       opacity: 1,
  //       duration: 1.2,
  //       ease: 'power3.out',
  //       delay: 0.8,
  //     }
  //   );

  //   gsap.fromTo(
  //     bgRef.current,
  //     {
  //       scaleX: 0,
  //       transformOrigin: 'left center',
  //     },
  //     {
  //       scaleX: 1,
  //       duration: 0.8,
  //       ease: 'power3.out',
  //       delay: 1,
  //     }
  //   );

  // }, []);

  // useEffect(() => {
  //   const tl = gsap.timeline();

  //   // ---- Your existing animations ----
  //   tl.fromTo(
  //     textRef.current,
  //     { y: 60, opacity: 0 },
  //     { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
  //   )
  //     .fromTo(
  //       textRef1.current,
  //       { y: 60, opacity: 0 },
  //       { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
  //       "-=0.9" // same as delay 0.3
  //     )
  //     .fromTo(
  //       buttonRef.current,
  //       { opacity: 0 },
  //       { opacity: 1, duration: 1.2, ease: "power3.out" },
  //       "-=0.7" // similar timing to delay 0.8
  //     )
  //     .fromTo(
  //       bgRef.current,
  //       { scaleX: 0, transformOrigin: "left center" },
  //       { scaleX: 1, duration: 0.8, ease: "power3.out" },
  //       "-=0.6"
  //     );

  //   // ---- Coin animation AFTER above finishes ----

  //   tl.set(coinRef.current, {
  //     opacity: 1,
  //     rotate: 0,
  //   });

  //   tl.to(coinRef.current, {
  //     duration: 1.6,
  //     ease: "power1.inOut",
  //     motionPath: {
  //       path: [
  //         { x: 0, y: 0 },

  //         // small curved travel (smooth right movement)
  //         { x: 40, y: -8 },
  //         { x: 80, y: -2 },
  //         { x: 120, y: 8 },
  //         { x: 150, y: 18 },
  //         { x: 180, y: 30 },
  //         { x: 210, y: 45 },
  //         { x: 235, y: 65 },
  //         { x: 250, y: 85 },

  //         // start dropping faster
  //         { x: 265, y: 120 },
  //         { x: 280, y: 170 },
  //         { x: 295, y: 240 },

  //         // steep falling down
  //         { x: 305, y: 330 },
  //         { x: 315, y: 440 },
  //         { x: 325, y: 580 },
  //         { x: 335, y: 740 },
  //       ],

  //       curviness: 1.5,
  //     },
  //     rotate: 720,  // rotating while moving
  //     opacity: 1,   // vanishes near end
  //   });
  // }, []);


  // useEffect(() => {
  //   const logos = logosRef.current.filter(Boolean);

  //   gsap.set(logos, { y: 40, opacity: 0, scale: 0.75 });

  //   const tl = gsap.timeline({ delay: 0.2 });

  //   tl.to(logos, {
  //     y: 0,
  //     opacity: 1,
  //     duration: 0.6,
  //     ease: "power3.out",
  //     stagger: 0.15,
  //   });
  // }, []);


  useEffect(() => {
    const tl = gsap.timeline();
    const logos = logosRef.current.filter(Boolean);
 
    tl.set(coinRef.current, {
      opacity: 0,
      rotate: 0,
    });

    gsap.set(logos, { y: 40, opacity: 0, scale: 0.75 });
    // ---- Text + button + bg ----
    tl.fromTo(
      textRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
      .fromTo(
        textRef1.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=0.9"
      )
      .fromTo(
        buttonRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=0.7"
      )
      .fromTo(
        bgRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, ease: "power2.out" },
        "-=0.6"
      );

    // ---- Coin animation ----
    tl.to(coinRef.current, {
      opacity: 1,
      rotate: 0,
    });


    tl.to(coinRef.current, {
      duration: 1.8,
      ease: "power1.inOut",
      motionPath: {
        path: [
          { x: 0, y: 0 },
          { x: 25, y: -6 },
          { x: 50, y: -5 },
          { x: 75, y: 2 },
          { x: 95, y: 12 },
          { x: 115, y: 28 },
          { x: 135, y: 48 },
          { x: 155, y: 70 },
          { x: 175, y: 95 },
          { x: 200, y: 125 },
          { x: 225, y: 165 },
          { x: 250, y: 215 },
          { x: 280, y: 275 },
          { x: 310, y: 330 },
        ],
        curviness: 1.5,
      },
      rotate: 720,
      opacity: 0,
    });

    // logos start exactly when coin reaches end
    tl.to(
      logosRef.current.filter(Boolean),
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.15,
      },
      ">" // immediate after coin finishes
    );

    // coin disappears after logos start (optional)
    tl.to(coinRef.current, {
      duration: 0.1,
      opacity: 0,
    }, "<"); // "<" means start at same time as logos


    return () => tl.kill();
  }, []);



  return (
    <div className='relative z-10  h-screen w-full overflow-hidden '>

      <div className='absolute h-full inset-0 z-10 top-40 -right-20 flex items-center justify-end '>

        <img
          src="/images/rupee.png"
          className="absolute z-0 coin scale-40 -top-50 right-30"
          ref={coinRef}
        />


        <div
          className="absolute z-10 bottom-20 -right-0 scale-105">
          <img
            ref={(el) => (logosRef.current[0] = el)}
            src="/images/bse.png"
          />
        </div>


        <img
          ref={(el) => (logosRef.current[1] = el)}
          src="/images/se.png"
          className="absolute z-12 scale-75 bottom-25 right-60"
        />

        <img
          ref={(el) => (logosRef.current[2] = el)}
          src="/images/sse.png"
          className="absolute z-10 scale-75 bottom-25 right-140 rotate-y-180"
        />

        <img
          ref={(el) => (logosRef.current[3] = el)}
          src="/images/nse.png"
          className="absolute z-9 scale-75 bottom-30 right-225"
        />

        <img
          ref={(el) => (logosRef.current[4] = el)}
          src="/images/shse.png"
          className="absolute z-8 scale-75 bottom-20 -left-35"
        />
      </div>


      <div className="relative z-10 text-white w-full h-screen flex flex-col items-center">

        <div
          ref={textRef}
          className='syne text-5xl max-w-[1200px] text-center mt-45 flex items-center gap-2'>
          <span>Because Investing Shouldn't Feel Like</span>
          <span className="relative inline-block px-1 overflow-hidden rounded-xs">
            <span
              ref={bgRef}
              className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-600 to-black"
            />

            <span className="relative z-10 text-white">
              Gambling
            </span>
          </span>

        </div>

        <div ref={textRef1}>
          {/* <div className='poppins text-center text-xl max-w-[850px] mt-8 text-gray-200/60'>
            Markets move fast. Charts are confusing. Advice is everywhere — and rarely clear
          </div> */}

          <div className='poppins text-center text-lg max-w-[750px] mt-5 text-gray-200/60'>
            <span className='text-white font-bold'>Gamma</span> cuts through the noise by translating market data into straightforward signals you can actually use
          </div>
        </div>

        <div
          ref={buttonRef}
          className='flex items-center justify-between w-[24%] py-2 mt-5 text-lg  mr-15'>

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