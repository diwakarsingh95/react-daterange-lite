import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { DateInput as DateInputType } from '../types';
import { toDayjs, formatDate, parseDate } from '../utils/dateUtils';
import { DEFAULT_DATE_FORMAT } from '../utils/constants';
import './DateInput.css';

export interface DateInputProps {
  value: DateInputType;
  placeholder?: string;
  format?: string;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onChange?: (date: Date | null) => void;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  disabled?: boolean;
}

export const DateInput: React.FC<DateInputProps> = React.memo(
  ({
    value,
    placeholder = 'Select date',
    format = DEFAULT_DATE_FORMAT,
    editable = false,
    onFocus,
    onBlur,
    onChange,
    className = '',
    style,
    ariaLabel,
    disabled = false,
  }: DateInputProps) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update input value when value prop changes (but not while editing)
    useEffect(() => {
      if (!isFocused) {
        const dayjsDate = toDayjs(value);
        setInputValue(dayjsDate ? formatDate(dayjsDate, format) : '');
      }
    }, [value, format, isFocused]);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      if (onFocus) {
        onFocus();
      }
    }, [onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      if (onBlur) {
        onBlur();
      }

      // Parse and validate input on blur
      if (editable && inputValue && onChange) {
        const parsed = parseDate(inputValue, format);
        if (parsed) {
          onChange(parsed.toDate());
        } else {
          // Reset to original value if parsing fails
          const dayjsDate = toDayjs(value);
          setInputValue(dayjsDate ? formatDate(dayjsDate, format) : '');
        }
      }
    }, [editable, inputValue, format, onChange, onBlur, value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editable) return;
        setInputValue(e.target.value);
      },
      [editable]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && editable && inputValue && onChange) {
          const parsed = parseDate(inputValue, format);
          if (parsed) {
            onChange(parsed.toDate());
            inputRef.current?.blur();
          }
        } else if (e.key === 'Escape') {
          inputRef.current?.blur();
        }
      },
      [editable, inputValue, format, onChange]
    );

    const displayValue: string =
      isFocused && editable ? inputValue : formatDate(value, format) || '';

    return (
      <div className={`rdr-DateInput ${className}`} style={style}>
        {editable ? (
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            placeholder={placeholder}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className="rdr-DateInput-input"
            aria-label={ariaLabel}
          />
        ) : (
          <div
            className="rdr-DateInput-display"
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel}
          >
            {displayValue || <span className="rdr-DateInput-placeholder">{placeholder}</span>}
          </div>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';

