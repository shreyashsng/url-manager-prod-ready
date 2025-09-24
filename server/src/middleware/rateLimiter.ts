import rateLimit from 'express-rate-limit';

export const createUrlLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 25,
    message: {error: "Too many requests, please try again later."},
    standardHeaders: true,
    legacyHeaders: false,
})