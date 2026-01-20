// import { TrendingUp } from 'lucide-react'
// import React, { useRef, useLayoutEffect } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// gsap.registerPlugin(ScrollTrigger)

// const Highlights = () => {
//   const containerRef = useRef(null)
//   const gridRef = useRef(null)
//   const titleRef = useRef(null)
//   const cardsRef = useRef([])

//   const addToCards = el => {
//     if (el && !cardsRef.current.includes(el)) {
//       cardsRef.current.push(el)
//     }
//   }

//   useLayoutEffect(() => {
//     const ctx = gsap.context(() => {
//       const cards = cardsRef.current

//       if (!containerRef.current || !titleRef.current || cards.length === 0) return

//       gsap.set(containerRef.current, {
//         position: 'relative'
//       })

//       gsap.set(cards, {
//         position: 'absolute',
//         top: 70,
//         left: '2.5%',
//         width: '95%',
//         backgroundColor: 'black'
//       })

//       // Initial states
//       gsap.set(gridRef.current, { opacity: 0 })
//       gsap.set(titleRef.current, { opacity: 0, y: 80 })
//       gsap.set(cards, { opacity: 0, y: 120 })

//       // Stack cards visually (back → front)
//       cards.forEach((card, i) => {
//         gsap.set(card, {
//           zIndex: i + 1,
//           yPercent: i * 15
//         })
//       })

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: containerRef.current,
//           start: 'top top',
//           end: () => `+=${cards.length * 900}`,
//           scrub: 1,
//           pin: true,
//           anticipatePin: 1,
//           invalidateOnRefresh: true
//         }
//       })

//       tl.to(gridRef.current, { opacity: 1, duration: 0.6 })
//         .to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, '+=0.2')


//       cards.forEach((card, i) => {
//         tl.to(card, {
//           opacity: 1,
//           y: 0,
//           backgroundColor: 'white',
//           yPercent: 0,
//           zIndex: cards.length + i,
//           duration: 0.9,
//           ease: 'power3.out'
//         }, '+=0.3')
//       })

//     }, containerRef)

//     return () => ctx.revert()
//   }, [])


//   return (
//     <div
//       ref={containerRef}
//       className='relative text-white h-screen flex flex-col items-center justify-center overflow-hidden'
//     >
//       <div ref={gridRef} className="inset-0 z-10 overflow-hidden">
//         <div className="grid-bg" />
//       </div>

//       <div
//         ref={titleRef}
//         className='absolute z-5 rounded-3xl w-full flex items-center justify-center gap-8 text-8xl'
//       >
//         <div to='/' className='flex gap-3 relative'>
//           <img src="/logos/gamma.png" className='absolute top-4 left-32 z-0 scale-200 rotate-10 opacity-40' />
//           <div className='text-white font-bold syne'>gamma</div>
//         </div>
//         <div className='syne'>Highlights</div>
//       </div>

//       <div
//         ref={addToCards}
//         className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'
//       >
//         <div className='w-[45%] h-full flex flex-col mt-20 py-15 px-12'>

//           <div className='syne text-5xl leading-[1.2] '>Built for decisions, not
//             <br />
//             <span
//               className=" bg-gradient-to-r from-blue-700 via-blue-600 to-black px-2 rounded-sm"
//             >
//               speculation
//             </span>
//           </div>

//           <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
//             <span className='text-white font-bold'>Gamma </span>
//             analyzes recent price behavior and technical patterns to predict short-term stock direction.
//           </div>

//           <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
//             Every signal is generated using a lightweight machine learning model trained on historical price movement
//           </div>
//           <button className='flex items-center justify-center gap-5 urbanist-semibold bg-white rounded-md w-40 px-4 py-2 text-black mt-20'>
//             Checkout
//             <TrendingUp className='w-5 h-5 mt-0.5' />
//           </button>
//         </div>

//         <div className='w-[50%] h-full flex flex-col items-center justify-center'>

//           <div className='w-[90%] h-[450px] rounded-3xl p-4 bg-gradient-to-r from-white/90 via-gray-200 to-gray-200/90 border-b-2 border-black'>
//             <div className='w-full h-[400px] rounded-2xl bg-black flex items-center justify-center overflow-hidden'>
//               <img src='/images/predictions.png' className='object-cover opacity-80' />
//             </div>
//           </div>

//           <div className='w-full h-[35px] bg-gradient-to-r from-white/80 via-gray-200 to-gray-200/90 rounded-bl-4xl
//           rounded-br-4xl'></div>
//         </div>
//       </div>

//       <div
//         ref={addToCards}
//         className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'>
//         <div className='w-[45%] h-full flex flex-col mt-20 py-17 px-12'>
//           <div className='syne text-5xl leading-[1.2] '>Because emotion drives
//             <br />
//             <span
//               className=" bg-gradient-to-r from-purple-700 via-purple-600 to-black px-2 rounded-sm"
//             >
//               volatility
//             </span>
//           </div>

//           <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
//             <span className='text-white font-bold'>Gamma </span>
//             continuously scans recent financial news and classifies market mood as Positive or Negative.
//           </div>

//           <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
//             <span className='text-white font-bold'>Gamma </span>
//             scrapes recent financial headlines related to a stock and evaluates overall sentiment.
//           </div>

//           <button className='flex items-center justify-center gap-5 urbanist-semibold bg-white rounded-md w-40 px-4 py-2 text-black mt-10'>
//             Checkout
//             <TrendingUp className='w-5 h-5 mt-0.5' />
//           </button>
//         </div>

//         <div className='w-[50%] h-full flex flex-col items-center justify-center'>

//           <div className='w-[90%] h-[450px] rounded-3xl p-4 bg-gradient-to-r from-white/90 via-gray-200 to-gray-200/90 border-b-2 border-black'>
//             <div className='relative w-full h-[400px] rounded-2xl flex items-center justify-center overflow-hidden'>
//               <img src='/images/news.png' className='object-cover absolute top-0' />
//             </div>
//           </div>

//           <div className='w-full h-[35px] bg-gradient-to-r from-white/80 via-gray-200 to-gray-200/90 rounded-bl-4xl
//           rounded-br-4xl'></div>
//         </div>

//       </div>

//       <div
//         ref={addToCards}
//         className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'>
//         <div className='w-[45%] h-full flex flex-col mt-20 py-15 px-12'>

//           <div className='syne text-5xl leading-[1.2]'>Compare opinions, Trust
//             <br />
//             <span
//               className=" bg-gradient-to-r from-yellow-700 via-yellow-600 to-black px-2 rounded-sm"
//             >
//               performance
//             </span>
//           </div>
//           <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
//             <span className='text-white font-bold'>Gamma </span>
//             runs the same stock data through multiple LLMs and Gamma's own ML-based prediction engine.
//           </div>

//           <div className='poppins text-sm mt-8 text-gray-200/60 max-w-[500px]'>
//             Displays each model's Buy / Sell / Hold recommendation side-by-side for direct comparison.
//           </div>

//           <button className='flex items-center justify-center gap-5 urbanist-semibold bg-white rounded-md w-40 px-4 py-2 text-black mt-10'>
//             Checkout
//             <TrendingUp className='w-5 h-5 mt-0.5' />
//           </button>
//         </div>


//         <div className='w-[50%] h-full flex flex-col items-center justify-center'>

//           <div className='w-[90%] h-[450px] rounded-3xl p-4 bg-gradient-to-r from-white/90 via-gray-200 to-gray-200/90 border-b-2 border-black'>
//             <div className='w-full h-[400px] rounded-2xl bg-black flex items-center justify-center'>
//               <img src='/images/comparision.png' className='object-cover' />
//             </div>
//           </div>

//           <div className='w-full h-[35px] bg-gradient-to-r from-white/80 via-gray-200 to-gray-200/90 rounded-bl-4xl
//           rounded-br-4xl'></div>
//         </div>

//       </div>

//     </div>
//   )
// }

// export default Highlights






import { TrendingUp } from 'lucide-react'
import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Highlights = () => {
  const containerRef = useRef(null)
  const gridRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  const addToCards = el => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current
      if (!containerRef.current || !titleRef.current || cards.length === 0) return

      // Card base setup (NO OPACITY)
      gsap.set(cards, {
        position: 'absolute',
        opacity: 0,
        top: 70,
        left: '2.5%',
        width: '95%',
        backgroundColor: 'black',
        y: 140
      })


      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: i + 1,
          yPercent: i * 12
        })
      })


      // Initial states
      gsap.set(gridRef.current, { autoAlpha: 0 })
      gsap.set(titleRef.current, { autoAlpha: 0, y: 80 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${cards.length * 800}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })

      /* 1️⃣ GRID FIRST */
      tl.to(gridRef.current, {
        autoAlpha: 1,
        duration: 1
      })

      /* 2️⃣ TITLE SECOND */
      tl.to(titleRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.2
      }, '+=0.2')

      cards.forEach((card, i) => {
        tl.to(titleRef.current, {
          autoAlpha: 0,
          duration: 0.8,
          y: 0,
        })

        tl.to(card, {
          opacity: 1,
          y: 2,
          yPercent: 5,
          zIndex: cards.length + i,
          duration: 1,
          ease: 'power3.out'
        }, '+=0.5')
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])



  return (
    <div
      ref={containerRef}
      className='relative text-white h-screen flex flex-col items-center justify-center overflow-hidden'
    >
      <div ref={gridRef} className="inset-0 z-0 overflow-hidden">
        <div className="grid-bg" />
      </div>

      <div
        ref={titleRef}
        className='absolute z-5 rounded-3xl w-full flex items-center justify-center gap-8 text-8xl'
      >
        <div to='/' className='flex gap-3 relative'>
          <img src="/logos/gamma.png" className='absolute top-4 left-32 z-0 scale-200 rotate-10 opacity-40' />
          <div className='text-white font-bold syne'>gamma</div>
        </div>
        <div className='syne'>Highlights</div>
      </div>

      <div
        ref={addToCards}
        className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'
      >
        <div className='w-[45%] h-full flex flex-col mt-20 py-15 px-12'>

          <div className='syne text-5xl leading-[1.2] '>Built for decisions, not
            <br />
            <span
              className=" bg-gradient-to-r from-blue-700 via-blue-600 to-black px-2 rounded-sm"
            >
              speculation
            </span>
          </div>

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
      </div>

      <div
        ref={addToCards}
        className='relative  z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'>
        <div className='w-[45%] h-full flex flex-col mt-20 py-17 px-12'>
          <div className='syne text-5xl leading-[1.2] '>Because emotion drives
            <br />
            <span
              className=" bg-gradient-to-r from-purple-700 via-purple-600 to-black px-2 rounded-sm"
            >
              volatility
            </span>
          </div>

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

      </div>

      <div
        ref={addToCards}
        className='relative z-10 bg-black rounded-3xl w-[95%] flex items-center shadow-gray-400 shadow-md'>
        <div className='w-[45%] h-full flex flex-col mt-20 py-15 px-12'>

          <div className='syne text-5xl leading-[1.2]'>Compare opinions, Trust
            <br />
            <span
              className=" bg-gradient-to-r from-yellow-700 via-yellow-600 to-black px-2 rounded-sm"
            >
              performance
            </span>
          </div>
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

      </div>

    </div>
  )
}

export default Highlights




