export class OpenHABService {
  constructor(private baseUrl: string) {
    if (!baseUrl) {
      throw new Error('OpenHAB URL is not configured');
    }
    console.log('Connecting to OpenHAB at:', baseUrl);
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
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/rest/items/${itemName}/state`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: state
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update state:', error);
      throw error;
    }
  }

  subscribeToUpdates(callback: (event: any) => void) {
    try {
      const eventSource = new EventSource(`${this.baseUrl}/rest/events`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ItemStateEvent' || data.type === 'ItemStateChangedEvent') {
            callback(data);
          }
        } catch (error) {
          console.error('Failed to parse event data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        setTimeout(() => {
          this.subscribeToUpdates(callback);
        }, 5000);
      };

      return () => eventSource.close();
    } catch (error) {
      console.error('Failed to subscribe to updates:', error);
      throw error;
    }
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
} 