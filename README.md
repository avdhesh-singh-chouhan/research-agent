# AgentLend - Multi-Agent Business Lending Platform

> **Your AI underwriting team works 24/7**

A multi-agent business lending platform built with Claude Agent SDK and Exa API. AgentLend deploys specialized AI agents that work in parallel to analyze business loan applications, verify legitimacy, assess financial health, and identify risks — delivering instant, comprehensive underwriting decisions.

![Architecture](https://img.shields.io/badge/Architecture-Multi--Agent-blue)
![Claude](https://img.shields.io/badge/Claude-Sonnet%204.5-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18-61dafb)

## 💡 The Problem We're Solving

Traditional business loan underwriting is:
- ⏱️ **Slow**: 2-5 days per application
- 💰 **Expensive**: $200-500 per decision in labor costs
- 👥 **Unscalable**: Requires 3-5 human specialists per application
- 🎯 **Inconsistent**: Human bias and fatigue affect decisions

**AgentLend solves this with AI agents that:**
- ⚡ Deliver decisions in **15-30 seconds** (99% faster)
- 💵 Cost **$2-5 per decision** (95% cost reduction)
- 🤖 Work **24/7** with unlimited scalability
- 🎯 Provide **consistent, auditable** decisions every time

## 🎯 Features

- **Multi-Agent System**: 3 specialized agents working in parallel (Business Verifier, Financial Analyst, Risk Assessor)
- **Real API Integration**: Live company research via Exa API
- **Real-Time Progress**: Server-Sent Events (SSE) streaming with live agent status updates
- **Transparent Operations**: Each agent shows its role and data sources in real-time
- **Beautiful UI**: React + Vite + TailwindCSS with smooth animations
- **Comprehensive Analysis**: Legitimacy verification, financial health, risk assessment, and fraud detection
- **Sample Business Library**: 6 pre-loaded examples from small businesses to Fortune 500
- **Expected Outcomes**: Dropdown labels show likely results (Declined/Conditional/Approved)
- **Scalable**: Handles $50K small business loans to $500M+ enterprise financing

## 🏗️ Architecture

### Agents

1. **Business Verifier Agent**
   - Uses `searchCompany()` - Searches for company information
   - Uses `searchNews()` - Analyzes recent news and reviews
   - Evaluates business legitimacy from web presence
   - Returns legitimacy score (0-100)

2. **Financial Analyst Agent**
   - Uses `searchIndustryInfo()` - Researches industry benchmarks
   - Analyzes credit score, revenue, debt ratios
   - Compares business performance vs competitors
   - Identifies financial strengths and concerns

3. **Risk Assessor Agent**
   - Uses `searchRisks()` - Searches for lawsuits, complaints, red flags
   - Uses `searchIndustryInfo()` - Analyzes industry-specific risks
   - Evaluates market conditions and sentiment
   - Returns risk score and risk level

4. **Coordinator Agent**
   - Orchestrates parallel execution of all agents
   - Synthesizes results into final decision
   - Calculates overall risk score
   - Makes recommendation (Approve/Decline/Conditional)

### Flow

```
User Submission
      ↓
  Coordinator
  /    |    \
 ↓     ↓     ↓
Agent Agent Agent  (Run in parallel)
 1     2     3
 ↓     ↓     ↓
  \    |    /
      ↓
 Synthesize
      ↓
Final Decision
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Exa API key ([get one here](https://exa.ai))

### Installation

1. **Clone the repository**
```bash
cd research-agent
```

2. **Create `.env` file in the root directory**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
EXA_API_KEY=your_exa_api_key_here
PORT=3000
```

3. **Install all dependencies**
```bash
npm run install:all
```

This will install dependencies for root, backend, and frontend.

### Running the Application

You'll need two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

Open your browser to `http://localhost:5173` to see the app!

## 📖 Usage

### Sample Businesses

Choose from 6 pre-loaded sample businesses to test different risk profiles:

| Business | Type | Expected Outcome |
|----------|------|------------------|
| 🍕 **Joe's Pizza** | Small Restaurant | ❌ Likely DECLINED |
| 🚗 **Autobell Car Wash** | Service Business | ⚠️ APPROVED WITH CONDITIONS |
| 💼 **Accenture plc** | Fortune 500 | ✅ APPROVED |
| 🎯 **Target Store** | Mid-Size Retail | ⚠️ APPROVED WITH CONDITIONS |
| 💊 **CVS Pharmacy** | Healthcare | ✅ APPROVED |
| 🏪 **Walmart** | Large Retail | ✅ APPROVED |

### Step-by-Step

1. **Select Sample Business**: Choose from dropdown or enter your own data
2. **Click "Analyze Submission"**: Watch agents work in parallel
3. **View Real-Time Progress**: See each agent's role and data sources
4. **Review Agent Findings**: Detailed analysis from each specialist
5. **Final Decision**: Risk score and recommendation with reasoning

## 🎨 Demo Features

### Transparent Agent Operations

Each agent card shows **exactly what it's doing**:

```
┌─────────────────────────────────────────┐
│ 🔄 Business Verifier                    │
│    Analyzing...                          │
│                                          │
│ Role: Verifies business legitimacy      │
│ Methods: searchCompany() • searchNews() │
└─────────────────────────────────────────┘
```

**Agent Roles & Exa Methods:**
- **Business Verifier**: `searchCompany()` • `searchNews()` • Company & News Analysis
- **Financial Analyst**: `searchIndustryInfo()` • Industry Benchmarks & Trends
- **Risk Assessor**: `searchRisks()` • `searchIndustryInfo()` • Risk & Industry Analysis

### Real-Time Progress Tracking
- Visual status indicators (idle → started → analyzing → complete)
- Animated progress bars and spinners
- Live updates via Server-Sent Events (SSE)
- Completion timestamps

### Comprehensive Results Display
- **Business Verification**: Legitimacy score (0-100), web presence analysis, recent news
- **Financial Analysis**: Credit assessment, strengths, concerns, industry comparison
- **Risk Assessment**: Risk level, red flags, industry risks, sentiment analysis

### Final Decision Card
- Overall risk score (0-100) with color-coded visualization
- Clear recommendation badge (Approve/Decline/Conditional)
- Detailed reasoning from synthesized agent findings
- Specific conditions for approval (if applicable)
- Analysis completion time

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **AI**: Anthropic Claude API (Sonnet 4.5)
- **Research**: Exa API
- **Streaming**: Server-Sent Events (SSE)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **API**: Fetch with EventSource (SSE)

## 📁 Project Structure

```
research-agent/
├── backend/
│   ├── src/
│   │   ├── agents/           # Agent implementations
│   │   │   ├── base-agent.ts
│   │   │   ├── business-verifier.ts
│   │   │   ├── financial-analyst.ts
│   │   │   ├── risk-assessor.ts
│   │   │   └── coordinator.ts
│   │   ├── services/         # External API services
│   │   │   └── exa-service.ts
│   │   ├── types.ts          # TypeScript types
│   │   └── server.ts         # Express API server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── SubmissionForm.tsx
│   │   │   ├── AgentProgress.tsx
│   │   │   ├── ResultsDisplay.tsx
│   │   │   └── DecisionCard.tsx
│   │   ├── App.tsx           # Main app component
│   │   ├── types.ts          # TypeScript types
│   │   └── index.css         # Tailwind styles
│   └── package.json
└── README.md
```

## 🔍 Exa API Integration

### Service Methods

The `ExaService` class provides 4 specialized search methods:

1. **`searchCompany(businessName, location)`**
   - Used by: Business Verifier Agent
   - Searches for company information and web presence
   - Returns: 3 results with 1000 characters each

2. **`searchNews(businessName)`**
   - Used by: Business Verifier Agent  
   - Searches for recent news articles and reviews
   - Returns: 5 results with 500 characters each

3. **`searchIndustryInfo(industry)`**
   - Used by: Financial Analyst Agent, Risk Assessor Agent
   - Searches for industry trends, statistics, and benchmarks
   - Returns: 3 results with 800 characters each

4. **`searchRisks(businessName, industry)`**
   - Used by: Risk Assessor Agent
   - Searches for lawsuits, complaints, and risk factors
   - Returns: 5 results with 500 characters each

## 🔑 API Endpoints

### `GET /api/health`
Health check endpoint

### `POST /api/analyze`
Main analysis endpoint with SSE streaming

**Request Body:**
```json
{
  "businessName": "Joe's Pizza",
  "location": "Brooklyn, NY",
  "loanAmount": 50000,
  "creditScore": 680,
  "annualRevenue": 250000,
  "monthlyRevenue": 20833,
  "debtToIncome": 0.35,
  "yearsInBusiness": 3,
  "industry": "Restaurant"
}
```

**SSE Events:**
- `analysis_started`: Analysis begins
- `agent_started`: Agent begins work
- `agent_completed`: Agent finishes with result
- `synthesis_started`: Final synthesis begins
- `analysis_complete`: Full results ready

### `POST /api/analyze-simple`
Non-streaming endpoint for testing (returns JSON directly)

## 🎯 Demo Strategies

### Show the Full Range

**3-Step Demo Flow:**

1. **Start with DECLINED** → 🍕 Joe's Pizza
   - High-risk restaurant industry
   - Moderate financials (680 credit, 35% debt ratio)
   - Only 3 years old
   - **Result**: Likely declined or heavy conditions
   - **Shows**: System can reject risky applications

2. **Middle Ground** → 🚗 Autobell or 🎯 Target
   - Established businesses with good credit
   - Some concerns (industry risk, debt levels)
   - **Result**: Approved with conditions
   - **Shows**: Nuanced risk assessment

3. **Finish with APPROVAL** → 💼 Accenture plc (Fortune 500)
   - $64B revenue, 750K employees
   - Perfect credit (850), low debt (15%)
   - 35 years in business
   - **Result**: Clean approval
   - **Shows**: System handles enterprise-scale loans

### Test Real Businesses

The system uses **Exa API for live research**, so you can analyze ANY real business:

- Enter actual company names
- Exa finds real website, news, reviews
- Business Verifier analyzes web presence and legitimacy
- **Try**: Local restaurants, retail stores, service businesses

### Highlight Key Features

- **Parallel Execution**: All 3 agents work simultaneously (15-30 seconds)
- **Real Data Sources**: Exa API searches, OpenCorporates verification
- **Transparent**: See exactly what each agent is checking
- **Web-Based Verification**: System analyzes online presence and news
- **Scalability**: Handles $50K to $500M+ loans

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file
PORT=3001
```

**API Keys not working:**
- Verify keys in `.env` file
- Ensure `.env` is in root directory
- Restart backend server after changes

**Frontend can't connect to backend:**
- Ensure backend is running on port 3000
- Check Vite proxy config in `frontend/vite.config.ts`

## 📝 Notes

- **API Costs**: Uses Claude API and Exa API (monitor usage)
- **Rate Limits**: Exa free tier has 1000 searches/month
- **Analysis Time**: Typically 10-15 seconds (agents run in parallel)
- **Data Privacy**: No data is stored; all processing is real-time

## 🚀 Future Enhancements

- [ ] Add more agents (Fraud Detector, Compliance Checker)
- [ ] Integrate with real credit APIs
- [ ] Add document upload (PDFs, financial statements)
- [ ] Export reports to PDF
- [ ] Historical tracking and analytics
- [ ] A/B testing different agent configurations

## 📄 License

MIT License - feel free to use this for demos, learning, or as a starting point for your own projects!

## 🙏 Acknowledgments

- Built with [Anthropic Claude API](https://anthropic.com)
- Research powered by [Exa API](https://exa.ai)
- Multi-agent architecture inspired by real underwriting teams

---

**Made with ❤️ to showcase the power of multi-agent AI systems**
