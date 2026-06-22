---
name: lark-openclaw-tutorial
description: Teach AI agents how to understand, configure, and safely use the official OpenClaw Lark/Feishu plugin, including installation knowledge, Feishu CLI binding, advanced OpenClaw Feishu channel settings, disabling native OpenClaw Feishu tools and Skills when using lark-cli, and troubleshooting plugin permissions. Use when an agent needs to learn OpenClaw Feishu plugin workflows without installing anything.
---

# Lark OpenClaw Tutorial

## Purpose

Use this skill as an agent-facing tutorial for the official OpenClaw Lark/Feishu plugin. It is for learning and configuration guidance only. Do not install or modify OpenClaw unless the user explicitly asks for that action.

## Source Notice

This skill summarizes:

- User-provided Feishu document: `https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh`
- Linked FAQ document about disabling native Feishu tools when using `lark-cli`: `LXrjwi1RuiXm2wkIGc7clmdanVf`
- User-provided install command: `npx -y @larksuite/openclaw-lark install`

Checked on 2026-06-22. Prefer the live official document if behavior changes.

## Quick Mental Model

The official OpenClaw Feishu plugin connects OpenClaw agents to Feishu/Lark business data and actions. It can work through official native plugin tools and can also bind `lark-cli` to the current OpenClaw Feishu robot for broader CLI-based Feishu operations.

Core decisions:

- Use robot identity for team assistants, group Q&A, notifications, and public resources.
- Use user identity only for personal use cases, because the agent may act as the user and access user-owned data.
- If using `lark-cli` as the primary Feishu interface, disable native Feishu tools and Skills so OpenClaw does not prefer the native tools over CLI execution.

## Read These References

- Read `references/install-and-cli-binding.md` for install knowledge, Feishu CLI binding, verification commands, and identity choices.
- Read `references/advanced-config.md` for streaming, thread sessions, group reply policy, OpenClaw 3.2 tool visibility, diagnostics, and official plugin enablement.
- Read `references/disable-native-tools.md` for disabling native OpenClaw Feishu tools and Skills when using `lark-cli`.
- Read `references/security.md` before advising any user-identity, group, permissions, or write-action configuration.
- Read `references/sources.md` when citing or refreshing upstream sources.

## Agent Rules

- Do not run `npx -y @larksuite/openclaw-lark install` unless the user explicitly asks to install.
- Do not ask the user to paste App Secret, gateway token, access token, cookies, or private dashboard credentials into chat.
- Treat configuration snippets as templates and replace all real secrets with placeholders.
- For group usage, prefer the safest policy: require @ mention and restrict replies to the application owner or explicit allowlist.
- When switching to CLI-only Feishu operations, disable both native tools and native Skills, then restart the gateway and verify in a new session.
- Do not recommend fully autonomous send/update/delete behavior; preview and confirm important write operations.

