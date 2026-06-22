# Sources

Checked on 2026-06-22.

## Primary Sources

- Feishu Open Platform lark-cli installation guide: `https://open.feishu.cn/document/no_class/mcp-archive/feishu-cli-installation-guide.md`
- Official GitHub repository: `https://github.com/larksuite/cli`

## Repository Facts Used

The official GitHub repository describes `lark-cli` as the official Lark/Feishu CLI maintained by the larksuite team and built for humans and AI Agents. It lists broad business domain coverage, npm installation through `npx @larksuite/cli@latest install`, app initialization with `lark-cli config init --new`, authorization through `lark-cli auth login --recommend`, verification through `lark-cli auth status`, identity switching with `--as user` and `--as bot`, command layers, output formats, dry-run previews, schema inspection, and security/risk warnings.

## Local Operational Source

This skill also incorporates local operational guidance from the installed `lark-shared` skill for agent split-flow authorization, QR code handling, identity selection, permission troubleshooting, update notices, high-risk write confirmation, and secret-handling rules.

