// Converts a Date into a plain YYYY-MM-DD string using LOCAL time —
// deliberately not .toISOString(), which secretly uses UTC and can
// silently shift the date by a day depending on your timezone,
// especially at night.
export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Figures out the "cultivation day" for a given real date — anything
// before 3am still counts as the previous day.
export function getCultivationDate(date: Date = new Date()): string {
  const d = new Date(date);
  if (d.getHours() < 3) {
    d.setDate(d.getDate() - 1);
  }
  return toDateString(d);
}

// How many whole days between two "cultivation dates" (YYYY-MM-DD strings)
export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((end.getTime() - start.getTime()) / msPerDay);
}