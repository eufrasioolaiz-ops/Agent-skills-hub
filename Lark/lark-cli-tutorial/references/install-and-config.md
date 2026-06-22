# Install And Configure lark-cli

## Requirements

- Node.js with `npm` and `npx` available.
- A browser session for completing Feishu/Lark app setup and OAuth authorization.
- Access to the target Feishu/Lark tenant and permissions needed for the business task.

Building from source is possible from the official GitHub repository, but normal agent usage should prefer npm installation.

## Install

Recommended installation:

```bash
npx @larksuite/cli@latest install
```

Verify the command is available:

```bash
lark-cli --help
lark-cli auth --help
```

## Initialize App Credentials

For first-time setup, initialize app credentials:

```bash
lark-cli config init --new
```

Agent handling:

1. Run the command in a background/interactive process.
2. Extract the exact authorization or console URL from the command output.
3. Generate a QR code when possible:

```bash
lark-cli auth qrcode "<verification_url>" --output "lark-cli-auth.png"
```

4. Show both the original URL and the QR image to the user.
5. Wait for the user to complete browser-side setup.

Do not modify, re-encode, shorten, or reconstruct the URL. Treat it as an opaque string.

## User Authorization

Recommended broad starter flow:

```bash
lark-cli auth login --recommend
```

More targeted flows:

```bash
lark-cli auth login --domain calendar,task
lark-cli auth login --scope "calendar:calendar:read"
```

Agent split-flow for non-blocking authorization:

```bash
lark-cli auth login --scope "<scope>" --no-wait --json
```

Then:

1. Extract `verification_url` and `device_code`.
2. Generate and show a QR code for the verification URL.
3. Tell the user to complete authorization and return to the agent.
4. In a later turn, after the user confirms completion, run:

```bash
lark-cli auth login --device-code <device_code>
```

Do not start the blocking device-code polling before the user has seen the URL.

## Verify

Check login and granted scopes:

```bash
lark-cli auth status
lark-cli auth list
```

Check one scope:

```bash
lark-cli auth check --scope "<scope>"
```

## Update

If command output contains an update notice, complete the current task, then offer:

```bash
lark-cli update
```

After updating, tell the user to restart the agent environment if skill metadata needs to be reloaded.

