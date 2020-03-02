// Time constants
const month = 30 * 24 *  60 * 60 * 1000;
const day = 24 * 60 * 60 * 1000;
const hour = 60 * 60 * 1000;
const minute = 60 * 1000;

/**
 * @function
 * Creates readable amount of time ago string given backend provided Date string (ISO-8601 date string)
 * eg. 2 months ago, 2 days ago, 2 hours ago, 2 minutes ago
 * @param date 
 */
export function getDateString(date: string): string {
    let currentDate = new Date();
    let newDate = new Date(date);
    let difference = Math.abs(currentDate.getTime() - newDate.getTime());
    let monthAgo = Math.round(difference / month);
    if (monthAgo > 0) {
      return monthAgo === 1? "1 month ago" : `${monthAgo} months ago`;
    }
    let daysAgo = Math.round(difference / day);
    if (daysAgo > 0) {
      return daysAgo === 1? "1 day ago" : `${daysAgo} days ago`;
    }
    let hoursAgo = Math.round(difference / hour);
    if (hoursAgo > 0){
      return hoursAgo === 1? "1 hour ago" : `${hoursAgo} hours ago`;
    }
    let minutesAgo = Math.round(difference / minute);
    return minutesAgo === 0? "Now" : minutesAgo === 1? "1 minute ago" : `${minutesAgo} minutes ago`;
}