import type { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CalendarProps, Range } from '../types';
import {
  DEFAULT_COLOR,
  DEFAULT_DAY_FORMAT,
  DEFAULT_MONTH_FORMAT,
  DEFAULT_WEEK_DAYS,
} from '../utils/constants';
import {
  addMonths,
  formatDate,
  getCalendarDays,
  isDateDisabled,
  isSameMonth,
  isToday,
  subtractMonths,
} from '../utils/dateUtils';
import { getPreviewRange, isDateInRange, isEndDate, isStartDate } from '../utils/rangeUtils';
import './Calendar.css';

export const Calendar: React.FC<CalendarProps> = React.memo(
  ({
    month,
    range,
    hoverDate,
    onHoverDateChange,
    focusedPart,
    onDateChange,
    onPreviewChange,
    sharedPreviewRange,
    sharedDragState,
    onDragStateChange,
    minDate,
    maxDate,
    disabledDates,
    disabledDay,
    weekStartsOn = 0,
    dateDisplayFormat = 'MMMM D, YYYY',
    monthDisplayFormat = DEFAULT_MONTH_FORMAT,
    dayDisplayFormat = DEFAULT_DAY_FORMAT,
    showPreview = true,
    dragSelectionEnabled = true,
    moveRangeOnFirstSelection: _moveRangeOnFirstSelection = false,
    retainEndDateOnFirstSelection: _retainEndDateOnFirstSelection = false,
    themeColor = DEFAULT_COLOR,
    locale,
    classNames,
    styles,
    ariaLabels,
    showMonthArrow = true,
    showHeader = true,
    onMonthChange,
  }: CalendarProps) => {
    // Use shared drag state if available, otherwise use local state
    const [localDragState, setLocalDragState] = useState<{
      isDragging: boolean;
      dragStartDate: Dayjs | null;
      hasDragged: boolean;
    }>({
      isDragging: false,
      dragStartDate: null,
      hasDragged: false,
    });

    const isDragging = sharedDragState?.isDragging ?? localDragState.isDragging;
    const dragStartDate = sharedDragState?.dragStartDate ?? localDragState.dragStartDate;
    const hasDragged = sharedDragState?.hasDragged ?? localDragState.hasDragged;

    // Ref to store the debounce timeout for date updates during drag
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastDebouncedDayRef = useRef<Dayjs | null>(null);

    // Ref to store the debounce timeout for hover state updates
    const hoverDebounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Ref to track if a drag operation occurred (to prevent onClick from firing after drag)
    const dragOccurredRef = useRef<boolean>(false);

    // Cleanup debounce timeouts on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        if (hoverDebounceTimeoutRef.current) {
          clearTimeout(hoverDebounceTimeoutRef.current);
        }
      };
    }, []);

    const updateDragState = useCallback(
      (
        updates: Partial<{ isDragging: boolean; dragStartDate: Dayjs | null; hasDragged: boolean }>
      ) => {
        if (onDragStateChange) {
          const currentState = sharedDragState ?? {
            isDragging: false,
            dragStartDate: null,
            hasDragged: false,
          };
          onDragStateChange({ ...currentState, ...updates });
        } else {
          setLocalDragState((prev) => ({ ...prev, ...updates }));
        }
      },
      [onDragStateChange, sharedDragState]
    );

    const calendarDays = useMemo(() => getCalendarDays(month, weekStartsOn), [month, weekStartsOn]);

    const weekDays = useMemo(() => {
      const days = locale?.weekDays ?? DEFAULT_WEEK_DAYS;
      const rotated = [...days.slice(weekStartsOn), ...days.slice(0, weekStartsOn)];
      return rotated;
    }, [weekStartsOn, locale]);

    // Use shared preview range if available (from other calendar), otherwise compute from shared hover date
    const previewRange = useMemo(() => {
      // Prioritize shared preview range for cross-calendar hover preview
      if (sharedPreviewRange) {
        return sharedPreviewRange;
      }

      // Fall back to shared hover date
      if (!showPreview || !hoverDate) return null;

      return getPreviewRange(hoverDate, range);
    }, [sharedPreviewRange, hoverDate, range, showPreview]);

    React.useEffect(() => {
      // Only notify parent of preview change if we're using shared hover (no shared preview supplied)
      // This prevents circular updates when shared preview is already set
      if (onPreviewChange && !sharedPreviewRange && previewRange) {
        onPreviewChange(previewRange);
      } else if (onPreviewChange && !sharedPreviewRange && !previewRange && hoverDate === null) {
        // Clear preview when hover leaves and no shared preview exists
        onPreviewChange(null);
      }
    }, [previewRange, onPreviewChange, sharedPreviewRange, hoverDate]);

    const handlePrevMonth = useCallback(() => {
      const newMonth = subtractMonths(month, 1);
      if (newMonth && onMonthChange) {
        onMonthChange(newMonth);
      }
    }, [month, onMonthChange]);

    const handleNextMonth = useCallback(() => {
      const newMonth = addMonths(month, 1);
      if (newMonth && onMonthChange) {
        onMonthChange(newMonth);
      }
    }, [month, onMonthChange]);

    // Generate month and year options for dropdowns
    const monthOptions = useMemo(() => {
      const months: { value: number; label: string }[] = [];
      // Extract month format from monthDisplayFormat (e.g., "MMM" from "MMMM YYYY" or "MMM YYYY")
      // Default to "MMM" for dropdown display
      let monthFormat = 'MMM';
      if (monthDisplayFormat.includes('MMMM')) {
        monthFormat = 'MMMM'; // Full month name
      } else if (monthDisplayFormat.includes('MMM')) {
        monthFormat = 'MMM'; // Abbreviated month name
      } else if (monthDisplayFormat.includes('MM')) {
        monthFormat = 'MM'; // Numeric month
      }

      for (let i = 0; i < 12; i++) {
        const monthDate = month.month(i).startOf('month');
        months.push({
          value: i,
          label: monthDate.format(monthFormat),
        });
      }
      return months;
    }, [month, monthDisplayFormat]);

    const yearOptions = useMemo(() => {
      const years: { value: number; label: string }[] = [];
      const currentYear = month.year();
      for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        years.push({ value: i, label: String(i) });
      }
      return years;
    }, [month]);

    const handleMonthChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = month.month(parseInt(e.target.value));
        if (onMonthChange) {
          onMonthChange(newMonth);
        }
      },
      [month, onMonthChange]
    );

    const handleYearChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = month.year(parseInt(e.target.value));
        if (onMonthChange) {
          onMonthChange(newMonth);
        }
      },
      [month, onMonthChange]
    );

    const getRangeColor = useCallback(
      (range: Range): string => {
        return range.color || themeColor || DEFAULT_COLOR;
      },
      [themeColor]
    );

    const getDayClasses = useCallback(
      (day: Dayjs): string => {
        const classes: string[] = ['rdr-Day'];
        const classNamesObj = classNames ?? {};

        // Check if day is in current month
        if (!isSameMonth(day, month)) {
          classes.push('rdr-DayPassive');
          if (classNamesObj.dayPassive) classes.push(classNamesObj.dayPassive);
        }

        // Check if today
        if (isToday(day)) {
          classes.push('rdr-DayToday');
          if (classNamesObj.dayToday) classes.push(classNamesObj.dayToday);
        }

        // Check if actually disabled (min/max/disabledDates/disabledDay) - NOT checking month
        // Adjacent month dates are not disabled, they're just passive
        const isActuallyDisabled = isDateDisabled(
          day,
          disabledDates,
          disabledDay,
          minDate,
          maxDate
        );
        if (isActuallyDisabled) {
          classes.push('rdr-DayDisabled');
          if (classNamesObj.dayDisabled) classes.push(classNamesObj.dayDisabled);
          return classes.join(' ');
        }

        // Use the current range for selected styling
        const activeRange = range;

        // Apply selected range classes (only if date is in current month)
        // Don't show active background for dates from prev/next month
        if (activeRange && isSameMonth(day, month)) {
          const isStart = isStartDate(day, activeRange);
          const isEnd = isEndDate(day, activeRange);
          const inRange = isDateInRange(day, activeRange);

          if (isStart) {
            classes.push('rdr-DayStartOfRange');
            if (classNamesObj.dayStartOfWeek) classes.push(classNamesObj.dayStartOfWeek);
          }
          if (isEnd) {
            classes.push('rdr-DayEndOfRange');
            if (classNamesObj.dayEndOfWeek) classes.push(classNamesObj.dayEndOfWeek);
          }
          if (inRange && !isStart && !isEnd) {
            classes.push('rdr-DayInRange');
            if (classNamesObj.dayInRange) classes.push(classNamesObj.dayInRange);
          }
          if (isStart || isEnd || inRange) {
            classes.push('rdr-DaySelected');
            if (classNamesObj.daySelected) classes.push(classNamesObj.daySelected);
          }
        }

        // Check if in hover range (preview) but NOT in current selected range
        // Only show border for dates in preview that are NOT in the active range
        if (previewRange) {
          const inPreviewRange = isDateInRange(day, previewRange);
          const isPreviewStart = isStartDate(day, previewRange);
          const isPreviewEnd = isEndDate(day, previewRange);

          // Only show hover border if in preview but not in active range
          if (inPreviewRange) {
            classes.push('rdr-DayInHoverRange');
            if (classNamesObj.dayInHoverRange) classes.push(classNamesObj.dayInHoverRange);

            // Add classes for start/end of hover range
            if (isPreviewStart) {
              classes.push('rdr-DayHoverRangeStart');
            }
            if (isPreviewEnd) {
              classes.push('rdr-DayHoverRangeEnd');
            }

            // Check if adjacent dates are also in hover range to remove borders between them
            const prevDay = day.subtract(1, 'day');
            const nextDay = day.add(1, 'day');

            // Helper to check if a date is in hover range but not in active range
            const isInHoverOnly = (date: Dayjs): boolean => {
              return isDateInRange(date, previewRange);
            };

            if (isInHoverOnly(prevDay)) {
              classes.push('rdr-DayHoverRangeHasPrev');
            }
            if (isInHoverOnly(nextDay)) {
              classes.push('rdr-DayHoverRangeHasNext');
            }
          }
        }

        // Week boundaries
        if (day.day() === weekStartsOn) {
          classes.push('rdr-DayStartOfWeek');
        }
        if (day.day() === (weekStartsOn + 6) % 7) {
          classes.push('rdr-DayEndOfWeek');
        }

        // Month boundaries
        if (day.date() === 1) {
          classes.push('rdr-DayStartOfMonth');
        }
        const daysInMonth = day.daysInMonth();
        if (day.date() === daysInMonth) {
          classes.push('rdr-DayEndOfMonth');
        }

        if (classNamesObj.day) classes.push(classNamesObj.day);

        return classes.join(' ');
      },
      [
        month,
        disabledDates,
        disabledDay,
        minDate,
        maxDate,
        range,
        previewRange,
        weekStartsOn,
        classNames,
      ]
    );

    const getDayInnerStyle = useCallback(
      (day: Dayjs): React.CSSProperties => {
        const style: React.CSSProperties = {};
        const activeRange = range;

        // Apply background color only to selected range (not preview)
        // Only apply if date is in current month (not prev/next month dates)
        if (activeRange && isSameMonth(day, month)) {
          const color = getRangeColor(activeRange);
          const isStart = isStartDate(day, activeRange);
          const isEnd = isEndDate(day, activeRange);
          const inRange = isDateInRange(day, activeRange);

          if (isStart || isEnd || inRange) {
            style.backgroundColor = color;
            style.color = '#ffffff !important';
          }
        } else if (activeRange && !isSameMonth(day, month)) {
          // Explicitly ensure adjacent month dates don't have background color
          // Even if they're part of the selected range
          style.backgroundColor = 'transparent';
          style.color = undefined; // Let CSS handle the color for passive days
        }

        return style;
      },
      [range, getRangeColor, month]
    );

    // Debounced function to update date during drag
    const debouncedUpdateDate = useCallback(
      (day: Dayjs) => {
        if (!dragStartDate) return;

        if (lastDebouncedDayRef.current && lastDebouncedDayRef.current.isSame(day, 'day')) {
          return;
        }

        // Clear existing timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Store the latest day
        lastDebouncedDayRef.current = day;

        // Set new timeout to debounce the update
        debounceTimeoutRef.current = setTimeout(() => {
          if (lastDebouncedDayRef.current && dragStartDate) {
            const currentDay = lastDebouncedDayRef.current;

            // Continuously update the end date as mouse moves during drag
            // This ensures the range updates in real-time whether dragging left-to-right or right-to-left
            if (dragStartDate.isSame(currentDay, 'day')) {
              onDateChange(currentDay, 'startDate');
              onDateChange(currentDay, 'endDate');
            } else if (dragStartDate.isBefore(currentDay)) {
              onDateChange(currentDay, 'endDate');
            } else {
              onDateChange(dragStartDate, 'startDate');
              onDateChange(currentDay, 'startDate');
            }
          }
        }, 5); // ~60fps debounce (16ms)
      },
      [dragStartDate, onDateChange]
    );

    const handleDayMouseEnter = useCallback(
      (day: Dayjs) => {
        // Debounce hover date update for preview range calculation
        if (hoverDebounceTimeoutRef.current) {
          clearTimeout(hoverDebounceTimeoutRef.current);
        }

        if (onHoverDateChange) {
          onHoverDateChange(day);
        }

        if (dragSelectionEnabled && isDragging && dragStartDate) {
          // Mouse moved during drag - this is an actual drag operation
          if (!hasDragged) {
            // First movement - drag has started, set the start date immediately (not debounced)
            updateDragState({ hasDragged: true });
            onDateChange(dragStartDate, 'startDate');
          }

          // Use debounced function for continuous updates during drag
          debouncedUpdateDate(day);
        }
      },
      [
        dragSelectionEnabled,
        isDragging,
        dragStartDate,
        hasDragged,
        onDateChange,
        updateDragState,
        debouncedUpdateDate,
        onHoverDateChange,
      ]
    );

    const handleDayMouseLeave = useCallback(() => {
      // Clear any pending hover debounce
      if (hoverDebounceTimeoutRef.current) {
        clearTimeout(hoverDebounceTimeoutRef.current);
        hoverDebounceTimeoutRef.current = null;
      }

      // Don't clear hover date if dragging - we want to maintain drag state across calendars
      if (!isDragging) {
        if (onHoverDateChange) {
          onHoverDateChange(null);
        }
      }
    }, [isDragging, onHoverDateChange]);

    const handleDayClick = useCallback(
      (day: Dayjs, event: React.MouseEvent) => {
        // Prevent click if this was part of a drag operation
        if (dragOccurredRef.current) {
          dragOccurredRef.current = false; // Reset for next interaction
          event.preventDefault();
          return;
        }
        // Only allow selection of dates in current month AND not actually disabled
        if (!isSameMonth(day, month)) return;
        if (isDateDisabled(day, disabledDates, disabledDay, minDate, maxDate)) return;
        const part = focusedPart === 0 ? 'startDate' : 'endDate';
        onDateChange(day, part);
      },
      [month, focusedPart, onDateChange, disabledDates, disabledDay, minDate, maxDate]
    );

    const handleDayMouseDown = useCallback(
      (day: Dayjs) => {
        // Only allow selection of dates in current month AND not actually disabled
        if (!isSameMonth(day, month)) return;
        if (isDateDisabled(day, disabledDates, disabledDay, minDate, maxDate)) return;

        if (!dragSelectionEnabled) {
          // If drag is disabled, handle as simple click
          const part = focusedPart === 0 ? 'startDate' : 'endDate';
          onDateChange(day, part);
          return;
        }

        // Start tracking drag - don't call onDateChange yet
        // Only call it if mouse actually moves (drag happens)
        updateDragState({
          isDragging: true,
          dragStartDate: day,
          hasDragged: false,
        });
      },
      [
        dragSelectionEnabled,
        month,
        focusedPart,
        onDateChange,
        disabledDates,
        disabledDay,
        minDate,
        maxDate,
        updateDragState,
      ]
    );

    const handleDayMouseUp = useCallback(
      (day: Dayjs) => {
        if (!dragSelectionEnabled || !isDragging) return;
        // Only allow selection of dates in current month AND not actually disabled
        if (!isSameMonth(day, month)) return;
        if (isDateDisabled(day, disabledDates, disabledDay, minDate, maxDate)) return;

        // Clear any pending debounced updates
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
          debounceTimeoutRef.current = null;
        }

        // Clear any pending hover debounce
        if (hoverDebounceTimeoutRef.current) {
          clearTimeout(hoverDebounceTimeoutRef.current);
          hoverDebounceTimeoutRef.current = null;
        }

        // If drag actually happened (mouse moved), finalize the end date
        if (dragStartDate && hasDragged) {
          dragOccurredRef.current = true; // Mark that a drag occurred
          // Use the last debounced day if available, otherwise use current day
          const finalDay = lastDebouncedDayRef.current || day;

          if (dragStartDate.isBefore(finalDay)) {
            onDateChange(finalDay, 'endDate');
          } else {
            onDateChange(finalDay, 'startDate');
          }
        } else if (dragStartDate && !hasDragged) {
          // Just a click, not a drag - onClick will handle it
          dragOccurredRef.current = false;
        }

        // Reset refs
        lastDebouncedDayRef.current = null;

        updateDragState({
          isDragging: false,
          dragStartDate: null,
          hasDragged: false,
        });
        if (onHoverDateChange) {
          onHoverDateChange(null);
        }
      },
      [
        dragSelectionEnabled,
        isDragging,
        dragStartDate,
        hasDragged,
        onDateChange,
        month,
        disabledDates,
        disabledDay,
        minDate,
        maxDate,
        updateDragState,
        onHoverDateChange,
      ]
    );

    React.useEffect(() => {
      const handleMouseUp = () => {
        if (isDragging) {
          updateDragState({
            isDragging: false,
            dragStartDate: null,
            hasDragged: false,
          });
          if (onHoverDateChange) {
            onHoverDateChange(null);
          }
        }
      };

      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, updateDragState, onHoverDateChange]);

    return (
      <div
        className={`rdr-Calendar ${classNames?.calendarWrapper ?? ''}`}
        style={
          {
            ...(styles?.calendarWrapper ?? {}),
            '--rdr-theme-color': themeColor,
          } as React.CSSProperties
        }
        onMouseLeave={handleDayMouseLeave}
        onMouseMove={(e) => {
          // Track mouse movement during drag to handle cross-calendar dragging
          if (dragSelectionEnabled && isDragging && dragStartDate) {
            // Find the day element under the mouse cursor
            const target = document.elementFromPoint(e.clientX, e.clientY);
            if (target) {
              const dayButton = target.closest('.rdr-Day') as HTMLButtonElement;
              if (dayButton && !dayButton.disabled) {
                // Extract day from the button's aria-label or find it in calendarDays
                const dayIndex = Array.from(e.currentTarget.querySelectorAll('.rdr-Day')).indexOf(
                  dayButton
                );
                if (dayIndex >= 0 && dayIndex < calendarDays.length) {
                  const day = calendarDays[dayIndex];
                  handleDayMouseEnter(day);
                }
              }
            }
          }
        }}
      >
        {showHeader && (
          <div
            className={`rdr-MonthAndYearWrapper ${classNames?.monthAndYearWrapper ?? ''}`}
            style={styles?.monthAndYearWrapper}
          >
            {showMonthArrow && (
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
            )}
            <div
              className={`rdr-MonthAndYearPickers ${classNames?.monthAndYearPickers ?? ''}`}
              style={styles?.monthAndYearPickers}
            >
              <select
                value={month.month()}
                onChange={handleMonthChange}
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
                value={month.year()}
                onChange={handleYearChange}
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
            {showMonthArrow && (
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
            )}
          </div>
        )}

        <div
          className={`rdr-MonthTitle ${classNames?.monthTitle ?? ''}`}
          style={styles?.monthTitle}
        >
          {formatDate(month, 'MMM YYYY')}
        </div>

        <div className={`rdr-WeekDays ${classNames?.weekDays ?? ''}`} style={styles?.weekDays}>
          {weekDays.map((day: string, index: number) => (
            <div
              key={index}
              className={`rdr-WeekDay ${classNames?.weekDay ?? ''}`}
              style={styles?.weekDay}
            >
              {day}
            </div>
          ))}
        </div>

        <div className={`rdr-Days ${classNames?.days ?? ''}`} style={styles?.days}>
          {calendarDays.map((day: Dayjs, index: number) => {
            const dayClasses = getDayClasses(day);
            const dayStyle = styles?.day ?? {};
            // Check if date is actually disabled (not just from adjacent month)
            const isActuallyDisabled = isDateDisabled(
              day,
              disabledDates,
              disabledDay,
              minDate,
              maxDate
            );
            // Disable button only if actually disabled OR from adjacent month
            const isDisabled = isActuallyDisabled || !isSameMonth(day, month);

            const dayInnerStyle = getDayInnerStyle(day);

            return (
              <button
                key={index}
                type="button"
                className={dayClasses}
                style={dayStyle}
                onClick={(e) => handleDayClick(day, e)}
                onMouseEnter={() => handleDayMouseEnter(day)}
                onMouseDown={() => handleDayMouseDown(day)}
                onMouseUp={() => handleDayMouseUp(day)}
                disabled={isDisabled}
                aria-label={formatDate(day, dateDisplayFormat)}
                aria-selected={isDateInRange(day, range) ?? false}
                aria-disabled={isDisabled}
              >
                <span
                  className={`rdr-DayInner ${classNames?.dayInner ?? ''}`}
                  style={dayInnerStyle}
                >
                  <span
                    className={`rdr-DayNumber ${classNames?.dayNumber ?? ''}`}
                    style={styles?.dayNumber}
                  >
                    {formatDate(day, dayDisplayFormat)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';
