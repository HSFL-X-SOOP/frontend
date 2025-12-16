/**
 * Search and fuzzy matching utilities
 * Extracted from SensorList to allow memoization and reuse
 */

/**
 * Normalize string for comparison: lowercase, remove diacritics, trim
 */
export const normalize = (s: string): string =>
    s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]+/g, '')
        .trim();

/**
 * Check if query is a subsequence of target string
 */
export const isSubsequence = (q: string, t: string): boolean => {
    let qi = 0;
    for (let i = 0; i < t.length && qi < q.length; i++) {
        if (t[i] === q[qi]) qi++;
    }
    return qi === q.length;
};

/**
 * Calculate Levenshtein distance between two strings
 * Time complexity: O(m*n) where m and n are string lengths
 */
export const levenshtein = (a: string, b: string): number => {
    if (a === b) return 0;
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = new Array(n + 1);
    for (let j = 0; j <= n; j++) dp[j] = j;
    for (let i = 1; i <= m; i++) {
        let prev = i - 1;
        dp[0] = i;
        for (let j = 1; j <= n; j++) {
            const tmp = dp[j];
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[j] = Math.min(
                dp[j] + 1,
                dp[j - 1] + 1,
                prev + cost
            );
            prev = tmp;
        }
    }
    return dp[n];
};

/**
 * Fuzzy match query against multiple candidate strings
 * Returns true if query matches any candidate using:
 * 1. Substring matching
 * 2. Subsequence matching
 * 3. Levenshtein distance (>= 0.6 similarity threshold)
 */
export const fuzzyMatch = (queryRaw: string, candidates: string[]): boolean => {
    const q = normalize(queryRaw);
    if (!q) return true;
    return candidates.some((raw) => {
        const t = normalize(raw);
        if (t.includes(q)) return true;
        if (isSubsequence(q, t)) return true;
        const dist = levenshtein(q, t);
        const maxLen = Math.max(q.length, t.length) || 1;
        const similarity = 1 - dist / maxLen;
        return similarity >= 0.6;
    });
};
