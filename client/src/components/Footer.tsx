import { Card, CardContent } from "@/components/ui/card";

export default function Footer() {
  return (
    <footer className="bg-elite-navy border-t border-elite-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Important Disclaimers */}
        <Card className="bg-red-900/20 border-red-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <i className="fas fa-exclamation-triangle text-red-400 text-xl mt-1 flex-shrink-0"></i>
              <div>
                <h4 className="text-red-400 font-bold text-lg mb-2">Important Disclaimer</h4>
                <div className="text-gray-300 space-y-2 text-sm">
                  <p>
                    <strong>Not Financial Advice:</strong> All analyses, predictions, and recommendations provided by Economic Elite are for informational purposes only and should not be considered as financial, investment, or trading advice.
                  </p>
                  <p>
                    <strong>Risk Warning:</strong> Trading and investing in stocks and cryptocurrencies carries significant risk of loss. Past performance does not guarantee future results.
                  </p>
                  <p>
                    <strong>Do Your Research:</strong> Always conduct your own research and consult with qualified financial advisors before making investment decisions.
                  </p>
                  <p>
                    <strong>Data Accuracy:</strong> While we strive for accuracy, market data and sentiment analysis may contain errors or delays. Users should verify information independently.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-elite-navy text-sm"></i>
              </div>
              <span className="text-elite-gold font-bold text-lg">Economic Elite</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Advanced financial analysis platform aggregating news, sentiment, and technical data for informed investment decisions.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-elite-gold transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-elite-gold transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-elite-gold transition-colors"
                aria-label="Telegram"
              >
                <i className="fab fa-telegram"></i>
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h5 className="text-white font-semibold mb-4">Features</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#sentiment" className="hover:text-elite-gold transition-colors">
                  Sentiment Analysis
                </a>
              </li>
              <li>
                <a href="#technical" className="hover:text-elite-gold transition-colors">
                  Technical Indicators
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-elite-gold transition-colors">
                  News Aggregation
                </a>
              </li>
              <li>
                <a href="#chart" className="hover:text-elite-gold transition-colors">
                  Chart Analysis
                </a>
              </li>
              <li>
                <a href="#filter" className="hover:text-elite-gold transition-colors">
                  Price Filtering
                </a>
              </li>
              <li>
                <a href="#reports" className="hover:text-elite-gold transition-colors">
                  Report Generation
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-white font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#api" className="hover:text-elite-gold transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#guide" className="hover:text-elite-gold transition-colors">
                  User Guide
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-elite-gold transition-colors">
                  Market Education
                </a>
              </li>
              <li>
                <a href="#risk" className="hover:text-elite-gold transition-colors">
                  Risk Management
                </a>
              </li>
              <li>
                <a href="#support" className="hover:text-elite-gold transition-colors">
                  Support Center
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-elite-gold transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-white font-semibold mb-4">Contact</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2 w-4"></i>
                <a 
                  href="mailto:support@economicElite.com" 
                  className="hover:text-elite-gold transition-colors"
                >
                  support@economicElite.com
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone mr-2 w-4"></i>
                <a 
                  href="tel:+15551234567" 
                  className="hover:text-elite-gold transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2 w-4"></i>
                <span>New York, NY</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-2 w-4"></i>
                <span>24/7 Support</span>
              </li>
            </ul>
            
            <div className="mt-4 p-3 bg-elite-blue rounded-lg">
              <h6 className="text-elite-gold font-semibold text-sm mb-2">
                <i className="fas fa-shield-alt mr-1"></i>
                Security Notice
              </h6>
              <p className="text-xs text-gray-400">
                Your data is protected with enterprise-grade encryption and security measures.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 pt-6 border-t border-elite-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h6 className="text-white font-semibold mb-3">Supported Markets</h6>
              <div className="flex flex-wrap gap-2">
                <span className="bg-elite-blue text-gray-300 px-2 py-1 rounded text-xs">NYSE</span>
                <span className="bg-elite-blue text-gray-300 px-2 py-1 rounded text-xs">NASDAQ</span>
                <span className="bg-elite-blue text-gray-300 px-2 py-1 rounded text-xs">Bitcoin</span>
                <span className="bg-elite-blue text-gray-300 px-2 py-1 rounded text-xs">Ethereum</span>
                <span className="bg-elite-blue text-gray-300 px-2 py-1 rounded text-xs">Altcoins</span>
              </div>
            </div>
            
            <div>
              <h6 className="text-white font-semibold mb-3">Data Sources</h6>
              <p className="text-gray-400 text-xs">
                Real-time data from leading financial institutions, news agencies, and social media platforms. 
                All data is aggregated and analyzed using advanced AI algorithms.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-elite-border mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">
            © 2024 Economic Elite. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <a href="#privacy" className="hover:text-elite-gold transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-600">|</span>
            <a href="#terms" className="hover:text-elite-gold transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-600">|</span>
            <a href="#risk-disclosure" className="hover:text-elite-gold transition-colors">
              Risk Disclosure
            </a>
            <span className="text-gray-600">|</span>
            <a href="#cookies" className="hover:text-elite-gold transition-colors">
              Cookie Policy
            </a>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            Economic Elite uses advanced AI and machine learning for financial analysis. 
            This platform is designed for informational purposes and educational use only.
          </p>
        </div>
      </div>
    </footer>
  );
}
