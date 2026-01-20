import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft } from "lucide-react";
import RiskRewardCalculator from '../components/Calculator/RiskRewardCalculator';

const CalculatorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      {/* Back Button */}
      <div className="w-full max-w-7xl mx-auto mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-semibold"
        >
          <MoveLeft className="w-4 h-4" /> Return to Home
        </button>
      </div>

      <RiskRewardCalculator />
    </div>
  );
};

export default CalculatorPage;