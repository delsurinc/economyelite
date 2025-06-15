import { useState } from "react";
import Header from "@/components/Header";
import SearchSection from "@/components/SearchSection";
import MarketOverview from "@/components/MarketOverview";
import AnalysisResults from "@/components/AnalysisResults";
import ChartUpload from "@/components/ChartUpload";
import NewsFeed from "@/components/NewsFeed";
import FilteredRecommendations from "@/components/FilteredRecommendations";
import Footer from "@/components/Footer";

export interface SearchParams {
  symbol: string;
  assetType: string;
  priceLimit?: number;
  timeRange: string;
  deepSearchEnabled: boolean;
}

export interface AnalysisData {
  query: any;
  analysisResult: any;
  marketData: any;
  technicalIndicators: any;
  newsArticles: any[];
  socialMetrics: any;
}

export default function Dashboard() {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleAnalysisComplete = (data: AnalysisData, params: SearchParams) => {
    setCurrentAnalysis(data);
    setSearchParams(params);
    setIsAnalyzing(false);
  };

  const handleSearchStart = () => {
    setIsAnalyzing(true);
  };

  return (
    <div className="min-h-screen bg-elite-bg text-gray-100">
      <Header 
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      <SearchSection 
        onAnalysisComplete={handleAnalysisComplete}
        onSearchStart={handleSearchStart}
        isAnalyzing={isAnalyzing}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MarketOverview />

        {currentAnalysis && (
          <>
            <AnalysisResults 
              data={currentAnalysis}
              searchParams={searchParams}
            />

            <ChartUpload 
              queryId={currentAnalysis.query?.id}
              symbol={currentAnalysis.analysisResult?.symbol}
            />

            <NewsFeed 
              newsArticles={currentAnalysis.newsArticles} 
              symbol={searchParams?.symbol}
            />

            {searchParams?.priceLimit && (
              <FilteredRecommendations 
                priceLimit={searchParams.priceLimit}
                assetType={searchParams.assetType}
              />
            )}
          </>
        )}

        {!currentAnalysis && !isAnalyzing && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-gold rounded-full flex items-center justify-center">
              <i className="fas fa-search text-elite-navy text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Start Your Financial Analysis
            </h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Enter a stock symbol or cryptocurrency above to begin comprehensive analysis with sentiment tracking, technical indicators, and market insights.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}