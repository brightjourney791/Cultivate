import { Season, Weather } from '../../services/worldService';

// General lines the companion might say regardless of season/weather.
export const AMBIENT_LINES: string[] = [
  'Welcome back.',
  "It's good to see you again.",
  'Rest is also part of growing.',
];

// Lines tied to the current season. Add more anytime — no other code
// needs to change.
export const SEASON_LINES: Record<Season, string[]> = {
  spring: [
    'The plum blossoms are lovely this spring.',
    'Everything feels new again.',
  ],
  summer: [
    'The days are long and warm.',
    'Summer is a good season for tea in the shade.',
  ],
  autumn: [
    'The leaves are turning beautifully.',
    'The air smells like fallen leaves.',
  ],
  winter: [
    'The cold makes tea taste even better.',
    'Winter has its own quiet beauty.',
  ],
};

// Lines tied to the current weather. Same idea — just add strings.
export const WEATHER_LINES: Record<Weather, string[]> = {
  sunny: ['What a clear, sunny day.'],
  rain: ['I love the sound of rain.'],
  fog: ['The mist is thick this morning.'],
  snow: ['Look how quietly the snow falls.'],
  wind: ['Feel that breeze?'],
  cloudy: ['A soft, cloudy day today.'],
};

// Lines said only in direct response to a tap.
export const TAP_REACTION_LINES: string[] = [
  'Oh, hello there.',
  'Have you eaten?',
  "Let's do our best today.",
  'The moon is nearly full.',
];