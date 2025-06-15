import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { apiRequest } from "@/lib/queryClient";

interface ChartUploadProps {
  queryId?: number;
  symbol?: string;
}

interface ChartAnalysisResult {
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

export default function ChartUpload({ queryId, symbol }: ChartUploadProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ChartAnalysisResult | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!queryId || !symbol) {
      toast({
        title: "Error",
        description: "Please run an analysis first before uploading charts",
        variant: "destructive",
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("chart", file);
      formData.append("queryId", queryId.toString());
      formData.append("symbol", symbol);

      const response = await fetch("/api/analyze-chart", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data.analysis);

      toast({
        title: "Chart Analysis Complete",
        description: "Your chart has been analyzed successfully",
      });
    } catch (error) {
      console.error("Chart analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the chart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [queryId, symbol, toast]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const getTrendColor = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'bullish':
        return 'text-green-400';
      case 'bearish':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend?.toLowerCase()) {
      case 'bullish':
        return 'fa-arrow-trend-up';
      case 'bearish':
        return 'fa-arrow-trend-down';
      default:
        return 'fa-arrows-left-right';
    }
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6">Chart Analysis</h3>
      <Card className="bg-elite-card border-elite-border">
        <CardHeader>
          <CardTitle className="text-white">Upload Chart Screenshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
              ${isDragActive ? 'border-elite-gold bg-elite-gold/5' : 'border-elite-border'}
              ${isDragReject ? 'border-red-500 bg-red-500/5' : ''}
              ${isAnalyzing ? 'pointer-events-none opacity-50' : 'hover:border-elite-gold hover:bg-elite-gold/5'}
            `}
          >
            <input {...getInputProps()} />
            
            {isAnalyzing ? (
              <>
                <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
                <h4 className="text-lg font-semibold text-gray-300 mb-2">
                  Analyzing Chart...
                </h4>
                <p className="text-gray-400">
                  Our AI is analyzing your chart for technical indicators and patterns
                </p>
              </>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                <h4 className="text-lg font-semibold text-gray-300 mb-2">
                  {isDragActive ? 'Drop your chart here' : 'Upload Chart Screenshot'}
                </h4>
                <p className="text-gray-400 mb-4">
                  Drop your TradingView or chart screenshot here for AI analysis
                </p>
                <Button 
                  variant="outline" 
                  className="border-elite-gold text-elite-gold hover:bg-elite-gold hover:text-elite-navy"
                >
                  Choose File
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Supports JPG, PNG up to 10MB
                </p>
              </>
            )}
          </div>

          {analysisResult && (
            <div className="mt-6 p-4 bg-elite-blue rounded-lg">
              <h5 className="font-semibold text-elite-gold mb-4 flex items-center">
                <i className="fas fa-chart-area mr-2"></i>
                Chart Analysis Results
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                {analysisResult.supportLevel && (
                  <div>
                    <span className="text-gray-400">Support Level:</span>
                    <p className="text-white font-semibold">
                      ${analysisResult.supportLevel.toFixed(2)}
                    </p>
                  </div>
                )}
                
                {analysisResult.resistanceLevel && (
                  <div>
                    <span className="text-gray-400">Resistance Level:</span>
                    <p className="text-white font-semibold">
                      ${analysisResult.resistanceLevel.toFixed(2)}
                    </p>
                  </div>
                )}
                
                <div>
                  <span className="text-gray-400">Trend Direction:</span>
                  <p className={`font-semibold flex items-center ${getTrendColor(analysisResult.trendDirection)}`}>
                    <i className={`fas ${getTrendIcon(analysisResult.trendDirection)} mr-1`}></i>
                    {analysisResult.trendDirection}
                  </p>
                </div>
              </div>

              {analysisResult.prediction && (
                <div className="mb-4">
                  <h6 className="text-gray-400 text-sm mb-2">AI Prediction:</h6>
                  <p className="text-gray-300 text-sm">
                    {analysisResult.prediction}
                  </p>
                  <div className="mt-2">
                    <span className="text-xs text-gray-400">
                      Confidence: {(analysisResult.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}

              {analysisResult.keyFindings && analysisResult.keyFindings.length > 0 && (
                <div>
                  <h6 className="text-gray-400 text-sm mb-2">Key Findings:</h6>
                  <ul className="text-gray-300 text-sm space-y-1">
                    {analysisResult.keyFindings.map((finding, index) => (
                      <li key={index}>• {finding}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
