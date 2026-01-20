import React from 'react'
import HeroSection from '../components/Home Components/HeroSection'
import Navbar from '../components/Navbar'
import Highlights from '../components/Home Components/Highlights'

const Home = () => {
  return (
    <div className='relative bg-black'>
      <Navbar />
      <HeroSection />
      <Highlights />
    </div>
  )
}

export default Home