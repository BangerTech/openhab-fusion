export class OpenHABService {
  private baseUrl: string;
  private eventSource: EventSource | null = null;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async testConnection() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/rest/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw new Error(`Could not connect to OpenHAB: ${error.message}`);
    }
  }

  async getItems() {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/rest/items`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const items = await response.json();
      console.log('Loaded items:', items.length);
      return items;
    } catch (error) {
      console.error('Failed to fetch items:', error);
      throw new Error(`Failed to fetch items: ${error.message}`);
    }
  }

  async updateItemState(itemName: string, state: string) {
    try {
      const response = await fetch(`${this.baseUrl}/rest/items/${itemName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Accept': 'application/json'
        },
        body: state
      });

      if (!response.ok) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return this.updateItemState(itemName, state);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.retryCount = 0;
    } catch (error) {
      console.error('Failed to update item state:', error);
      throw error;
    }
  }

  subscribeToUpdates(callback: (event: any) => void) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(`${this.baseUrl}/rest/events`);
    
    this.eventSource.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ItemStateEvent' || data.type === 'ItemStateChangedEvent') {
          const payload = JSON.parse(data.payload);
          callback({
            topic: data.topic,
            payload: payload.value
          });
        }
      } catch (error) {
        console.error('Error parsing event data:', error);
      }
    });

    return () => {
      if (this.eventSource) {
        this.eventSource.close();
      }
    };
  }

  async getItemHistory(itemName: string, period: string) {
    try {
      const endTime = new Date().toISOString();
      const startTime = new Date(Date.now() - this.periodToMilliseconds(period)).toISOString();
      
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/rest/persistence/items/${itemName}?starttime=${startTime}&endtime=${endTime}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch item history:', error);
      throw error;
    }
  }

  private periodToMilliseconds(period: string): number {
    const value = parseInt(period);
    const unit = period.slice(-1);
    
    switch (unit) {
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'w': return value * 7 * 24 * 60 * 60 * 1000;
      default: return 24 * 60 * 60 * 1000; // Default to 24h
    }
  }

  async getItemState(itemName: string): Promise<string> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/rest/items/${itemName}/state`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Failed to fetch item state:', error);
      throw error;
    }
  }
} 