# Agent Usage Guide

## What lark-cli Is For

`lark-cli` lets agents operate Feishu/Lark business domains through CLI commands. The official repository describes coverage across messaging, docs, base, sheets, slides, calendar, mail, tasks, meetings, markdown, approval, OKR, attendance, and related domains.

Use it when the user asks an agent to read, create, update, summarize, search, export, or organize Feishu/Lark resources.

## Identity Selection

Use `--as user` when the task concerns a user's own resources:

- Calendar agenda and personal events.
- Drive and Docs owned or accessible to the user.
- Mail, attendance, approvals, personal tasks, personal meeting records.

Use `--as bot` when the task should be performed by the app/bot:

- Bot messages.
- App-level operations.
- Resources created or owned by the bot.

Important differences:

- Bot identity does not automatically see the user's personal calendar, drive, mail, or similar resources.
- User identity requires both app-side scopes and user OAuth authorization.
- Bot identity generally needs app permissions configured in the developer console, not `auth login`.

## Command Discovery

Start broad:

```bash
lark-cli --help
lark-cli <service> --help
lark-cli <service> +<shortcut> --help
```

Inspect schemas:

```bash
lark-cli schema
lark-cli schema calendar.events.instance_view
lark-cli schema im.messages.delete
```

Use command output to learn required parameters, supported identities, risks, and scopes.

## Command Layers

Use shortcuts first when available:

```bash
lark-cli calendar +agenda --as user
lark-cli im +messages-send --as bot --chat-id "<chat_id>" --text "hello" --dry-run
```

Use API commands when shortcuts do not cover the task:

```bash
lark-cli calendar calendars list --as user
```

Use raw API only when necessary:

```bash
lark-cli api GET /open-apis/calendar/v4/calendars --as user
```

## Output Formats

Prefer structured output for agents:

```bash
--format json
--format table
--format ndjson
--format csv
```

Use `--page-all`, `--page-limit`, and `--page-delay` when the result is paginated.

## Permission Troubleshooting

When a command fails with missing permissions:

1. Read the error body for missing scopes, console URL, identity, and suggested command.
2. If using bot identity, ask the user to enable the missing app scope in the developer console.
3. If using user identity, run a targeted login:

```bash
lark-cli auth login --scope "<missing_scope>"
```

4. Re-run `auth status` or `auth check`.
5. Retry the original command.

## Example Agent Flow

For a user asking "show today's Feishu calendar":

```bash
lark-cli auth status
lark-cli calendar +agenda --as user --format table
```

If authorization is missing, request the smallest required scope and use the split-flow in `install-and-config.md`.

