# Economic Elite - Advanced Financial Analysis Platform

## Overview

Economic Elite is a full-stack financial analysis platform that aggregates news, analyzes sentiment, and provides investment insights for stocks and cryptocurrencies. The application combines React frontend with Express backend, utilizing PostgreSQL for data persistence and integrating with external APIs for market data and news aggregation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for the "Economic Elite" theme
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with structured error handling
- **File Handling**: Multer for chart image uploads (up to 10MB)
- **Development**: Hot reloading with Vite middleware integration

### Database Architecture
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Schema**: Structured tables for users, search queries, analysis results, news articles, and chart analyses
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless driver for scalable connections

## Key Components

### Core Services
1. **Financial Data Service**: Mock service providing market data, technical indicators, and market sentiment
2. **News Aggregator Service**: Aggregates financial news from multiple sources with sentiment analysis
3. **OpenAI Integration**: Provides sentiment analysis, chart analysis, and text translation capabilities
4. **PDF Generator Service**: Creates downloadable analysis reports in PDF format

### Data Models
- **Users**: Authentication and language preferences
- **Search Queries**: User search parameters and settings
- **Analysis Results**: Comprehensive financial analysis with sentiment scores and recommendations
- **News Articles**: Aggregated news with sentiment classification
- **Chart Analyses**: Technical chart analysis results from uploaded images

### UI Components
- **Dashboard**: Main interface with market overview and analysis results
- **Search Section**: Advanced search with filters for asset type, price limits, and time ranges
- **Market Overview**: Real-time market sentiment indicators
- **News Feed**: Categorized news articles with sentiment indicators
- **Chart Upload**: Drag-and-drop chart analysis functionality
- **Analysis Results**: Comprehensive display of technical and sentiment analysis

## Data Flow

1. **User Input**: Users enter search parameters (symbol, asset type, price limits, time range)
2. **Data Aggregation**: System fetches market data, news articles, and social metrics
3. **Analysis Processing**: OpenAI services analyze sentiment and technical indicators
4. **Storage**: Results stored in PostgreSQL with relational integrity
5. **Display**: Real-time updates displayed through React Query state management
6. **Export**: Users can generate and download PDF reports

## External Dependencies

### Production Dependencies
- **Database**: `@neondatabase/serverless`, `drizzle-orm`, `connect-pg-simple`
- **UI Framework**: React ecosystem with `@radix-ui` components
- **API Integration**: `@tanstack/react-query` for data fetching
- **Validation**: `zod` for schema validation and `drizzle-zod` for database integration
- **File Processing**: `multer` for upload handling
- **Styling**: `tailwindcss`, `class-variance-authority`, `clsx`

### Development Dependencies
- **Build Tools**: Vite with React plugin and TypeScript support
- **Code Quality**: ESBuild for production bundling
- **Development**: TSX for TypeScript execution and hot reloading

### External APIs (Mocked in Current Implementation)
- Financial data providers for real-time market information
- News aggregation services for comprehensive coverage
- OpenAI API for advanced sentiment and chart analysis
- Social media APIs for community sentiment tracking

## Deployment Strategy

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Build Command**: `npm run build` (Vite build + ESBuild server bundling)
- **Start Command**: `npm run start` (production) / `npm run dev` (development)
- **Port**: 5000 for development server

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild bundles Express server with external packages
- **Database**: Drizzle migrations ensure schema consistency
- **Static Assets**: Served through Express with Vite middleware in development

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `OPENAI_API_KEY`: OpenAI API access for analysis services
- `NODE_ENV`: Environment designation (development/production)

## Changelog
```
Changelog:
- June 15, 2025. Initial setup with Economic Elite branding
- June 15, 2025. Updated project name and branding throughout application
- June 15, 2025. OpenAI API integration active for sentiment analysis and chart analysis
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
Project name: Economic Elite (updated from previous generic name)
```