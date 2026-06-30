const rateLimits = new Map();

const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes default
    max = 100, // Limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.'
  } = options;

  return (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress;
    
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    const now = Date.now();
    let clientRecord = rateLimits.get(ip);

    if (!clientRecord) {
      clientRecord = {
        resetTime: now + windowMs,
        count: 1
      };
      rateLimits.set(ip, clientRecord);
    } else {
      if (now > clientRecord.resetTime) {
        clientRecord.resetTime = now + windowMs;
        clientRecord.count = 1;
      } else {
        clientRecord.count++;
      }
    }

    const remaining = Math.max(0, max - clientRecord.count);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(clientRecord.resetTime / 1000));

    if (clientRecord.count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    next();
  };
};

module.exports = rateLimiter;
