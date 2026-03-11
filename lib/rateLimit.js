// In-memory rate limiter for API routes
// For production at scale, replace with Redis-based solution

const rateLimitStore = new Map();

// Clean up expired entries every 60 seconds
const CLEANUP_INTERVAL = 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of rateLimitStore) {
        if (now - entry.resetTime > 0) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Rate limit an API request
 * @param {Request} request - The incoming request
 * @param {Object} options
 * @param {number} options.maxRequests - Max requests per window (default: 30)
 * @param {number} options.windowMs - Time window in ms (default: 60000 = 1 min)
 * @returns {{ success: boolean, remaining: number, reset: number } | null}
 */
export function rateLimit(request, { maxRequests = 30, windowMs = 60000 } = {}) {
    cleanup();

    // Extract IP from headers (works behind proxies)
    const forwarded = request.headers?.get?.('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
    const key = `${ip}:${new URL(request.url).pathname}`;

    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
        // New window
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        });
        return { success: true, remaining: maxRequests - 1, reset: now + windowMs };
    }

    entry.count += 1;

    if (entry.count > maxRequests) {
        return { success: false, remaining: 0, reset: entry.resetTime };
    }

    return { success: true, remaining: maxRequests - entry.count, reset: entry.resetTime };
}

/**
 * Apply rate limiting to a request and return a 429 response if exceeded
 * @param {Request} request
 * @param {Object} options - Same as rateLimit options
 * @returns {Response|null} - Returns a 429 Response if rate limited, null if okay
 */
export function checkRateLimit(request, options = {}) {
    const result = rateLimit(request, options);

    if (!result.success) {
        return new Response(
            JSON.stringify({ error: 'Too many requests. Please try again later.' }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
                    'X-RateLimit-Limit': String(options.maxRequests || 30),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(result.reset),
                },
            }
        );
    }

    return null;
}
