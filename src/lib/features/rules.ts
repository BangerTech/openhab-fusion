import type { Rule } from '../types/rules';

export class RuleManager {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getRules(): Promise<Rule[]> {
    const response = await fetch(`${this.baseUrl}/rest/rules`);
    return await response.json();
  }

  async createRule(rule: Rule): Promise<void> {
    await fetch(`${this.baseUrl}/rest/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rule)
    });
  }
} 