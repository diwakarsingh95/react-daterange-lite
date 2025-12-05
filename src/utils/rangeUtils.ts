import type { DateInput, Range } from '../types';
import { isInRange, isSameDay, toDayjs } from './dateUtils';

/**
 * Check if a date is the start date of a range
 */
export const isStartDate = (date: DateInput, range: Range): boolean => {
  if (!range.startDate) return false;
  return isSameDay(date, range.startDate);
};

/**
 * Check if a date is the end date of a range
 */
export const isEndDate = (date: DateInput, range: Range): boolean => {
  if (!range.endDate) return false;
  return isSameDay(date, range.endDate);
};

/**
 * Check if a date is in a range (between start and end, inclusive)
 */
export const isDateInRange = (date: DateInput, range: Range): boolean => {
  if (!range.startDate || !range.endDate) return false;
  return isInRange(date, range.startDate, range.endDate);
};

/**
 * Check if a date is the start of a range (first day)
 */
export const isRangeStart = (date: DateInput, range: Range, weekStartsOn: number = 0): boolean => {
  if (!range.startDate) return false;
  const d = toDayjs(date);
  const start = toDayjs(range.startDate);
  if (!d || !start) return false;
  return isSameDay(d, start) || (d.isSame(start, 'week') && d.day() === weekStartsOn);
};

/**
 * Check if a date is the end of a range (last day)
 */
export const isRangeEnd = (date: DateInput, range: Range, weekStartsOn: number = 0): boolean => {
  if (!range.endDate) return false;
  const d = toDayjs(date);
  const end = toDayjs(range.endDate);
  if (!d || !end) return false;
  return isSameDay(d, end) || (d.isSame(end, 'week') && d.day() === (weekStartsOn + 6) % 7);
};

/**
 * Get the range that contains a date
 */
export const getRangeForDate = (date: DateInput, ranges: Range[]): Range | null => {
  const d = toDayjs(date);
  if (!d) return null;

  for (const range of ranges) {
    if (isDateInRange(d, range) || isStartDate(d, range) || isEndDate(d, range)) {
      return range;
    }
  }

  return null;
};

/**
 * Check if a date is in any range
 */
export const isDateInAnyRange = (date: DateInput, ranges: Range[]): boolean => {
  return ranges.some((range) => isDateInRange(date, range));
};

/**
 * Get preview range (for hover effects)
 */
export const getPreviewRange = (date: DateInput, range: Range): Range | null => {
  if (!range) return null;

  const d = toDayjs(date);
  if (!d) return null;

  const startDate = toDayjs(range.startDate);
  const endDate = toDayjs(range.endDate);

  if (!startDate && !endDate) {
    return {
      startDate: d.toDate(),
      endDate: d.toDate(),
      color: range.color,
      key: range.key,
    };
  }

  if (!startDate && endDate) {
    if (endDate.isBefore(d, 'day')) {
      return {
        startDate: endDate.toDate(),
        endDate: d.toDate(),
        color: range.color,
        key: range.key,
      };
    }
    return {
      startDate: d.toDate(),
      endDate: endDate.toDate(),
      color: range.color,
      key: range.key,
    };
  }

  if (startDate && !endDate) {
    if (startDate.isAfter(d, 'day')) {
      return {
        startDate: d.toDate(),
        endDate: startDate.toDate(),
        color: range.color,
        key: range.key,
      };
    }

    return {
      startDate: startDate.toDate(),
      endDate: d.toDate(),
      color: range.color,
      key: range.key,
    };
  }

  if (startDate && endDate && d.isAfter(startDate, 'day')) {
    return {
      startDate: startDate.toDate(),
      endDate: d.toDate(),
      color: range.color,
      key: range.key,
    };
  }
  if (startDate && endDate && d.isBefore(startDate, 'day')) {
    return {
      startDate: d.toDate(),
      endDate: endDate.toDate(),
      color: range.color,
      key: range.key,
    };
  }

  return {
    startDate: startDate ? startDate.toDate() : d.toDate(),
    endDate: endDate ? endDate.toDate() : d.toDate(),
    color: range.color,
    key: range.key,
  };
};

/**
 * Normalize range (ensure startDate <= endDate)
 */
export const normalizeRange = (range: Range): Range => {
  const start = toDayjs(range.startDate);
  const end = toDayjs(range.endDate);

  if (!start || !end) return range;

  if (start.isAfter(end, 'day')) {
    return {
      ...range,
      startDate: end.toDate(),
      endDate: start.toDate(),
    };
  }

  return range;
};
