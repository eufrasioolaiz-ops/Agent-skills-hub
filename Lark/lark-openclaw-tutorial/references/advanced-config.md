# Advanced OpenClaw Feishu Configuration

Use these notes when an agent needs to explain advanced OpenClaw Feishu plugin behavior. Treat commands as examples unless the user asks to apply them.

## Enable Official Feishu Channel

The official plugin uses the `channels.feishu` configuration. A sanitized example:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "<FEISHU_APP_ID>",
      "appSecret": "<FEISHU_APP_SECRET>",
      "requireMention": true,
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["<OWNER_OPEN_ID>"],
      "groups": {
        "*": { "enabled": true }
      }
    }
  }
}
```

Do not store real `appSecret` or open IDs in a public repository or chat transcript.

## Streaming Output

Enable streaming card replies:

```bash
openclaw config set channels.feishu.streaming true
```

Disable streaming:

```bash
openclaw config set channels.feishu.streaming false
```

Show more footer details on streaming cards:

```bash
openclaw config set channels.feishu.footer.elapsed true
openclaw config set channels.feishu.footer.status true
```

## Topic Isolation And Parallel Work

Enable independent context and parallel tasks per Feishu topic:

```bash
openclaw config set channels.feishu.threadSession true
```

Disable:

```bash
openclaw config set channels.feishu.threadSession false
```

## Group Reply Policies

### Recommended: owner allowlist plus @ mention

For group scenarios, prefer the safer policy where only the app owner or allowlisted users can trigger the bot, and messages must @ the bot:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "<FEISHU_APP_ID>",
      "appSecret": "<FEISHU_APP_SECRET>",
      "requireMention": true,
      "groupPolicy": "allowlist",
      "groupAllowFrom": ["<OWNER_OPEN_ID>"],
      "groups": {
        "*": { "enabled": true }
      }
    }
  }
}
```

### Any group member can trigger with @ mention

```bash
openclaw config set channels.feishu.requireMention true --json
openclaw gateway restart
```

Template:

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "appId": "<FEISHU_APP_ID>",
      "appSecret": "<FEISHU_APP_SECRET>",
      "requireMention": true,
      "groupPolicy": "open"
    }
  }
}
```

### No @ mention required

Use with caution because it can create noisy group behavior. It may require sensitive group-message permissions.

```bash
openclaw config set channels.feishu.requireMention false --json
openclaw gateway restart
```

### Specific groups require @ mention

Set a default policy, then override specific group IDs:

```bash
openclaw config set channels.feishu.requireMention open --json
openclaw config set channels.feishu.groups.<GROUP_ID>.requireMention true --json
openclaw gateway restart
```

## OpenClaw 3.2 Tool Visibility

Some OpenClaw versions default new agent tool access to off. The source document recommends this `openclaw.json` shape:

```json
{
  "tools": {
    "profile": "full",
    "sessions": {
      "visibility": "all"
    }
  }
}
```

Diagnostic card prompts may also suggest:

```bash
openclaw config set tools.profile "full"
openclaw gateway restart
```

## Diagnostics

Use Feishu chat commands:

```text
/feishu start
/feishu doctor
/feishu auth
```

Use terminal diagnostics:

```bash
npx @larksuite/openclaw-lark doctor
npx @larksuite/openclaw-lark doctor --fix
npx @larksuite/openclaw-lark info
npx @larksuite/openclaw-lark info --all
```

Never paste sensitive diagnostic output into public documents without redaction.

