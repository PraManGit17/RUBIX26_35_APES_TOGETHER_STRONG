export const NEWS_DATA = [
  {
    id: 1,
    category: "URGENT",
    title: "RBI Holds Rates: Market Eyes Q3 Pivot",
    description: "Governor signals inflationary cooling; banking stocks expected to lead the next Nifty rally.",
    sentiment: "BULLISH",
    timestamp: "12m ago",
    impactedSectors: ["Banking", "Finance"],
    image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    category: "TECH",
    title: "NVIDIA-Reliance AI Deal Finalized",
    description: "The 2026 'Sovereign AI' initiative kicks off with a massive data center in Gujarat.",
    sentiment: "BULLISH",
    timestamp: "45m ago",
    impactedSectors: ["Tech", "Cloud"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    category: "GLOBAL",
    title: "Crude Oil Spikes Amid Suez Congestion",
    description: "Supply chain fears return as 15 tankers are diverted; O&G stocks show immediate momentum.",
    sentiment: "NEGATIVE",
    timestamp: "1h ago",
    impactedSectors: ["Energy", "Logistics"],
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    category: "AUTO",
    title: "Tata Motors EV Sales Surge 40% YoY",
    description: "The Tiago.ev 2026 model dominates the budget segment, crushing competition.",
    sentiment: "BULLISH",
    timestamp: "2h ago",
    impactedSectors: ["Auto", "EV"],
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 5,
    category: "MACRO",
    title: "GST 2.0 Framework Draft Leaked",
    description: "Proposed 3-tier structure could simplify tax for SME sector significantly.",
    sentiment: "NEUTRAL",
    timestamp: "3h ago",
    impactedSectors: ["Retail", "SME"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 6,
    category: "PHARMA",
    title: "Sun Pharma Wins FDA Approval for New Oncology Drug",
    description: "Phase 3 results show 20% higher efficacy than current market leaders.",
    sentiment: "BULLISH",
    timestamp: "5h ago",
    impactedSectors: ["Healthcare", "Pharma"],
    image: "https://images.unsplash.com/photo-1587854680352-936b22b91030?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 7,
    category: "ENERGY",
    title: "Adani Green Hits 10GW Milestone",
    description: "Renewable giant stays ahead of schedule in its 2030 decarbonization roadmap.",
    sentiment: "BULLISH",
    timestamp: "6h ago",
    impactedSectors: ["Renewables", "Energy"],
    image: "https://images.unsplash.com/photo-1466611653911-954ffea1130d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 8,
    category: "GLOBAL",
    title: "US Fed Signals 'Higher for Longer' Stance",
    description: "Jerome Powell cites stubborn service inflation; IT exporters may face margin pressure.",
    sentiment: "NEGATIVE",
    timestamp: "8h ago",
    impactedSectors: ["IT Services", "Export"],
    image: "https://images.unsplash.com/photo-1611974715853-2b8ef9597394?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 9,
    category: "METALS",
    title: "JSW Steel to Acquire Australian Iron Mine",
    description: "Strategic move to secure raw material supply for the upcoming Vijayanagar expansion.",
    sentiment: "BULLISH",
    timestamp: "10h ago",
    impactedSectors: ["Metals", "Mining"],
    image: "https://images.unsplash.com/photo-1518709766631-a6a7f4e94b3d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 10,
    category: "RETAIL",
    title: "Zomato-Blinkit Integration Hits Record GMV",
    description: "Quick commerce adoption in Tier-2 cities exceeds analyst expectations by 15%.",
    sentiment: "BULLISH",
    timestamp: "12h ago",
    impactedSectors: ["Consumer Tech", "Logistics"],
    image: "https://images.unsplash.com/photo-1526367790999-0150786486a9?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 11,
    category: "HYPE",
    title: "India FinTech Week: IPO Pipeline Explodes",
    description: "7 major unicorns filed DRHP today, signaling a hot primary market for 2026.",
    sentiment: "BULLISH",
    timestamp: "1d ago",
    impactedSectors: ["FinTech", "IPO"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
  }
];

export const STOCK_PICKS = [
  {
    symbol: "HDFC",
    action: "STRONG BUY",
    target: "2,150",
    reason: "Low valuation relative to peers + improving NIMs.",
    confidence: 92,
    trend: "+4.2%",
    isUp: true
  },
  {
    symbol: "INFY",
    action: "HOLD",
    target: "1,850",
    reason: "Global tech spending is slowing; wait for lower entries.",
    confidence: 54,
    trend: "-1.8%",
    isUp: false
  },
  {
    symbol: "TCS",
    action: "ACCUMULATE",
    target: "4,400",
    reason: "Steady dividends and consistent deal wins provide a safety net.",
    confidence: 78,
    trend: "+0.5%",
    isUp: true
  },
  {
    symbol: "BAJAJFIN",
    action: "STRONG BUY",
    target: "8,200",
    reason: "Disruptive entry into the credit card market is paying off.",
    confidence: 89,
    trend: "+5.1%",
    isUp: true
  },
  {
    symbol: "LICI",
    action: "SELL",
    target: "850",
    reason: "Losing market share to private insurers in the high-ticket segment.",
    confidence: 42,
    trend: "-3.4%",
    isUp: false
  },
  {
    symbol: "WIPRO",
    action: "NEUTRAL",
    target: "520",
    reason: "Restructuring is still in progress; margins are yet to show recovery.",
    confidence: 60,
    trend: "0.0%",
    isUp: true
  }
];