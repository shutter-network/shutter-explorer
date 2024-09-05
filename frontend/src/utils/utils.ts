import { formatDistanceToNow } from 'date-fns';

/**
 * Converts a Unix timestamp (in seconds) to a "time ago" string.
 * @param timestamp - Unix timestamp in seconds.
 * @returns {string} - Human-readable "time ago" string.
 */
export const getTimeAgo = (timestamp: number): string => {
    return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
};