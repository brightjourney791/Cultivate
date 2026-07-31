export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

// Figures out the current season from a real date.
// (Northern-hemisphere seasons for now — this is a good candidate
// to make configurable later, once the app supports more regions.)
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0 = January, 11 = December

  if (month === 11 || month === 0 || month === 1) return 'winter';
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  return 'autumn';
}
export type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';

// Figures out the current time of day from a real clock.
export function getCurrentTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours(); // 0–23

  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'sunset';
  return 'night';
}
export type Weather = 'sunny' | 'rain' | 'fog' | 'snow' | 'wind' | 'cloudy';