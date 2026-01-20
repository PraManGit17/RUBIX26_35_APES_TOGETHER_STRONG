import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import NotFound from './pages/NotFound';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/predictions" element={<Prediction />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
