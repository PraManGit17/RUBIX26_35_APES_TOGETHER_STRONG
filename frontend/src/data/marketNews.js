export const BACKEND_DATA = {
  "success": true,
  "overall_market_sentiment": "Bearish",
  "sentiment_score": -0.65,
  "data": {
    "beginner_friendly_summary": "The stock market is currently 'on sale' because of fears about new global taxes (tariffs) and some big companies making less money than expected...",
    "confidence_level": "High",
    "investment_recommendation": {
      "action": "HOLD",
      "reasoning": "For a beginner, the current market is 'noisy' due to global politics (tariffs) and temporary earnings dips...",
      "risk_level": "Medium",
      "time_horizon": "Long-term"
    },
    "key_trends": [
      "Trend 1: Global Trade Tensions - New tariff threats from the U.S. (specifically targeting Europe) are causing fear...",
      "Trend 2: Earnings-Driven Volatility - Major Indian companies like Reliance Industries and ICICI Bank are reporting 'disappointing' financial results...",
      "Trend 3: Retail Resilience vs. Foreign Exit - Individual Indian investors are continuing to invest record amounts through SIPs."
    ]
  },
  "news_impact_examples": [
    {
      "news_headline": "Sun Pharma clarifies $10 bn Organon acquisition report, calls it 'speculative in nature'",
      "affected_stocks": ["SUNPHARMA"],
      "impact_on_market": "Positive: likely to support the stock / sector.",
      "url": "https://economictimes.indiatimes.com/...",
      "image": "https://images.unsplash.com/photo-1587854680352-936b22b91030?q=80&w=1000"
    },
    {
      "news_headline": "Everstone to sell entire stake in India's Burger King operator Restaurant Brands Asia",
      "affected_stocks": ["RBA"],
      "impact_on_market": "Neutral/uncertain",
      "url": "https://economictimes.indiatimes.com/...",
      "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000"
    }
    // ... add all other news from your JSON here
  ],
  "sectors_impacted": [
    { "sector": "Information Technology (IT)", "impact": "Neutral to Negative", "score": 45 },
    { "sector": "Banking & Finance", "impact": "Negative", "score": 30 },
    { "sector": "Defense & Public Sector (PSU)", "impact": "Positive", "score": 85 }
  ],
  "top_opportunities": [
    {
      "symbol": "BEL",
      "action": "BUY",
      "target": "₹320",
      "reason": "Indigenous defense technology growth through Navy partnerships.",
      "confidence": 85,
      "isUp": true
    },
    {
      "symbol": "NIFTYBEES",
      "action": "ACCUMULATE",
      "target": "Market Avg",
      "reason": "SIP inflows hitting record highs allows rupee-cost averaging.",
      "confidence": 95,
      "isUp": true
    }
  ]
};