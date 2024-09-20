import { formatDistanceToNow } from 'date-fns';

/**
 * Converts a Unix timestamp (in seconds) to a "time ago" string.
 * @param timestamp - Unix timestamp in seconds.
 * @returns {string} - Human-readable "time ago" string.
 */
export const getTimeAgo = (timestamp: number): string => {
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
};

export const formatSeconds = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconds`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutes`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hours`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days} days`;
  }
}

export const formatTimestamp = (unixTimestamp: number): string => {
  const now = Date.now();
  const timeDifference = now - unixTimestamp * 1000;
  const secondsAgo = Math.floor(timeDifference / 1000);

  let timeAgo: string;
  if (secondsAgo < 60) {
    timeAgo = `${secondsAgo} secs ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    timeAgo = `${minutesAgo} mins ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    timeAgo = `${hoursAgo} hours ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    timeAgo = `${daysAgo} days ago`;
  }

  const date = new Date(unixTimestamp * 1000);

  // Formatting date in UTC (dd-MM-yyyy hh:mm:ss PM UTC)
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getUTCFullYear();

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, '0');
  const period = isPM ? 'PM' : 'AM';

  const formattedDate = `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${period} UTC`;

  return `${timeAgo} (${formattedDate})`;
}

export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

export const truncateDecimals = (num: number): string => {
  let result =  num.toString().match(/^-?\d+(\.\d{0,2})?/);
  if (result){
    return result[0];
  }
  return 'N/A'
}