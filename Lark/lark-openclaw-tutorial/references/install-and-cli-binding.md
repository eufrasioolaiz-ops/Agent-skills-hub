# Install Knowledge And Feishu CLI Binding

This skill records how an agent should understand the official OpenClaw Feishu plugin install flow. Do not execute these commands unless the user explicitly requests installation.

## Prerequisites

The source document states OpenClaw must already be installed:

- Linux or macOS: OpenClaw `2026.2.26` or later.
- Windows: OpenClaw `2026.3.2` or later.

## Official Plugin Install Command

User-provided command:

```bash
npx -y @larksuite/openclaw-lark install
```

The install flow may ask the user to create a new bot or connect an existing bot. If connecting an existing bot, the flow may ask for App ID and App Secret. Agents must not request those secrets in chat; let the user enter them in the installer or trusted console.

## Post-Install Feishu Conversation Commands

After plugin setup, the user can open the bot in Feishu and send:

```text
/feishu start
```

If it returns version information, the plugin is installed.

For user authorization:

```text
/feishu auth
```

This performs batch user authorization so OpenClaw can act on user-authorized resources.

To help OpenClaw learn the plugin capabilities:

```text
学习一下我安装的新飞书插件，列出有哪些能力
```

## Bind Feishu CLI In OpenClaw

The official document says Feishu CLI can be installed from inside the OpenClaw Feishu plugin and automatically bound to the current OpenClaw Feishu robot.

Send this to OpenClaw in Feishu:

```text
请按照该文档帮我安装飞书cli：https://open.feishu.cn/document/mcp_open_tools/feishu-cli/set-up-lark-cli-for-ai-agents-in-openclaw_hermes.md
```

After CLI binding, OpenClaw can use broader Feishu capabilities, including messages, groups, docs, drive, sheets, base, calendar, meetings, minutes, mail, tasks, wiki, contacts, slides, whiteboards, OKR, approval, and attendance.

## Identity Choice

During CLI or plugin authorization, choose collaboration mode carefully:

- Robot identity: the agent performs operations as the bot. Use for team assistants, group Q&A, notifications, and public document maintenance.
- User identity: the agent performs operations as the user. Use only for personal workflows, because it may read/write user-owned docs, messages, calendar, and other resources.

Do not share a user-identity bot broadly.

## Upgrade Knowledge

The source document shows a version-pinned example for upgrading to the 2026.6.10 plugin:

```bash
npx -y @larksuite/openclaw-lark@2026.6.10 install --version 2026.6.10 --tools-version 1.0.47
```

Agents should verify the latest official document before recommending a pinned version.

