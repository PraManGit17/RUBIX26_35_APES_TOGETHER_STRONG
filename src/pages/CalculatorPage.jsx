import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft } from "lucide-react";
import RiskRewardCalculator from '../components/Calculator/RiskRewardCalculator';
import Navbar from '../components/Navbar';
import Squares from '../components/Squares';

const CalculatorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-200 font-['Outfit'] p-4 lg:p-8 overflow-hidden">
      {/* Squares Background - Fixed to viewport */}
      <div className="fixed inset-0 z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#222222"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        <div className="max-w-[1500px] mx-auto pt-6">
          <RiskRewardCalculator />
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;