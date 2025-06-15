import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SearchParams, AnalysisData } from "@/pages/Dashboard";

interface SearchSectionProps {
  onAnalysisComplete: (data: AnalysisData, params: SearchParams) => void;
  onSearchStart: () => void;
  isAnalyzing: boolean;
}

export default function SearchSection({ onAnalysisComplete, onSearchStart, isAnalyzing }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceLimit, setPriceLimit] = useState("");
  const [assetType, setAssetType] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    // If no search query is provided, check if we have filters to work with
    if (!searchQuery.trim()) {
      if (!priceLimit) {
        toast({
          title: "Error",
          description: "Please enter a stock symbol or set a price limit to filter assets",
          variant: "destructive",
        });
        return;
      }
    }

    onSearchStart();

    try {
      // If no symbol provided, use price filtering endpoint
      if (!searchQuery.trim() && priceLimit) {
        const response = await apiRequest("GET", `/api/assets-under-price?maxPrice=${priceLimit}&assetType=${assetType}`);
        const assets = await response.json();
        
        if (assets.length === 0) {
          toast({
            title: "No Results",
            description: `No ${assetType === 'all' ? '' : assetType} assets found under $${priceLimit}`,
            variant: "destructive",
          });
          onAnalysisComplete(null as any, {} as SearchParams);
          return;
        }

        // For now, analyze the first asset found
        const firstAsset = assets[0];
        const searchParams: SearchParams = {
          symbol: firstAsset.symbol,
          assetType,
          priceLimit: parseFloat(priceLimit),
          timeRange,
          deepSearchEnabled,
        };

        const analysisResponse = await apiRequest("POST", "/api/analyze", searchParams);
        const data = await analysisResponse.json();
        onAnalysisComplete(data, searchParams);

        toast({
          title: "Analysis Complete",
          description: `Found ${assets.length} assets under $${priceLimit}. Analyzing ${firstAsset.symbol}`,
        });
        return;
      }

      const searchParams: SearchParams = {
        symbol: searchQuery.trim().toUpperCase(),
        assetType,
        priceLimit: priceLimit ? parseFloat(priceLimit) : undefined,
        timeRange,
        deepSearchEnabled,
      };

      const response = await apiRequest("POST", "/api/analyze", {
        symbol: searchParams.symbol,
        assetType: searchParams.assetType,
        priceLimit: searchParams.priceLimit,
        timeRange: searchParams.timeRange,
        deepSearchEnabled: searchParams.deepSearchEnabled,
      });

      const data = await response.json();
      onAnalysisComplete(data, searchParams);

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${searchParams.symbol}`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      
      // Check if it's a 404 error with asset not found message
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze the asset";
      
      if (errorMessage.includes("Asset not found")) {
        toast({
          title: "Symbol Not Found",
          description: `"${searchParams.symbol}" not found. Try: AAPL, TSLA, MSFT, GOOGL, NVDA, BTC, ETH, SOL, ADA, DOT`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
      onAnalysisComplete(null as any, {} as SearchParams);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="bg-gradient-elite py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Intelligent Financial Analysis
        </h2>
        <p className="text-xl text-gray-300 mb-8">
          Aggregate news, analyze sentiment, and make informed investment decisions
        </p>

        <Card className="bg-white dark:bg-white shadow-2xl">
          <CardContent className="p-6">
            {/* Main Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter stock symbol or cryptocurrency (e.g., AAPL, BTC, TSLA) - Optional if using price filter"
                  className="text-gray-900 text-lg h-12 focus:ring-elite-gold focus:border-elite-gold bg-white"
                  disabled={isAnalyzing}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isAnalyzing}
                className="bg-elite-gold hover:bg-yellow-600 text-elite-navy px-8 py-3 h-12 font-semibold text-lg transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search mr-2"></i>
                    Analyze
                  </>
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div>
                <Label htmlFor="priceLimit" className="text-gray-700 font-medium">
                  Price Limit ($)
                </Label>
                <Input
                  id="priceLimit"
                  type="number"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(e.target.value)}
                  placeholder="Max price per share/coin"
                  className="mt-2 text-gray-900 focus:ring-elite-gold focus:border-elite-gold bg-white"
                  disabled={isAnalyzing}
                />
              </div>
              <div>
                <Label htmlFor="assetType" className="text-gray-700 font-medium">
                  Asset Type
                </Label>
                <Select value={assetType} onValueChange={setAssetType} disabled={isAnalyzing}>
                  <SelectTrigger className="mt-2 text-gray-900 focus:ring-elite-gold [&>span]:text-gray-900" style={{color: '#111827'}}>
                    <SelectValue className="text-gray-900" style={{color: '#111827'}} />
                  </SelectTrigger>
                  <SelectContent className="text-gray-900" style={{color: '#111827'}}>
                    <SelectItem value="all" className="text-gray-900" style={{color: '#111827'}}>All Assets</SelectItem>
                    <SelectItem value="stocks" className="text-gray-900" style={{color: '#111827'}}>Stocks Only</SelectItem>
                    <SelectItem value="crypto" className="text-gray-900" style={{color: '#111827'}}>Crypto Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeRange" className="text-gray-700 font-medium">
                  Time Range
                </Label>
                <Select value={timeRange} onValueChange={setTimeRange} disabled={isAnalyzing}>
                  <SelectTrigger className="mt-2 text-gray-900 focus:ring-elite-gold [&>span]:text-gray-900" style={{color: '#111827'}}>
                    <SelectValue className="text-gray-900" style={{color: '#111827'}} />
                  </SelectTrigger>
                  <SelectContent className="text-gray-900" style={{color: '#111827'}}>
                    <SelectItem value="7d" className="text-gray-900" style={{color: '#111827'}}>Last 7 Days</SelectItem>
                    <SelectItem value="30d" className="text-gray-900" style={{color: '#111827'}}>Last 30 Days</SelectItem>
                    <SelectItem value="90d" className="text-gray-900" style={{color: '#111827'}}>Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deep Search Toggle */}
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="deepSearch"
                  checked={deepSearchEnabled}
                  onCheckedChange={setDeepSearchEnabled}
                  disabled={isAnalyzing}
                  className="data-[state=checked]:bg-elite-gold data-[state=checked]:border-elite-gold"
                />
                <Label htmlFor="deepSearch" className="text-gray-700 font-medium cursor-pointer">
                  Enable Deep Search Mode
                </Label>
                <i 
                  className="fas fa-info-circle text-gray-400 cursor-help" 
                  title="Enhanced analysis with real-time web scraping"
                ></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
