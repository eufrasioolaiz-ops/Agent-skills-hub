# Sources

Checked on 2026-06-22.

## User-Provided Sources

- OpenClaw Feishu official plugin guide: `https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh`
- Install command: `npx -y @larksuite/openclaw-lark install`
- Linked FAQ: `LXrjwi1RuiXm2wkIGc7clmdanVf`, titled `常见问题：使用飞书cli 后，如何禁用OpenClaw飞书官方插件原生工具`

## Main Facts Used

- The official plugin supports Feishu and Lark.
- OpenClaw prerequisites in the guide: Linux/macOS `2026.2.26` or later, Windows `2026.3.2` or later.
- The official plugin can be installed with `npx -y @larksuite/openclaw-lark install`.
- The plugin can create a new Feishu bot or link an existing bot.
- `/feishu start`, `/feishu auth`, and `/feishu doctor` are the main Feishu chat commands for verification, authorization, and diagnosis.
- Feishu CLI can be installed from inside OpenClaw and bound to the current Feishu robot by asking OpenClaw to follow the Feishu CLI setup document.
- Advanced config includes streaming output, footer elapsed/status display, thread session isolation, group reply policy, OpenClaw tool visibility, diagnostics, and gateway restart.
- The FAQ explains how to disable native Feishu tools and native Feishu Skills when using `lark-cli`.

