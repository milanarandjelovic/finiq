#!/bin/bash

# Change to the api directory
cd "$(dirname "$0")/.."

# Cleanup function
cleanup() {
  echo ""
  echo "Stopping services..."
  docker compose down
  kill 0  # Kill all processes in the current process group
  exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

# Run concurrently
pnpm concurrently "pnpm dev:db" "nest start --watch"
