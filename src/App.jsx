import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import NotFound from './pages/NotFound';
import StockChart from './pages/StockChart';
import CalculatorPage from './pages/CalculatorPage';
import TradingFloor from './pages/TradingFloor';
import Ledger from './pages/Ledger';
import PaperTrading from './pages/PaperTrading';
import Portfolio from './pages/Portfolio';
import TradeHistory from './pages/TradeHistory';
import StockDetail from './pages/StockDetail';
import NewsPage from './pages/NewsPage';
import WatchlistPage from './pages/WatchlistPage';
import MarketPage from './pages/MarketPage';
import Prediction from './pages/Prediction';
import Analysis from './pages/Analysis';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/predictions" element={<Prediction/>} />
      <Route path="/bot" element={<Chatbot />} />
      <Route path='/chart' element={<StockChart/>}/>
      <Route path='/calculator' element={<CalculatorPage/>}/>
      <Route path='/trading-floor' element={<TradingFloor/>} />
      <Route path="/ledger" element={<Ledger />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/paper-trading" element={<PaperTrading />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/trade-history" element={<TradeHistory />} />
      <Route path="/stock/:symbol" element={<StockDetail />} />
      <Route path='/news' element={<NewsPage/>}/>
      <Route path='/watchlist' element={<WatchlistPage/>} />
      <Route path='/markets' element={<MarketPage/>}/>
      <Route path="*" element={<NotFound />} />
      <Route path="/analysis" element={<Analysis />} />
    </Routes>
  );
}

export default App;
