import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

interface FilteredRecommendationsProps {
  priceLimit: number;
  assetType: string;
}

export default function FilteredRecommendations({ priceLimit, assetType }: FilteredRecommendationsProps) {
  const { data: assets, isLoading, error } = useQuery<MarketData[]>({
    queryKey: ["/api/assets-under-price", { maxPrice: priceLimit, assetType }],
    enabled: !!priceLimit,
  });

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-400" : "text-red-400";
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return "N/A";
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
    return volume.toLocaleString();
  };

  if (isLoading) {
    return (
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Recommendations Within Your Budget</h3>
        <Card className="bg-elite-card border-elite-border">
          <CardContent className="p-6">
            <div className="mb-4 p-4 bg-elite-blue rounded-lg">
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-elite-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-12 w-full mt-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Recommendations Within Your Budget</h3>
        <Card className="bg-elite-card border-elite-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">
                  Failed to Load Recommendations
                </h4>
                <p className="text-gray-400">
                  Unable to fetch assets within your price range. Please try again later.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <section className="mb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Recommendations Within Your Budget</h3>
        <Card className="bg-elite-card border-elite-border">
          <CardContent className="p-6">
            <div className="mb-4 p-4 bg-elite-blue rounded-lg">
              <p className="text-gray-300">
                <i className="fas fa-filter text-elite-gold mr-2"></i>
                Searching for assets under <span className="text-elite-gold font-semibold">${priceLimit}</span> per share/coin
              </p>
            </div>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h4 className="text-lg font-semibold text-white mb-2">
                  No Assets Found
                </h4>
                <p className="text-gray-400">
                  No assets found within your budget of ${priceLimit}. Try increasing your price limit or exploring different asset types.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6">Recommendations Within Your Budget</h3>
      <Card className="bg-elite-card border-elite-border">
        <CardContent className="p-6">
          <div className="mb-4 p-4 bg-elite-blue rounded-lg">
            <p className="text-gray-300">
              <i className="fas fa-filter text-elite-gold mr-2"></i>
              Found <span className="text-elite-gold font-semibold">{assets.length}</span> assets under{" "}
              <span className="text-elite-gold font-semibold">${priceLimit}</span> per share/coin
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
              <div key={asset.symbol} className="border border-elite-border rounded-lg p-4 hover:border-elite-gold transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-white text-lg">{asset.symbol}</h5>
                  <span className="text-elite-gold font-bold text-xl">
                    ${asset.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">24h Change:</span>
                    <div className="flex items-center space-x-1">
                      <span className={`font-semibold ${getChangeColor(asset.change)}`}>
                        {asset.change > 0 ? "+" : ""}{asset.changePercent.toFixed(2)}%
                      </span>
                      <i className={`fas ${asset.change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} text-xs ${getChangeColor(asset.change)}`}></i>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume:</span>
                    <span className="text-blue-400 font-medium">
                      {formatVolume(asset.volume)}
                    </span>
                  </div>
                  
                  {asset.marketCap && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Cap:</span>
                      <span className="text-gray-300 font-medium">
                        {formatMarketCap(asset.marketCap)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <Badge variant="outline" className="border-elite-border text-gray-300">
                      {assetType === 'stocks' ? 'Stock' : assetType === 'crypto' ? 'Crypto' : 
                       asset.symbol.length <= 4 ? 'Stock' : 'Crypto'}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-elite-blue rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className={`fas ${asset.changePercent >= 0 ? 'fa-thumbs-up text-green-400' : 'fa-exclamation-triangle text-yellow-400'}`}></i>
                    <span className="text-xs font-semibold text-gray-300">
                      {asset.changePercent >= 5 ? 'Strong Performance' : 
                       asset.changePercent >= 0 ? 'Positive Momentum' : 
                       asset.changePercent >= -5 ? 'Slight Decline' : 'Weak Performance'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {asset.changePercent >= 5 ? 'Showing strong upward momentum with significant gains' :
                     asset.changePercent >= 0 ? 'Demonstrating positive price action and investor confidence' :
                     asset.changePercent >= -5 ? 'Minor downward movement, monitor for trend reversal' :
                     'Experiencing downward pressure, consider risk factors'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {assets.length > 6 && (
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Showing top {Math.min(assets.length, 6)} recommendations based on your criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
