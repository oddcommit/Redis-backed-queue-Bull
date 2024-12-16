import fs from 'fs/promises';
import path from 'path';

interface CacheEntry {
  id: number;
  timestamp: number;
}

class CacheService {
  private cacheFile = path.join(__dirname, '../cache.json');
  private cache: Map<number, number> = new Map();
  private CACHE_DURATION = 3 * 60 * 1000;

  constructor() {
    this.loadCache();
    this.startCleanupInterval();
  }

  private async loadCache() {
    try {
      const data = await fs.readFile(this.cacheFile, 'utf-8');
      const entries: CacheEntry[] = JSON.parse(data);
      entries.forEach(entry => {
        this.cache.set(entry.id, entry.timestamp);
      });
    } catch (error) {
      await this.saveCache();
    }
  }

  private async saveCache() {
    const entries: CacheEntry[] = Array.from(this.cache.entries()).map(([id, timestamp]) => ({
      id,
      timestamp
    }));
    await fs.writeFile(this.cacheFile, JSON.stringify(entries, null, 2));
  }

  private startCleanupInterval() {
    setInterval(() => {
      const now = Date.now();
      for (const [id, timestamp] of this.cache.entries()) {
        if (now - timestamp > this.CACHE_DURATION) {
          this.cache.delete(id);
        }
      }
      this.saveCache();
    }, 60000);
  }

  async set(id: number) {
    this.cache.set(id, Date.now());
    await this.saveCache();
  }

  has(id: number): boolean {
    const timestamp = this.cache.get(id);
    if (!timestamp) return false;
    return Date.now() - timestamp <= this.CACHE_DURATION;
  }
}

export default new CacheService();
