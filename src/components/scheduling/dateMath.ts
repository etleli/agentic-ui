export const minutesPerDay = 1440;

// ISO dates and local wall-clock date-times are projected without host timezone shifts.
export function civilMinute(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}(?:T(?:[01]\d|2[0-3]):[0-5]\d)?$/.test(value)) return undefined;
  const timestamp = Date.parse(value.length === 10 ? `${value}T00:00:00Z` : `${value}:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, value.length) !== value) return undefined;
  return timestamp / 60000;
}

export const civilDate = (minute: number) => new Date(minute * 60000);
export const civilDay = (minute: number) => civilDate(minute).toISOString().slice(0, 10);
export function clockText(minute: number) {
  return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
}
