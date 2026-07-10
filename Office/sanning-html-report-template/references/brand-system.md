# 三宁 HTML 汇报视觉系统

## 设计意图

Use a clean red-white executive-report aesthetic: disciplined, technical, and warm enough for internal management communication. The page should read like a polished presentation, not a marketing landing page or a generic software dashboard.

## Core Tokens

```css
:root{
  --red:#ce0015;
  --red-deep:#83000b;
  --red-soft:#fff1f3;
  --ink:#16171b;
  --muted:#5f6876;
  --line:#efd8dc;
  --paper:#fffdfd;
  --shadow:0 24px 62px rgba(87,19,29,.14);
  --soft-shadow:0 10px 28px rgba(87,19,29,.09);
}
```

Use red only for primary emphasis, status, rules, accent lines, and controlled red panels. Keep most surfaces white, off-white, or very pale pink. Never use an all-red canvas, a purple gradient, beige-heavy palette, or a dark-blue dashboard palette.

## Typography

- Use `HarmonyOS Sans SC`, `PingFang SC`, `Microsoft YaHei`, and Arial for UI and body text.
- Use `Source Han Serif SC`, `Noto Serif SC`, or `SimSun` for major Chinese titles only.
- Use serif titles at 42-74px desktop and 38-46px mobile; avoid huge viewport-scaled type.
- Use 15-18px body text on desktop and 13-15px on mobile. Keep line-height 1.5-1.75.
- Use positive, compact letter spacing only for small English micro-labels. Do not use negative tracking on body text.

## Layout

- Desktop content width: `min(1760px, calc(100% - 44px))` for single-page work.
- Main paper shell: 26-34px radius, very light border, soft red shadow, 26-48px padding.
- Deck: preserve a 16:9 card; keep controls outside or below without covering footer content.
- Use 20-32px grid gaps desktop and 14-18px mobile.
- Use cards only for distinct repeated items, major panels, or framed tools. Do not nest card inside card without a clear hierarchy.
- Use a 3-5px red left rule on information panels; use a red gradient panel only for the page's single dominant message or key action block.

## Brand Header And Footer

- Place the embedded Sanning logo at upper left. Logo height: 36-42px desktop, 27-30px mobile.
- Pair it with a compact red module pill. Use a thin red line and uppercase English micro-label at upper right.
- Footer is quiet: a short red rule, report/page identifier on the left, and a concise status phrase on the right.

## Cards And Data

- Card radius: 17-28px depending on scale. Use `--soft-shadow`; never use hard borders or intense drop shadows.
- Place the category number or micro-label in red, title in near-black, and supporting copy in muted gray.
- Prefer 3 or 4 even cards on desktop. Collapse to 2 columns then 1 column on mobile.
- Use real values only when supplied. For missing values, use neutral labels or clear placeholders, never invent metrics.

## Decorative Treatment

- Use subtle radial red glow, low-opacity grid lines, and one oversized pale watermark only when it does not compete with content.
- Never use decorative blobs, bokeh, complex SVG illustrations, or unrelated image collages as primary visual content.
- Use Lucide icons only when an icon adds scan value; otherwise use text and restrained numbering.

## Responsive Rules

- Start responsive changes at 1080px and make the principal one-column change at 700px.
- On mobile: remove outer card radius/margins if it improves usable width; make navigation and controls wrap; ensure no control is below the first reachable viewport without page scroll.
- Avoid `100vh` as the only height constraint on mobile. Use `min-height` and let the page grow.
- Use `min-width:0`, `overflow-wrap:anywhere`, and stable grid tracks to prevent long Chinese text from forcing overflow.
- Thumb images should retain a meaningful height; do not flatten screenshots into thin strips.

## Accessibility And Interaction

- Every clickable card must be a `button` or link, not a plain `div`.
- Use visible `:focus-visible` styles in red or white depending on contrast.
- Preserve keyboard use for deck navigation, close buttons, and media lightbox.
- Provide `alt` text and a visible caption for business screenshots.
