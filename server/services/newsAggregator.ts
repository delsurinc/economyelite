export interface NewsSource {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
}

export interface RawNewsArticle {
  title: string;
  content: string;
  url: string;
  source: string;
  publishedAt: Date;
  language?: string;
}

// Mock news service - in production, this would integrate with real news APIs
export class NewsAggregatorService {
  private mockNews: Record<string, RawNewsArticle[]> = {
    'AAPL': [
      {
        title: 'Apple Announces Strategic Partnership with Leading AI Company',
        content: 'Apple Inc. today announced a major strategic partnership that is expected to boost revenue by 25% over the next two years. The collaboration focuses on integrating advanced AI capabilities into Apple\'s ecosystem.',
        url: 'https://example.com/apple-partnership',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        language: 'en'
      },
      {
        title: 'Q3 Earnings Beat Expectations with 18% Revenue Growth',
        content: 'Apple reported strong quarterly results showing 18% revenue growth, surpassing analyst predictions. The company attributed growth to strong iPhone sales and services revenue.',
        url: 'https://example.com/apple-earnings',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        language: 'en'
      },
      {
        title: 'New Product Launch Announcement Drives Market Enthusiasm',
        content: 'Apple unveiled its latest product innovation with pre-orders exceeding expectations. The new device features groundbreaking technology and is scheduled for release next quarter.',
        url: 'https://example.com/apple-product',
        source: 'TechCrunch',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        language: 'en'
      }
    ],
    'BTC': [
      {
        title: 'Bitcoin Adoption Surges Among Institutional Investors',
        content: 'Major financial institutions continue to increase their Bitcoin holdings, with total institutional ownership reaching new highs. This trend reflects growing confidence in cryptocurrency as a store of value.',
        url: 'https://example.com/btc-institutional',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        language: 'en'
      },
      {
        title: 'Regulatory Clarity Brings Positive Sentiment to Crypto Markets',
        content: 'Recent regulatory announcements have provided much-needed clarity for the cryptocurrency market, leading to increased trading volume and positive price action across major cryptocurrencies.',
        url: 'https://example.com/btc-regulation',
        source: 'CryptoNews',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        language: 'en'
      }
    ],
    'TSLA': [
      {
        title: 'Tesla Reports Record Deliveries Despite Market Challenges',
        content: 'Tesla achieved record vehicle deliveries this quarter, demonstrating strong demand for electric vehicles. The company continues to expand its global manufacturing footprint.',
        url: 'https://example.com/tesla-deliveries',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        language: 'en'
      }
    ],
    'ADA': [
      {
        title: 'Cardano Ecosystem Shows Strong Growth in DeFi Applications',
        content: 'The Cardano blockchain has seen significant growth in decentralized finance applications, with total value locked increasing by 40% this quarter.',
        url: 'https://example.com/ada-defi',
        source: 'CoinTelegraph',
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        language: 'en'
      },
      {
        title: 'Major Partnership Announcement Boosts Cardano Adoption',
        content: 'Cardano announces strategic partnership with leading enterprise software company, expanding real-world blockchain applications.',
        url: 'https://example.com/ada-partnership',
        source: 'CryptoNews',
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        language: 'en'
      }
    ],
    'DOGE': [
      {
        title: 'Dogecoin Sees Increased Adoption in Payment Processing',
        content: 'Several major payment processors announce support for Dogecoin, leading to increased transaction volume and positive market sentiment.',
        url: 'https://example.com/doge-payments',
        source: 'CoinDesk',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        language: 'en'
      }
    ],
    'XRP': [
      {
        title: 'Ripple Legal Victory Boosts XRP Market Confidence',
        content: 'Recent legal developments favor Ripple in ongoing regulatory discussions, leading to increased investor confidence and trading volume.',
        url: 'https://example.com/xrp-legal',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        language: 'en'
      }
    ]
  };

  async aggregateNews(symbol: string, timeRange: string = '7d', deepSearch: boolean = false): Promise<RawNewsArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, deepSearch ? 1000 : 300));
    
    const articles = this.mockNews[symbol.toUpperCase()] || [];
    
    // Filter by time range
    const cutoffTime = this.getTimeRangeCutoff(timeRange);
    const filteredArticles = articles.filter(article => 
      article.publishedAt >= cutoffTime
    );
    
    // If deep search is enabled, simulate finding more articles
    if (deepSearch && filteredArticles.length > 0) {
      const additionalArticles = this.generateAdditionalArticles(symbol, filteredArticles.length);
      return [...filteredArticles, ...additionalArticles];
    }
    
    return filteredArticles;
  }

  async searchSocialMedia(symbol: string, platforms: string[] = ['twitter', 'reddit']): Promise<any[]> {
    // Simulate social media API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock social media data
    return [
      {
        platform: 'twitter',
        mentions: 2847 + Math.floor(Math.random() * 1000),
        change: 23 + Math.floor(Math.random() * 20),
        sentiment: 'positive',
        trendingTopics: ['#Partnership', '#Innovation', '#Growth', '#Bullish']
      },
      {
        platform: 'reddit',
        discussions: 156 + Math.floor(Math.random() * 100),
        change: 8 + Math.floor(Math.random() * 15),
        sentiment: 'positive',
        communityScore: 8.4 + Math.random() * 1.5
      }
    ];
  }

  private getTimeRangeCutoff(timeRange: string): Date {
    const now = new Date();
    switch (timeRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
  }

  private generateAdditionalArticles(symbol: string, baseCount: number): RawNewsArticle[] {
    const templates = [
      {
        title: `${symbol} Shows Strong Technical Momentum`,
        content: `Technical analysis indicates strong momentum for ${symbol} with key indicators showing bullish signals.`,
        source: 'MarketWatch'
      },
      {
        title: `Analyst Upgrades ${symbol} Price Target`,
        content: `Leading financial analysts have upgraded their price targets for ${symbol} citing strong fundamentals.`,
        source: 'Financial Times'
      },
      {
        title: `${symbol} Trading Volume Spikes on Positive News`,
        content: `Trading volume for ${symbol} has increased significantly following recent positive developments.`,
        source: 'Yahoo Finance'
      }
    ];

    return templates.slice(0, Math.min(2, templates.length)).map((template, index) => ({
      title: template.title,
      content: template.content,
      url: `https://example.com/${symbol.toLowerCase()}-news-${baseCount + index}`,
      source: template.source,
      publishedAt: new Date(Date.now() - (7 + index) * 60 * 60 * 1000),
      language: 'en'
    }));
  }
}

export const newsAggregatorService = new NewsAggregatorService();
