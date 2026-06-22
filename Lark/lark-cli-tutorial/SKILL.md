---
name: lark-cli-tutorial
description: Teach AI agents how to install, configure, authorize, verify, and safely use the official Lark/Feishu lark-cli for Feishu business work. Use when an agent needs guidance for lark-cli setup, app credential initialization, OAuth authorization, identity selection, scope troubleshooting, command discovery, dry-run previews, or safe execution of Feishu operations through the CLI.
---

# Lark CLI Tutorial

## Purpose

Use this skill only as an agent-facing tutorial for learning and operating the official `lark-cli`. It is not a replacement for the official documentation; always prefer current official docs when behavior differs.

## Source Notice

This skill summarizes public documentation and repository information from:

- Feishu Open Platform lark-cli installation guide: `https://open.feishu.cn/document/no_class/mcp-archive/feishu-cli-installation-guide.md`
- Official GitHub repository: `https://github.com/larksuite/cli`
- Local operational notes from the bundled `lark-shared` skill used for agent safety, split authorization flow, identity selection, update notices, and high-risk write confirmation.

## Quick Workflow

1. Confirm `node` and `npm` or `npx` are available.
2. Install or update `lark-cli`.
3. Initialize app credentials with `lark-cli config init --new`.
4. Authorize user scopes with `lark-cli auth login`.
5. Verify with `lark-cli auth status`.
6. Choose the right identity: `--as user` for user resources, `--as bot` for app/bot operations.
7. Discover and run business commands with `--help`, `schema`, shortcuts, and `--dry-run` for write operations.

## Read These References

- Read `references/install-and-config.md` for installation, app configuration, and user authorization.
- Read `references/agent-usage.md` for how agents should choose commands, identities, output formats, and troubleshooting paths.
- Read `references/security.md` before running write operations, permission changes, or commands that may expose private data.
- Read `references/sources.md` when citing the upstream source or refreshing this skill.

## Agent Rules

- Never ask the user to paste `appSecret`, access tokens, cookies, or session data into chat.
- Never store authorization URLs or device codes for reuse; generate new ones when needed.
- Show authorization links and QR codes to the user, then stop and wait for the user to confirm completion before polling a device code.
- Use `--dry-run` before side-effecting commands when supported.
- Do not add `--yes` to high-risk operations until the user explicitly confirms the exact action.
- Prefer JSON or table output for inspection; avoid dumping large raw payloads into chat.
- If official docs or `lark-cli --help` disagree with this skill, follow the current CLI output and note that the skill may need updating.

