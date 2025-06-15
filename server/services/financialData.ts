export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  volume: number;
  volumeChange: number;
  sma20?: number;
  sma50?: number;
  support?: number;
  resistance?: number;
}

export interface MarketSentiment {
  overall: number; // 0-100
  stocks: number;
  crypto: number;
  fearGreedIndex?: number;
}

// Mock data service - in production, this would integrate with real APIs
export class FinancialDataService {
  private mockStockData: Record<string, MarketData> = {
    'AAPL': {
      symbol: 'AAPL',
      price: 175.43,
      change: 2.15,
      changePercent: 1.24,
      volume: 52847392,
      marketCap: 2750000000000,
      high24h: 176.80,
      low24h: 172.90
    },
    'TSLA': {
      symbol: 'TSLA',
      price: 238.45,
      change: -5.32,
      changePercent: -2.18,
      volume: 89234567,
      marketCap: 755000000000,
      high24h: 245.20,
      low24h: 235.10
    },
    'MSFT': {
      symbol: 'MSFT',
      price: 378.92,
      change: 4.67,
      changePercent: 1.25,
      volume: 28934512,
      marketCap: 2810000000000,
      high24h: 380.50,
      low24h: 375.20
    }
  };

  private mockCryptoData: Record<string, MarketData> = {
    'BTC': {
      symbol: 'BTC',
      price: 43567.89,
      change: 1234.56,
      changePercent: 2.92,
      volume: 28394756123,
      marketCap: 850000000000,
      high24h: 44200.00,
      low24h: 42800.00
    },
    'ETH': {
      symbol: 'ETH',
      price: 2345.67,
      change: -89.45,
      changePercent: -3.67,
      volume: 15678934567,
      marketCap: 282000000000,
      high24h: 2420.00,
      low24h: 2330.00
    },
    'ADA': {
      symbol: 'ADA',
      price: 0.45,
      change: 0.023,
      changePercent: 5.38,
      volume: 567894123,
      marketCap: 15800000000,
      high24h: 0.47,
      low24h: 0.42
    }
  };

  async getMarketData(symbol: string, assetType: 'stock' | 'crypto'): Promise<MarketData | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const data = assetType === 'stock' 
      ? this.mockStockData[symbol.toUpperCase()]
      : this.mockCryptoData[symbol.toUpperCase()];
    
    return data || null;
  }

  async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicators> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Generate realistic but mock technical indicators
    const basePrice = 100 + Math.random() * 300;
    return {
      rsi: 30 + Math.random() * 40, // RSI between 30-70
      macd: (Math.random() - 0.5) * 2, // MACD between -1 and 1
      volume: Math.floor(1000000 + Math.random() * 50000000),
      volumeChange: (Math.random() - 0.3) * 100, // Volume change -30% to +70%
      sma20: basePrice * (0.95 + Math.random() * 0.1),
      sma50: basePrice * (0.90 + Math.random() * 0.15),
      support: basePrice * (0.85 + Math.random() * 0.1),
      resistance: basePrice * (1.05 + Math.random() * 0.1)
    };
  }

  async getMarketSentiment(): Promise<MarketSentiment> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      overall: 60 + Math.random() * 20, // 60-80% bullish
      stocks: 65 + Math.random() * 15, // 65-80% bullish
      crypto: 55 + Math.random() * 25, // 55-80% (more volatile)
      fearGreedIndex: 45 + Math.random() * 30 // 45-75
    };
  }

  async searchAssets(query: string, assetType: 'all' | 'stocks' | 'crypto' = 'all'): Promise<string[]> {
    const allStocks = Object.keys(this.mockStockData);
    const allCrypto = Object.keys(this.mockCryptoData);
    
    let searchPool: string[] = [];
    if (assetType === 'all') {
      searchPool = [...allStocks, ...allCrypto];
    } else if (assetType === 'stocks') {
      searchPool = allStocks;
    } else {
      searchPool = allCrypto;
    }
    
    const results = searchPool.filter(symbol => 
      symbol.toLowerCase().includes(query.toLowerCase())
    );
    
    return results.slice(0, 10); // Limit to 10 results
  }

  async getAssetsUnderPrice(maxPrice: number, assetType: 'all' | 'stocks' | 'crypto' = 'all'): Promise<MarketData[]> {
    let allData: MarketData[] = [];
    
    if (assetType === 'all' || assetType === 'stocks') {
      allData.push(...Object.values(this.mockStockData));
    }
    if (assetType === 'all' || assetType === 'crypto') {
      allData.push(...Object.values(this.mockCryptoData));
    }
    
    return allData.filter(asset => asset.price <= maxPrice);
  }
}

export const financialDataService = new FinancialDataService();
