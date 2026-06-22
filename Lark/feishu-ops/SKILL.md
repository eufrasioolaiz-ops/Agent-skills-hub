---
name: feishu-ops
description: Handle Feishu or Lark collaboration operations, including message drafting, task triage, calendar coordination, document routing, approval follow-up, and repeatable office workflows. Use when the user asks for help with Feishu work items, meeting follow-ups, cross-team coordination, or operational communication.
---

# Feishu Ops

## Workflow

1. Identify the Feishu object type: message, task, calendar event, document, approval, meeting note, or base table.
2. Clarify whether the request is read-only, draft-only, or should perform an action.
3. Use the matching Feishu/Lark tool or connector when available.
4. For communication tasks, produce a concise draft first and wait before sending if the user did not explicitly authorize sending.
5. Record unresolved blockers, owners, deadlines, and next actions.

## Resource Guide

- Read `references/feishu-workflows.md` for common routing patterns.
- Use `scripts/summarize_action_items.py` to extract owners, dates, and actions from pasted meeting notes or chat text.

## Output Style

- Keep operational summaries brief and action-oriented.
- Separate confirmed facts from inferred next steps.
- For messages to colleagues, prefer polite, restrained, and concrete wording.

