#!/bin/bash
# Force-launch Chrome headless with full sandbox bypass
# Designed for root/containers where Chrome refuses to start without --no-sandbox
# Usage: bash force-launch.sh [CDP_PORT] [USER_DATA_DIR]

set -e

CDP_PORT="${1:-18800}"
USER_DATA_DIR="${2:-/tmp/chrome-force-persistent}"
CHROME_BIN="${CHROME_BIN:-$(which google-chrome-stable 2>/dev/null || which chromium-browser 2>/dev/null || which chromium 2>/dev/null)}"

if [ -z "$CHROME_BIN" ]; then
  echo "[✗] No Chrome/Chromium binary found. Install google-chrome-stable."
  exit 1
fi

# Step 1: Kill zombie Chrome processes
echo "[1] Cleaning up zombie Chrome processes..."
pkill -9 -f 'google-chrome' 2>/dev/null || true
pkill -9 -f 'chromium' 2>/dev/null || true
pkill -9 -f 'Xvfb' 2>/dev/null || true
sleep 1

# Step 2: Clean old data dir to avoid lock-file errors
echo "[2] Preparing clean user-data dir: ${USER_DATA_DIR}"
rm -rf "${USER_DATA_DIR}" 2>/dev/null
mkdir -p "${USER_DATA_DIR}"

# Step 3: Launch Chrome headless
echo "[3] Launching Chrome headless on CDP port ${CDP_PORT}..."
"${CHROME_BIN}" \
  --no-sandbox \
  --disable-dev-shm-usage \
  --disable-gpu \
  --headless=new \
  --remote-debugging-port="${CDP_PORT}" \
  --user-data-dir="${USER_DATA_DIR}" \
  --incognito \
  --disable-extensions \
  --disable-background-networking \
  --disable-sync \
  --no-first-run \
  --disable-default-apps \
  about:blank </dev/null >>/tmp/chrome-force.log 2>&1 &

CHROME_PID=$!
# Disown to survive shell exit (bash only)
disown 2>/dev/null || true

echo "[3] Chrome PID: ${CHROME_PID}"

# Step 4: Validate CDP is responding
echo "[4] Validating CDP on port ${CDP_PORT}..."
for i in $(seq 1 15); do
  RESPONSE=$(curl -s "http://127.0.0.1:${CDP_PORT}/json/version" 2>/dev/null)
  if [ -n "$RESPONSE" ]; then
    echo "[✓] CDP is alive after ${i}s!"
    echo "$RESPONSE"
    echo ""
    echo "=== BROWSER READY ==="
    echo "PID=${CHROME_PID}"
    echo "CDP_PORT=${CDP_PORT}"
    echo "USER_DATA_DIR=${USER_DATA_DIR}"
    exit 0
  fi
  # Check if process is still alive
  if ! kill -0 "${CHROME_PID}" 2>/dev/null; then
    echo "[✗] Chrome process ${CHROME_PID} died during startup"
    echo "[✗] Last 20 lines of log:"
    tail -20 /tmp/chrome-force.log 2>/dev/null
    exit 1
  fi
  sleep 1
done

echo "[✗] CDP not responding after 15s"
echo "[✗] Chrome log tail:"
tail -20 /tmp/chrome-force.log 2>/dev/null
exit 1
