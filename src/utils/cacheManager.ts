interface CacheEntry {
    data: any;
    etag: string;
    timestamp: number;
    ttl: number; // milliseconds
}

class CacheManager {
    private cache: Map<string, CacheEntry> = new Map();

    set(key: string, data: any, etag: string, ttl: number = 300000) {
        // ttl default: 5 minutes
        this.cache.set(key, {
            data,
            etag,
            timestamp: Date.now(),
            ttl,
        });
    }

    get(key: string): any | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    getETag(key: string): string | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.etag;
    }

    invalidate(key: string) {
        this.cache.delete(key);
    }

    invalidatePattern(pattern: string) {
        // Invalidate all keys matching pattern
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    clear() {
        this.cache.clear();
    }
}

export const cacheManager = new CacheManager();
