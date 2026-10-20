// src/lib/sanity/cache.ts
// Cache for frequently accessed data
const novelCache = new Map();
const metadataCache = new Map();

export const NovelCache = {
  // Cache novels by page
  setNovelsPage(page: number, limit: number, novels: any[]) {
    const key = `novels_${page}_${limit}`;
    novelCache.set(key, {
      data: novels,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000 // 5 minutes TTL
    });
  },

  getNovelsPage(page: number, limit: number): any[] | null {
    const key = `novels_${page}_${limit}`;
    const cached = novelCache.get(key);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Remove expired cache
    novelCache.delete(key);
    return null;
  },

  // Cache metadata
  setMetadata(type: string, data: any) {
    const key = `metadata_${type}`;
    metadataCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: 10 * 60 * 1000 // 10 minutes TTL
    });
  },

  getMetadata(type: string): any | null {
    const key = `metadata_${type}`;
    const cached = metadataCache.get(key);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Remove expired cache
    metadataCache.delete(key);
    return null;
  },

  clear() {
    novelCache.clear();
    metadataCache.clear();
  }
};