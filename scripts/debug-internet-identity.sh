#!/bin/bash
# scripts/debug-internet-identity.sh

echo "🔍 Debugging Internet Identity Setup..."
echo ""

# Check dfx status
echo "📊 DFX Status:"
dfx ping --network local
echo ""

# Check canister status
echo "🏗️ Canister Status:"
echo "Internet Identity:"
dfx canister status internet_identity --network local
echo ""
echo "User Management:"
dfx canister status user_management --network local
echo ""

# Get canister IDs
II_CANISTER_ID=$(dfx canister id internet_identity --network local)
USER_MANAGEMENT_ID=$(dfx canister id user_management --network local)

echo "📋 Canister IDs:"
echo "- Internet Identity: $II_CANISTER_ID"
echo "- User Management: $USER_MANAGEMENT_ID"
echo ""

# Check if Internet Identity responds to basic calls
echo "🔧 Testing Internet Identity API:"
echo "Trying to call stats..."
if dfx canister call internet_identity stats --network local 2>/dev/null; then
    echo "✅ Internet Identity API is working"
else
    echo "❌ Internet Identity API is not responding"
fi
echo ""

# Check if Internet Identity serves HTTP
echo "🌐 Testing Internet Identity HTTP interface:"
if curl -s "http://localhost:4943/?canisterId=$II_CANISTER_ID" | grep -q "Internet Identity" 2>/dev/null; then
    echo "✅ Internet Identity HTTP interface seems to be working"
else
    echo "❌ Internet Identity HTTP interface is not responding properly"
fi
echo ""

# Check file structure
echo "📁 Checking file structure:"
echo "Internet Identity files in canisters/:"
ls -la canisters/internet_identity/ 2>/dev/null || echo "No files found"
echo ""
echo "Internet Identity files in .dfx/:"
ls -la .dfx/local/canisters/internet_identity/ 2>/dev/null || echo "No files found"
echo ""

# Check if the WASM file is correct
echo "🔍 Checking WASM files:"
if [ -f "canisters/internet_identity/internet_identity_dev.wasm.gz" ]; then
    echo "✅ Found canisters/internet_identity/internet_identity_dev.wasm.gz"
    echo "   Size: $(du -h canisters/internet_identity/internet_identity_dev.wasm.gz | cut -f1)"
else
    echo "❌ Missing canisters/internet_identity/internet_identity_dev.wasm.gz"
fi

if [ -f ".dfx/local/canisters/internet_identity/internet_identity.wasm" ]; then
    echo "✅ Found .dfx/local/canisters/internet_identity/internet_identity.wasm"
    echo "   Size: $(du -h .dfx/local/canisters/internet_identity/internet_identity.wasm | cut -f1)"
else
    echo "❌ Missing .dfx/local/canisters/internet_identity/internet_identity.wasm"
fi
echo ""

# Try to get the frontend directly
echo "🌐 Testing direct frontend access:"
echo "URL: http://localhost:4943/?canisterId=$II_CANISTER_ID"
if command -v curl >/dev/null 2>&1; then
    echo "Response status:"
    curl -s -w "%{http_code}" "http://localhost:4943/?canisterId=$II_CANISTER_ID" -o /dev/null
    echo ""
else
    echo "curl not available for testing"
fi
echo ""

echo "🔧 Suggested fixes:"
echo "1. Try reinstalling Internet Identity:"
echo "   dfx canister uninstall-code internet_identity --network local"
echo "   dfx deploy internet_identity --network local --argument '(null)'"
echo ""
echo "2. If that doesn't work, try using the official Internet Identity:"
echo "   dfx canister install internet_identity --network local --wasm https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz --argument '(null)' --mode reinstall"
echo ""
echo "3. Alternative: Use rdmx6-jaaaa-aaaaa-aaadq-cai (well-known dev II canister)"
echo "   URL: http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai"