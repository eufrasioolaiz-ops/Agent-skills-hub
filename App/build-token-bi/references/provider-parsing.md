# Provider Parsing Notes

Use this reference when adapting or debugging `src/token-monitor.js`.

## Provider Routes

- MiniMax usage: `https://platform.minimaxi.com/console/usage`
- MiniMax plan detail fallback: `https://platform.minimaxi.com/console/plan`
- MiMo plan management: `https://platform.xiaomimimo.com/console/plan-manage`
- DeepSeek usage: `https://platform.deepseek.com/usage`

## Session Model

Each provider uses a separate persistent Electron partition:

- `persist:tokenbi-minimax`
- `persist:tokenbi-mimo`
- `persist:tokenbi-deepseek`

These partitions remain local to the generated app's Electron user data. Do not copy or commit the user data directory.

## Parsing Strategy

1. Open the provider console page in a hidden Electron window.
2. Wait for expected page text and data-ready patterns.
3. Capture visible page text and a limited set of link metadata.
4. Parse percentages, reset hints, expiry dates, balance, and spend values from text.
5. Return structured data to the renderer.

## Maintenance Rules

- Prefer updating keywords and regexes over adding brittle CSS selectors.
- Keep capture limits bounded.
- Sanitize error messages before surfacing them.
- Treat provider page captures as private data.
- Use fake examples when documenting parser behavior.

