import { BaseAgent } from './base-agent.js';
import { BusinessVerifierAgent } from './business-verifier.js';
import { FinancialAnalystAgent } from './financial-analyst.js';
import { RiskAssessorAgent } from './risk-assessor.js';
import {
  Submission,
  UnderwritingDecision,
  BusinessVerificationResult,
  FinancialAnalysisResult,
  RiskAssessmentResult
} from '../types.js';

export class CoordinatorAgent extends BaseAgent {
  private businessVerifier: BusinessVerifierAgent;
  private financialAnalyst: FinancialAnalystAgent;
  private riskAssessor: RiskAssessorAgent;

  constructor(apiKey: string, exaApiKey: string) {
    super(apiKey);
    this.businessVerifier = new BusinessVerifierAgent(apiKey, exaApiKey);
    this.financialAnalyst = new FinancialAnalystAgent(apiKey, exaApiKey);
    this.riskAssessor = new RiskAssessorAgent(apiKey, exaApiKey);
  }

  async analyze(submission: Submission): Promise<UnderwritingDecision> {
    console.log('\n=== Starting Underwriting Analysis ===');
    const startTime = Date.now();

    try {
      // Phase 1: Run all agents in parallel
      console.log('\n[Coordinator] Spawning agents in parallel...\n');
      const [verifierResult, financialResult, riskResult] = await Promise.all([
        this.businessVerifier.analyze(submission),
        this.financialAnalyst.analyze(submission),
        this.riskAssessor.analyze(submission)
      ]);

      console.log('\n[Coordinator] All agents completed. Synthesizing results...\n');

      // Phase 2: Synthesize results into final decision
      const decision = await this.synthesizeDecision(
        submission,
        verifierResult,
        financialResult,
        riskResult
      );

      const analysisTime = (Date.now() - startTime) / 1000;

      const finalDecision: UnderwritingDecision = {
        businessName: submission.businessName,
        riskScore: decision.riskScore,
        recommendation: decision.recommendation,
        agentFindings: {
          businessVerifier: verifierResult,
          financialAnalyst: financialResult,
          riskAssessor: riskResult
        },
        finalDecision: {
          approved: decision.approved,
          conditions: decision.conditions,
          reasoning: decision.reasoning
        },
        metadata: {
          analysisTime,
          timestamp: new Date().toISOString()
        }
      };

      console.log(`\n[Coordinator] Analysis complete in ${analysisTime.toFixed(1)}s`);
      console.log(`[Coordinator] Final Decision: ${decision.recommendation}`);
      console.log(`[Coordinator] Risk Score: ${decision.riskScore}/100\n`);

      return finalDecision;

    } catch (error) {
      console.error('Error in coordinator:', error);
      throw error;
    }
  }

  private async synthesizeDecision(
    submission: Submission,
    verifierResult: BusinessVerificationResult,
    financialResult: FinancialAnalysisResult,
    riskResult: RiskAssessmentResult
  ): Promise<{
    riskScore: number;
    recommendation: 'APPROVE' | 'DECLINE' | 'APPROVE_WITH_CONDITIONS' | 'REQUEST_MORE_INFO';
    approved: boolean;
    conditions: string[];
    reasoning: string;
  }> {
    const prompt = `You are a senior underwriting officer making a final lending decision. Review the following analysis from your team:

LOAN APPLICATION:
Business: ${submission.businessName}
Industry: ${submission.industry}
Location: ${submission.location}
Loan Amount: $${submission.loanAmount.toLocaleString()}
Years in Business: ${submission.yearsInBusiness}

BUSINESS VERIFICATION (Legitimacy Score: ${verifierResult.legitimacyScore}/100):
${verifierResult.summary}
Online Presence: ${verifierResult.onlinePresence}
Registered: ${verifierResult.registered ? 'Yes' : 'No'}
Recent News: ${verifierResult.recentNews.join('; ')}

FINANCIAL ANALYSIS:
Assessment: ${financialResult.assessment}
Strengths:
${financialResult.strengths.map(s => `- ${s}`).join('\n')}
Concerns:
${financialResult.concerns.map(c => `- ${c}`).join('\n')}
Industry Comparison: ${financialResult.industryComparison}
Credit Assessment: ${financialResult.creditAssessment}

RISK ASSESSMENT (Level: ${riskResult.riskLevel}, Score: ${riskResult.riskScore}/100):
Risk Factors:
${riskResult.factors.map(f => `- ${f}`).join('\n')}
Red Flags:
${riskResult.redFlags.length > 0 ? riskResult.redFlags.map(r => `- ${r}`).join('\n') : '- None identified'}
Industry Risks:
${riskResult.industryRisks.map(r => `- ${r}`).join('\n')}
Sentiment: ${riskResult.sentiment}

Based on this comprehensive analysis, provide your final underwriting decision:

1. Calculate an overall risk score (0-100, where 100 is highest risk)
2. Make a recommendation: APPROVE, DECLINE, APPROVE_WITH_CONDITIONS, or REQUEST_MORE_INFO
3. If approved (with or without conditions), list specific conditions
4. Provide clear reasoning for your decision

Format your response as JSON:
{
  "riskScore": <number>,
  "recommendation": "<APPROVE/DECLINE/APPROVE_WITH_CONDITIONS/REQUEST_MORE_INFO>",
  "approved": <boolean>,
  "conditions": [<array of conditions if approved with conditions, otherwise empty>],
  "reasoning": "<detailed explanation of decision>"
}`;

    const response = await this.callClaude(prompt);

    // Parse Claude's response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse synthesis response:', error);
    }

    // Fallback decision
    return {
      riskScore: 50,
      recommendation: 'REQUEST_MORE_INFO',
      approved: false,
      conditions: [],
      reasoning: 'Unable to complete synthesis'
    };
  }
}
