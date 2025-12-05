import React, { useCallback } from 'react';
import type { Range, StaticRange, InputRange, RangeKeyDict } from '../types';
import { toDayjs, toDate } from '../utils/dateUtils';
import './DefinedRanges.css';

export interface DefinedRangesProps {
  range: Range;
  staticRanges?: StaticRange[];
  inputRanges?: InputRange[];
  focusedPart: number;
  onRangeChange: (range: RangeKeyDict) => void;
  onRangeFocusChange: (focusedRange: [number, number]) => void;
  onPreviewChange?: (preview: Range | null) => void;
  rangeColors?: string[];
  className?: string;
  style?: React.CSSProperties;
  classNames?: {
    definedRangesWrapper?: string;
    staticRange?: string;
    staticRangeLabel?: string;
    staticRangeSelected?: string;
    inputRange?: string;
    inputRangeInput?: string;
    inputRangeLabel?: string;
  };
  styles?: {
    definedRangesWrapper?: React.CSSProperties;
    staticRange?: React.CSSProperties;
    staticRangeLabel?: React.CSSProperties;
    staticRangeSelected?: React.CSSProperties;
    inputRange?: React.CSSProperties;
    inputRangeInput?: React.CSSProperties;
    inputRangeLabel?: React.CSSProperties;
  };
  renderStaticRangeLabel?: (staticRange: StaticRange) => React.ReactNode;
  renderInputRangeLabel?: (inputRange: InputRange) => React.ReactNode;
}

export const DefinedRanges: React.FC<DefinedRangesProps> = React.memo(
  ({
    range,
    staticRanges = [],
    inputRanges = [],
    onRangeChange,
    onRangeFocusChange,
    onPreviewChange,
    className = '',
    style,
    classNames,
    styles,
    renderStaticRangeLabel,
    renderInputRangeLabel,
  }: DefinedRangesProps) => {
    const handleStaticRangeMouseEnter = useCallback(
      (staticRange: StaticRange) => {
        if (onPreviewChange) {
          const previewRange = staticRange.range();
          onPreviewChange({
            ...previewRange,
            startDate: toDate(toDayjs(previewRange.startDate)),
            endDate: toDate(toDayjs(previewRange.endDate)),
          });
        }
      },
      [onPreviewChange]
    );

    const handleStaticRangeMouseLeave = useCallback(() => {
      if (onPreviewChange) {
        onPreviewChange(null);
      }
    }, [onPreviewChange]);

    const handleStaticRangeClick = useCallback(
      (staticRange: StaticRange, index: number) => {
        const range = staticRange.range();
        const rangeKey = range.key || `static-${index}`;
        const rangeDict: RangeKeyDict = {
          [rangeKey]: {
            ...range,
            startDate: toDate(toDayjs(range.startDate)),
            endDate: toDate(toDayjs(range.endDate)),
          },
        };
        onRangeChange(rangeDict);
        onRangeFocusChange([0, 0]);
        if (onPreviewChange) {
          onPreviewChange(null);
        }
      },
      [onRangeChange, onRangeFocusChange, onPreviewChange]
    );

    const handleInputRangeChange = useCallback(
      (inputRange: InputRange, value: string) => {
        const range = inputRange.range(value);
        const rangeKey = range.key || 'input-range';
        const rangeDict: RangeKeyDict = {
          [rangeKey]: {
            ...range,
            startDate: toDate(toDayjs(range.startDate)),
            endDate: toDate(toDayjs(range.endDate)),
          },
        };
        onRangeChange(rangeDict);
        onRangeFocusChange([0, 0]);
      },
      [onRangeChange, onRangeFocusChange]
    );

    if (staticRanges.length === 0 && inputRanges.length === 0) {
      return null;
    }

    return (
      <div
        className={`rdr-DefinedRanges ${classNames?.definedRangesWrapper ?? ''} ${className}`}
        style={{ ...(styles?.definedRangesWrapper ?? {}), ...style }}
      >
        {staticRanges.map((staticRange: StaticRange, index: number) => {
          const isSelected = staticRange.isSelected(range ?? {});
          const rangeKey = staticRange.range().key ?? `static-${index}`;

          return (
            <button
              key={rangeKey}
              type="button"
              className={`rdr-StaticRange ${classNames?.staticRange ?? ''} ${
                isSelected ? `rdr-StaticRangeSelected ${classNames?.staticRangeSelected ?? ''}` : ''
              }`}
              style={{
                ...(styles?.staticRange ?? {}),
                ...(isSelected ? styles?.staticRangeSelected ?? {} : {}),
              }}
              onClick={() => handleStaticRangeClick(staticRange, index)}
              onMouseEnter={() => handleStaticRangeMouseEnter(staticRange)}
              onMouseLeave={handleStaticRangeMouseLeave}
            >
              <span
                className={`rdr-StaticRangeLabel ${classNames?.staticRangeLabel ?? ''}`}
                style={styles?.staticRangeLabel}
              >
                {renderStaticRangeLabel
                  ? renderStaticRangeLabel(staticRange)
                  : staticRange.label}
              </span>
            </button>
          );
        })}

        {inputRanges.map((inputRange: InputRange, index: number) => {
          const currentValue = inputRange.getCurrentValue(range ?? {});
          const rangeKey = `input-${index}`;

          return (
            <div
              key={rangeKey}
              className={`rdr-InputRange ${classNames?.inputRange ?? ''}`}
              style={styles?.inputRange}
            >
              <label
                className={`rdr-InputRangeLabel ${classNames?.inputRangeLabel ?? ''}`}
                style={styles?.inputRangeLabel}
              >
                {renderInputRangeLabel ? renderInputRangeLabel(inputRange) : inputRange.label}
              </label>
              <input
                type="text"
                className={`rdr-InputRangeInput ${classNames?.inputRangeInput ?? ''}`}
                style={styles?.inputRangeInput}
                value={currentValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputRangeChange(inputRange, e.target.value)
                }
                placeholder="0"
              />
            </div>
          );
        })}
      </div>
    );
  }
);

DefinedRanges.displayName = 'DefinedRanges';

