#!/bin/bash
set -e

if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  npm install pm2 -g
fi

if pm2 show cdns &> /dev/null; then
  echo "Stopping and deleting existing cdns..."
  pm2 stop cdns
  pm2 delete cdns
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname $(dirname "$DIR"))"

# 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
KILL_TIMEOUT_MS=$((24 * 60 * 60 * 1000))

pm2 start $PARENT_DIR/dist/src/commands/schedule.js --name cdns --kill-timeout $KILL_TIMEOUT_MS --restart-delay 5000 --exp-backoff-restart-delay=100 --max-restarts=10000 --watch $PARENT_DIR --ignore-watch="*.log"
pm2 startup
pm2 save --force

echo ""
echo "cdns scheduler has been started"
echo ""
exit 0
