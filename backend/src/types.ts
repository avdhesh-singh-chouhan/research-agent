export interface Submission {
  businessName: string;
  location: string;
  website?: string;
  loanAmount: number;
  creditScore: number;
  annualRevenue: number;
  monthlyRevenue: number;
  debtToIncome: number;
  yearsInBusiness: number;
  industry: string;
  existingDebt?: number;
  employees?: number;
}

export interface BusinessVerificationResult {
  legitimacyScore: number;
  registered: boolean;
  onlinePresence: string;
  websiteFound: boolean;
  recentNews: string[];
  sources: string[];
  summary: string;
}

export interface FinancialAnalysisResult {
  assessment: string;
  strengths: string[];
  concerns: string[];
  industryComparison: string;
  creditAssessment: string;
}

export interface RiskAssessmentResult {
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  riskScore: number;
  factors: string[];
  redFlags: string[];
  sentiment: string;
  industryRisks: string[];
}

export interface UnderwritingDecision {
  businessName: string;
  riskScore: number;
  recommendation: 'APPROVE' | 'DECLINE' | 'APPROVE_WITH_CONDITIONS' | 'REQUEST_MORE_INFO';
  agentFindings: {
    businessVerifier: BusinessVerificationResult;
    financialAnalyst: FinancialAnalysisResult;
    riskAssessor: RiskAssessmentResult;
  };
  finalDecision: {
    approved: boolean;
    conditions: string[];
    reasoning: string;
  };
  metadata: {
    analysisTime: number;
    timestamp: string;
  };
}

export interface AgentProgress {
  agentName: string;
  status: 'started' | 'in_progress' | 'completed' | 'error';
  progress?: number;
  message?: string;
}
