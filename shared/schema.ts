import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  preferredLanguage: text("preferred_language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchQueries = pgTable("search_queries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  symbol: text("symbol").notNull(),
  assetType: text("asset_type").notNull(), // 'stock' or 'crypto'
  priceLimit: real("price_limit"),
  deepSearchEnabled: boolean("deep_search_enabled").default(false),
  timeRange: text("time_range").default("7d"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  queryId: integer("query_id").notNull(),
  symbol: text("symbol").notNull(),
  sentimentScore: real("sentiment_score"),
  technicalIndicators: jsonb("technical_indicators").$type<{
    rsi?: number;
    macd?: number;
    volume?: number;
    volumeChange?: number;
  }>(),
  newsCount: integer("news_count").default(0),
  positiveNewsPercent: real("positive_news_percent"),
  neutralNewsPercent: real("neutral_news_percent"),
  negativeNewsPercent: real("negative_news_percent"),
  price: real("price"),
  priceChange: real("price_change"),
  socialMetrics: jsonb("social_metrics").$type<{
    twitterMentions?: number;
    redditDiscussions?: number;
    communityScore?: number;
  }>(),
  recommendation: text("recommendation"), // 'bullish', 'bearish', 'neutral'
  riskLevel: text("risk_level"), // 'low', 'medium', 'high'
  keyInsights: text("key_insights").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  title: text("title").notNull(),
  content: text("content"),
  summary: text("summary"),
  sentiment: text("sentiment"), // 'positive', 'negative', 'neutral'
  sentimentScore: real("sentiment_score"),
  source: text("source").notNull(),
  url: text("url"),
  publishedAt: timestamp("published_at"),
  originalLanguage: text("original_language"),
  translatedContent: text("translated_content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chartAnalyses = pgTable("chart_analyses", {
  id: serial("id").primaryKey(),
  queryId: integer("query_id").notNull(),
  fileName: text("file_name").notNull(),
  analysis: jsonb("analysis").$type<{
    supportLevel?: number;
    resistanceLevel?: number;
    trendDirection?: string;
    rsi?: number;
    macd?: number;
    volume?: string;
    prediction?: string;
    confidence?: number;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  queryId: integer("query_id").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  reportData: jsonb("report_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  createdAt: true,
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertChartAnalysisSchema = createInsertSchema(chartAnalyses).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;

export type AnalysisResult = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type ChartAnalysis = typeof chartAnalyses.$inferSelect;
export type InsertChartAnalysis = z.infer<typeof insertChartAnalysisSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
