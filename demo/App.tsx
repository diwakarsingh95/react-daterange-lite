import dayjs from 'dayjs';
import React, { useState } from 'react';
import { DateRangePicker } from '../src';
import type { RangeKeyDict } from '../src/types';

function App() {
  const [themeColor, setThemeColor] = useState('#3d91ff');
  const [selectedRangeColor, setSelectedRangeColor] = useState('#3d91ff');
  const [state, setState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
      color: '#3d91ff',
    },
  });

  const handleChange = (item: RangeKeyDict) => {
    const selection = item.selection;
    setState({
      selection: {
        startDate: selection.startDate ? dayjs(selection.startDate).toDate() : new Date(),
        endDate: selection.endDate ? dayjs(selection.endDate).toDate() : new Date(),
        key: selection.key || 'selection',
        // Preserve the range's color if it exists, otherwise preserve current color or use themeColor
        color: selection.color || state.selection.color || themeColor,
      },
    });
  };

  // Custom predefined ranges example (for demonstration)
  const customStaticRanges = [
    {
      label: 'Last 14 Days',
      range: () => ({
        startDate: dayjs().subtract(13, 'day').toDate(),
        endDate: dayjs().toDate(),
        key: 'last14Days',
      }),
      isSelected: (range: any) => {
        if (!range.startDate || !range.endDate) return false;
        const start = dayjs().subtract(13, 'day');
        const end = dayjs();
        return (
          dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day')
        );
      },
    },
    {
      label: 'Last 90 Days',
      range: () => ({
        startDate: dayjs().subtract(89, 'day').toDate(),
        endDate: dayjs().toDate(),
        key: 'last90Days',
      }),
      isSelected: (range: any) => {
        if (!range.startDate || !range.endDate) return false;
        const start = dayjs().subtract(89, 'day');
        const end = dayjs();
        return (
          dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day')
        );
      },
    },
  ];

  const themeColors = [
    { name: 'Default Blue', value: '#3d91ff' },
    { name: 'Red', value: '#ff6b6b' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem' }}>React Date Range Lite</h1>
      <p style={{ marginBottom: '2rem', color: '#666', fontSize: '0.875rem', lineHeight: '1.6' }}>
        A lightweight, performant React date range picker library using dayjs. Built with modern
        React standards, tree-shakable, and fully customizable. Each example below includes detailed
        prop documentation.
      </p>

      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Selected Range Date Color</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Change the background color for selected date ranges:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {themeColors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setSelectedRangeColor(color.value);
                setState((prev) => ({
                  selection: {
                    ...prev.selection,
                    color: color.value,
                  },
                }));
              }}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${color.value}`,
                borderRadius: '4px',
                background: selectedRangeColor === color.value ? color.value : '#ffffff',
                color: selectedRangeColor === color.value ? '#ffffff' : color.value,
                cursor: 'pointer',
                fontWeight: selectedRangeColor === color.value ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Custom Color:</label>
          <input
            type="color"
            value={selectedRangeColor}
            onChange={(e) => {
              setSelectedRangeColor(e.target.value);
              setState((prev) => ({
                selection: {
                  ...prev.selection,
                  color: e.target.value,
                },
              }));
            }}
            style={{
              width: '60px',
              height: '40px',
              border: '2px solid #d5d5d5',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
          <input
            type="text"
            value={selectedRangeColor}
            onChange={(e) => {
              setSelectedRangeColor(e.target.value);
              setState((prev) => ({
                selection: {
                  ...prev.selection,
                  color: e.target.value,
                },
              }));
            }}
            placeholder="#3d91ff"
            style={{
              padding: '0.5rem',
              border: '1px solid #d5d5d5',
              borderRadius: '4px',
              fontSize: '0.875rem',
              width: '120px',
            }}
          />
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Current selected range color:{' '}
          <strong style={{ color: selectedRangeColor }}>{selectedRangeColor}</strong>
        </div>
      </div>

      <div
        style={{
          marginBottom: '2rem',
          padding: '1rem',
          background: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3 style={{ marginBottom: '1rem' }}>Theme Color (Hover Borders, Focus, Navigation)</h3>
        <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Change the color for hover borders, focus styles, and navigation buttons:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          {themeColors.map((color) => (
            <button
              key={`theme-${color.value}`}
              onClick={() => setThemeColor(color.value)}
              style={{
                padding: '0.5rem 1rem',
                border: `2px solid ${color.value}`,
                borderRadius: '4px',
                background: themeColor === color.value ? color.value : '#ffffff',
                color: themeColor === color.value ? '#ffffff' : color.value,
                cursor: 'pointer',
                fontWeight: themeColor === color.value ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Custom Color:</label>
          <input
            type="color"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            style={{
              width: '60px',
              height: '40px',
              border: '2px solid #d5d5d5',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          />
          <input
            type="text"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            placeholder="#3d91ff"
            style={{
              padding: '0.5rem',
              border: '1px solid #d5d5d5',
              borderRadius: '4px',
              fontSize: '0.875rem',
              width: '120px',
            }}
          />
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          Current theme color: <strong style={{ color: themeColor }}>{themeColor}</strong>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>
          Basic Example (Predefined Ranges Visible by Default)
        </h2>
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#e8f4f8',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Props used:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>
              <code>onChange</code> - Callback fired when the user changes the date range (type:{' '}
              <code>(item: RangeKeyDict) =&gt; void</code>)
            </li>
            <li>
              <code>ranges</code> - Array of range objects to display and control (type:{' '}
              <code>Range[]</code>)
            </li>
            <li>
              <code>themeColor</code> - Primary theme color for selected ranges, hover borders,
              focus styles, etc. (type: <code>string</code>, default: <code>'#3d91ff'</code>)
            </li>
            <li>
              <code>showDateDisplay</code> - Show the date input tabs (type: <code>boolean</code>,
              default: <code>true</code>)
            </li>
            <li>
              <code>editableDateInputs</code> - Allow manual date input editing (type:{' '}
              <code>boolean</code>, default: <code>false</code>)
            </li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#666' }}>
            <strong>Note:</strong> Predefined ranges (Today, Yesterday, This Week, Last 7 Days, Last
            30 Days, This Month, Last Month) are visible by default. No need to pass{' '}
            <code>staticRanges</code> prop unless you want custom ranges.
          </p>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Code Example</summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#ffffff',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {`<DateRangePicker
  onChange={handleChange}
  ranges={[state.selection]}
  themeColor={themeColor}
  showDateDisplay={true}
  editableDateInputs={false}
/>`}
            </pre>
          </details>
        </div>
        <DateRangePicker
          onChange={handleChange}
          ranges={[state.selection]}
          themeColor={themeColor}
          showDateDisplay={true}
          editableDateInputs={false}
        />
        <div
          style={{ marginTop: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}
        >
          <strong>Selected Range:</strong>
          <br />
          Start: {state.selection.startDate?.toLocaleDateString() || 'Not selected'}
          <br />
          End: {state.selection.endDate?.toLocaleDateString() || 'Not selected'}
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>With Custom Predefined Ranges</h2>
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#e8f4f8',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Props used:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>
              <code>staticRanges</code> - Array of custom predefined range options (type:{' '}
              <code>StaticRange[]</code>). Each range has:
              <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                <li>
                  <code>label</code> - Display text for the range
                </li>
                <li>
                  <code>range()</code> - Function that returns a Range object
                </li>
                <li>
                  <code>isSelected(range)</code> - Function to check if this range is currently
                  selected
                </li>
              </ul>
            </li>
            <li>
              <code>onChange</code> - Callback fired when the user changes the date range (type:{' '}
              <code>(item: RangeKeyDict) =&gt; void</code>)
            </li>
            <li>
              <code>ranges</code> - Array of range objects to display and control (type:{' '}
              <code>Range[]</code>)
            </li>
            <li>
              <code>themeColor</code> - Primary theme color for selected ranges, hover borders,
              focus styles, etc. (type: <code>string</code>, default: <code>'#3d91ff'</code>)
            </li>
            <li>
              <code>showDateDisplay</code> - Show the date input tabs (type: <code>boolean</code>,
              default: <code>true</code>)
            </li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#666' }}>
            Pass custom <code>staticRanges</code> to override the default predefined ranges.
            Predefined ranges are always displayed on the left side of the picker. Hovering over a
            predefined range shows a preview in the calendar.
          </p>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Code Example</summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#ffffff',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {`const customStaticRanges = [
  {
    label: 'Last 14 Days',
    range: () => ({
      startDate: dayjs().subtract(13, 'day').toDate(),
      endDate: dayjs().toDate(),
      key: 'last14Days',
    }),
    isSelected: (range) => {
      if (!range.startDate || !range.endDate) return false;
      const start = dayjs().subtract(13, 'day');
      const end = dayjs();
      return dayjs(range.startDate).isSame(start, 'day') && 
             dayjs(range.endDate).isSame(end, 'day');
    },
  },
  // ... more custom ranges
];

<DateRangePicker
  onChange={handleChange}
  ranges={[state.selection]}
  staticRanges={customStaticRanges}
  themeColor={themeColor}
  showDateDisplay={true}
/>`}
            </pre>
          </details>
        </div>
        <DateRangePicker
          onChange={handleChange}
          ranges={[state.selection]}
          staticRanges={customStaticRanges}
          themeColor={themeColor}
          showDateDisplay={true}
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Editable Date Inputs</h2>
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#e8f4f8',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Props used:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>
              <code>editableDateInputs</code> - Set to <code>true</code> to allow users to manually
              type dates in the input fields (type: <code>boolean</code>, default:{' '}
              <code>false</code>)
            </li>
            <li>
              <code>onChange</code> - Callback fired when the user changes the date range (via input
              or calendar) (type: <code>(item: RangeKeyDict) =&gt; void</code>)
            </li>
            <li>
              <code>ranges</code> - Array of range objects to display and control (type:{' '}
              <code>Range[]</code>)
            </li>
            <li>
              <code>themeColor</code> - Primary theme color for selected ranges, hover borders,
              focus styles, etc. (type: <code>string</code>, default: <code>'#3d91ff'</code>)
            </li>
            <li>
              <code>showDateDisplay</code> - Show the date input tabs (type: <code>boolean</code>,
              default: <code>true</code>)
            </li>
            <li>
              <code>dateDisplayFormat</code> - Format string for date inputs (type:{' '}
              <code>string</code>, default: <code>'MMM D, YYYY'</code>)
            </li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#666' }}>
            When enabled, users can click on the date inputs and type dates directly. Dates are
            validated on blur using the <code>dateDisplayFormat</code> prop.
          </p>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Code Example</summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#ffffff',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {`<DateRangePicker
  onChange={handleChange}
  ranges={[state.selection]}
  themeColor={themeColor}
  editableDateInputs={true}
  showDateDisplay={true}
  dateDisplayFormat="MM/DD/YYYY" // Optional: custom format
/>`}
            </pre>
          </details>
        </div>
        <DateRangePicker
          onChange={handleChange}
          ranges={[state.selection]}
          themeColor={themeColor}
          editableDateInputs={true}
          showDateDisplay={true}
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Single Month</h2>
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#e8f4f8',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Props used:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>
              <code>months</code> - Number of months to display side by side (default: 2, type:{' '}
              <code>number</code>)
            </li>
            <li>
              <code>onChange</code> - Callback fired when the user changes the date range (type:{' '}
              <code>(item: RangeKeyDict) =&gt; void</code>)
            </li>
            <li>
              <code>ranges</code> - Array of range objects to display and control (type:{' '}
              <code>Range[]</code>)
            </li>
            <li>
              <code>themeColor</code> - Primary theme color for selected ranges, hover borders,
              focus styles, etc. (type: <code>string</code>, default: <code>'#3d91ff'</code>)
            </li>
            <li>
              <code>showDateDisplay</code> - Show the date input tabs (type: <code>boolean</code>,
              default: <code>true</code>)
            </li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#666' }}>
            Set <code>months={1}</code> to display only one calendar month. Use{' '}
            <code>months={2}</code> or more for multiple months.
          </p>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Code Example</summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#ffffff',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {`<DateRangePicker
  onChange={handleChange}
  ranges={[state.selection]}
  themeColor={themeColor}
  months={1}
  showDateDisplay={true}
/>`}
            </pre>
          </details>
        </div>
        <DateRangePicker
          onChange={handleChange}
          ranges={[state.selection]}
          themeColor={themeColor}
          months={1}
          showDateDisplay={true}
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>With Min/Max Dates</h2>
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#e8f4f8',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Props used:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>
              <code>minDate</code> - Minimum selectable date (type: <code>DateInput</code>). Dates
              before this are automatically disabled and appear with a distinct disabled styling.
            </li>
            <li>
              <code>maxDate</code> - Maximum selectable date (type: <code>DateInput</code>). Dates
              after this are automatically disabled and appear with a distinct disabled styling.
            </li>
            <li>
              <code>onChange</code> - Callback fired when the user changes the date range (type:{' '}
              <code>(item: RangeKeyDict) =&gt; void</code>)
            </li>
            <li>
              <code>ranges</code> - Array of range objects to display and control (type:{' '}
              <code>Range[]</code>)
            </li>
            <li>
              <code>themeColor</code> - Primary theme color for selected ranges, hover borders,
              focus styles, etc. (type: <code>string</code>, default: <code>'#3d91ff'</code>)
            </li>
            <li>
              <code>showDateDisplay</code> - Show the date input tabs (type: <code>boolean</code>,
              default: <code>true</code>)
            </li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#666' }}>
            Dates outside the min/max range are disabled and have a distinct visual appearance (grey
            background, darker text) that differs from adjacent month dates (which are just faded).
            Users can navigate to adjacent months to select dates there, but cannot select dates
            outside the min/max range.
          </p>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Code Example</summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#ffffff',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {`<DateRangePicker
  onChange={handleChange}
  ranges={[state.selection]}
  themeColor={themeColor}
  minDate={dayjs().subtract(1, 'month').toDate()}
  maxDate={dayjs().add(1, 'month').toDate()}
  showDateDisplay={true}
/>`}
            </pre>
          </details>
        </div>
        <DateRangePicker
          onChange={handleChange}
          ranges={[state.selection]}
          themeColor={themeColor}
          minDate={dayjs().subtract(1, 'month').toDate()}
          maxDate={dayjs().add(1, 'month').toDate()}
          showDateDisplay={true}
        />
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>With Disabled Dates</h2>
        <div
          style={{
            marginBottom: '1rem',
            padding: '1rem',
            background: '#e8f4f8',
            borderRadius: '4px',
            fontSize: '0.875rem',
          }}
        >
          <strong>Props used:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            <li>
              <code>disabledDates</code> - Array of specific dates that cannot be selected (type:{' '}
              <code>DateInput[]</code>). Accepts Date, string, number, or Dayjs objects.
            </li>
            <li>
              <code>minDate</code> - Minimum selectable date (type: <code>DateInput</code>). Dates
              before this are automatically disabled.
            </li>
            <li>
              <code>maxDate</code> - Maximum selectable date (type: <code>DateInput</code>). Dates
              after this are automatically disabled.
            </li>
            <li>
              <code>disabledDay</code> - Optional function to disable specific days (type:{' '}
              <code>(date: Dayjs) =&gt; boolean</code>). Useful for disabling weekends, holidays,
              etc.
            </li>
            <li>
              <code>onChange</code> - Callback fired when the user changes the date range (type:{' '}
              <code>(item: RangeKeyDict) =&gt; void</code>)
            </li>
            <li>
              <code>ranges</code> - Array of range objects to display and control (type:{' '}
              <code>Range[]</code>)
            </li>
            <li>
              <code>themeColor</code> - Primary theme color for selected ranges, hover borders,
              focus styles, etc. (type: <code>string</code>, default: <code>'#3d91ff'</code>)
            </li>
            <li>
              <code>showDateDisplay</code> - Show the date input tabs (type: <code>boolean</code>,
              default: <code>true</code>)
            </li>
          </ul>
          <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic', color: '#666' }}>
            In this example, specific dates are disabled, and dates outside the min/max range are
            also disabled. Disabled dates appear grayed out and cannot be selected.
          </p>
          <details style={{ marginTop: '0.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500' }}>Code Example</summary>
            <pre
              style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: '#ffffff',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '0.75rem',
              }}
            >
              {`// Disable specific dates
disabledDates={[
  dayjs().add(1, 'day').toDate(),
  dayjs().add(2, 'day').toDate(),
]}

// Disable dates outside range
minDate={dayjs().subtract(1, 'month').toDate()}
maxDate={dayjs().add(3, 'month').toDate()}

// Disable weekends
disabledDay={(date) => date.day() === 0 || date.day() === 6}

<DateRangePicker
  onChange={handleChange}
  ranges={[state.selection]}
  themeColor={themeColor}
  disabledDates={[...]}
  minDate={...}
  maxDate={...}
  disabledDay={(date) => date.day() === 0 || date.day() === 6}
  showDateDisplay={true}
/>`}
            </pre>
          </details>
        </div>
        <DateRangePicker
          onChange={handleChange}
          ranges={[state.selection]}
          themeColor={themeColor}
          disabledDates={[
            dayjs().add(1, 'day').toDate(),
            dayjs().add(2, 'day').toDate(),
            dayjs().add(3, 'day').toDate(),
          ]}
          minDate={dayjs().subtract(1, 'month').toDate()}
          maxDate={dayjs().add(3, 'month').toDate()}
          showDateDisplay={true}
        />
      </div>
    </div>
  );
}

export default App;
