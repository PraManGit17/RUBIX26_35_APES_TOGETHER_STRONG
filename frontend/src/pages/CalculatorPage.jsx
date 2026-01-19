import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoveLeft } from "lucide-react";
import RiskCalculator from '../components/Calculator/RiskCalculator';

const CalculatorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 flex flex-col items-center justify-center">
      {/* Back Button */}
      <div className="w-full max-w-[1100px] mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors urbanist text-sm"
        >
          <MoveLeft className="w-4 h-4" /> Return to Terminal
        </button>
      </div>


      <RiskCalculator currentPrice={18580} />
    </div>
  );
};

export default CalculatorPage;