import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketSentiment {
  overall: number;
  stocks: number;
  crypto: number;
  fearGreedIndex?: number;
}

export default function MarketOverview() {
  const { data: marketSentiment, isLoading } = useQuery<MarketSentiment>({
    queryKey: ["/api/market-overview"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const getSentimentColor = (score: number) => {
    if (score >= 60) return "bg-green-500";
    if (score <= 40) return "bg-red-500";
    return "bg-yellow-500";
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return "Bullish";
    if (score >= 60) return "Moderately Bullish";
    if (score >= 40) return "Neutral";
    if (score >= 30) return "Moderately Bearish";
    return "Bearish";
  };

  const getSentimentIndicator = (score: number) => {
    if (score >= 60) return "bg-green-500";
    if (score <= 40) return "bg-red-500";
    return "bg-yellow-500";
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-elite-card border-elite-border">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (!marketSentiment) {
    return null;
  }

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6">Market Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-elite-card border-elite-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-semibold text-gray-300">
                Stock Market
              </CardTitle>
              <div className={`w-3 h-3 rounded-full ${getSentimentIndicator(marketSentiment.stocks)}`}></div>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-2">
              {marketSentiment.stocks.toFixed(0)}%
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {getSentimentLabel(marketSentiment.stocks)}
            </p>
            <Progress 
              value={marketSentiment.stocks} 
              className="h-2"
              style={{
                background: "var(--elite-border)",
              }}
            />
          </CardContent>
        </Card>

        <Card className="bg-elite-card border-elite-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-semibold text-gray-300">
                Cryptocurrency
              </CardTitle>
              <div className={`w-3 h-3 rounded-full ${getSentimentIndicator(marketSentiment.crypto)}`}></div>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              {marketSentiment.crypto.toFixed(0)}%
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {getSentimentLabel(marketSentiment.crypto)}
            </p>
            <Progress 
              value={marketSentiment.crypto} 
              className="h-2"
            />
          </CardContent>
        </Card>

        <Card className="bg-elite-card border-elite-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-semibold text-gray-300">
                Overall Market
              </CardTitle>
              <div className={`w-3 h-3 rounded-full ${getSentimentIndicator(marketSentiment.overall)}`}></div>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {marketSentiment.overall.toFixed(0)}%
            </div>
            <p className="text-sm text-gray-400 mb-4">
              {getSentimentLabel(marketSentiment.overall)}
            </p>
            <Progress 
              value={marketSentiment.overall} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
