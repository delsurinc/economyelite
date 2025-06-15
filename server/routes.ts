import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchQuerySchema, insertAnalysisResultSchema, insertNewsArticleSchema, insertChartAnalysisSchema } from "@shared/schema";
import { analyzeSentiment, analyzeChart, summarizeNews, translateText } from "./services/openai";
import { financialDataService } from "./services/financialData";
import { newsAggregatorService } from "./services/newsAggregator";
import { pdfGeneratorService } from "./services/pdfGenerator";
import multer from "multer";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Market overview endpoint
  app.get("/api/market-overview", async (req, res) => {
    try {
      const marketSentiment = await financialDataService.getMarketSentiment();
      res.json(marketSentiment);
    } catch (error) {
      console.error("Market overview error:", error);
      res.status(500).json({ error: "Failed to fetch market overview" });
    }
  });

  // Search and analyze endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const queryData = insertSearchQuerySchema.parse(req.body);
      const query = await storage.createSearchQuery(queryData);
      
      // Try to find the asset in both stocks and crypto
      let marketData = null;
      let finalAssetType = queryData.assetType;
      
      if (queryData.assetType === 'all') {
        // Try stocks first
        marketData = await financialDataService.getMarketData(queryData.symbol, 'stock');
        if (marketData) {
          finalAssetType = 'stock';
        } else {
          // Try crypto if not found in stocks
          marketData = await financialDataService.getMarketData(queryData.symbol, 'crypto');
          if (marketData) {
            finalAssetType = 'crypto';
          }
        }
      } else {
        // Use specified asset type
        finalAssetType = queryData.assetType || 'stock';
        marketData = await financialDataService.getMarketData(queryData.symbol, finalAssetType as 'stock' | 'crypto');
      }
      
      if (!marketData) {
        return res.status(404).json({ 
          error: "Asset not found", 
          message: `Could not find data for symbol "${queryData.symbol}". Available symbols include: AAPL, TSLA, MSFT, GOOGL, NVDA, BTC, ETH, SOL, ADA, DOT and more.`
        });
      }
      
      // Get technical indicators
      const technicalIndicators = await financialDataService.getTechnicalIndicators(queryData.symbol);
      
      // Aggregate news
      const rawNews = await newsAggregatorService.aggregateNews(
        queryData.symbol, 
        queryData.timeRange || '7d', 
        queryData.deepSearchEnabled || false
      );
      
      // Analyze sentiment for each news article
      const newsWithSentiment = await Promise.all(
        rawNews.map(async (article) => {
          const sentiment = await analyzeSentiment(article.content, queryData.symbol);
          const newsArticle = await storage.createNewsArticle({
            symbol: queryData.symbol,
            title: article.title,
            content: article.content,
            summary: article.content.substring(0, 200) + "...",
            sentiment: sentiment.sentiment,
            sentimentScore: sentiment.score / 100,
            source: article.source,
            url: article.url,
            publishedAt: article.publishedAt,
            originalLanguage: article.language || 'en'
          });
          return newsArticle;
        })
      );
      
      // Calculate sentiment percentages
      const totalNews = newsWithSentiment.length;
      const positiveCount = newsWithSentiment.filter(n => n.sentiment === 'positive').length;
      const neutralCount = newsWithSentiment.filter(n => n.sentiment === 'neutral').length;
      const negativeCount = newsWithSentiment.filter(n => n.sentiment === 'negative').length;
      
      const positivePercent = totalNews > 0 ? (positiveCount / totalNews) * 100 : 0;
      const neutralPercent = totalNews > 0 ? (neutralCount / totalNews) * 100 : 0;
      const negativePercent = totalNews > 0 ? (negativeCount / totalNews) * 100 : 0;
      
      // Get social media data
      const socialData = await newsAggregatorService.searchSocialMedia(queryData.symbol);
      const socialMetrics = socialData.reduce((acc, platform) => {
        if (platform.platform === 'twitter') acc.twitterMentions = platform.mentions;
        if (platform.platform === 'reddit') {
          acc.redditDiscussions = platform.discussions;
          acc.communityScore = platform.communityScore;
        }
        return acc;
      }, {} as any);
      
      // Calculate overall sentiment score
      const sentimentScore = positivePercent - negativePercent + 50; // Normalize to 0-100
      
      // Determine recommendation
      let recommendation = 'neutral';
      if (sentimentScore >= 65 && technicalIndicators.rsi < 70) recommendation = 'bullish';
      if (sentimentScore <= 35 || technicalIndicators.rsi > 80) recommendation = 'bearish';
      
      // Generate key insights
      const keyInsights = [];
      if (positivePercent > 60) keyInsights.push(`Strong positive sentiment with ${positivePercent.toFixed(1)}% positive news coverage`);
      if (technicalIndicators.rsi < 30) keyInsights.push('RSI indicates oversold conditions - potential buying opportunity');
      if (technicalIndicators.rsi > 70) keyInsights.push('RSI indicates overbought conditions - caution advised');
      if (technicalIndicators.volumeChange > 50) keyInsights.push(`Significantly increased trading volume (+${technicalIndicators.volumeChange.toFixed(1)}%)`);
      if (socialMetrics.twitterMentions > 2000) keyInsights.push('High social media engagement and community interest');
      
      // Create analysis result
      const analysisResult = await storage.createAnalysisResult({
        queryId: query.id,
        symbol: queryData.symbol,
        sentimentScore: sentimentScore,
        technicalIndicators: {
          rsi: technicalIndicators.rsi,
          macd: technicalIndicators.macd,
          volume: technicalIndicators.volume,
          volumeChange: technicalIndicators.volumeChange
        },
        newsCount: totalNews,
        positiveNewsPercent: positivePercent,
        neutralNewsPercent: neutralPercent,
        negativeNewsPercent: negativePercent,
        price: marketData.price,
        priceChange: marketData.changePercent,
        socialMetrics,
        recommendation,
        riskLevel: sentimentScore > 70 || technicalIndicators.rsi > 75 ? 'high' : sentimentScore < 30 ? 'high' : 'medium',
        keyInsights
      });
      
      res.json({
        query,
        analysisResult,
        marketData,
        technicalIndicators,
        newsArticles: newsWithSentiment,
        socialMetrics
      });
      
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Failed to perform analysis" });
    }
  });

  // Chart upload and analysis endpoint
  app.post("/api/analyze-chart", upload.single('chart'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No chart file uploaded" });
      }
      
      const { queryId, symbol } = req.body;
      if (!queryId || !symbol) {
        return res.status(400).json({ error: "Query ID and symbol are required" });
      }
      
      // Convert buffer to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Analyze chart with OpenAI
      const chartAnalysis = await analyzeChart(base64Image, symbol);
      
      // Store chart analysis
      const analysis = await storage.createChartAnalysis({
        queryId: parseInt(queryId),
        fileName: req.file.originalname,
        analysis: chartAnalysis
      });
      
      res.json(analysis);
      
    } catch (error) {
      console.error("Chart analysis error:", error);
      res.status(500).json({ error: "Failed to analyze chart" });
    }
  });

  // Generate report endpoint
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { queryId } = req.body;
      if (!queryId) {
        return res.status(400).json({ error: "Query ID is required" });
      }
      
      // Get analysis results
      const analysisResults = await storage.getAnalysisResultsByQuery(queryId);
      if (analysisResults.length === 0) {
        return res.status(404).json({ error: "No analysis results found" });
      }
      
      const analysisResult = analysisResults[0];
      const newsArticles = await storage.getNewsArticlesBySymbol(analysisResult.symbol);
      const chartAnalyses = await storage.getChartAnalysesByQuery(queryId);
      
      // Generate PDF report
      const reportData = {
        symbol: analysisResult.symbol,
        analysisResult,
        newsArticles,
        chartAnalyses,
        generatedAt: new Date()
      };
      
      const report = await pdfGeneratorService.generateReport(reportData);
      
      // Store report record
      await storage.createReport({
        queryId,
        fileName: report.fileName,
        filePath: report.filePath,
        reportData
      });
      
      // Send PDF as response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
      res.send(report.buffer);
      
    } catch (error) {
      console.error("Report generation error:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Search assets endpoint
  app.get("/api/search-assets", async (req, res) => {
    try {
      const { q, assetType } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await financialDataService.searchAssets(
        q, 
        assetType as 'all' | 'stocks' | 'crypto'
      );
      
      res.json(results);
      
    } catch (error) {
      console.error("Asset search error:", error);
      res.status(500).json({ error: "Failed to search assets" });
    }
  });

  // Get assets under price limit
  app.get("/api/assets-under-price", async (req, res) => {
    try {
      const { maxPrice, assetType } = req.query;
      if (!maxPrice || maxPrice === 'undefined') {
        return res.json([]); // Return empty array instead of error
      }
      
      const price = parseFloat(maxPrice as string);
      if (isNaN(price)) {
        return res.json([]);
      }
      
      const assets = await financialDataService.getAssetsUnderPrice(
        price,
        assetType as 'all' | 'stocks' | 'crypto' || 'all'
      );
      
      res.json(assets);
      
    } catch (error) {
      console.error("Price filter error:", error);
      res.json([]); // Return empty array instead of error
    }
  });

  // Translation endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage } = req.body;
      if (!text || !targetLanguage) {
        return res.status(400).json({ error: "Text and target language are required" });
      }
      
      const translatedText = await translateText(text, targetLanguage);
      res.json({ translatedText });
      
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Failed to translate text" });
    }
  });

  // Get latest news
  app.get("/api/news/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const newsArticles = await storage.getNewsArticlesBySymbol(symbol, 10);
      res.json(newsArticles);
    } catch (error) {
      console.error("News fetch error:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
