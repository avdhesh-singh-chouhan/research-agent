import Exa from 'exa-js';

export class ExaService {
  private exa: Exa;

  constructor(apiKey: string) {
    this.exa = new Exa(apiKey);
  }

  async searchCompany(businessName: string, location: string): Promise<any> {
    try {
      const query = `${businessName} ${location} business information`;
      const result = await this.exa.searchAndContents(query, {
        numResults: 3,
        useAutoprompt: true,
        text: { maxCharacters: 1000 }
      });
      return result;
    } catch (error) {
      console.error('Exa search error:', error);
      return { results: [] };
    }
  }

  async searchNews(businessName: string): Promise<any> {
    try {
      const query = `${businessName} news articles reviews`;
      const result = await this.exa.searchAndContents(query, {
        numResults: 5,
        useAutoprompt: true,
        text: { maxCharacters: 500 }
      });
      return result;
    } catch (error) {
      console.error('Exa news search error:', error);
      return { results: [] };
    }
  }

  async searchIndustryInfo(industry: string): Promise<any> {
    try {
      const query = `${industry} industry trends statistics benchmarks 2026`;
      const result = await this.exa.searchAndContents(query, {
        numResults: 3,
        useAutoprompt: true,
        text: { maxCharacters: 800 }
      });
      return result;
    } catch (error) {
      console.error('Exa industry search error:', error);
      return { results: [] };
    }
  }

  async searchRisks(businessName: string, industry: string): Promise<any> {
    try {
      const query = `${businessName} ${industry} lawsuits complaints risks problems`;
      const result = await this.exa.searchAndContents(query, {
        numResults: 5,
        useAutoprompt: true,
        text: { maxCharacters: 500 }
      });
      return result;
    } catch (error) {
      console.error('Exa risk search error:', error);
      return { results: [] };
    }
  }
}
