# 内容编排与自然语言映射

## 先判断输出模式

| 用户表述 | 推荐模式 | 默认结构 |
| --- | --- | --- |
| “做一页汇报”“一页 H5”“方案总览” | 单页流 | 标题、目标、主题板块、路径、保障、页脚 |
| “做成阶段汇报”“多页翻页”“演示稿” | 横向翻页流 | 封面、背景、现状、方案、路径、保障、结尾 |
| “手机上看”“向下浏览”“长图汇报” | 纵向翻页或单页流 | 顶部摘要、分区内容、固定或可见导航、页尾 |
| “插入多张系统截图” | 单页或多页 | 文字先行，截图置于对应模块下方，统一缩略图比例 |

## 需求转换规则

1. Turn a broad brief into one primary title, one positioning sentence, 3-6 thematic modules, and 3-5 execution phases.
2. Keep supplied facts, numbers, names, and scope unchanged. Write missing connective copy, labels, and implementation language only when the user asks for content help.
3. Use a domain grid when there are 4-6 parallel departments, scenarios, or workstreams.
4. Use a timeline when the user describes sequencing, implementation, milestones, or “next steps.”
5. Use a red outcome panel when one conclusion, directive, or decision needs executive attention.
6. Use a detail switcher only when six or more cards would otherwise make the page too dense. The first card must display useful content by default.

## Writing Pattern

Use headings that name the decision or work, not vague labels. Prefer:

- `[业务域]推进重点`
- `[项目]目标与价值`
- `[阶段]关键交付`
- `[机制]组织与保障`
- `[场景]试点边界与验收方式`

For each workstream, include up to three of: objective, scope, first action, owner, dependency, metric, or expected deliverable. Do not fill the page with abstract slogans.

## Image Placement

- Put scenario text above or beside its screenshot; do not make a small screenshot carry the story alone.
- Keep parallel thumbnails equal in size and crop ratio.
- For a UI screenshot, use a caption that states the business function rather than the software product name alone.
- Put a meaningful image in the lower portion of a content module when the headline and key point need priority.
- Use the lightbox for all screenshots wider than their readable thumbnail size.

## Common Anti-patterns

- Do not duplicate the title in every card.
- Do not put more than six dense cards in one desktop row.
- Do not use four different accent colors to distinguish business departments; use typography, labels, and layout first.
- Do not create fake charts, fabricated KPIs, or unverified implementation claims.
- Do not move controls over content merely to force a page into a fixed height.
