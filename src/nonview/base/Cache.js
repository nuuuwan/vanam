export default class Cache {
  static CACHE_VERSION = "v1";
  static LOCAL_CACHE = {};
  static LOCAL_CACHE_SIZE = 0;

  static _getCacheKey(key) {
    return `${key}-${this.CACHE_VERSION}`;
  }

  static _readFromCache(cacheKey) {
    if (Cache.LOCAL_CACHE[cacheKey] !== undefined) {
      return { found: true, value: Cache.LOCAL_CACHE[cacheKey] };
    }

    try {
      const cachedValue = localStorage.getItem(cacheKey);
      if (cachedValue !== null) {
        return { found: true, value: JSON.parse(cachedValue) };
      }
    } catch (error) {
      console.error(`Error reading from cache for key "${cacheKey}":`, error);
    }

    return { found: false };
  }

  static _writeToCache(cacheKey, value) {
    try {
      const payload = JSON.stringify(value);
      const payloadSize = payload.length;
      localStorage.setItem(cacheKey, payload);
      Cache.LOCAL_CACHE[cacheKey] = value;
      Cache.LOCAL_CACHE_SIZE += payloadSize;

      if (Cache.LOCAL_CACHE_SIZE > 5 * 1_000_000 || payloadSize > 100_000) {
        console.warn(
          `⚠️[Cache] ${(payloadSize / 1_000_000.0).toFixed(3)}MB/${(
            Cache.LOCAL_CACHE_SIZE / 1_000_000.0
          ).toFixed(1)}MB: "${cacheKey}"`,
        );
      }
    } catch (error) {
      console.error(`Error writing to cache for key "${cacheKey}":`, error);
      localStorage.clear();
    }
  }

  static get(key, callback) {
    const cacheKey = this._getCacheKey(key);
    const cached = this._readFromCache(cacheKey);

    if (cached.found) {
      return cached.value;
    }

    const value = callback();
    this._writeToCache(cacheKey, value);
    return value;
  }

  static async getAsync(key, callback) {
    const cacheKey = this._getCacheKey(key);
    const cached = this._readFromCache(cacheKey);

    if (cached.found) {
      return cached.value;
    }

    const value = await callback();
    this._writeToCache(cacheKey, value);
    return value;
  }
}
