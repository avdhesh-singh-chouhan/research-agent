import { BaseAgent } from './base-agent.js';
import { ExaService } from '../services/exa-service.js';
import { Submission, BusinessVerificationResult } from '../types.js';

export class BusinessVerifierAgent extends BaseAgent {
  private exaService: ExaService;

  constructor(apiKey: string, exaApiKey: string) {
    super(apiKey);
    this.exaService = new ExaService(exaApiKey);
  }

  async analyze(submission: Submission): Promise<BusinessVerificationResult> {
    console.log(`[Business Verifier] Analyzing ${submission.businessName}...`);

    // Search for company information using Exa
    const companyInfo = await this.exaService.searchCompany(
      submission.businessName,
      submission.location
    );

    // Search for news and reviews
    const newsInfo = await this.exaService.searchNews(submission.businessName);

    // Prepare data for Claude analysis
    const companyResults = companyInfo.results || [];
    const newsResults = newsInfo.results || [];

    const prompt = `You are a business verification specialist for underwriting. Analyze the following information about a business:

Business Name: ${submission.businessName}
Location: ${submission.location}
Website: ${submission.website || 'Not provided'}
Years in Business: ${submission.yearsInBusiness}

Company Information from Web Search:
${companyResults.map((r: any, i: number) => `
${i + 1}. ${r.title}
   URL: ${r.url}
   Content: ${r.text || 'No content'}
`).join('\n')}

Recent News and Reviews:
${newsResults.map((r: any, i: number) => `
${i + 1}. ${r.title}
   URL: ${r.url}
   Content: ${r.text || 'No content'}
`).join('\n')}

Provide a verification analysis with:
1. Legitimacy score (0-100)
2. Whether the business appears to be registered and legitimate
3. Quality of online presence (Strong/Moderate/Weak/None)
4. Key findings from news and reviews
5. Summary assessment

Format your response as JSON with this structure:
{
  "legitimacyScore": <number>,
  "registered": <boolean>,
  "onlinePresence": "<Strong/Moderate/Weak/None>",
  "websiteFound": <boolean>,
  "recentNews": [<array of key news points>],
  "sources": [<array of source URLs>],
  "summary": "<brief summary>"
}`;

    const response = await this.callClaude(prompt);

    // Parse Claude's response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        console.log(`[Business Verifier] Completed. Legitimacy score: ${result.legitimacyScore}`);
        return result;
      }
    } catch (error) {
      console.error('Failed to parse Business Verifier response:', error);
    }

    // Fallback response
    return {
      legitimacyScore: 50,
      registered: true,
      onlinePresence: 'Unknown',
      websiteFound: !!submission.website,
      recentNews: [],
      sources: [],
      summary: 'Unable to complete verification'
    };
  }
}
