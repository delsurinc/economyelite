import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisData, SearchParams } from "@/pages/Dashboard";

interface AnalysisResultsProps {
  data: AnalysisData;
  searchParams: SearchParams | null;
}

export default function AnalysisResults({ data, searchParams }: AnalysisResultsProps) {
  const { toast } = useToast();

  if (!data?.analysisResult) return null;

  const { analysisResult, marketData, technicalIndicators } = data;

  const generateReport = async () => {
    try {
      const response = await apiRequest("POST", "/api/generate-report", {
        queryId: data.query.id,
      });

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `economic-elite-report-${analysisResult.symbol}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Report Generated",
        description: "Your analysis report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "Report Generation Failed",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 60) return "text-green-400";
    if (score <= 40) return "text-red-400";
    return "text-yellow-400";
  };

  const getTechnicalColor = (value: number, indicator: string) => {
    if (indicator === "rsi") {
      if (value >= 70) return "text-red-400";
      if (value <= 30) return "text-green-400";
      return "text-yellow-400";
    }
    if (indicator === "macd") {
      return value > 0 ? "text-green-400" : "text-red-400";
    }
    if (indicator === "volume") {
      return value > 0 ? "text-green-400" : "text-red-400";
    }
    return "text-gray-300";
  };

  const getRSILabel = (rsi: number) => {
    if (rsi >= 70) return "Overbought";
    if (rsi <= 30) return "Oversold";
    return "Normal";
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === "bullish") return "bg-green-900 text-green-300";
    if (recommendation === "bearish") return "bg-red-900 text-red-300";
    return "bg-yellow-900 text-yellow-300";
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white">
          Analysis Results for {analysisResult.symbol}
        </h3>
        <Button
          onClick={generateReport}
          className="bg-elite-gold hover:bg-yellow-600 text-elite-navy font-semibold transition-colors"
        >
          <i className="fas fa-download mr-2"></i>
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Analysis */}
        <Card className="bg-elite-card border-elite-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Sentiment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Positive News</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${analysisResult.positiveNewsPercent || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-green-400 font-semibold min-w-[3rem]">
                    {(analysisResult.positiveNewsPercent || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Neutral News</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${analysisResult.neutralNewsPercent || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-yellow-400 font-semibold min-w-[3rem]">
                    {(analysisResult.neutralNewsPercent || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Negative News</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${analysisResult.negativeNewsPercent || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-red-400 font-semibold min-w-[3rem]">
                    {(analysisResult.negativeNewsPercent || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {analysisResult.keyInsights && analysisResult.keyInsights.length > 0 && (
              <div className="mt-6 p-4 bg-elite-blue rounded-lg">
                <h5 className="font-semibold text-elite-gold mb-2">Key Insights</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  {analysisResult.keyInsights.map((insight: string, index: number) => (
                    <li key={index}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Analysis */}
        <Card className="bg-elite-card border-elite-border">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              Technical Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {technicalIndicators?.rsi && (
                <div className="flex items-center justify-between p-3 bg-elite-blue rounded-lg">
                  <div>
                    <span className="text-gray-300 font-medium">RSI (14)</span>
                    <p className="text-xs text-gray-400">Relative Strength Index</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getTechnicalColor(technicalIndicators.rsi, "rsi")}`}>
                      {technicalIndicators.rsi.toFixed(1)}
                    </span>
                    <p className={`text-xs ${getTechnicalColor(technicalIndicators.rsi, "rsi")}`}>
                      {getRSILabel(technicalIndicators.rsi)}
                    </p>
                  </div>
                </div>
              )}

              {technicalIndicators?.macd !== undefined && (
                <div className="flex items-center justify-between p-3 bg-elite-blue rounded-lg">
                  <div>
                    <span className="text-gray-300 font-medium">MACD</span>
                    <p className="text-xs text-gray-400">Moving Average Convergence</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getTechnicalColor(technicalIndicators.macd, "macd")}`}>
                      {technicalIndicators.macd > 0 ? "+" : ""}{technicalIndicators.macd.toFixed(3)}
                    </span>
                    <p className={`text-xs ${getTechnicalColor(technicalIndicators.macd, "macd")}`}>
                      {technicalIndicators.macd > 0 ? "Bullish Signal" : "Bearish Signal"}
                    </p>
                  </div>
                </div>
              )}

              {technicalIndicators?.volumeChange !== undefined && (
                <div className="flex items-center justify-between p-3 bg-elite-blue rounded-lg">
                  <div>
                    <span className="text-gray-300 font-medium">Volume</span>
                    <p className="text-xs text-gray-400">24h Trading Volume</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${getTechnicalColor(technicalIndicators.volumeChange, "volume")}`}>
                      {technicalIndicators.volumeChange > 0 ? "+" : ""}{technicalIndicators.volumeChange.toFixed(1)}%
                    </span>
                    <p className={`text-xs ${getTechnicalColor(technicalIndicators.volumeChange, "volume")}`}>
                      {Math.abs(technicalIndicators.volumeChange) > 20 ? "High Activity" : "Normal Activity"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {analysisResult.recommendation && (
              <div className={`mt-6 p-4 border rounded-lg ${getRecommendationColor(analysisResult.recommendation)} border-current`}>
                <div className="flex items-center space-x-2 mb-2">
                  <i className={`fas ${analysisResult.recommendation === 'bullish' ? 'fa-arrow-trend-up' : analysisResult.recommendation === 'bearish' ? 'fa-arrow-trend-down' : 'fa-arrows-left-right'}`}></i>
                  <span className="font-semibold capitalize">
                    {analysisResult.recommendation} Prediction
                  </span>
                </div>
                <p className="text-sm">
                  {analysisResult.recommendation === 'bullish' && 
                    "Technical indicators and sentiment analysis suggest potential upward momentum."
                  }
                  {analysisResult.recommendation === 'bearish' && 
                    "Technical indicators and sentiment analysis suggest potential downward pressure."
                  }
                  {analysisResult.recommendation === 'neutral' && 
                    "Mixed signals from technical indicators and sentiment analysis - proceed with caution."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
