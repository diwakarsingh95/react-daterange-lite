// Main exports
export { Calendar } from './components/Calendar';
export { DateInput } from './components/DateInput';
export { DateRangePicker } from './components/DateRangePicker';
export { DefinedRanges } from './components/DefinedRanges';

// Type exports
export type {
  CalendarDirection,
  CalendarFocus,
  CalendarProps,
  DateInput as DateInputType,
  DateRangePickerProps,
  InputRange,
  Range,
  RangeKeyDict,
  StaticRange,
} from './types';

// Utility exports (for tree-shaking)
export {
  addDays,
  addMonths,
  formatDate,
  getCalendarDays,
  getDaysInMonth,
  getEndOfMonth,
  getEndOfWeek,
  getStartOfMonth,
  getStartOfWeek,
  isAfter,
  isBefore,
  isDateDisabled,
  isInRange,
  isSameDay,
  isSameMonth,
  isToday,
  parseDate,
  subtractDays,
  subtractMonths,
  toDate,
  toDayjs,
} from './utils/dateUtils';

export {
  getPreviewRange,
  getRangeForDate,
  isDateInAnyRange,
  isDateInRange,
  isEndDate,
  isRangeEnd,
  isRangeStart,
  isStartDate,
  normalizeRange,
} from './utils/rangeUtils';
