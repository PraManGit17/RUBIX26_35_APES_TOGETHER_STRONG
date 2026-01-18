import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import NotFound from './pages/NotFound';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bot" element={<Chatbot />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
