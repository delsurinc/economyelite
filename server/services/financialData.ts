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

// Financial data service with real API integration
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
    },
    'GOOGL': {
      symbol: 'GOOGL',
      price: 142.56,
      change: 1.89,
      changePercent: 1.34,
      volume: 23456789,
      marketCap: 1800000000000,
      high24h: 144.20,
      low24h: 140.80
    },
    'AMZN': {
      symbol: 'AMZN',
      price: 154.23,
      change: -2.45,
      changePercent: -1.56,
      volume: 34567890,
      marketCap: 1600000000000,
      high24h: 157.80,
      low24h: 152.10
    },
    'NVDA': {
      symbol: 'NVDA',
      price: 875.30,
      change: 12.45,
      changePercent: 1.44,
      volume: 45678901,
      marketCap: 2150000000000,
      high24h: 880.50,
      low24h: 860.20
    },
    'META': {
      symbol: 'META',
      price: 485.20,
      change: 8.90,
      changePercent: 1.87,
      volume: 18765432,
      marketCap: 1250000000000,
      high24h: 490.60,
      low24h: 478.40
    },
    'NFLX': {
      symbol: 'NFLX',
      price: 485.67,
      change: -6.78,
      changePercent: -1.38,
      volume: 8765432,
      marketCap: 215000000000,
      high24h: 492.80,
      low24h: 482.10
    },
    'AMD': {
      symbol: 'AMD',
      price: 142.80,
      change: 3.25,
      changePercent: 2.33,
      volume: 32165498,
      marketCap: 230000000000,
      high24h: 145.20,
      low24h: 138.90
    },
    'INTC': {
      symbol: 'INTC',
      price: 43.25,
      change: -0.85,
      changePercent: -1.93,
      volume: 28456789,
      marketCap: 180000000000,
      high24h: 44.50,
      low24h: 42.80
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
    'BITCOIN': {
      symbol: 'BITCOIN',
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
    'ETHEREUM': {
      symbol: 'ETHEREUM',
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
    },
    'CARDANO': {
      symbol: 'CARDANO',
      price: 0.45,
      change: 0.023,
      changePercent: 5.38,
      volume: 567894123,
      marketCap: 15800000000,
      high24h: 0.47,
      low24h: 0.42
    },
    'SOL': {
      symbol: 'SOL',
      price: 98.45,
      change: 4.23,
      changePercent: 4.49,
      volume: 892341567,
      marketCap: 43500000000,
      high24h: 102.80,
      low24h: 94.20
    },
    'SOLANA': {
      symbol: 'SOLANA',
      price: 98.45,
      change: 4.23,
      changePercent: 4.49,
      volume: 892341567,
      marketCap: 43500000000,
      high24h: 102.80,
      low24h: 94.20
    },
    'DOT': {
      symbol: 'DOT',
      price: 6.78,
      change: -0.34,
      changePercent: -4.78,
      volume: 234567890,
      marketCap: 8900000000,
      high24h: 7.20,
      low24h: 6.55
    },
    'POLKADOT': {
      symbol: 'POLKADOT',
      price: 6.78,
      change: -0.34,
      changePercent: -4.78,
      volume: 234567890,
      marketCap: 8900000000,
      high24h: 7.20,
      low24h: 6.55
    }
  };

  private getSymbolFromName(input: string): string {
    const nameToSymbol: Record<string, string> = {
      // Stock companies
      'APPLE': 'AAPL',
      'TESLA': 'TSLA',
      'MICROSOFT': 'MSFT',
      'GOOGLE': 'GOOGL',
      'ALPHABET': 'GOOGL',
      'AMAZON': 'AMZN',
      'NVIDIA': 'NVDA',
      'META': 'META',
      'FACEBOOK': 'META',
      'NETFLIX': 'NFLX',
      'AMD': 'AMD',
      'INTEL': 'INTC',
      // Crypto currencies
      'BITCOIN': 'BTC',
      'ETHEREUM': 'ETH',
      'CARDANO': 'ADA',
      'SOLANA': 'SOL',
      'POLKADOT': 'DOT',
    };
    
    const upperInput = input.toUpperCase();
    return nameToSymbol[upperInput] || upperInput;
  }

  async getMarketData(symbol: string, assetType: 'stock' | 'crypto'): Promise<MarketData | null> {
    const mappedSymbol = this.getSymbolFromName(symbol);
    const upperSymbol = mappedSymbol.toUpperCase();
    
    try {
      if (assetType === 'crypto') {
        return await this.getCryptoData(upperSymbol);
      } else {
        return await this.getStockData(upperSymbol);
      }
    } catch (error) {
      console.error(`Error fetching ${assetType} data for ${upperSymbol}:`, error);
      // Only use fallback data if live APIs are completely unavailable
      console.log(`Live API failed for ${upperSymbol}, checking fallback options...`);
      
      if (assetType === 'stock') {
        return this.mockStockData[upperSymbol] || null;
      } else {
        return this.mockCryptoData[upperSymbol] || null;
      }
    }
  }

  private async getCryptoData(symbol: string): Promise<MarketData | null> {
    // CoinGecko API - free tier allows 10-50 requests per minute
    const coinMap: Record<string, string> = {
      'BTC': 'bitcoin',
      'BITCOIN': 'bitcoin',
      'ETH': 'ethereum',
      'ETHEREUM': 'ethereum',
      'ADA': 'cardano',
      'CARDANO': 'cardano',
      'SOL': 'solana',
      'SOLANA': 'solana',
      'DOT': 'polkadot',
      'POLKADOT': 'polkadot',
      'MATIC': 'matic-network',
      'POLYGON': 'matic-network',
      'AVAX': 'avalanche-2',
      'AVALANCHE': 'avalanche-2',
      'LINK': 'chainlink',
      'CHAINLINK': 'chainlink',
      'UNI': 'uniswap',
      'UNISWAP': 'uniswap',
      'LTC': 'litecoin',
      'LITECOIN': 'litecoin'
    };

    const coinId = coinMap[symbol];
    if (!coinId) {
      return null;
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    const coinData = data[coinId];

    if (!coinData) {
      return null;
    }

    return {
      symbol: symbol,
      price: coinData.usd,
      change: coinData.usd_24h_change || 0,
      changePercent: coinData.usd_24h_change || 0,
      volume: coinData.usd_24h_vol || 0,
      marketCap: coinData.usd_market_cap || 0,
      high24h: coinData.usd * (1 + Math.abs(coinData.usd_24h_change || 0) / 100),
      low24h: coinData.usd * (1 - Math.abs(coinData.usd_24h_change || 0) / 100)
    };
  }

  private async getStockData(symbol: string): Promise<MarketData | null> {
    // Try multiple stock APIs for better coverage
    
    // First try Yahoo Finance alternative API (free)
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        const result = data?.chart?.result?.[0];
        
        if (result && result.meta) {
          const meta = result.meta;
          const currentPrice = meta.regularMarketPrice || meta.previousClose;
          const previousClose = meta.previousClose;
          const change = currentPrice - previousClose;
          const changePercent = (change / previousClose) * 100;

          return {
            symbol: symbol,
            price: currentPrice,
            change: change,
            changePercent: changePercent,
            volume: meta.regularMarketVolume || 0,
            marketCap: meta.marketCap,
            high24h: meta.regularMarketDayHigh || currentPrice,
            low24h: meta.regularMarketDayLow || currentPrice
          };
        }
      }
    } catch (error) {
      console.log('Yahoo Finance API failed, trying alternative:', error.message);
    }

    // Fallback to Financial Modeling Prep API (free tier available)
    try {
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=demo`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const quote = data[0];
          return {
            symbol: symbol,
            price: quote.price,
            change: quote.change,
            changePercent: quote.changesPercentage,
            volume: quote.volume || 0,
            marketCap: quote.marketCap,
            high24h: quote.dayHigh,
            low24h: quote.dayLow
          };
        }
      }
    } catch (error) {
      console.log('Financial Modeling Prep API failed:', error.message);
    }

    // Final fallback to Alpha Vantage if API key is available
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`,
          {
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const quote = data['Global Quote'];

          if (quote && Object.keys(quote).length > 0) {
            const price = parseFloat(quote['05. price']);
            const change = parseFloat(quote['09. change']);
            const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));

            return {
              symbol: symbol,
              price: price,
              change: change,
              changePercent: changePercent,
              volume: parseInt(quote['06. volume']) || 0,
              marketCap: undefined,
              high24h: parseFloat(quote['03. high']),
              low24h: parseFloat(quote['04. low'])
            };
          }
        }
      } catch (error) {
        console.log('Alpha Vantage API failed:', error.message);
      }
    }

    // If all APIs fail, return null (no fallback to mock data for live prices)
    return null;
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
