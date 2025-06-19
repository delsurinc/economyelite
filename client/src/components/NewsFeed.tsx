import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

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
  redditDiscussions?: number;
  communityScore?: number;
}

interface NewsFeedProps {
  newsArticles: NewsArticle[];
  socialMetrics: SocialMetrics;
}

export default function NewsFeed({ newsArticles, socialMetrics }: NewsFeedProps) {
  if (!newsArticles?.length && !socialMetrics) return null;

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-900 text-green-300';
      case 'negative':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-yellow-900 text-yellow-300';
    }
  };

  const getSentimentDot = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'bg-green-400';
      case 'negative':
        return 'bg-red-400';
      default:
        return 'bg-yellow-400';
    }
  };

  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'Unknown';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-white mb-6">Latest News & Social Sentiment</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* News Feed */}
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
                <i className="fas fa-newspaper text-3xl text-gray-400 mb-4"></i>
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
              {socialMetrics?.twitterMentions && (
                <div className="flex items-center justify-between p-3 bg-elite-blue rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className="fab fa-twitter text-blue-400"></i>
                    <span className="text-gray-300">Twitter/X Mentions</span>
                  </div>
                  <span className="text-white font-semibold">
                    {socialMetrics.twitterMentions.toLocaleString()}
                  </span>
                </div>
              )}
              
              {socialMetrics?.redditDiscussions && (
                <div className="flex items-center justify-between p-3 bg-elite-blue rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className="fab fa-reddit text-orange-400"></i>
                    <span className="text-gray-300">Reddit Discussions</span>
                  </div>
                  <span className="text-white font-semibold">
                    {socialMetrics.redditDiscussions.toLocaleString()}
                  </span>
                </div>
              )}
              
              {socialMetrics?.communityScore && (
                <div className="flex items-center justify-between p-3 bg-elite-blue rounded-lg">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-users text-purple-400"></i>
                    <span className="text-gray-300">Community Score</span>
                  </div>
                  <span className="text-white font-semibold">
                    {socialMetrics.communityScore.toFixed(1)}/10
                  </span>
                </div>
              )}
              
              {(!socialMetrics?.twitterMentions && !socialMetrics?.redditDiscussions && !socialMetrics?.communityScore) && (
                <div className="text-center py-8">
                  <i className="fas fa-chart-line text-3xl text-gray-400 mb-4"></i>
                  <p className="text-gray-400">No social metrics available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}