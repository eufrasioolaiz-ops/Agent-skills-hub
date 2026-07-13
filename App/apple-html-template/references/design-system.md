# Design System

## Visual Intent

Create a calm, premium product surface: one strong promise, generous empty space, a real Hero visual, and a small number of highly legible supporting sections. The visual language should feel refined without becoming a branded imitation.

## Tokens

```css
:root {
  --page: #f5f5f7;
  --surface: rgba(255, 255, 255, .56);
  --ink: #1d1d1f;
  --muted: #6e6e73;
  --blue: #0071e3;
  --radius-lg: 24px;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}
```

Use `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, and `Microsoft YaHei` as the system font stack. Use an 8px spacing rhythm. Reserve Hero-scale type for the page promise; use smaller titles inside features.

## Glass Hierarchy

1. Put a bitmap image, product render, or meaningful color field behind the glass layer.
2. Use translucent white or charcoal surfaces (`.38` to `.58` alpha), then apply `backdrop-filter: blur(20px) saturate(150%)`.
3. Add a thin, bright border plus an inset top highlight before adding an outer shadow.
4. Keep dense copy on solid or higher-opacity surfaces so contrast remains readable.
5. Limit glass to navigation, Hero callouts, a specification strip, and a few feature panels.

## Layout And Motion

- Use a centered content width near 1120px, a two-column Hero, then a 3-column feature row.
- Collapse Hero at 820px and use one feature column near 600px.
- Keep interaction movement to `transform`, `opacity`, and background/color changes. Use 300-700ms `--ease-out` transitions.
- Respect `prefers-reduced-motion`; do not make animation necessary for comprehension.

## Accessibility

- Keep body text contrast at WCAG AA or higher.
- Provide visible `:focus-visible` outlines and text labels for icon buttons.
- Use `header`, `nav`, `main`, `section`, `article`, and `footer` elements.
- Use descriptive `alt` text for Hero media. Do not encode essential copy inside an image.
