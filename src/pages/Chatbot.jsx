import React from 'react'
import ChatBotHero from '../components/ChatBot Components/ChatBotHero'
import Navbar from '../components/Navbar'

const Chatbot = () => {
  return (
    <div>
      <Navbar />
      <div className="pt-20">
        <ChatBotHero />
      </div>
    </div>
  )
}

export default Chatbot
