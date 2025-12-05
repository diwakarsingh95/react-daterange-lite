import type { Dayjs } from 'dayjs';
import type { CSSProperties, ReactNode } from 'react';

export type DateInput = string | number | Date | Dayjs | null | undefined;

export interface Range {
  startDate?: DateInput;
  endDate?: DateInput;
  color?: string;
  key?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  showDateDisplay?: boolean;
}

export interface RangeKeyDict {
  [key: string]: Range;
}

export interface StaticRange {
  label: string;
  range: () => Range;
  isSelected: (range: Range) => boolean;
}

export interface InputRange {
  label: string;
  range: (value: string) => Range;
  getCurrentValue: (range: Range) => string;
}

export type CalendarDirection = 'vertical' | 'horizontal';

export type CalendarFocus = 'forwards' | 'backwards';

export interface DateRangePickerProps {
  /** Array of range objects to display */
  ranges?: Range[];
  /** Callback fired when the user changes the date */
  onChange?: (item: RangeKeyDict) => void;
  /** Callback fired when the user changes the focused range */
  onRangeFocusChange?: (focusedRange: [number, number]) => void;
  /** Initial start date */
  startDate?: DateInput;
  /** Initial end date */
  endDate?: DateInput;
  /** Initial focused range */
  focusedRange?: [number, number];
  /** Initial focused range */
  initialFocusedRange?: [number, number];
  /** Number of months to display */
  months?: number;
  /** Direction of calendar months */
  direction?: CalendarDirection;
  /** Enable scroll for months */
  scroll?: {
    enabled: boolean;
    monthHeight?: number;
    longMonthHeight?: number;
    calendarWidth?: number;
    calendarHeight?: number;
  };
  /** Show month navigation arrows */
  showMonthArrow?: boolean;
  /** Show date display */
  showDateDisplay?: boolean;
  /** Show preview range */
  showPreview?: boolean;
  /** Allow manual date input */
  editableDateInputs?: boolean;
  /** Enable drag selection */
  dragSelectionEnabled?: boolean;
  /** Move range on first selection */
  moveRangeOnFirstSelection?: boolean;
  /** Retain end date on first selection */
  retainEndDateOnFirstSelection?: boolean;
  /** Which calendar to focus */
  calendarFocus?: CalendarFocus;
  /** Prevent snap refocus */
  preventSnapRefocus?: boolean;
  /** Array of disabled dates */
  disabledDates?: DateInput[];
  /** Function to disable days */
  disabledDay?: (date: Dayjs) => boolean;
  /** Minimum selectable date */
  minDate?: DateInput;
  /** Maximum selectable date */
  maxDate?: DateInput;
  /** Date display format */
  dateDisplayFormat?: string;
  /** Month display format */
  monthDisplayFormat?: string;
  /** Weekday display format */
  weekdayDisplayFormat?: string;
  /** Day display format */
  dayDisplayFormat?: string;
  /** Week start day (0-6, 0 = Sunday) */
  weekStartsOn?: number;
  /** Locale configuration */
  locale?: {
    formatLocale?: Record<string, unknown>;
    monthNames?: string[];
    weekDays?: string[];
    weekStartOn?: number;
  };
  /** Custom CSS class */
  className?: string;
  /** Custom class names object */
  classNames?: {
    dateRangePickerWrapper?: string;
    calendarWrapper?: string;
    dateDisplay?: string;
    dateDisplayItem?: string;
    dateDisplayItemActive?: string;
    dateDisplayItemInput?: string;
    monthAndYearWrapper?: string;
    monthAndYearPickers?: string;
    nextPrevButton?: string;
    month?: string;
    weekDays?: string;
    weekDay?: string;
    days?: string;
    day?: string;
    dayNumber?: string;
    dayPassive?: string;
    dayToday?: string;
    dayStartOfWeek?: string;
    dayEndOfWeek?: string;
    daySelected?: string;
    dayDisabled?: string;
    dayStartOfMonth?: string;
    dayEndOfMonth?: string;
    dayInRange?: string;
    dayInHoverRange?: string;
    definedRangesWrapper?: string;
    staticRange?: string;
    staticRangeLabel?: string;
    staticRangeSelected?: string;
    inputRange?: string;
    inputRangeInput?: string;
    inputRangeLabel?: string;
  };
  /** Custom styles object */
  styles?: {
    dateRangePickerWrapper?: CSSProperties;
    calendarWrapper?: CSSProperties;
    dateDisplay?: CSSProperties;
    dateDisplayItem?: CSSProperties;
    dateDisplayItemActive?: CSSProperties;
    dateDisplayItemInput?: CSSProperties;
    monthAndYearWrapper?: CSSProperties;
    monthAndYearPickers?: CSSProperties;
    nextPrevButton?: CSSProperties;
    month?: CSSProperties;
    weekDays?: CSSProperties;
    weekDay?: CSSProperties;
    days?: CSSProperties;
    day?: CSSProperties;
    dayNumber?: CSSProperties;
    dayPassive?: CSSProperties;
    dayToday?: CSSProperties;
    dayStartOfWeek?: CSSProperties;
    dayEndOfWeek?: CSSProperties;
    daySelected?: CSSProperties;
    dayDisabled?: CSSProperties;
    dayStartOfMonth?: CSSProperties;
    dayEndOfMonth?: CSSProperties;
    dayInRange?: CSSProperties;
    dayInHoverRange?: CSSProperties;
    definedRangesWrapper?: CSSProperties;
    staticRange?: CSSProperties;
    staticRangeLabel?: CSSProperties;
    staticRangeSelected?: CSSProperties;
    inputRange?: CSSProperties;
    inputRangeInput?: CSSProperties;
    inputRangeLabel?: CSSProperties;
  };
  /** Theme color */
  color?: string;
  /** Primary theme color for selected ranges, hover borders, focus styles, etc. */
  themeColor?: string;
  /** Predefined ranges */
  staticRanges?: StaticRange[];
  /** Input-based ranges */
  inputRanges?: InputRange[];
  /** Callback for shown date change */
  onShownDateChange?: (shownDate: Dayjs) => void;
  /** Callback for preview change */
  onPreviewChange?: (preview: Range | null) => void;
  /** Custom render function for static range label */
  renderStaticRangeLabel?: (staticRange: StaticRange) => ReactNode;
  /** Custom render function for input range label */
  renderInputRangeLabel?: (inputRange: InputRange) => ReactNode;
  /** ARIA labels */
  ariaLabels?: {
    dateInput?: {
      startDate?: string;
      endDate?: string;
    };
    monthPicker?: string;
    yearPicker?: string;
    prevButton?: string;
    nextButton?: string;
    [key: string]: string | Record<string, string> | undefined;
  };
  /** Wrapper class name */
  wrapperClassName?: string;
}

export interface CalendarProps {
  /** Current month to display */
  month: Dayjs;
  /** Current range */
  range: Range;
  /** Focused part (0 = startDate, 1 = endDate) */
  focusedPart: number;
  /** On date change callback */
  onDateChange: (date: Dayjs, part: 'startDate' | 'endDate') => void;
  /** On preview change callback */
  onPreviewChange?: (preview: Range | null) => void;
  /** Shared preview range from parent (for cross-calendar hover) */
  sharedPreviewRange?: Range | null;
  /** Shared drag state from parent (for cross-calendar dragging) */
  sharedDragState?: {
    isDragging: boolean;
    dragStartDate: Dayjs | null;
    hasDragged: boolean;
  };
  /** Callback to update shared drag state */
  onDragStateChange?: (state: { isDragging: boolean; dragStartDate: Dayjs | null; hasDragged: boolean }) => void;
  /** Minimum date */
  minDate?: DateInput;
  /** Maximum date */
  maxDate?: DateInput;
  /** Disabled dates */
  disabledDates?: DateInput[];
  /** Disabled day function */
  disabledDay?: (date: Dayjs) => boolean;
  /** Week starts on */
  weekStartsOn?: number;
  /** Date format */
  dateDisplayFormat?: string;
  /** Month format */
  monthDisplayFormat?: string;
  /** Weekday format */
  weekdayDisplayFormat?: string;
  /** Day format */
  dayDisplayFormat?: string;
  /** Show preview */
  showPreview?: boolean;
  /** Drag selection enabled */
  dragSelectionEnabled?: boolean;
  /** Move range on first selection */
  moveRangeOnFirstSelection?: boolean;
  /** Retain end date on first selection */
  retainEndDateOnFirstSelection?: boolean;
  /** Primary theme color for selected ranges, hover borders, focus styles, etc. */
  themeColor?: string;
  /** Locale */
  locale?: DateRangePickerProps['locale'];
  /** Class names */
  classNames?: DateRangePickerProps['classNames'] & {
    monthTitle?: string;
    dayInner?: string;
  };
  /** Styles */
  styles?: DateRangePickerProps['styles'] & {
    monthTitle?: CSSProperties;
    dayInner?: CSSProperties;
  };
  /** ARIA labels */
  ariaLabels?: DateRangePickerProps['ariaLabels'];
  /** Show month arrow */
  showMonthArrow?: boolean;
  /** Show header (month/year selectors and navigation) */
  showHeader?: boolean;
  /** Calendar focus */
  calendarFocus?: CalendarFocus;
  /** On month change */
  onMonthChange?: (month: Dayjs) => void;
}


