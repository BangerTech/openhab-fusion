// Neues Cache-System für Offline-Funktionalität
export class CacheManager {
  static async cacheItems(items: any[]) {
    try {
      await localStorage.setItem('cached_items', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to cache items:', e);
    }
  }

  static async getCachedItems() {
    try {
      const cached = localStorage.getItem('cached_items');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      console.error('Failed to get cached items:', e);
      return [];
    }
  }
} 