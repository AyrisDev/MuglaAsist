import { HoursJSON, DayName } from '../types/database';

const DAY_NAMES: DayName[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/**
 * Check if a venue is currently open based on its hours
 * @param hours - The venue's hours JSON
 * @returns true if the venue is currently open, false otherwise
 */
export function isVenueOpen(hours?: HoursJSON): boolean {
  if (!hours) return false;

  const now = new Date();
  const currentDay = DAY_NAMES[now.getDay()];
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const todayHours = hours[currentDay];
  if (!todayHours) return false;

  const { open, close, is_next_day } = todayHours;

  // If closing time is next day (e.g., opens 09:00, closes 02:00 next day)
  if (is_next_day) {
    // Open if current time >= open OR current time < close
    return currentTime >= open || currentTime < close;
  }

  // Normal case: open and close on the same day
  return currentTime >= open && currentTime < close;
}

/**
 * Get the formatted hours for a specific day
 * @param hours - The venue's hours JSON
 * @param day - The day name
 * @returns Formatted string like "09:00 - 23:00" or "Kapalı"
 */
export function getFormattedHours(
  hours?: HoursJSON,
  day?: DayName
): string {
  if (!hours) return 'Bilinmiyor';

  const targetDay = day || DAY_NAMES[new Date().getDay()];
  const dayHours = hours[targetDay];

  if (!dayHours) return 'Kapalı';

  const { open, close, is_next_day } = dayHours;
  const suffix = is_next_day ? ' (ertesi gün)' : '';
  return `${open} - ${close}${suffix}`;
}

/**
 * Get all days with their hours formatted
 * @param hours - The venue's hours JSON
 * @returns Array of {day, formatted, isToday, isOpen}
 */
export function getAllDaysFormatted(hours?: HoursJSON) {
  const today = DAY_NAMES[new Date().getDay()];

  const dayLabels: Record<DayName, string> = {
    monday: 'Pazartesi',
    tuesday: 'Salı',
    wednesday: 'Çarşamba',
    thursday: 'Perşembe',
    friday: 'Cuma',
    saturday: 'Cumartesi',
    sunday: 'Pazar',
  };

  return DAY_NAMES.map((day) => ({
    day,
    label: dayLabels[day],
    formatted: getFormattedHours(hours, day),
    isToday: day === today,
    hasHours: hours?.[day] !== undefined,
  }));
}
