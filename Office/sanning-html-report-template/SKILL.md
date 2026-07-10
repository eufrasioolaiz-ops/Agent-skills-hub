---
name: sanning-html-report-template
description: Create or refine self-contained, responsive HTML/H5 reports in the Sanning corporate presentation style. Use for natural-language requests to make a Sanning report page, project briefing H5, executive dashboard, single-page scrolling report, or horizontal/vertical multi-page slide report with embedded logo, inline media, image lightboxes, navigation, and mobile adaptation.
---

# 三宁通用汇报 HTML 模板

Use this skill to generate a new, self-contained HTML report. Do not reuse business copy, screenshots, figures, project names, or conclusions from older reports unless the current user explicitly supplies them.

## Start Here

1. Extract the user's title, audience, required sections, available images, and whether the requested flow is `single`, `deck-horizontal`, or `deck-vertical`.
2. Read [brand-system.md](references/brand-system.md) and [content-composition.md](references/content-composition.md) before designing the page.
3. Create the starter file with the bundled generator. It embeds the official logo automatically.

```powershell
python scripts/create_report.py --mode single --title "[汇报标题]" --module "[模块名称]" --output "C:\path\report.html"
python scripts/create_report.py --mode deck --flow horizontal --title "[汇报标题]" --module "[模块名称]" --output "C:\path\report.html"
python scripts/create_report.py --mode deck --flow vertical --title "[汇报标题]" --module "[模块名称]" --output "C:\path\report.html"
```

Use `assets/single-page.html` for a scrollable one-page report and `assets/slide-deck.html` for a page-by-page presentation. The generator replaces the logo, title, module, and flow placeholders; do not leave any `__...__` placeholder in the delivered file.

## Build Rules

- Keep all CSS and JavaScript in the output HTML. Do not use CDNs, external fonts, external images, or external scripts.
- Use `assets/sanning-logo.data-uri.txt` only through the generator or paste its data URI into the output. The delivered logo must be embedded, not a relative file reference.
- Convert every user-supplied bitmap to a `data:image/...;base64,...` URI before delivery. Preserve GIF animation by using `image/gif`.
- Add a click-to-enlarge lightbox to every meaningful screenshot or photo. Use the template's `.media-thumb` button, `data-lightbox-src`, and included lightbox logic.
- Preserve the 16:9 desktop presentation proportion for decks. For one-page reports, use a wide executive layout on desktop and one-column reading on narrow screens.
- Treat 700px as the principal mobile breakpoint. Avoid horizontal page scroll, clipping, tiny text, and controls hidden below the viewport.
- Use semantic `header`, `main`, `section`, `article`, `aside`, `figure`, and `button` elements. Buttons need visible focus styles and a text or `aria-label` name.

## Content Workflow

### One-page flow

Use this sequence unless the brief requires another order:

1. Identity bar: embedded logo, module pill, English micro-label.
2. Hero: title, one-sentence positioning, concise objective statement.
3. Main board: 4-6 business areas, initiatives, or decisions. Use click-to-switch detail only when it makes the page easier to scan.
4. Route: 3-5 phases, workstreams, or milestones with ownership and outcomes.
5. Assurance: technology, knowledge, people, governance, partners, and measurement as appropriate.
6. Footer: report name and short status phrase.

### Multi-page flow

Use 3-10 pages by default. The standard order is cover, context/objective, current state, solution or workstreams, roadmap, governance/assurance, and close. Keep one dominant idea per slide. Use horizontal flow for conventional presentations and vertical flow when the audience will scroll on a phone or kiosk.

For each slide, keep title plus subtitle at the top, reserve the footer for page identity, and avoid more than two major content columns unless the brief calls for a comparison. Do not put a dense paragraph over an image.

## Style Guardrails

Follow [brand-system.md](references/brand-system.md) exactly for color, typography, spacing, cards, decorative treatment, and the mobile rules. Use [content-composition.md](references/content-composition.md) to choose the right information pattern.

Do not replace the red-white corporate design with generic dark dashboards, purple gradients, oversized hero marketing copy, rounded floating-card overload, or unrelated stock imagery.

## Media Pattern

Insert media as a button so it is keyboard accessible:

```html
<button class="media-thumb" type="button" data-lightbox-src="data:image/jpeg;base64,..." aria-label="放大查看：[图片说明]">
  <img src="data:image/jpeg;base64,..." alt="[图片说明]">
  <span>[图片说明]</span>
</button>
```

Use `object-fit: cover` for thumbnails. For screenshots with small text, use `object-fit: contain` or a wider frame so the content stays legible. Do not put important information only inside the image; add a visible caption or supporting text.

## Deck Interaction Rules

The deck template includes previous/next buttons, keyboard navigation, progress, counter, fullscreen, and a mobile-view toggle. Keep all of them working after edits. When adding slides, give every page the class `slide` and keep exactly one `slide active` at initialization.

Use `data-flow="horizontal"` or `data-flow="vertical"` on `body`; do not implement separate duplicate decks for the two directions.

## Validation Before Delivery

1. Confirm the final HTML has no unresolved `__PLACEHOLDER__` markers.
2. Confirm all `src` values are data URIs, except `#` anchors.
3. Verify desktop at 1366x768 and a mobile width near 390px when browser access is available.
4. Check first viewport, long-content scroll, text wrapping, footer/control visibility, lightbox open/close, and deck previous/next navigation.
5. Check browser console for errors. Report any untested condition honestly.

## Bundled Resources

- `assets/single-page.html`: responsive one-page starter with the full visual system and media lightbox.
- `assets/slide-deck.html`: responsive horizontal/vertical deck starter with navigation and lightbox.
- `assets/sanning-logo.data-uri.txt`: official embedded logo source.
- `scripts/create_report.py`: generate a self-contained starter and inline the official logo.
- `references/brand-system.md`: visual system and responsive rules.
- `references/content-composition.md`: composition patterns and natural-language mapping.
