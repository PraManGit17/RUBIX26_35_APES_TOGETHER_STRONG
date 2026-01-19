import React from 'react'
import HeroSection from '../components/Home Components/HeroSection'
import Navbar from '../components/Navbar'

const Home = () => {
  return (
    <div className='relative bg-black'>
      <Navbar />
      <HeroSection />
    </div>
  )
}

export default Home
