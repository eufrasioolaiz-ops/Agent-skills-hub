---
name: apple-html-template
description: "Create original, self-contained HTML product pages with a refined Apple-inspired visual language: generous whitespace, translucent glass layers, system typography, subtle motion, dark mode, and responsive layout. Use for product showcases, concept pages, premium landing pages, or visual prototypes that need this style without copying Apple brand assets or product interfaces."
---

# Apple-Inspired HTML Product Page

Create a single, offline-ready HTML product page from the bundled template. Treat the word "Apple" as a design shorthand only; do not use Apple logos, product names, trademarked copy, or a close reconstruction of any Apple page.

## Start Here

1. Extract the product name, audience, main promise, supporting copy, and required actions.
2. Read [design-system.md](references/design-system.md). Read [brand-and-safety.md](references/brand-and-safety.md) before using an external reference or user-supplied brand material.
3. Generate a starter. The script HTML-escapes supplied text and embeds the bundled Hero image as a data URI.

```powershell
python scripts/create_apple_html.py `
  --product-name "产品名称" `
  --eyebrow "PRODUCT LINE" `
  --headline "一句清晰的核心承诺" `
  --hero-copy "用两句话说明产品为谁解决什么问题。" `
  --output "C:\path\product-page.html"
```

Use `assets/product-page.html` when making structural changes. Keep the template self-contained: no CDN, external font, analytics, tracking, or remote image URL.

## Build Rules

- Start with one dominant promise, one concise supporting paragraph, and one primary action.
- Use a real image or a generated bitmap for the Hero. Put it behind translucent surfaces so refraction, blur, and highlights have visible content to work against.
- Keep glass treatment layered: a low-opacity background, `backdrop-filter`, a thin bright edge, a restrained outer shadow, and an inner top highlight. Do not turn every section into frosted glass.
- Use system fonts, an 8px spacing rhythm, a neutral base palette, and one deliberate accent color.
- Include a `prefers-reduced-motion` fallback, visible keyboard focus, semantic landmarks, image alt text, and a mobile layout near 600px.
- Use buttons only for actions. Give icon-only controls a text `aria-label` and `title`.
- Add dark mode by changing custom properties. Do not invert bitmap imagery blindly.
- Keep product copy, metric values, and claims supplied or explicitly marked as placeholders. Never invent business results.

## Validation Before Delivery

1. Run `python scripts/create_apple_html.py ...` with realistic Chinese text containing `&`, `<`, and quotes.
2. Confirm no `__PLACEHOLDER__` remains and that the generated HTML has no external URL.
3. Check the inline script with Node and inspect the page on desktop and a width near 390px when browser access permits.
4. Test theme toggle, section navigation, any mode switcher, keyboard focus, and text wrapping.

## Bundled Resources

- `assets/product-page.html`: editable product-page template.
- `assets/translucent-sensor-hero.png`: original Hero bitmap for the default template.
- `scripts/create_apple_html.py`: generate a standalone page and inline the Hero asset.
- `references/design-system.md`: visual tokens and composition rules.
- `references/brand-and-safety.md`: attribution, trademark, and privacy boundaries.
