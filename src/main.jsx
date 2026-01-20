import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { TradeProvider } from './context/TradeContext.jsx';
import { WatchlistProvider } from './context/WatchlistContext.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>,
  

  <BrowserRouter>
    <TradeProvider>
      <WatchlistProvider>
        <App />
      </WatchlistProvider>
    </TradeProvider>
  </BrowserRouter>
)
