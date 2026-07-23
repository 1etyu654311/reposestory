---
name: chrome-headless-force
description: >
  Force-launch Chrome in headless mode on Linux containers/servers running as root.
  Use when: (1) browser tool fails with "Running as root without --no-sandbox",
  (2) CDP connection refused or DevToolsActivePort not found, (3) Chrome crashes
  or exits immediately in headless mode on a container, (4) OpenClaw browser status
  shows running=false or CDP not ready, (5) user asks to open a website in a
  headless browser on a server/container environment, (6) browser startup errors
  mention sandbox, OOM score, dbus, or DevToolsActivePort. NOT for: macOS desktop,
  normal Linux desktop with GUI, or when Chrome is already working via OpenClaw browser tool.
---

# Chrome Headless Force-Launch

Launch Chrome headless on root/containers where the normal `openclaw browser start` fails.

## When This Skill Triggers

- Browser tool errors mentioning `--no-sandbox` or `Running as root`
- CDP connection refused / `DevToolsActivePort` not found
- Chrome exits immediately after launch
- `openclaw browser status` shows `running: false` with Chrome installed

## Quick Fix Workflow

1. **Run the force-launch script:**
   ```bash
   bash scripts/force-launch.sh
   ```
   Default: CDP port 18800, data dir `/tmp/chrome-force-persistent`.

   Custom port/dir:
   ```bash
   bash scripts/force-launch.sh 9222 /tmp/my-chrome-data
   ```

2. **Update OpenClaw config** to match the running CDP:
   ```bash
   openclaw config set browser.noSandbox true
   openclaw config set browser.headless true
   ```
   Then set the CDP port in config (direct JSON edit if CLI fails on profile color validation):
   ```python
   import json
   d = json.load(open("/app/state/openclaw.json"))
   d.setdefault("browser", {}).setdefault("profiles", {}).setdefault("openclaw", {})
   d["browser"]["profiles"]["openclaw"]["cdpPort"] = 18800
   d["browser"]["profiles"]["openclaw"]["color"] = "#FF4500"
   json.dump(d, open("/app/state/openclaw.json", "w"), indent=2)
   ```

3. **Verify** the browser tool works:
   ```
   browser action=status    → running: true, cdpReady: true
   browser action=open url=https://example.com
   browser action=snapshot
   ```

## Root Cause

Chrome refuses to run as `root` without `--no-sandbox`. Containers typically run as root, and OpenClaw's default config has `noSandbox: false`. This causes:
- Chrome exits immediately with `Running as root without --no-sandbox`
- `DevToolsActivePort` never gets created
- OpenClaw browser tool fails: "Could not connect to Chrome"

## Key Flags

| Flag | Purpose |
|---|---|
| `--no-sandbox` | Bypass root restriction (required in containers) |
| `--disable-dev-shm-usage` | Avoid /dev/shm size issues in containers |
| `--disable-gpu` | No GPU in headless servers |
| `--headless=new` | New headless mode (supports full Chrome features) |
| `--incognito` | Clean session, no profile lock conflicts |

## Troubleshooting

**Chrome dies after launch:**
- Run with `nohup` and `</dev/null>` to detach from terminal
- Check `/tmp/chrome-force.log` for crash details
- Ensure no other Chrome instance holds the CDP port: `pkill -9 chrome`

**CDP not responding:**
- Verify port is free: `curl -s http://127.0.0.1:18800/json/version`
- Check process alive: `ps -p <PID> -o pid,state`
- Increase wait time (some containers need 10-15s for CDP init)

**OOM score errors in logs:**
- Safe to ignore (`Permission denied (13)` on OOM score adjustment)
- These are warnings, not fatal errors

**dbus errors in logs:**
- Safe to ignore in containers (no dbus daemon)
- Chrome still works for browsing; dbus is for desktop integrations

**Config changes not taking effect:**
- OpenClaw may need a gateway restart to pick up config changes
- In containers where gateway runs foreground, the running CDP instance can be used directly by setting the correct `cdpPort`
