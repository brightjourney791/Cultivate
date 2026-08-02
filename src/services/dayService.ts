// Figures out the "cultivation day" for a given real date — anything
// before 3am still counts as the previous day, so a task written down
// late at night for "tomorrow" is still there when you wake up.
export function getCultivationDate(date: Date = new Date()): string {
  const d = new Date(date);
  if (d.getHours() < 3) {
    d.setDate(d.getDate() - 1);
  }
  return d.toISOString().split('T')[0]; // e.g. "2026-08-02"
}