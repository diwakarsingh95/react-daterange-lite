# React Date Range Lite

A lightweight, performant React date range picker library built with `dayjs`. Optimized for modern React applications with minimal bundle size, tree-shaking support, and full TypeScript coverage.

## Features

- 🚀 **Lightweight**: Uses `dayjs` (~2KB) for smaller bundle size
- 📦 **Tree-shakable**: Named exports allow bundlers to eliminate unused code
- ⚡ **Performant**: Optimized with React.memo, useMemo, and useCallback
- 🎨 **Modern UI**: Clean, accessible interface with smooth interactions
- 🔧 **TypeScript**: Full TypeScript support with comprehensive type definitions
- ♿ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation
- 🎨 **Customizable**: Theme colors, custom styles, and flexible date formatting

## Quick Start

### Installation

```bash
npm install react-daterange-lite dayjs
# or
yarn add react-daterange-lite dayjs
# or
pnpm add react-daterange-lite dayjs
```

### Basic Usage

```tsx
import React, { useState } from 'react';
import { DateRangePicker } from 'react-daterange-lite';
import 'react-daterange-lite/styles';

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
        dayjs(range.startDate).isSame(dayjs(), 'day') && dayjs(range.endDate).isSame(dayjs(), 'day')
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
      return dayjs(range.startDate).isSame(start, 'day') && dayjs(range.endDate).isSame(end, 'day');
    },
  },
];

<DateRangePicker
  onChange={(item) => setState({ selection: item.selection })}
  ranges={[state.selection]}
  staticRanges={staticRanges}
/>;
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
  disabledDates={[dayjs().add(1, 'day').toDate(), dayjs().add(2, 'day').toDate()]}
  minDate={dayjs().subtract(1, 'month').toDate()}
  maxDate={dayjs().add(3, 'month').toDate()}
  disabledDay={(date) => date.day() === 0 || date.day() === 6} // Disable weekends
/>;
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

| Prop                            | Type                                       | Default         | Description                                                          |
| ------------------------------- | ------------------------------------------ | --------------- | -------------------------------------------------------------------- |
| `ranges`                        | `Range[]`                                  | -               | Array of range objects to display                                    |
| `onChange`                      | `(item: RangeKeyDict) => void`             | -               | Callback fired when the user changes the date                        |
| `onRangeFocusChange`            | `(focusedRange: [number, number]) => void` | -               | Callback fired when the user changes the focused range               |
| `startDate`                     | `DateInput`                                | -               | Initial start date                                                   |
| `endDate`                       | `DateInput`                                | -               | Initial end date                                                     |
| `focusedRange`                  | `[number, number]`                         | `[0, 0]`        | Initial focused range                                                |
| `initialFocusedRange`           | `[number, number]`                         | `[0, 0]`        | Initial focused range                                                |
| `months`                        | `number`                                   | `2`             | Number of months to display                                          |
| `direction`                     | `'horizontal' \| 'vertical'`               | `'horizontal'`  | Direction of calendar months                                         |
| `showMonthArrow`                | `boolean`                                  | `true`          | Show month navigation arrows                                         |
| `showDateDisplay`               | `boolean`                                  | `true`          | Show date display                                                    |
| `showPreview`                   | `boolean`                                  | `true`          | Show preview range                                                   |
| `editableDateInputs`            | `boolean`                                  | `false`         | Allow manual date input                                              |
| `dragSelectionEnabled`          | `boolean`                                  | `true`          | Enable drag selection                                                |
| `moveRangeOnFirstSelection`     | `boolean`                                  | `false`         | Move range on first selection                                        |
| `retainEndDateOnFirstSelection` | `boolean`                                  | `false`         | Retain end date on first selection                                   |
| `calendarFocus`                 | `'forwards' \| 'backwards'`                | `'forwards'`    | Which calendar to focus                                              |
| `disabledDates`                 | `DateInput[]`                              | -               | Array of disabled dates                                              |
| `disabledDay`                   | `(date: Dayjs) => boolean`                 | -               | Function to disable days                                             |
| `minDate`                       | `DateInput`                                | -               | Minimum selectable date                                              |
| `maxDate`                       | `DateInput`                                | -               | Maximum selectable date                                              |
| `dateDisplayFormat`             | `string`                                   | `'MMM D, YYYY'` | Date display format                                                  |
| `monthDisplayFormat`            | `string`                                   | `'MMMM YYYY'`   | Month display format                                                 |
| `weekdayDisplayFormat`          | `string`                                   | `'dd'`          | Weekday format                                                       |
| `dayDisplayFormat`              | `string`                                   | `'D'`           | Day format                                                           |
| `weekStartsOn`                  | `number`                                   | `0`             | Week start day (0-6, 0 = Sunday)                                     |
| `locale`                        | `LocaleConfig`                             | -               | Locale configuration                                                 |
| `className`                     | `string`                                   | -               | Custom CSS class                                                     |
| `classNames`                    | `ClassNames`                               | -               | Custom class names object                                            |
| `styles`                        | `Styles`                                   | -               | Custom styles object                                                 |
| `themeColor`                    | `string`                                   | `'#3d91ff'`     | Primary theme color for selected ranges, hover borders, focus styles |
| `color`                         | `string`                                   | `'#3d91ff'`     | Legacy prop, use `themeColor` instead                                |
| `staticRanges`                  | `StaticRange[]`                            | -               | Predefined ranges                                                    |
| `inputRanges`                   | `InputRange[]`                             | -               | Input-based ranges                                                   |
| `onShownDateChange`             | `(shownDate: Dayjs) => void`               | -               | Callback for shown date change                                       |
| `onPreviewChange`               | `(preview: Range \| null) => void`         | -               | Callback for preview change                                          |
| `renderStaticRangeLabel`        | `(staticRange: StaticRange) => ReactNode`  | -               | Custom render function                                               |
| `renderInputRangeLabel`         | `(inputRange: InputRange) => ReactNode`    | -               | Custom render function                                               |
| `ariaLabels`                    | `AriaLabels`                               | -               | ARIA labels object                                                   |
| `wrapperClassName`              | `string`                                   | -               | Wrapper class name                                                   |

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

- **Bundle Size**: ~8-10KB gzipped (ESM: ~10KB, CJS: ~9KB) + ~2.4KB CSS
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
import { DateRangePicker, Range, RangeKeyDict } from 'react-daterange-lite';

const handleChange = (item: RangeKeyDict) => {
  const range: Range = item.selection;
  // TypeScript knows the structure
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## TODO / Future Improvements

The following items are planned for future releases:

### Testing

- [ ] Unit tests for utility functions (`dateUtils`, `rangeUtils`)
- [ ] Component tests for `DateRangePicker`, `Calendar`, `DateInput`, `DefinedRanges`
- [ ] Integration tests for user interactions (click, drag, keyboard navigation)
- [ ] Visual regression tests
- [ ] Accessibility tests (a11y)
- [ ] Test coverage reporting (aim for >80% coverage)

### Documentation

- [ ] Storybook for interactive component documentation
- [ ] More code examples and use cases
- [ ] Migration guide from other date picker libraries
- [ ] CHANGELOG.md for version history
- [ ] CONTRIBUTING.md guidelines
- [ ] API documentation with JSDoc comments

### Features

- [ ] Multiple range selection support
- [ ] Internationalization (i18n) with locale support
- [ ] More predefined range templates
- [ ] Custom date formatting with dayjs plugins
- [ ] Server-side rendering (SSR) optimization
- [ ] React Server Components compatibility
- [ ] Keyboard shortcuts documentation
- [ ] Touch/mobile gesture improvements

### Developer Experience

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Automated releases with semantic versioning
- [ ] Bundle size monitoring
- [ ] Performance benchmarking
- [ ] TypeScript strict mode improvements
- [ ] ESLint warnings resolution

### Performance

- [ ] Code splitting for large date ranges
- [ ] Virtual scrolling for long date lists
- [ ] Memoization optimizations
- [ ] Bundle size analysis and optimization

## License

MIT

## Acknowledgments

This library provides a modern, lightweight date range picker solution using `dayjs` for optimal performance and bundle size.
