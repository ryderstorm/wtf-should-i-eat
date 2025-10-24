import type { Restaurant } from '../types';

const today = new Date();
const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);

interface ClosingInfo {
  isOpen: boolean;
  closesAt: Date | null;
}

const parseTime = (timeStr: string): [number, number] | null => {
  if (!timeStr) return null;
  const cleanedTimeStr = timeStr.replace(/\s+/g, '').toUpperCase();
  const match = cleanedTimeStr.match(/(\d{1,2}):?(\d{2})?(AM|PM)/);
  if (!match) return null;

  let [, hoursStr, minutesStr, modifier] = match;
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;

  if (modifier === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier === 'AM' && hours === 12) { // Midnight case
    hours = 0;
  }
  return [hours, minutes];
};

const getClosingInfo = (restaurant: Restaurant): ClosingInfo => {
  const hoursToday = restaurant.hours?.[dayOfWeek as keyof typeof restaurant.hours];
  if (!hoursToday || hoursToday.toLowerCase() === 'closed') {
    return { isOpen: false, closesAt: null };
  }
  if (hoursToday.toLowerCase() === '24 hours') {
    const farFuture = new Date();
    farFuture.setDate(farFuture.getDate() + 1);
    return { isOpen: true, closesAt: farFuture };
  }

  const parts = hoursToday.split(/[-–]/);
  if (parts.length < 2) return { isOpen: false, closesAt: null };

  const startTimeParts = parseTime(parts[0]);
  const endTimeParts = parseTime(parts[1]);

  if (!startTimeParts || !endTimeParts) {
    return { isOpen: false, closesAt: null };
  }

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startTimeParts[0], startTimeParts[1]);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endTimeParts[0], endTimeParts[1]);
  
  // Handle overnight closing times (e.g., 8 PM - 2 AM)
  if (endDate <= startDate) {
    // If current time is after start time, end date is tomorrow.
    // If current time is before end time, start date was yesterday.
    if(now > startDate) {
      endDate.setDate(endDate.getDate() + 1);
    } else {
      startDate.setDate(startDate.getDate() -1);
    }
  }

  const isOpen = now >= startDate && now <= endDate;
  
  return {
    isOpen,
    closesAt: isOpen ? endDate : null,
  };
};

export const getClosingTime = (restaurant: Restaurant): string | null => {
    const hoursToday = restaurant.hours?.[dayOfWeek as keyof typeof restaurant.hours];
    if (!hoursToday || hoursToday.toLowerCase() === 'closed') {
        return null;
    }
    const parts = hoursToday.split(/[-–]/);
    return parts[1]?.trim() || null;
}


export const sortRestaurants = (restaurants: Restaurant[]): Restaurant[] => {
  return [...restaurants].sort((a, b) => {
    const infoA = getClosingInfo(a);
    const infoB = getClosingInfo(b);

    // One is open, the other is not
    if (infoA.isOpen && !infoB.isOpen) return -1;
    if (!infoA.isOpen && infoB.isOpen) return 1;

    // Both are open, sort by closing time (later first)
    if (infoA.isOpen && infoB.isOpen && infoA.closesAt && infoB.closesAt) {
      const timeDiff = infoB.closesAt.getTime() - infoA.closesAt.getTime();
      if (timeDiff !== 0) return timeDiff;
    }
    
    // If closing times are same or both are closed, sort by rating (higher first)
    const ratingDiff = b.rating.stars - a.rating.stars;
    if (ratingDiff !== 0) return ratingDiff;

    // As a final tie-breaker, sort by number of reviews
    return b.rating.count - a.rating.count;
  });
};