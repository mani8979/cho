const cache = new Map();

const getCacheKey = (req) => {
  return req.originalUrl || req.url;
};

const cacheMiddleware = (durationSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = getCacheKey(req);
    const cached = cache.get(key);

    if (cached && cached.expiry > Date.now()) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    // Override res.json to capture data
    const originalJson = res.json;
    res.json = function (data) {
      const statusCode = res.statusCode;
      if (statusCode >= 200 && statusCode < 300) {
        cache.set(key, {
          data,
          expiry: Date.now() + durationSeconds * 1000
        });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson.call(this, data);
    };

    next();
  };
};

const invalidateCache = (patterns) => {
  const keys = Array.from(cache.keys());
  for (const key of keys) {
    for (const pattern of patterns) {
      if (key.includes(pattern)) {
        cache.delete(key);
        break;
      }
    }
  }
};

const clearAllCache = () => {
  cache.clear();
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  clearAllCache
};
