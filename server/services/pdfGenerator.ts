import { AnalysisResult, NewsArticle, ChartAnalysis } from "@shared/schema";

export interface ReportData {
  symbol: string;
  analysisResult: AnalysisResult;
  newsArticles: NewsArticle[];
  chartAnalyses: ChartAnalysis[];
  generatedAt: Date;
  userLanguage?: string;
}

export class PDFGeneratorService {
  async generateReport(data: ReportData): Promise<{ fileName: string; filePath: string; buffer: Buffer }> {
    // In a real implementation, this would use a PDF library like puppeteer, jsPDF, or PDFKit
    // For now, we'll create a simple HTML report that can be converted to PDF
    
    const htmlContent = this.generateHTMLReport(data);
    const fileName = `economic-elite-report-${data.symbol}-${Date.now()}.pdf`;
    const filePath = `/tmp/${fileName}`;
    
    // Mock PDF buffer - in production, this would be actual PDF generation
    const pdfBuffer = Buffer.from(htmlContent, 'utf8');
    
    return {
      fileName,
      filePath,
      buffer: pdfBuffer
    };
  }

  private generateHTMLReport(data: ReportData): string {
    const { symbol, analysisResult, newsArticles, chartAnalyses, generatedAt } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Economic Elite Analysis Report - ${symbol}</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a2e;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #d4af37;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            color: #d4af37;
            font-size: 2em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .tagline {
            color: #666;
            font-size: 0.9em;
        }
        .symbol-header {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
        }
        .symbol-header h1 {
            margin: 0;
            font-size: 2.5em;
            color: #d4af37;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .section h2 {
            color: #1a1a2e;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 10px;
        }
        .metric-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .metric {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }
        .metric-label {
            font-size: 0.9em;
            color: #666;
            margin-bottom: 5px;
        }
        .metric-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #1a1a2e;
        }
        .positive { color: #28a745; }
        .negative { color: #dc3545; }
        .neutral { color: #ffc107; }
        .news-item {
            border-left: 4px solid #d4af37;
            padding-left: 15px;
            margin-bottom: 15px;
        }
        .news-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .news-meta {
            font-size: 0.8em;
            color: #666;
            margin-bottom: 10px;
        }
        .disclaimer {
            background: #ffe6e6;
            border: 1px solid #ff9999;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .disclaimer h3 {
            color: #cc0000;
            margin-top: 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">Economic Elite</div>
        <div class="tagline">Advanced Financial Analysis Platform</div>
    </div>

    <div class="symbol-header">
        <h1>${symbol}</h1>
        <p>Comprehensive Analysis Report</p>
        <p style="font-size: 0.9em; opacity: 0.8;">Generated on ${generatedAt.toLocaleDateString()} at ${generatedAt.toLocaleTimeString()}</p>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <div class="metric-grid">
            <div class="metric">
                <div class="metric-label">Overall Sentiment</div>
                <div class="metric-value ${this.getSentimentClass(analysisResult.sentimentScore || 50)}">${(analysisResult.sentimentScore || 50).toFixed(1)}%</div>
            </div>
            <div class="metric">
                <div class="metric-label">Current Price</div>
                <div class="metric-value">$${(analysisResult.price || 0).toFixed(2)}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Recommendation</div>
                <div class="metric-value ${this.getRecommendationClass(analysisResult.recommendation || 'neutral')}">${(analysisResult.recommendation || 'neutral').toUpperCase()}</div>
            </div>
            <div class="metric">
                <div class="metric-label">Risk Level</div>
                <div class="metric-value">${(analysisResult.riskLevel || 'medium').toUpperCase()}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Technical Analysis</h2>
        <div class="metric-grid">
            ${analysisResult.technicalIndicators?.rsi ? `
            <div class="metric">
                <div class="metric-label">RSI (14)</div>
                <div class="metric-value ${this.getRSIClass(analysisResult.technicalIndicators.rsi)}">${analysisResult.technicalIndicators.rsi.toFixed(1)}</div>
            </div>
            ` : ''}
            ${analysisResult.technicalIndicators?.macd ? `
            <div class="metric">
                <div class="metric-label">MACD</div>
                <div class="metric-value ${analysisResult.technicalIndicators.macd > 0 ? 'positive' : 'negative'}">${analysisResult.technicalIndicators.macd.toFixed(3)}</div>
            </div>
            ` : ''}
            ${analysisResult.technicalIndicators?.volumeChange ? `
            <div class="metric">
                <div class="metric-label">Volume Change</div>
                <div class="metric-value ${analysisResult.technicalIndicators.volumeChange > 0 ? 'positive' : 'negative'}">${analysisResult.technicalIndicators.volumeChange.toFixed(1)}%</div>
            </div>
            ` : ''}
        </div>
    </div>

    <div class="section">
        <h2>Sentiment Breakdown</h2>
        <div class="metric-grid">
            <div class="metric">
                <div class="metric-label">Positive News</div>
                <div class="metric-value positive">${(analysisResult.positiveNewsPercent || 0).toFixed(1)}%</div>
            </div>
            <div class="metric">
                <div class="metric-label">Neutral News</div>
                <div class="metric-value neutral">${(analysisResult.neutralNewsPercent || 0).toFixed(1)}%</div>
            </div>
            <div class="metric">
                <div class="metric-label">Negative News</div>
                <div class="metric-value negative">${(analysisResult.negativeNewsPercent || 0).toFixed(1)}%</div>
            </div>
        </div>
    </div>

    ${analysisResult.keyInsights && analysisResult.keyInsights.length > 0 ? `
    <div class="section">
        <h2>Key Insights</h2>
        <ul>
            ${analysisResult.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
    </div>
    ` : ''}

    ${newsArticles.length > 0 ? `
    <div class="section">
        <h2>Recent News Analysis</h2>
        ${newsArticles.slice(0, 5).map(article => `
        <div class="news-item">
            <div class="news-title">${article.title}</div>
            <div class="news-meta">${article.source} • ${article.publishedAt?.toLocaleDateString()} • Sentiment: <span class="${this.getSentimentClass((article.sentimentScore || 50) * 100)}">${article.sentiment || 'neutral'}</span></div>
            ${article.summary ? `<p>${article.summary}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${chartAnalyses.length > 0 ? `
    <div class="section">
        <h2>Chart Analysis</h2>
        ${chartAnalyses.map(chart => `
        <div style="margin-bottom: 20px;">
            <h4>Chart: ${chart.fileName}</h4>
            ${chart.analysis?.prediction ? `<p><strong>Prediction:</strong> ${chart.analysis.prediction}</p>` : ''}
            ${chart.analysis?.trendDirection ? `<p><strong>Trend:</strong> ${chart.analysis.trendDirection}</p>` : ''}
            ${chart.analysis?.supportLevel ? `<p><strong>Support Level:</strong> $${chart.analysis.supportLevel}</p>` : ''}
            ${chart.analysis?.resistanceLevel ? `<p><strong>Resistance Level:</strong> $${chart.analysis.resistanceLevel}</p>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="disclaimer">
        <h3>⚠️ Important Disclaimer</h3>
        <p><strong>Not Financial Advice:</strong> This report is for informational purposes only and should not be considered as financial, investment, or trading advice.</p>
        <p><strong>Risk Warning:</strong> Trading and investing in stocks and cryptocurrencies carries significant risk of loss. Past performance does not guarantee future results.</p>
        <p><strong>Do Your Research:</strong> Always conduct your own research and consult with qualified financial advisors before making investment decisions.</p>
        <p><strong>Data Accuracy:</strong> While we strive for accuracy, market data and sentiment analysis may contain errors or delays.</p>
    </div>

    <div class="footer">
        <p>© 2024 Economic Elite. All rights reserved.</p>
        <p>This report was generated using advanced AI analysis and market data aggregation.</p>
    </div>
</body>
</html>
    `;
  }

  private getSentimentClass(score: number): string {
    if (score >= 60) return 'positive';
    if (score <= 40) return 'negative';
    return 'neutral';
  }

  private getRecommendationClass(recommendation: string): string {
    if (recommendation === 'bullish') return 'positive';
    if (recommendation === 'bearish') return 'negative';
    return 'neutral';
  }

  private getRSIClass(rsi: number): string {
    if (rsi >= 70) return 'negative'; // Overbought
    if (rsi <= 30) return 'positive'; // Oversold
    return 'neutral';
  }
}

export const pdfGeneratorService = new PDFGeneratorService();
