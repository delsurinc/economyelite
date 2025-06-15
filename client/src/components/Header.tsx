import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function Header({ selectedLanguage, onLanguageChange }: HeaderProps) {
  return (
    <header className="bg-elite-navy border-b border-elite-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-gold rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-elite-navy text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-elite-gold">Economic Elite</h1>
              <p className="text-xs text-gray-400">Advanced Financial Analysis</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#dashboard" className="text-gray-300 hover:text-elite-gold transition-colors">
              Dashboard
            </a>
            <a href="#analysis" className="text-gray-300 hover:text-elite-gold transition-colors">
              Analysis
            </a>
            <a href="#reports" className="text-gray-300 hover:text-elite-gold transition-colors">
              Reports
            </a>
            <a href="#tools" className="text-gray-300 hover:text-elite-gold transition-colors">
              Tools
            </a>
          </nav>

          {/* Language Selector */}
          <div className="flex items-center space-x-4">
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-32 bg-elite-blue border-elite-border text-gray-300 focus:ring-elite-gold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-elite-blue border-elite-border">
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
            <button className="md:hidden text-gray-300 hover:text-elite-gold transition-colors">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
