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
type WeatherWeight = { weather: Weather; weight: number };

// Each season only allows certain weather types — some combinations
// (like snow in summer) are excluded entirely, not just made rare.
// Within what's allowed, higher weight = more common.
const WEATHER_TABLE: Record<Season, WeatherWeight[]> = {
  spring: [
    { weather: 'sunny', weight: 30 },
    { weather: 'cloudy', weight: 25 },
    { weather: 'rain', weight: 25 },
    { weather: 'wind', weight: 15 },
    { weather: 'fog', weight: 10 },
    { weather: 'snow', weight: 3 },
  ],
  summer: [
    { weather: 'sunny', weight: 40 },
    { weather: 'cloudy', weight: 20 },
    { weather: 'rain', weight: 15 },
    { weather: 'wind', weight: 15 },
    { weather: 'fog', weight: 10 },
  ],
  autumn: [
    { weather: 'sunny', weight: 20 },
    { weather: 'cloudy', weight: 25 },
    { weather: 'rain', weight: 25 },
    { weather: 'wind', weight: 15 },
    { weather: 'fog', weight: 12 },
    { weather: 'snow', weight: 3 },
  ],
  winter: [
    { weather: 'sunny', weight: 20 },
    { weather: 'cloudy', weight: 25 },
    { weather: 'snow', weight: 25 },
    { weather: 'wind', weight: 15 },
    { weather: 'fog', weight: 15 },
  ],
};

// Rolls a random weather for the given season, respecting the
// weighted table above.
export function pickRandomWeather(season: Season): Weather {
  const options = WEATHER_TABLE[season];
  const totalWeight = options.reduce((sum, o) => sum + o.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const option of options) {
    if (roll < option.weight) return option.weather;
    roll -= option.weight;
  }
  return options[0].weather;
}