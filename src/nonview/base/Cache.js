export default class Cache {
  static SALT = "v1";
  static CACHE_DURATION_MS = 10 * 60 * 1000;
  static LOCAL_CACHE = {};
  static LOCAL_CACHE_SIZE = 0;

  static get(key, callback) {
    const roundedTimestamp = Math.floor(Date.now() / this.CACHE_DURATION_MS);
    const cacheKey = `${key}-${roundedTimestamp}-${this.SALT}`;

    if (Cache.LOCAL_CACHE[cacheKey] !== undefined) {
      return Cache.LOCAL_CACHE[cacheKey];
    }

    try {
      const cachedValue = localStorage.getItem(cacheKey);
      if (cachedValue !== null) {
        return JSON.parse(cachedValue);
      }
    } catch (error) {
      console.error(`Error reading from cache for key "${cacheKey}":`, error);
    }

    const value = callback();

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
          ).toFixed(1)}MB: "${cacheKey}"`
        );
      }
    } catch (error) {
      console.error(`Error writing to cache for key "${cacheKey}":`, error);
      localStorage.clear();
    }

    return value;
  }
}
