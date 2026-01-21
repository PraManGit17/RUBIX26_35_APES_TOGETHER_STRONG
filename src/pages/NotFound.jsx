import React from 'react'
import Navbar from '../components/Navbar'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <div className="pt-24 p-6">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      </div>
    </div>
  )
}

export default NotFound
