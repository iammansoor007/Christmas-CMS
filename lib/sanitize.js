/**
 * Sanitize a string by removing HTML tags and trimming whitespace.
 * Prevents XSS injection in CMS fields and form inputs.
 */
export function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/<[^>]*>/g, '')   // Strip HTML tags
        .replace(/&lt;/g, '<')      // Decode common entities for re-stripping
        .replace(/&gt;/g, '>')
        .replace(/<[^>]*>/g, '')   // Strip again after decode
        .trim();
}

/**
 * Recursively sanitize all string values in an object.
 * Safe for nested CMS content objects.
 * @param {any} obj - The object to sanitize
 * @param {string[]} skipKeys - Keys to skip (e.g., 'password', 'image')
 * @returns {any} - Sanitized copy
 */
export function sanitizeObject(obj, skipKeys = ['password', 'image', 'imageUrl', 'src', 'logo', 'favicon', 'url', 'href', 'icon', 'svg', 'path', 'd', 'mapUrl']) {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        return sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item, skipKeys));
    }

    if (typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (skipKeys.includes(key)) {
                sanitized[key] = value; // Don't sanitize URLs/images
            } else {
                sanitized[key] = sanitizeObject(value, skipKeys);
            }
        }
        return sanitized;
    }

    return obj; // numbers, booleans, etc.
}
