import { BaseAgent } from './base-agent.js';
import { ExaService } from '../services/exa-service.js';
import { Submission, RiskAssessmentResult } from '../types.js';

export class RiskAssessorAgent extends BaseAgent {
  private exaService: ExaService;

  constructor(apiKey: string, exaApiKey: string) {
    super(apiKey);
    this.exaService = new ExaService(exaApiKey);
  }

  async analyze(submission: Submission): Promise<RiskAssessmentResult> {
    console.log(`[Risk Assessor] Analyzing ${submission.businessName}...`);

    // Search for risk information
    const riskInfo = await this.exaService.searchRisks(
      submission.businessName,
      submission.industry
    );
    const riskResults = riskInfo.results || [];

    // Search for industry risks
    const industryRiskQuery = `${submission.industry} industry risks failure rate challenges 2026`;
    const industryRisks = await this.exaService.searchIndustryInfo(submission.industry);
    const industryResults = industryRisks.results || [];

    const prompt = `You are a risk assessment specialist for underwriting. Analyze the following business for potential risks:

Business: ${submission.businessName}
Industry: ${submission.industry}
Location: ${submission.location}
Years in Business: ${submission.yearsInBusiness}

Financial Context:
- Loan Amount: $${submission.loanAmount.toLocaleString()}
- Debt-to-Income: ${(submission.debtToIncome * 100).toFixed(1)}%
- Credit Score: ${submission.creditScore}

Risk Information Found:
${riskResults.map((r: any, i: number) => `
${i + 1}. ${r.title}
   ${r.text || 'No content'}
`).join('\n')}

Industry Risk Information:
${industryResults.map((r: any, i: number) => `
${i + 1}. ${r.title}
   ${r.text || 'No content'}
`).join('\n')}

Provide a comprehensive risk assessment with:
1. Overall risk level (LOW/MODERATE/HIGH/VERY_HIGH)
2. Risk score (0-100, where 100 is highest risk)
3. Key risk factors (as an array)
4. Any red flags found (as an array, or empty if none)
5. Sentiment from news/reviews (Positive/Neutral/Negative)
6. Industry-specific risks (as an array)

Format your response as JSON with this structure:
{
  "riskLevel": "<LOW/MODERATE/HIGH/VERY_HIGH>",
  "riskScore": <number>,
  "factors": [<array of risk factors>],
  "redFlags": [<array of red flags, or empty>],
  "sentiment": "<Positive/Neutral/Negative>",
  "industryRisks": [<array of industry-specific risks>]
}`;

    const response = await this.callClaude(prompt);

    // Parse Claude's response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        console.log(`[Risk Assessor] Completed. Risk level: ${result.riskLevel}, Score: ${result.riskScore}`);
        return result;
      }
    } catch (error) {
      console.error('Failed to parse Risk Assessor response:', error);
    }

    // Fallback response
    return {
      riskLevel: 'MODERATE',
      riskScore: 50,
      factors: ['Unable to complete risk assessment'],
      redFlags: [],
      sentiment: 'Neutral',
      industryRisks: []
    };
  }
}
