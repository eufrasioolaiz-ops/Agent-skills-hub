---
name: html-auto38
description: Create polished HTML presentation decks and styled HTML documents from a curated catalog of 32 source templates. Use for HTML slides, pitch decks, Chinese-friendly business reports, research reports, brand narratives, and landing-page-like documents that need template selection by audience, mood, formality, density, or light/dark scheme.
---

# HTML Auto 38

Create a finished HTML deck by matching the brief to a template, adapting content without breaking its design system, and delivering a standalone HTML file.

## 中文友好说明

使用本技能时，用中文理解需求、确认场景，并用中文向用户解释模板选择。除非用户明确要求英文，最终页面文案、预览说明、文件命名建议和交付说明都优先使用中文。

适合处理：

- 中文汇报页、路演页、研究报告、品牌叙事、课题展示和轻量落地页；
- 需要在多种视觉风格之间做选择的 HTML 演示稿；
- 用户只给出主题，需要智能体补齐结构、章节、标题层级和版式方向的任务。

中文沟通时保持简洁：先确认“用途/观众/情绪风格”，再给 3 个候选模板。说明模板时使用“适合什么、视觉感觉、取舍点”三句话，不堆英文设计术语。

## Gather the brief

Before choosing a template, obtain or infer these items:

- occasion, audience, and desired outcome;
- title, author, date, and required sections;
- visual mood and light/dark preference;
- information density and any mandatory facts, charts, images, or brand assets.

If the request lacks a clear occasion or mood, ask only for those two items. Do not choose a template before that answer.

For Chinese briefs, map common phrases before selecting:

- “正式汇报、领导汇报、经营分析” -> prefer `Signal`, `Blue Professional`, `Monochrome`, or `Cartesian`.
- “研究报告、课题成果、白皮书” -> prefer `Monochrome`, `Cartesian`, `Cobalt Grid`, or `Vellum`.
- “品牌发布、创意提案、活动视觉” -> prefer `Creative Mode`, `Studio`, `Bold Poster`, or `Editorial Tri-Tone`.
- “轻松、社区、培训、工作坊” -> prefer `Daisy Days`, `Capsule`, `Playful`, or `Scatterbrain`.

## Select a template

Read [references/template-catalog.md](references/template-catalog.md). Match mood and `best for` first, then use formality, density, and scheme as constraints. Treat `avoid for` as a warning rather than an absolute prohibition.

Propose three genuinely distinct matches. For each, state its name, one-line visual rationale, and trade-off. Do not select a final template until the user chooses, unless they explicitly delegate the choice.

## Acquire the selected source

Do not clone the upstream repository and do not bundle third-party template files into this skill. Download only the chosen template at execution time:

```powershell
python scripts/fetch_template.py <slug> --output <working-directory>
```

The script saves `template.html` and `template.json`, and automatically downloads `deck-stage.js` for templates that require it. Inspect the downloaded HTML and metadata before editing. Verify upstream licensing and attribution requirements before external publication.

The downloaded templates come from `zarazhangrui/beautiful-html-templates` at execution time. Keep attribution and source notes in the working folder when the output will be shared outside the local task.

On Windows, set `$env:PYTHONUTF8='1'` before running the script if Chinese help text appears garbled.

## Make previews

For each of the three candidates, create a standalone title-slide preview in a `previews/` directory. Replace only cover text (title, subtitle, author, date) and preserve all CSS, fonts, decorations, and layout. Show the three local paths and ask which direction feels right.

## Build the deck

Use the chosen `template.html` as the base.

- Replace placeholders in headings, copy, facts, labels, and image slots.
- Add or remove slides by duplicating the closest existing layout; keep page numbering correct.
- For a missing layout, create it with the same fonts, colors, spacing rhythm, decorative vocabulary, and component grammar.
- Keep required runtime files next to the final HTML and retain relative references.

Never substitute fonts, recolor the palette, combine layouts from different templates, or remove decorative elements merely because they look nonfunctional.

## Verify and deliver

Open the final HTML locally and check legibility, clipping, image paths, page numbers, and keyboard/navigation behavior where applicable. Deliver the HTML file and a one-sentence explanation of why its visual tone fits the brief.
