import dayjs from 'dayjs';
import type { Range, StaticRange } from '../types';

/**
 * Default week day names
 */
export const DEFAULT_WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Default month names
 */
export const DEFAULT_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Default date format
 */
export const DEFAULT_DATE_FORMAT = 'MMM D, YYYY';

/**
 * Default month format
 */
export const DEFAULT_MONTH_FORMAT = 'MMMM YYYY';

/**
 * Default weekday format
 */
export const DEFAULT_WEEKDAY_FORMAT = 'dd';

/**
 * Default day format
 */
export const DEFAULT_DAY_FORMAT = 'D';

/**
 * Default theme color
 */
export const DEFAULT_COLOR = '#3d91ff';

/**
 * Default range colors
 */
export const DEFAULT_RANGE_COLORS = ['#3d91ff', '#0ecb81', '#feb019', '#ff4560', '#775dd0'];

/**
 * Default predefined static ranges for the date range picker
 * Similar to react-date-range's defaultStaticRanges
 */
export const defaultStaticRanges: StaticRange[] = [
  {
    label: 'Today',
    range: () => ({
      startDate: dayjs().toDate(),
      endDate: dayjs().toDate(),
      key: 'today',
    }),
    isSelected: (range: Range) => {
      if (!range.startDate || !range.endDate) return false;
      return (
        dayjs(range.startDate).isSame(dayjs(), 'day') && dayjs(range.endDate).isSame(dayjs(), 'day')
      );
    },
  },
  {
    label: 'Yesterday',
    range: () => ({
      startDate: dayjs().subtract(1, 'day').toDate(),
      endDate: dayjs().subtract(1, 'day').toDate(),
      key: 'yesterday',
    }),
    isSelected: (range: Range) => {
      if (!range.startDate || !range.endDate) return false;
      return (
        dayjs(range.startDate).isSame(dayjs().subtract(1, 'day'), 'day') &&
        dayjs(range.endDate).isSame(dayjs().subtract(1, 'day'), 'day')
      );
    },
  },
  {
    label: 'This Week',
    range: () => ({
      startDate: dayjs().startOf('week').toDate(),
      endDate: dayjs().endOf('week').toDate(),
      key: 'thisWeek',
    }),
    isSelected: (range: Range) => {
      if (!range.startDate || !range.endDate) return false;
      const start = dayjs().startOf('week');
      const end = dayjs().endOf('week');
      return dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day');
    },
  },
  {
    label: 'Last 7 Days',
    range: () => ({
      startDate: dayjs().subtract(6, 'day').toDate(),
      endDate: dayjs().toDate(),
      key: 'last7Days',
    }),
    isSelected: (range: Range) => {
      if (!range.startDate || !range.endDate) return false;
      const start = dayjs().subtract(6, 'day');
      const end = dayjs();
      return dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day');
    },
  },
  {
    label: 'Last 30 Days',
    range: () => ({
      startDate: dayjs().subtract(29, 'day').toDate(),
      endDate: dayjs().toDate(),
      key: 'last30Days',
    }),
    isSelected: (range: Range) => {
      if (!range.startDate || !range.endDate) return false;
      const start = dayjs().subtract(29, 'day');
      const end = dayjs();
      return dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day');
    },
  },
  {
    label: 'This Month',
    range: () => ({
      startDate: dayjs().startOf('month').toDate(),
      endDate: dayjs().endOf('month').toDate(),
      key: 'thisMonth',
    }),
    isSelected: (range: Range) => {
      if (!range.startDate || !range.endDate) return false;
      const start = dayjs().startOf('month');
      const end = dayjs().endOf('month');
      return dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day');
    },
  },
  {
    label: 'Last Month',
    range: () => ({
      startDate: dayjs().subtract(1, 'month').startOf('month').toDate(),
      endDate: dayjs().subtract(1, 'month').endOf('month').toDate(),
      key: 'lastMonth',
    }),
    isSelected: (range: Range) => {
      if (!range.startDate || !range.endDate) return false;
      const start = dayjs().subtract(1, 'month').startOf('month');
      const end = dayjs().subtract(1, 'month').endOf('month');
      return dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day');
    },
  },
];
