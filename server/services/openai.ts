import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface SentimentAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // 0-100
  confidence: number; // 0-1
  keyPoints: string[];
}

export interface ChartAnalysisResult {
  supportLevel?: number;
  resistanceLevel?: number;
  trendDirection: string;
  rsi?: number;
  macd?: number;
  volume?: string;
  prediction: string;
  confidence: number;
  keyFindings: string[];
}

export async function analyzeSentiment(text: string, symbol?: string): Promise<SentimentAnalysis> {
  try {
    const prompt = `Analyze the sentiment of this financial news/content about ${symbol || 'the asset'}. 
    Consider market impact, investor sentiment, and financial implications.
    
    Content: ${text}
    
    Respond with JSON in this exact format:
    {
      "sentiment": "positive|negative|neutral",
      "score": <number 0-100>,
      "confidence": <number 0-1>,
      "keyPoints": ["point1", "point2", "point3"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial sentiment analysis expert. Analyze sentiment with focus on market impact and investor psychology."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      sentiment: result.sentiment || 'neutral',
      score: Math.max(0, Math.min(100, result.score || 50)),
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      keyPoints: result.keyPoints || []
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return {
      sentiment: 'neutral',
      score: 50,
      confidence: 0.1,
      keyPoints: ['Analysis unavailable due to technical error']
    };
  }
}

export async function analyzeChart(base64Image: string, symbol: string): Promise<ChartAnalysisResult> {
  try {
    const prompt = `Analyze this trading chart for ${symbol}. Focus on:
    1. Technical indicators (RSI, MACD, Volume)
    2. Support and resistance levels
    3. Trend direction and momentum
    4. Price prediction with confidence level
    
    Provide specific numerical values where visible and actionable insights.
    
    Respond with JSON in this exact format:
    {
      "supportLevel": <number or null>,
      "resistanceLevel": <number or null>,
      "trendDirection": "bullish|bearish|sideways",
      "rsi": <number or null>,
      "macd": <number or null>,
      "volume": "high|normal|low",
      "prediction": "detailed prediction text",
      "confidence": <number 0-1>,
      "keyFindings": ["finding1", "finding2", "finding3"]
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional technical analyst with expertise in reading trading charts and identifying patterns, support/resistance levels, and technical indicators."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      supportLevel: result.supportLevel,
      resistanceLevel: result.resistanceLevel,
      trendDirection: result.trendDirection || 'sideways',
      rsi: result.rsi,
      macd: result.macd,
      volume: result.volume || 'normal',
      prediction: result.prediction || 'No clear prediction available from chart analysis.',
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      keyFindings: result.keyFindings || []
    };
  } catch (error) {
    console.error('Chart analysis error:', error);
    return {
      trendDirection: 'sideways',
      prediction: 'Chart analysis unavailable due to technical error.',
      confidence: 0.1,
      keyFindings: ['Analysis unavailable - please try uploading the chart again']
    };
  }
}

export async function summarizeNews(articles: string[], symbol: string): Promise<string> {
  try {
    const combinedText = articles.join('\n\n');
    
    const prompt = `Summarize the key news and developments for ${symbol} based on these articles. 
    Focus on market-moving events, partnerships, earnings, regulatory changes, and other significant developments.
    
    Articles:
    ${combinedText}
    
    Provide a concise but comprehensive summary highlighting the most important points for investors.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a financial news analyst who creates clear, concise summaries focusing on market impact and investment implications."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    return response.choices[0].message.content || 'News summary unavailable.';
  } catch (error) {
    console.error('News summarization error:', error);
    return 'News summary unavailable due to technical error.';
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const prompt = `Translate the following financial content to ${targetLanguage}. 
    Maintain technical accuracy and financial terminology.
    
    Content: ${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional financial translator who maintains accuracy of technical terms and market terminology."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: Math.max(500, text.length * 2),
      temperature: 0.1,
    });

    return response.choices[0].message.content || text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}
