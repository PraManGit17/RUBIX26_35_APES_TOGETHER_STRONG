import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import NotFound from './pages/NotFound';
import StockChart from './pages/StockChart';
import CalculatorPage from './pages/CalculatorPage';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bot" element={<Chatbot />} />
      <Route path="*" element={<NotFound />} />
      <Route path='/chart' element={<StockChart/>}/>
      <Route path='/calculator' element={<CalculatorPage/>}/>
    </Routes>
  );
}

export default App;
