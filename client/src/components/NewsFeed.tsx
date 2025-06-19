import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsArticle {
  id: number;
  title: string;
  content?: string;
  summary?: string;
  sentiment: string;
  sentimentScore?: number;
  source: string;
  url?: string;
  publishedAt?: Date;
}

interface SocialMetrics {
  twitterMentions?: number;
  twitterSentiment?: string;
  twitterSentimentScore?: number;
  twitterTrending?: boolean;
  twitterEngagement?: number;
  twitterReach?: number;
  redditDiscussions?: number;
  redditUpvotes?: number;
  redditSentiment?: string;
  redditSentimentScore?: number;
  communityScore?: number;
  redditHotPosts?: number;
  topSubreddits?: string[];
}

interface NewsFeedProps {
  newsArticles: NewsArticle[];
  socialMetrics: SocialMetrics;
}

export default function NewsFeed({ newsArticles, socialMetrics }: NewsFeedProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getSentimentDot = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return 'Just now';
    if (diffHrs === 1) return '1 hour ago';
    return `${diffHrs} hours ago`;
  };

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* News Articles */}
        <Card className="bg-elite-card border-elite-border">
          <CardHeader className="border-b border-elite-border">
            <CardTitle className="text-lg font-semibold text-white">
              Recent News
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {newsArticles?.length > 0 ? (
              <div className="space-y-4">
                {newsArticles.slice(0, 5).map((article) => (
                  <div key={article.id} className="flex space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getSentimentDot(article.sentiment)}`}></div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium mb-1 line-clamp-2">
                        {article.title}
                      </h5>
                      {article.summary && (
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {article.summary}
                        </p>
                      )}
                      <div className="flex items-center flex-wrap gap-2 text-xs">
                        <span className="text-gray-400">
                          {new Date(article.publishedAt || new Date()).toLocaleDateString('en-US', {
                            month: '2-digit',
                            day: '2-digit', 
                            year: 'numeric'
                          })}
                        </span>
                        <Badge className={getSentimentColor(article.sentiment)}>
                          {article.sentiment || 'neutral'}
                        </Badge>
                        {article.url ? (
                          <a 
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {article.source || 'source'}
                          </a>
                        ) : (
                          <span className="text-gray-500">{article.source || 'source'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No recent news articles found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media Sentiment */}
        <Card className="bg-elite-card border-elite-border">
          <CardHeader className="border-b border-elite-border">
            <CardTitle className="text-lg font-semibold text-white">
              Social Media Buzz
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Twitter/X Analysis Section */}
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <span className="text-blue-400 mr-2 text-lg">𝕏</span>
                  Twitter/X Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400">
                      {socialMetrics?.twitterMentions?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-400">Mentions</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${
                      socialMetrics?.twitterSentiment === 'bullish' ? 'text-green-400' :
                      socialMetrics?.twitterSentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {socialMetrics?.twitterSentiment?.toUpperCase() || 'NEUTRAL'}
                    </div>
                    <div className="text-xs text-gray-400">Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">
                      {socialMetrics?.twitterEngagement?.toFixed(1) || '0'}%
                    </div>
                    <div className="text-xs text-gray-400">Engagement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {socialMetrics?.twitterReach ? (socialMetrics.twitterReach / 1000000).toFixed(1) + 'M' : '0'}
                    </div>
                    <div className="text-xs text-gray-400">Reach</div>
                  </div>
                </div>
                {socialMetrics?.twitterTrending && (
                  <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                    🔥 Trending
                  </div>
                )}
              </div>

              {/* Reddit Analysis Section */}
              <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700/50">
                <h4 className="text-white font-medium mb-3 flex items-center">
                  <span className="text-orange-400 mr-2 text-lg">📱</span>
                  Reddit Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-400">
                      {socialMetrics?.redditDiscussions?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-400">Discussions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400">
                      {socialMetrics?.redditUpvotes?.toLocaleString() || '0'}
                    </div>
                    <div className="text-xs text-gray-400">Upvotes</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${
                      socialMetrics?.redditSentiment === 'bullish' ? 'text-green-400' :
                      socialMetrics?.redditSentiment === 'bearish' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {socialMetrics?.redditSentiment?.toUpperCase() || 'NEUTRAL'}
                    </div>
                    <div className="text-xs text-gray-400">Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-400">
                      {socialMetrics?.communityScore?.toFixed(1) || '0'}
                    </div>
                    <div className="text-xs text-gray-400">Community Score</div>
                  </div>
                </div>
                {socialMetrics?.redditHotPosts && socialMetrics.redditHotPosts > 5 && (
                  <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    🔥 {socialMetrics.redditHotPosts} Hot Posts
                  </div>
                )}
                {socialMetrics?.topSubreddits && socialMetrics.topSubreddits.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs text-gray-400 mb-2">Active Communities:</div>
                    <div className="flex flex-wrap gap-1">
                      {socialMetrics.topSubreddits.map((subreddit, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50">
                          {subreddit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Community Score Explanation */}
              {socialMetrics?.communityScore && (
                <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/50">
                  <div className="text-white text-sm">
                    <span className="font-medium">Community Score Explained:</span>
                    <span className="text-gray-300 ml-2">
                      Calculated from upvote ratio, discussion quality, and engagement metrics. 
                      Score above 7.0 indicates strong community support.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}