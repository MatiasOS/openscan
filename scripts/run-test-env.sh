#!/bin/bash

# Script to run Hardhat node with transactions and OpenScan for testing
# Usage: bash scripts/run-test-env.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OPENSCAN_DIR="$(dirname "$SCRIPT_DIR")"
HARDHAT_DIR="$OPENSCAN_DIR/hardhat-node-test"

echo "================================================"
echo "🧪 OpenScan Test Environment"
echo "================================================"
echo ""
echo "📁 OpenScan dir: $OPENSCAN_DIR"
echo "📁 Hardhat dir: $HARDHAT_DIR"
echo ""

# Check if hardhat-node-test exists
if [ ! -d "$HARDHAT_DIR" ]; then
    echo "❌ hardhat-node-test directory not found at $HARDHAT_DIR"
    exit 1
fi

# Kill any existing processes on ports 8545 and 3000
cleanup_ports() {
    if lsof -i :8545 > /dev/null 2>&1; then
        echo "⚠️  Killing existing process on port 8545..."
        kill $(lsof -t -i :8545) 2>/dev/null || true
    fi
    if lsof -i :3000 > /dev/null 2>&1; then
        echo "⚠️  Killing existing process on port 3000..."
        kill $(lsof -t -i :3000) 2>/dev/null || true
    fi
    sleep 2
}

cleanup_ports

# ========== START HARDHAT NODE ==========
echo "🔨 Setting up Hardhat node..."
cd "$HARDHAT_DIR"

# Compile contracts
echo "   Compiling contracts..."
npx hardhat compile

# Create artifacts zip
echo "   Creating artifacts zip..."
rm -f hardhat-test-artifacts.zip
zip -r hardhat-test-artifacts.zip contracts ignition -x "*.DS_Store" -x "*__pycache__*" > /dev/null

# Start hardhat node in background
echo "   Starting Hardhat node..."
npx hardhat node --network hardhatMainnet > /tmp/hardhat-node.log 2>&1 &
HARDHAT_PID=$!

# Wait for node to be ready
echo "   Waiting for node to start..."
sleep 5

# Check if node started
if ! kill -0 $HARDHAT_PID 2>/dev/null; then
    echo "❌ Failed to start Hardhat node. Check /tmp/hardhat-node.log"
    exit 1
fi
echo "   ✅ Hardhat node running (PID: $HARDHAT_PID)"

# Run transaction generation script
echo ""
echo "📝 Generating test transactions..."
npx hardhat run scripts/generate-transactions.ts --network localhost

# ========== START OPENSCAN ==========
echo ""
echo "🔍 Starting OpenScan (Ethereum Mainnet + Localhost only)..."
cd "$OPENSCAN_DIR"

# Start OpenScan - it will read .env.local on start
REACT_APP_OPENSCAN_NETWORKS="1,31337" npm start &
OPENSCAN_PID=$!

# Wait for OpenScan to start
sleep 5

echo ""
echo "================================================"
echo "✨ Test Environment Ready!"
echo "================================================"
echo ""
echo "📍 Hardhat Node: http://127.0.0.1:8545 (Chain ID: 31337)"
echo "📍 OpenScan:     http://localhost:3000"
echo ""
echo "🌐 Available Networks:"
echo "   - Ethereum Mainnet (Chain ID: 1)"
echo "   - Localhost/Hardhat (Chain ID: 31337)"
echo ""
echo "📦 Artifacts: $HARDHAT_DIR/hardhat-test-artifacts.zip"
echo ""
echo "Press Ctrl+C to stop all services..."

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $HARDHAT_PID 2>/dev/null || true
    kill $OPENSCAN_PID 2>/dev/null || true
    echo "   Done!"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for either process to exit
wait $HARDHAT_PID $OPENSCAN_PID
