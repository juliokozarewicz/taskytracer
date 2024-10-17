import rateLimit from 'express-rate-limit';

// rate limiter
//------------------------------------------------------------------------
export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    status: "error",
    code: 429,
    message: 'Too many requests, please try again later',
  },
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];

    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0];
    } else if (Array.isArray(forwarded)) {
      return forwarded[0];
    }
    return req.ip || 'unknown';
  },
});
//------------------------------------------------------------------------