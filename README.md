# React Date Range Picker

A lightweight, performant React date range picker library built with `dayjs`. API-compatible with `react-date-range` but optimized for modern React applications with minimal bundle size, tree-shaking support, and full TypeScript coverage.

## Features

- 🚀 **Lightweight**: Uses `dayjs` (~2KB) instead of `date-fns` for smaller bundle size
- 📦 **Tree-shakable**: Named exports allow bundlers to eliminate unused code
- ⚡ **Performant**: Optimized with React.memo, useMemo, and useCallback
- 🎨 **Modern UI**: Clean, accessible interface similar to react-date-range
- 🔧 **TypeScript**: Full TypeScript support with comprehensive type definitions
- ♿ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- 🎯 **API Compatible**: Accepts same props as react-date-range for easy migration
- 🎨 **Customizable**: Theme colors, custom styles, and flexible date formatting

## Quick Start

### Installation

```bash
npm install react-date-range-picker dayjs
# or
yarn add react-date-range-picker dayjs
# or
pnpm add react-date-range-picker dayjs
```

### Basic Usage

```tsx
import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range-picker';
import 'react-date-range-picker/styles';

function App() {
  const [state, setState] = useState({
    selection: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  });

  return (
    <DateRangePicker
      onChange={(item) => setState({ selection: item.selection })}
      ranges={[state.selection]}
    />
  );
}
```

### With Custom Theme Color

```tsx
<DateRangePicker
  onChange={(item) => setState({ selection: item.selection })}
  ranges={[state.selection]}
  themeColor="#3d91ff" // Customize selected range color, hover borders, focus styles
/>
```

### With Predefined Ranges

```tsx
import dayjs from 'dayjs';

const staticRanges = [
  {
    label: 'Today',
    range: () => ({
      startDate: dayjs().toDate(),
      endDate: dayjs().toDate(),
      key: 'today',
    }),
    isSelected: (range) => {
      if (!range.startDate || !range.endDate) return false;
      return (
        dayjs(range.startDate).isSame(dayjs(), 'day') &&
        dayjs(range.endDate).isSame(dayjs(), 'day')
      );
    },
  },
  {
    label: 'Last 7 Days',
    range: () => ({
      startDate: dayjs().subtract(6, 'day').toDate(),
      endDate: dayjs().toDate(),
      key: 'last7Days',
    }),
    isSelected: (range) => {
      if (!range.startDate || !range.endDate) return false;
      const start = dayjs().subtract(6, 'day');
      const end = dayjs();
      return (
        dayjs(range.startDate).isSame(start, 'day') &&
        dayjs(range.endDate).isSame(end, 'day')
      );
    },
  },
];

<DateRangePicker
  onChange={(item) => setState({ selection: item.selection })}
  ranges={[state.selection]}
  staticRanges={staticRanges}
/>
```

## Examples

### Editable Date Inputs

```tsx
<DateRangePicker
  ranges={[state.selection]}
  onChange={(item) => setState({ selection: item.selection })}
  editableDateInputs={true}
  dateDisplayFormat="MM/DD/YYYY"
/>
```

### Disabled Dates

```tsx
import dayjs from 'dayjs';

<DateRangePicker
  ranges={[state.selection]}
  onChange={(item) => setState({ selection: item.selection })}
  disabledDates={[
    dayjs().add(1, 'day').toDate(),
    dayjs().add(2, 'day').toDate(),
  ]}
  minDate={dayjs().subtract(1, 'month').toDate()}
  maxDate={dayjs().add(3, 'month').toDate()}
  disabledDay={(date) => date.day() === 0 || date.day() === 6} // Disable weekends
/>
```

### Single Month Display

```tsx
<DateRangePicker
  ranges={[state.selection]}
  onChange={(item) => setState({ selection: item.selection })}
  months={1}
/>
```

### Custom Styling

```tsx
<DateRangePicker
  ranges={[state.selection]}
  onChange={(item) => setState({ selection: item.selection })}
  themeColor="#ff6b6b"
  rangeColors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
  classNames={{
    dateRangePickerWrapper: 'custom-wrapper',
    calendarWrapper: 'custom-calendar',
  }}
  styles={{
    dateDisplay: {
      backgroundColor: '#f8f9fa',
    },
  }}
/>
```

## API Reference

### DateRangePicker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ranges` | `Range[]` | - | Array of range objects to display |
| `onChange` | `(item: RangeKeyDict) => void` | - | Callback fired when the user changes the date |
| `onRangeFocusChange` | `(focusedRange: [number, number]) => void` | - | Callback fired when the user changes the focused range |
| `startDate` | `DateInput` | - | Initial start date |
| `endDate` | `DateInput` | - | Initial end date |
| `focusedRange` | `[number, number]` | `[0, 0]` | Initial focused range |
| `initialFocusedRange` | `[number, number]` | `[0, 0]` | Initial focused range |
| `months` | `number` | `2` | Number of months to display |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of calendar months |
| `showMonthArrow` | `boolean` | `true` | Show month navigation arrows |
| `showDateDisplay` | `boolean` | `true` | Show date display |
| `showPreview` | `boolean` | `true` | Show preview range |
| `editableDateInputs` | `boolean` | `false` | Allow manual date input |
| `dragSelectionEnabled` | `boolean` | `true` | Enable drag selection |
| `moveRangeOnFirstSelection` | `boolean` | `false` | Move range on first selection |
| `retainEndDateOnFirstSelection` | `boolean` | `false` | Retain end date on first selection |
| `calendarFocus` | `'forwards' \| 'backwards'` | `'forwards'` | Which calendar to focus |
| `disabledDates` | `DateInput[]` | - | Array of disabled dates |
| `disabledDay` | `(date: Dayjs) => boolean` | - | Function to disable days |
| `minDate` | `DateInput` | - | Minimum selectable date |
| `maxDate` | `DateInput` | - | Maximum selectable date |
| `dateDisplayFormat` | `string` | `'MMM D, YYYY'` | Date display format |
| `monthDisplayFormat` | `string` | `'MMMM YYYY'` | Month display format |
| `weekdayDisplayFormat` | `string` | `'dd'` | Weekday format |
| `dayDisplayFormat` | `string` | `'D'` | Day format |
| `weekStartsOn` | `number` | `0` | Week start day (0-6, 0 = Sunday) |
| `locale` | `LocaleConfig` | - | Locale configuration |
| `className` | `string` | - | Custom CSS class |
| `classNames` | `ClassNames` | - | Custom class names object |
| `styles` | `Styles` | - | Custom styles object |
| `themeColor` | `string` | `'#3d91ff'` | Primary theme color for selected ranges, hover borders, focus styles |
| `color` | `string` | `'#3d91ff'` | Legacy prop, use `themeColor` instead |
| `rangeColors` | `string[]` | `['#3d91ff', ...]` | Array of range colors |
| `staticRanges` | `StaticRange[]` | - | Predefined ranges |
| `inputRanges` | `InputRange[]` | - | Input-based ranges |
| `onShownDateChange` | `(shownDate: Dayjs) => void` | - | Callback for shown date change |
| `onPreviewChange` | `(preview: Range \| null) => void` | - | Callback for preview change |
| `renderStaticRangeLabel` | `(staticRange: StaticRange) => ReactNode` | - | Custom render function |
| `renderInputRangeLabel` | `(inputRange: InputRange) => ReactNode` | - | Custom render function |
| `ariaLabels` | `AriaLabels` | - | ARIA labels object |
| `wrapperClassName` | `string` | - | Wrapper class name |

### Range Interface

```typescript
interface Range {
  startDate?: DateInput;
  endDate?: DateInput;
  color?: string;
  key?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  showDateDisplay?: boolean;
}
```

### DateInput Type

```typescript
type DateInput = string | number | Date | Dayjs | null | undefined;
```

### StaticRange Interface

```typescript
interface StaticRange {
  label: string;
  range: () => Range;
  isSelected: (range: Range) => boolean;
}
```

## Migration from react-date-range

This library is designed to be a drop-in replacement for `react-date-range`. The main differences:

1. **Import path**: Change from `react-date-range` to `react-date-range-picker`
2. **Styles**: Import from `react-date-range-picker/styles` instead of `react-date-range/dist/styles.css`
3. **Date library**: Uses `dayjs` internally instead of `date-fns` (no API changes needed)

### Before (react-date-range)

```tsx
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
```

### After (react-date-range-picker)

```tsx
import { DateRangePicker } from 'react-date-range-picker';
import 'react-date-range-picker/styles';
```

## Development

To preview the component locally:

```bash
# Install dependencies
npm install

# Start preview server
npm run preview
# or
npm run dev
```

This will start a development server with multiple examples showcasing different features of the date range picker.

## Performance

- **Bundle Size**: ~15KB gzipped (including dayjs)
- **Tree-shaking**: All utilities and components are tree-shakable
- **Optimizations**: 
  - React.memo for all components
  - useMemo for expensive calculations
  - useCallback for event handlers
  - Efficient date calculations with dayjs
  - Debounced hover and drag handlers

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## TypeScript

Full TypeScript support is included. All components and utilities are fully typed.

```tsx
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range-picker';

const handleChange = (item: RangeKeyDict) => {
  const range: Range = item.selection;
  // TypeScript knows the structure
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

This library is inspired by [react-date-range](https://github.com/hypeserver/react-date-range) and aims to provide a modern, lightweight alternative using `dayjs`.
