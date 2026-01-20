import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import PredictionHero from '../components/Prediction Components/PredictionHero'
import PredictionResults from '../components/Prediction Components/PredictionResults'
import { response } from '../data/predictiondata.js';

const Prediction = () => {

  const [predictionData, setPredictionData] = useState(response);

  return (
    <div className='relative bg-black'>
      <Navbar />
      <PredictionHero setPredictionData={setPredictionData} />
      {predictionData && (
        <PredictionResults
          data={predictionData}
          inline={true}
          onClose={() => setPredictionData(null)}
        />
      )}

    </div>
  )
}

export default Prediction