import { BaseAgent } from './base-agent.js';
import { ExaService } from '../services/exa-service.js';
import { Submission, FinancialAnalysisResult } from '../types.js';

export class FinancialAnalystAgent extends BaseAgent {
  private exaService: ExaService;

  constructor(apiKey: string, exaApiKey: string) {
    super(apiKey);
    this.exaService = new ExaService(exaApiKey);
  }

  async analyze(submission: Submission): Promise<FinancialAnalysisResult> {
    console.log(`[Financial Analyst] Analyzing ${submission.businessName}...`);

    // Search for industry benchmarks
    const industryInfo = await this.exaService.searchIndustryInfo(submission.industry);
    const industryResults = industryInfo.results || [];

    const prompt = `You are a financial analyst specializing in business underwriting. Analyze the following business financials:

Business: ${submission.businessName}
Industry: ${submission.industry}
Location: ${submission.location}

Financial Data:
- Loan Amount Requested: $${submission.loanAmount.toLocaleString()}
- Credit Score: ${submission.creditScore}
- Annual Revenue: $${submission.annualRevenue.toLocaleString()}
- Monthly Revenue: $${submission.monthlyRevenue.toLocaleString()}
- Debt-to-Income Ratio: ${(submission.debtToIncome * 100).toFixed(1)}%
- Years in Business: ${submission.yearsInBusiness}
${submission.existingDebt ? `- Existing Debt: $${submission.existingDebt.toLocaleString()}` : ''}
${submission.employees ? `- Number of Employees: ${submission.employees}` : ''}

Industry Benchmarks and Information:
${industryResults.map((r: any, i: number) => `
${i + 1}. ${r.title}
   ${r.text || 'No content'}
`).join('\n')}

Provide a comprehensive financial analysis with:
1. Overall financial assessment
2. Key strengths (as an array)
3. Key concerns (as an array)
4. How the business compares to industry benchmarks
5. Credit score assessment

Format your response as JSON with this structure:
{
  "assessment": "<overall assessment in one sentence>",
  "strengths": [<array of strength points>],
  "concerns": [<array of concern points>],
  "industryComparison": "<comparison to industry>",
  "creditAssessment": "<credit score evaluation>"
}`;

    const response = await this.callClaude(prompt);

    // Parse Claude's response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        console.log(`[Financial Analyst] Completed. Assessment: ${result.assessment}`);
        return result;
      }
    } catch (error) {
      console.error('Failed to parse Financial Analyst response:', error);
    }

    // Fallback response
    return {
      assessment: 'Unable to complete analysis',
      strengths: [],
      concerns: [],
      industryComparison: 'No data available',
      creditAssessment: 'Unable to assess'
    };
  }
}
