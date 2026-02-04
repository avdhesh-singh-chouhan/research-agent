import Anthropic from '@anthropic-ai/sdk';

export abstract class BaseAgent {
  protected client: Anthropic;
  protected model: string = 'claude-sonnet-4-5-20250929';

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  protected async callClaude(prompt: string): Promise<string> {
    try {
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = message.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      return '';
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }

  abstract analyze(data: any): Promise<any>;
}
