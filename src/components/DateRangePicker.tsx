import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { DateRangePickerProps, Range, RangeKeyDict } from '../types';
import {
  DEFAULT_COLOR,
  DEFAULT_DATE_FORMAT,
  DEFAULT_MONTH_FORMAT,
  DEFAULT_RANGE_COLORS,
} from '../utils/constants';
import { addMonths, subtractMonths, toDate, toDayjs } from '../utils/dateUtils';
import { normalizeRange } from '../utils/rangeUtils';
import { Calendar } from './Calendar';
import { DateInput } from './DateInput';
import './DateRangePicker.css';
import { DefinedRanges } from './DefinedRanges';

export const DateRangePicker: React.FC<DateRangePickerProps> = React.memo(
  ({
    ranges: initialRanges,
    onChange,
    onRangeFocusChange,
    startDate: initialStartDate,
    endDate: initialEndDate,
    focusedRange: initialFocusedRange,
    initialFocusedRange: initialFocusedRangeProp,
    months = 2,
    direction = 'horizontal',
    scroll: _scroll,
    showMonthArrow = true,
    showDateDisplay = true,
    showPreview = true,
    editableDateInputs = false,
    dragSelectionEnabled = true,
    moveRangeOnFirstSelection = false,
    retainEndDateOnFirstSelection = false,
    calendarFocus = 'forwards',
    preventSnapRefocus: _preventSnapRefocus,
    disabledDates,
    disabledDay,
    minDate,
    maxDate,
    dateDisplayFormat = DEFAULT_DATE_FORMAT,
    monthDisplayFormat = DEFAULT_MONTH_FORMAT,
    weekdayDisplayFormat,
    dayDisplayFormat,
    weekStartsOn = 0,
    locale,
    className = '',
    classNames,
    styles,
    color = DEFAULT_COLOR,
    themeColor = DEFAULT_COLOR,
    rangeColors = DEFAULT_RANGE_COLORS,
    staticRanges,
    inputRanges,
    onShownDateChange,
    onPreviewChange,
    renderStaticRangeLabel,
    renderInputRangeLabel,
    ariaLabels,
    wrapperClassName = '',
  }: DateRangePickerProps) => {
    // Handle preview change from calendars
    const handlePreviewChange = useCallback(
      (preview: Range | null) => {
        setSharedPreviewRange(preview);
        if (onPreviewChange) {
          onPreviewChange(preview);
        }
      },
      [onPreviewChange]
    );
    // Initialize range
    const getInitialRange = useCallback((): Range => {
      if (initialRanges && initialRanges.length > 0) {
        const range = initialRanges[0];
        return {
          ...range,
          startDate: toDate(toDayjs(range.startDate)),
          endDate: toDate(toDayjs(range.endDate)),
        };
      }

      // Default range from startDate/endDate props
      const start = toDate(toDayjs(initialStartDate));
      const end = toDate(toDayjs(initialEndDate));
      return {
        startDate: start || undefined,
        endDate: end || undefined,
        key: 'selection',
        color: color,
      };
    }, [initialRanges, initialStartDate, initialEndDate, color]);

    const [range, setRange] = useState<Range>(getInitialRange);
    const [focusedPart, setFocusedPart] = useState<number>(
      initialFocusedRange?.[1] ?? initialFocusedRangeProp?.[1] ?? 0
    );
    const [shownDate, setShownDate] = useState<Dayjs>(() => {
      const start = toDayjs(range?.startDate);
      return start || dayjs();
    });
    const [sharedPreviewRange, setSharedPreviewRange] = useState<Range | null>(null);
    const [sharedDragState, setSharedDragState] = useState<{
      isDragging: boolean;
      dragStartDate: Dayjs | null;
      hasDragged: boolean;
    }>({
      isDragging: false,
      dragStartDate: null,
      hasDragged: false,
    });

    // Update range when props change (controlled mode)
    useEffect(() => {
      if (initialRanges && initialRanges.length > 0) {
        const newRange = initialRanges[0];
        setRange({
          ...newRange,
          startDate: toDate(toDayjs(newRange.startDate)),
          endDate: toDate(toDayjs(newRange.endDate)),
        });
      } else if (initialStartDate !== undefined || initialEndDate !== undefined) {
        setRange({
          startDate: toDate(toDayjs(initialStartDate)),
          endDate: toDate(toDayjs(initialEndDate)),
          key: 'selection',
          color: color,
        });
      }
    }, [initialRanges, initialStartDate, initialEndDate, color]);

    // Update focused part when prop changes
    useEffect(() => {
      if (initialFocusedRange) {
        setFocusedPart(initialFocusedRange[1]);
      }
    }, [initialFocusedRange]);

    // Handle date change
    const handleDateChange = useCallback(
      (date: Dayjs, part: 'startDate' | 'endDate') => {
        setRange((prevRange) => {
          // Create a new range object to avoid mutations
          const newRange: Range = {
            ...prevRange,
            startDate: prevRange?.startDate
              ? prevRange.startDate instanceof Date
                ? new Date(prevRange.startDate)
                : toDate(toDayjs(prevRange.startDate))
              : undefined,
            endDate: prevRange?.endDate
              ? prevRange.endDate instanceof Date
                ? new Date(prevRange.endDate)
                : toDate(toDayjs(prevRange.endDate))
              : undefined,
          };

          if (part === 'startDate') {
            newRange.startDate = date.toDate();
            // If moveRangeOnFirstSelection, clear endDate
            if (moveRangeOnFirstSelection && !retainEndDateOnFirstSelection) {
              newRange.endDate = undefined;
            }
            console.log({ gvhvhgvh: newRange });
            // If new start is after end, set end date to new start date
            if (newRange.endDate) {
              const end = toDayjs(newRange.endDate);
              if (end && date.isAfter(end, 'day')) {
                console.log('isAfter end');
                newRange.endDate = date.toDate();
              }
            }
          } else {
            // Selecting end date - ONLY update endDate, never touch startDate unless swapping
            const preservedStartDate = newRange.startDate
              ? newRange.startDate instanceof Date
                ? new Date(newRange.startDate)
                : toDate(toDayjs(newRange.startDate))
              : undefined;

            if (preservedStartDate) {
              const start = toDayjs(preservedStartDate);
              // If end is before start, swap them
              if (start && date.isBefore(start, 'day')) {
                console.log('isBefore start');

                // Swap: new end becomes start, old start becomes end
                newRange.startDate = date.toDate();
                newRange.endDate = preservedStartDate;
              } else if (start && date.isAfter(start, 'day')) {
                console.log('isAfter start');
                // Normal case: end is after or equal to start - ONLY set endDate
                // Explicitly preserve startDate - DO NOT touch it
                newRange.startDate = preservedStartDate;
                newRange.endDate = date.toDate();
                console.log({ newRange });
              } else {
                console.log('same day');
                newRange.endDate = date.toDate();
              }
            } else {
              console.log('no start date');
              // No start date yet, just set end date
              newRange.endDate = date.toDate();
            }
          }

          // Normalize range (only swaps if start > end, doesn't affect equal dates)
          const normalized = normalizeRange(newRange);

          console.log({ normalized });

          // Create range key dict for onChange (for API compatibility)
          const rangeKey = normalized.key || 'selection';
          const rangeDict: RangeKeyDict = {
            [rangeKey]: normalized,
          };

          if (onChange) {
            onChange(rangeDict);
          }

          return normalized;
        });

        // Auto-focus management: always cycle to the opposite tab after selection
        const newFocusedPart = part === 'startDate' ? 1 : 0;
        setFocusedPart(newFocusedPart);
        // Notify parent component of focus change (for API compatibility)
        if (onRangeFocusChange) {
          onRangeFocusChange([0, newFocusedPart]);
        }
      },
      [
        range,
        onChange,
        moveRangeOnFirstSelection,
        retainEndDateOnFirstSelection,
        onRangeFocusChange,
      ]
    );

    // Handle range focus change
    const handleRangeFocusChange = useCallback(
      (newFocusedRange: [number, number]) => {
        setFocusedPart(newFocusedRange[1]);
        if (onRangeFocusChange) {
          onRangeFocusChange(newFocusedRange);
        }
      },
      [onRangeFocusChange]
    );

    // Handle range change from defined ranges
    const handleRangeChange = useCallback(
      (rangeDict: RangeKeyDict) => {
        const newRange = Object.values(rangeDict)[0];
        if (newRange) {
          setRange(newRange);
        }
        if (onChange) {
          onChange(rangeDict);
        }
      },
      [onChange]
    );

    // Handle month change
    const handleMonthChange = useCallback(
      (month: Dayjs) => {
        setShownDate(month);
        if (onShownDateChange) {
          onShownDateChange(month);
        }
      },
      [onShownDateChange]
    );

    // Get months to display
    const displayMonths = useMemo(() => {
      const monthsArray: Dayjs[] = [];
      for (let i = 0; i < months; i++) {
        monthsArray.push(shownDate.add(i, 'month'));
      }
      return monthsArray;
    }, [shownDate, months]);

    // Determine which calendar is active (0 = first, 1 = second)
    const activeCalendarIndex = useMemo(() => {
      return focusedPart === 0 ? 0 : Math.min(1, months - 1);
    }, [focusedPart, months]);

    // Get the active month for header display
    const activeMonth = useMemo(() => {
      return displayMonths[activeCalendarIndex] || shownDate;
    }, [displayMonths, activeCalendarIndex, shownDate]);

    // Generate month and year options for dropdowns
    const monthOptions = useMemo(() => {
      const months: { value: number; label: string }[] = [];
      let monthFormat = 'MMM';
      if (monthDisplayFormat.includes('MMMM')) {
        monthFormat = 'MMMM';
      } else if (monthDisplayFormat.includes('MMM')) {
        monthFormat = 'MMM';
      } else if (monthDisplayFormat.includes('MM')) {
        monthFormat = 'MM';
      }

      for (let i = 0; i < 12; i++) {
        const monthDate = activeMonth.month(i).startOf('month');
        months.push({
          value: i,
          label: monthDate.format(monthFormat),
        });
      }
      return months;
    }, [activeMonth, monthDisplayFormat]);

    const yearOptions = useMemo(() => {
      const years: { value: number; label: string }[] = [];
      const currentYear = activeMonth.year();
      for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        years.push({ value: i, label: String(i) });
      }
      return years;
    }, [activeMonth]);

    // Handle month navigation for active calendar
    const handleActiveMonthChange = useCallback(
      (newMonth: Dayjs) => {
        // Update shownDate to reflect the new month for the active calendar
        const currentActiveMonth = displayMonths[activeCalendarIndex];
        if (currentActiveMonth) {
          const diff = newMonth.diff(currentActiveMonth, 'month');
          const newShownDate = shownDate.add(diff, 'month');
          setShownDate(newShownDate);
          if (onShownDateChange) {
            onShownDateChange(newShownDate);
          }
        }
      },
      [displayMonths, activeCalendarIndex, shownDate, onShownDateChange]
    );

    const handlePrevMonth = useCallback(() => {
      const newMonth = subtractMonths(activeMonth, 1);
      if (newMonth) {
        handleActiveMonthChange(newMonth);
      }
    }, [activeMonth, handleActiveMonthChange]);

    const handleNextMonth = useCallback(() => {
      const newMonth = addMonths(activeMonth, 1);
      if (newMonth) {
        handleActiveMonthChange(newMonth);
      }
    }, [activeMonth, handleActiveMonthChange]);

    const handleMonthSelectChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = activeMonth.month(parseInt(e.target.value));
        handleActiveMonthChange(newMonth);
      },
      [activeMonth, handleActiveMonthChange]
    );

    const handleYearSelectChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = activeMonth.year(parseInt(e.target.value));
        handleActiveMonthChange(newMonth);
      },
      [activeMonth, handleActiveMonthChange]
    );

    // Handle date input change
    const handleStartDateInputChange = useCallback(
      (date: Date | null) => {
        if (date) {
          const dayjsDate = dayjs(date);
          handleDateChange(dayjsDate, 'startDate');
        }
      },
      [handleDateChange]
    );

    const handleEndDateInputChange = useCallback(
      (date: Date | null) => {
        if (date) {
          const dayjsDate = dayjs(date);
          handleDateChange(dayjsDate, 'endDate');
        }
      },
      [handleDateChange]
    );

    // Handle input focus
    const handleStartDateFocus = useCallback(() => {
      handleRangeFocusChange([0, 0]);
    }, [handleRangeFocusChange]);

    const handleEndDateFocus = useCallback(() => {
      handleRangeFocusChange([0, 1]);
    }, [handleRangeFocusChange]);

    return (
      <div
        className={`rdr-DateRangePickerWrapper ${wrapperClassName} ${className}`}
        style={
          {
            ...(styles?.dateRangePickerWrapper ?? {}),
            '--rdr-theme-color': themeColor,
          } as React.CSSProperties
        }
      >
        <div className="rdr-DateRangePickerContent">
          {(staticRanges || inputRanges) && (
            <DefinedRanges
              range={range}
              staticRanges={staticRanges}
              inputRanges={inputRanges}
              focusedPart={focusedPart}
              onRangeChange={handleRangeChange}
              onRangeFocusChange={handleRangeFocusChange}
              onPreviewChange={onPreviewChange}
              rangeColors={rangeColors}
              classNames={classNames}
              styles={styles}
              renderStaticRangeLabel={renderStaticRangeLabel}
              renderInputRangeLabel={renderInputRangeLabel}
            />
          )}

          <div className="rdr-DateRangePickerMain">
            {showDateDisplay && (
              <div
                className={`rdr-DateDisplay ${classNames?.dateDisplay ?? ''}`}
                style={styles?.dateDisplay}
              >
                <div
                  className={`rdr-DateDisplayItem ${
                    focusedPart === 0
                      ? `rdr-DateDisplayItemActive ${classNames?.dateDisplayItemActive ?? ''}`
                      : ''
                  } ${classNames?.dateDisplayItem ?? ''}`}
                  style={{
                    ...(styles?.dateDisplayItem ?? {}),
                    ...(focusedPart === 0 ? (styles?.dateDisplayItemActive ?? {}) : {}),
                  }}
                  onClick={handleStartDateFocus}
                >
                  <DateInput
                    value={range?.startDate}
                    placeholder="Start Date"
                    format={dateDisplayFormat}
                    editable={editableDateInputs}
                    onFocus={handleStartDateFocus}
                    onChange={handleStartDateInputChange}
                    className={classNames?.dateDisplayItemInput}
                    style={styles?.dateDisplayItemInput}
                    ariaLabel={ariaLabels?.dateInput?.startDate ?? 'Start date'}
                  />
                </div>
                <div
                  className={`rdr-DateDisplayItem ${
                    focusedPart === 1
                      ? `rdr-DateDisplayItemActive ${classNames?.dateDisplayItemActive ?? ''}`
                      : ''
                  } ${classNames?.dateDisplayItem ?? ''}`}
                  style={{
                    ...(styles?.dateDisplayItem ?? {}),
                    ...(focusedPart === 1 ? (styles?.dateDisplayItemActive ?? {}) : {}),
                  }}
                  onClick={handleEndDateFocus}
                >
                  <DateInput
                    value={range?.endDate}
                    placeholder="End Date"
                    format={dateDisplayFormat}
                    editable={editableDateInputs}
                    onFocus={handleEndDateFocus}
                    onChange={handleEndDateInputChange}
                    className={classNames?.dateDisplayItemInput}
                    style={styles?.dateDisplayItemInput}
                    ariaLabel={ariaLabels?.dateInput?.endDate ?? 'End date'}
                  />
                </div>
              </div>
            )}

            {showMonthArrow && (
              <div
                className={`rdr-MonthAndYearWrapper ${classNames?.monthAndYearWrapper ?? ''}`}
                style={styles?.monthAndYearWrapper}
              >
                <button
                  type="button"
                  className={`rdr-NextPrevButton rdr-PrevButton ${classNames?.nextPrevButton ?? ''}`}
                  style={styles?.nextPrevButton}
                  onClick={handlePrevMonth}
                  aria-label={ariaLabels?.prevButton ?? 'Previous month'}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className={`rdr-MonthAndYearPickers ${classNames?.monthAndYearPickers ?? ''}`}
                  style={styles?.monthAndYearPickers}
                >
                  <select
                    value={activeMonth.month()}
                    onChange={handleMonthSelectChange}
                    className="rdr-MonthPicker"
                    aria-label={ariaLabels?.monthPicker ?? 'Select month'}
                  >
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={activeMonth.year()}
                    onChange={handleYearSelectChange}
                    className="rdr-YearPicker"
                    aria-label={ariaLabels?.yearPicker ?? 'Select year'}
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className={`rdr-NextPrevButton rdr-NextButton ${classNames?.nextPrevButton ?? ''}`}
                  style={styles?.nextPrevButton}
                  onClick={handleNextMonth}
                  aria-label={ariaLabels?.nextButton ?? 'Next month'}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 12L10 8L6 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div
              className={`rdr-CalendarWrapper rdr-CalendarWrapper-${direction} ${classNames?.calendarWrapper ?? ''}`}
              style={styles?.calendarWrapper}
            >
              {displayMonths.map((month: Dayjs, index: number) => (
                <Calendar
                  key={index}
                  month={month}
                  range={range}
                  focusedPart={focusedPart}
                  onDateChange={handleDateChange}
                  onPreviewChange={handlePreviewChange}
                  sharedPreviewRange={sharedPreviewRange}
                  sharedDragState={sharedDragState}
                  onDragStateChange={setSharedDragState}
                  minDate={minDate}
                  maxDate={maxDate}
                  disabledDates={disabledDates}
                  disabledDay={disabledDay}
                  weekStartsOn={weekStartsOn}
                  dateDisplayFormat={dateDisplayFormat}
                  monthDisplayFormat={monthDisplayFormat}
                  weekdayDisplayFormat={weekdayDisplayFormat}
                  dayDisplayFormat={dayDisplayFormat}
                  showPreview={showPreview}
                  dragSelectionEnabled={dragSelectionEnabled}
                  themeColor={themeColor}
                  moveRangeOnFirstSelection={moveRangeOnFirstSelection}
                  retainEndDateOnFirstSelection={retainEndDateOnFirstSelection}
                  rangeColors={rangeColors}
                  locale={locale}
                  classNames={classNames}
                  styles={styles}
                  ariaLabels={ariaLabels}
                  showMonthArrow={false}
                  showHeader={false}
                  calendarFocus={calendarFocus}
                  onMonthChange={handleMonthChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
