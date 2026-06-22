# Disable Native Feishu Tools And Skills For CLI-First Usage

Use this reference when the user wants OpenClaw to call Feishu through `lark-cli` instead of the native OpenClaw Feishu tools.

## Why Disable Native Tools

The linked FAQ says disabling native tools can help because:

- Native Feishu tools and prompts consume context.
- `lark-cli` has broader Feishu API coverage and more flexible control.
- If native tools and `lark-cli` are both enabled, OpenClaw may prefer native Feishu tools and fail to use the CLI path.

## Disable Native Feishu Tools

```bash
openclaw config set channels.feishu.tools.doc false
openclaw config set channels.feishu.tools.chat false
openclaw config set channels.feishu.tools.wiki false
openclaw config set channels.feishu.tools.drive false
openclaw config set channels.feishu.tools.perm false
openclaw config set channels.feishu.tools.scopes false
```

Tool meanings:

- `channels.feishu.tools.doc`: document read/write tools.
- `channels.feishu.tools.chat`: chat/message tools; tool only, no matching Skill.
- `channels.feishu.tools.wiki`: wiki tools.
- `channels.feishu.tools.drive`: drive/file tools.
- `channels.feishu.tools.perm`: permission tools, default off in the source FAQ.
- `channels.feishu.tools.scopes`: scope query tools; tool only, no matching Skill.

## Disable Native Feishu Skills

```bash
openclaw config set skills.entries.feishu-doc.enabled false
openclaw config set skills.entries.feishu-drive.enabled false
openclaw config set skills.entries.feishu-wiki.enabled false
openclaw config set skills.entries.feishu-perm.enabled false
```

Skill meanings:

- `skills.entries.feishu-doc.enabled`: document Skill.
- `skills.entries.feishu-drive.enabled`: drive Skill.
- `skills.entries.feishu-wiki.enabled`: wiki Skill.
- `skills.entries.feishu-perm.enabled`: permission Skill, default off in the source FAQ.

`doc`, `drive`, `wiki`, and `perm` have both tools and Skills, so disable both sides. `chat` and `scopes` are tools only.

## Restart And Verify

Restart the gateway:

```bash
openclaw gateway restart
```

Open a new OpenClaw session and ask it to operate on a Feishu document. If it uses `lark-cli`, the CLI-first configuration is working.

Example verification prompt:

```text
帮我读一下这个飞书文档：https://your-domain.feishu.cn/docx/<doc-token>
```

## Roll Back To Native Tools

Use `config set ... true`, not `config unset`, so custom configuration paths are not removed accidentally:

```bash
openclaw config set channels.feishu.tools.doc true
openclaw config set channels.feishu.tools.chat true
openclaw config set channels.feishu.tools.wiki true
openclaw config set channels.feishu.tools.drive true
openclaw config set channels.feishu.tools.scopes true
openclaw config set skills.entries.feishu-doc.enabled true
openclaw config set skills.entries.feishu-drive.enabled true
openclaw config set skills.entries.feishu-wiki.enabled true
openclaw gateway restart
```

`perm` is normally left off unless the user intentionally enables permission management.

## Disable OpenClaw Community Feishu Plugin Entry

The source document's Coze troubleshooting section says to inspect OpenClaw's built-in Feishu plugin entry. If it is enabled, set it to false to avoid conflicts with the official plugin:

```json
{
  "plugins": {
    "entries": {
      "feishu": {
        "enabled": false
      }
    }
  }
}
```

This is separate from enabling the official Feishu channel under `channels.feishu.enabled: true`.

