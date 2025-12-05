import dayjs, { Dayjs } from 'dayjs';
import type { DateInput } from '../types';

/**
 * Convert various date input types to Dayjs object
 */
export const toDayjs = (date: DateInput): Dayjs | null => {
  if (!date) return null;
  if (dayjs.isDayjs(date)) return date;
  const d = dayjs(date);
  return d.isValid() ? d : null;
};

/**
 * Convert Dayjs to Date object
 */
export const toDate = (date: Dayjs | null): Date | null => {
  if (!date) return null;
  return date.toDate();
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (day1: DateInput, day2: DateInput): boolean => {
  const d1 = toDayjs(day1);
  const d2 = toDayjs(day2);
  if (!d1 || !d2) return false;
  return d1.isSame(d2, 'day');
};

/**
 * Check if date1 is before date2
 */
export const isBefore = (day1: DateInput, day2: DateInput): boolean => {
  const d1 = toDayjs(day1);
  const d2 = toDayjs(day2);
  if (!d1 || !d2) return false;
  return d1.isBefore(d2, 'day');
};

/**
 * Check if date1 is after date2
 */
export const isAfter = (day1: DateInput, day2: DateInput): boolean => {
  const d1 = toDayjs(day1);
  const d2 = toDayjs(day2);
  if (!d1 || !d2) return false;
  return d1.isAfter(d2, 'day');
};

/**
 * Check if date is between start and end (inclusive)
 */
export const isInRange = (date: DateInput, start: DateInput, end: DateInput): boolean => {
  const d = toDayjs(date);
  const s = toDayjs(start);
  const e = toDayjs(end);
  if (!d || !s || !e) return false;
  return (
    (d.isAfter(s, 'day') || d.isSame(s, 'day')) && (d.isBefore(e, 'day') || d.isSame(e, 'day'))
  );
};

/**
 * Get number of days in month
 */
export const getDaysInMonth = (date: DateInput): number => {
  const d = toDayjs(date);
  if (!d) return 0;
  return d.daysInMonth();
};

/**
 * Get start of week
 */
export const getStartOfWeek = (date: DateInput, weekStartsOn: number = 0): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  const day = d.day();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  return d.subtract(diff, 'day').startOf('day');
};

/**
 * Get end of week
 */
export const getEndOfWeek = (date: DateInput, weekStartsOn: number = 0): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  const start = getStartOfWeek(d, weekStartsOn);
  if (!start) return null;
  return start.add(6, 'day').endOf('day');
};

/**
 * Add days to date
 */
export const addDays = (date: DateInput, days: number): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  return d.add(days, 'day');
};

/**
 * Subtract days from date
 */
export const subtractDays = (date: DateInput, days: number): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  return d.subtract(days, 'day');
};

/**
 * Add months to date
 */
export const addMonths = (date: DateInput, months: number): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  return d.add(months, 'month');
};

/**
 * Subtract months from date
 */
export const subtractMonths = (date: DateInput, months: number): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  return d.subtract(months, 'month');
};

/**
 * Format date string
 */
export const formatDate = (date: DateInput, format: string = 'YYYY-MM-DD'): string => {
  const d = toDayjs(date);
  if (!d) return '';
  return d.format(format);
};

/**
 * Parse date string
 */
export const parseDate = (dateString: string, format?: string): Dayjs | null => {
  if (!dateString) return null;
  const d = format ? dayjs(dateString, format) : dayjs(dateString);
  return d.isValid() ? d : null;
};

/**
 * Get start of month
 */
export const getStartOfMonth = (date: DateInput): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  return d.startOf('month');
};

/**
 * Get end of month
 */
export const getEndOfMonth = (date: DateInput): Dayjs | null => {
  const d = toDayjs(date);
  if (!d) return null;
  return d.endOf('month');
};

/**
 * Check if date is today
 */
export const isToday = (date: DateInput): boolean => {
  return isSameDay(date, dayjs());
};

/**
 * Check if date is in the same month
 */
export const isSameMonth = (day1: DateInput, day2: DateInput): boolean => {
  const d1 = toDayjs(day1);
  const d2 = toDayjs(day2);
  if (!d1 || !d2) return false;
  return d1.isSame(d2, 'month');
};

/**
 * Get calendar days for a month (including previous/next month days)
 * Always returns 42 days (6 weeks) to ensure consistent calendar height
 */
export const getCalendarDays = (date: DateInput, weekStartsOn: number = 0): Dayjs[] => {
  const d = toDayjs(date);
  if (!d) return [];

  const startOfMonth = d.startOf('month');
  const startOfCalendar = getStartOfWeek(startOfMonth, weekStartsOn);

  if (!startOfCalendar) return [];

  const days: Dayjs[] = [];
  let current = startOfCalendar;

  // Always show exactly 6 weeks (42 days) for consistent calendar height
  for (let i = 0; i < 42; i++) {
    days.push(current);
    current = current.add(1, 'day');
  }

  return days;
};

/**
 * Check if date is actually disabled (due to min/max/disabledDates/disabledDay constraints)
 * This does NOT check if the date is in the current month - adjacent month dates can be selected
 */
export const isDateDisabled = (
  date: DateInput,
  disabledDates?: DateInput[],
  disabledDay?: (date: Dayjs) => boolean,
  minDate?: DateInput,
  maxDate?: DateInput
): boolean => {
  const d = toDayjs(date);
  if (!d) return true;

  // Check min/max date
  if (minDate && isBefore(d, minDate)) return true;
  if (maxDate && isAfter(d, maxDate)) return true;

  // Check disabled dates array
  if (disabledDates && disabledDates.some((disabledDate) => isSameDay(d, disabledDate))) {
    return true;
  }

  // Check disabled day function
  if (disabledDay && disabledDay(d)) return true;

  return false;
};

/**
 * Check if date should be disabled for selection in a specific month view
 * This includes both actual disabled dates AND dates from adjacent months
 * @deprecated Use isDateDisabled for actual constraints and isSameMonth for month check separately
 */
export const isDateDisabledInMonth = (
  date: DateInput,
  month: DateInput,
  disabledDates?: DateInput[],
  disabledDay?: (date: Dayjs) => boolean,
  minDate?: DateInput,
  maxDate?: DateInput
): boolean => {
  const d = toDayjs(date);
  if (!d) return true;

  // Dates from adjacent months should be disabled in current month view
  if (!isSameMonth(d, month)) return true;

  // Check actual disabled constraints
  return isDateDisabled(date, disabledDates, disabledDay, minDate, maxDate);
};
