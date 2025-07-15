#!/bin/bash
set -e

export NVM_DIR="$HOME/.nvm"
# Load nvm if available
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use

echo "Starting backend..."
cd backend
nvm use
npm install
npm run dev &
BACKEND_PID=$!

echo "Starting frontend..."
cd ../frontend
nvm use
npm install
npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID