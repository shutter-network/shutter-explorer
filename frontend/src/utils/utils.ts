
/**
 * Converts a Unix timestamp (in seconds) to a "time ago" string.
 * @param timestamp - Unix timestamp in seconds.
 * @returns {string} - Human-readable "time ago" string.
 */
export const getTimeAgo = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  const seconds = diff;
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes === 1) {
    return '1 minute ago';
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return '1 hour ago';
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days === 1) {
    return '1d ago';
  } else if (days < 7) {
    return `${days}d ago`;
  } else if (weeks === 1) {
    return '1 week ago';
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months === 1) {
    return '1 month ago';
  } else if (months < 12) {
    return `${months} months ago`;
  } else if (years === 1) {
    return '1 year ago';
  } else {
    return `${years} years ago`;
  }
};

export const formatSeconds = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} ${seconds == 1 ? 'second' : 'seconds'}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} ${minutes == 1 ? 'minute' : 'minutes'}`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} ${hours == 1 ? 'hour' : 'hours'}`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days} ${days == 1 ? 'day' : 'days'}`;
  }
}

export const formatTimestamp = (ago: boolean, unixTimestamp: number): string => {
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

  if (ago) {
    return `${timeAgo} (${formattedDate})`;
  } else {
    return `${formattedDate}`;
  }
}

export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
}

export const truncateDecimals = (num: number): string => {
  let result = num.toString().match(/^-?\d+(\.\d{0,2})?/);
  if (result) {
    return result[0];
  }
  return 'N/A'
}

export const formatTime = (seconds: number | undefined): string => {
  if (seconds) {
    if (seconds >= 86400) {
      let days = seconds / 86400
      return `${truncateDecimals(days)}d`
    } else if (seconds >= 3600) {
      let hours = Math.floor(seconds / 3600);
      return `${hours}h`;
    } else if (seconds >= 60) {
      let minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  }
  return ''
}