import { 
  users, searchQueries, analysisResults, newsArticles, chartAnalyses, reports,
  type User, type InsertUser, 
  type SearchQuery, type InsertSearchQuery,
  type AnalysisResult, type InsertAnalysisResult,
  type NewsArticle, type InsertNewsArticle,
  type ChartAnalysis, type InsertChartAnalysis,
  type Report, type InsertReport
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Search Queries
  createSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  getSearchQuery(id: number): Promise<SearchQuery | undefined>;

  // Analysis Results
  createAnalysisResult(analysis: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysisResultsByQuery(queryId: number): Promise<AnalysisResult[]>;
  getLatestAnalysisResults(limit?: number): Promise<AnalysisResult[]>;

  // News Articles
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getNewsArticlesBySymbol(symbol: string, limit?: number): Promise<NewsArticle[]>;
  getLatestNews(limit?: number): Promise<NewsArticle[]>;

  // Chart Analyses
  createChartAnalysis(analysis: InsertChartAnalysis): Promise<ChartAnalysis>;
  getChartAnalysesByQuery(queryId: number): Promise<ChartAnalysis[]>;

  // Reports
  createReport(report: InsertReport): Promise<Report>;
  getReportsByQuery(queryId: number): Promise<Report[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private searchQueries: Map<number, SearchQuery> = new Map();
  private analysisResults: Map<number, AnalysisResult> = new Map();
  private newsArticles: Map<number, NewsArticle> = new Map();
  private chartAnalyses: Map<number, ChartAnalysis> = new Map();
  private reports: Map<number, Report> = new Map();
  
  private currentUserId = 1;
  private currentSearchQueryId = 1;
  private currentAnalysisResultId = 1;
  private currentNewsArticleId = 1;
  private currentChartAnalysisId = 1;
  private currentReportId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async createSearchQuery(insertQuery: InsertSearchQuery): Promise<SearchQuery> {
    const query: SearchQuery = {
      ...insertQuery,
      id: this.currentSearchQueryId++,
      createdAt: new Date(),
    };
    this.searchQueries.set(query.id, query);
    return query;
  }

  async getSearchQuery(id: number): Promise<SearchQuery | undefined> {
    return this.searchQueries.get(id);
  }

  async createAnalysisResult(insertAnalysis: InsertAnalysisResult): Promise<AnalysisResult> {
    const analysis: AnalysisResult = {
      ...insertAnalysis,
      id: this.currentAnalysisResultId++,
      createdAt: new Date(),
    };
    this.analysisResults.set(analysis.id, analysis);
    return analysis;
  }

  async getAnalysisResultsByQuery(queryId: number): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values())
      .filter(result => result.queryId === queryId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getLatestAnalysisResults(limit = 10): Promise<AnalysisResult[]> {
    return Array.from(this.analysisResults.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const article: NewsArticle = {
      ...insertArticle,
      id: this.currentNewsArticleId++,
      createdAt: new Date(),
    };
    this.newsArticles.set(article.id, article);
    return article;
  }

  async getNewsArticlesBySymbol(symbol: string, limit = 20): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values())
      .filter(article => article.symbol.toLowerCase() === symbol.toLowerCase())
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async getLatestNews(limit = 50): Promise<NewsArticle[]> {
    return Array.from(this.newsArticles.values())
      .sort((a, b) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))
      .slice(0, limit);
  }

  async createChartAnalysis(insertAnalysis: InsertChartAnalysis): Promise<ChartAnalysis> {
    const analysis: ChartAnalysis = {
      ...insertAnalysis,
      id: this.currentChartAnalysisId++,
      createdAt: new Date(),
    };
    this.chartAnalyses.set(analysis.id, analysis);
    return analysis;
  }

  async getChartAnalysesByQuery(queryId: number): Promise<ChartAnalysis[]> {
    return Array.from(this.chartAnalyses.values())
      .filter(analysis => analysis.queryId === queryId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const report: Report = {
      ...insertReport,
      id: this.currentReportId++,
      createdAt: new Date(),
    };
    this.reports.set(report.id, report);
    return report;
  }

  async getReportsByQuery(queryId: number): Promise<Report[]> {
    return Array.from(this.reports.values())
      .filter(report => report.queryId === queryId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
}

export const storage = new MemStorage();
