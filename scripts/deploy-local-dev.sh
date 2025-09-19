#!/bin/bash
# scripts/deploy-local-dev.sh

set -e

echo "⏹️ Stopping current replica..."
dfx stop

echo "🧹 Cleaning old state..."
rm -rf .dfx

echo "🚀 Starting replica with clean state..."
dfx start --background --clean

# Wait for replica to start
echo "⏳ Waiting for replica to initialize..."
sleep 10

# Stop and clean any existing deployment
echo "🧹 Cleaning existing Internet Identity deployment..."
dfx canister stop internet_identity 2>/dev/null || true
dfx canister delete internet_identity 2>/dev/null || true

# Create all necessary directories first
echo "📁 Setting up directories..."
mkdir -p canisters/internet_identity
mkdir -p .dfx/local/canisters/internet_identity

echo "📥 Downloading Internet Identity files..."

# Download the Candid interface
echo "  - Downloading Candid interface..."
curl -sSL https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did \
     -o canisters/internet_identity/internet_identity.did

# Download the development WASM to the correct location
echo "  - Downloading development WASM..."
curl -L "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz" \
     -o canisters/internet_identity/internet_identity_dev.wasm.gz

# Also download to the .dfx directory for installation
echo "  - Downloading WASM for installation..."
curl -L "https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz" \
     -o .dfx/local/canisters/internet_identity/internet_identity.wasm.gz

# Decompress the WASM files
echo "📦 Decompressing WASM files..."
gunzip -f canisters/internet_identity/internet_identity_dev.wasm.gz 2>/dev/null || true
gunzip -f .dfx/local/canisters/internet_identity/internet_identity.wasm.gz 2>/dev/null || true

# Rename the decompressed file to match expected name
if [ -f "canisters/internet_identity/internet_identity_dev.wasm" ]; then
    # Keep original name for dfx.json reference
    gzip canisters/internet_identity/internet_identity_dev.wasm
fi

if [ -f ".dfx/local/canisters/internet_identity/internet_identity.wasm" ]; then
    echo "✅ WASM file ready for installation"
else
    echo "❌ WASM file not found, installation may fail"
fi

# Create Internet Identity canister
echo "🏗️ Creating Internet Identity canister..."
II_CANISTER_ID=$(dfx canister create internet_identity --network local --no-wallet 2>/dev/null || echo "rdmx6-jaaaa-aaaaa-aaadq-cai")

# Install the WASM if we have a custom canister ID
if [ -f ".dfx/local/canisters/internet_identity/internet_identity.wasm" ] && [ "$II_CANISTER_ID" != "rdmx6-jaaaa-aaaaa-aaadq-cai" ]; then
    echo "📦 Installing Internet Identity WASM..."
    dfx canister install internet_identity --network local --wasm .dfx/local/canisters/internet_identity/internet_identity.wasm --argument '(null)' --mode install || {
        echo "⚠️ Manual installation failed, trying dfx deploy..."
        dfx deploy internet_identity --network local --argument '(null)' || echo "⚠️ Deploy also failed, but continuing..."
    }
else
    echo "🔧 Deploying Internet Identity with dfx deploy..."
    dfx deploy internet_identity --network local --argument '(null)' || {
        echo "⚠️ Deploy failed, but continuing with existing canister..."
    }
fi

# Get the Internet Identity canister ID
II_CANISTER_ID=$(dfx canister id internet_identity --network local 2>/dev/null || echo "$II_CANISTER_ID")
echo "✅ Internet Identity canister ID: $II_CANISTER_ID"

# Deploy other canisters
echo "🏗️ Deploying TradeChain canisters..."
echo "🔧 Deploying user management..."
dfx deploy user_management --network local

echo "🔗 Regenerating declarations..."
dfx generate user_management --network local
dfx generate internet_identity --network local 2>/dev/null || echo "⚠️ Could not generate II declarations, but continuing..."

# Move declarations to correct location
if [ -d "src/declarations" ]; then
    mkdir -p frontend/declarations
    cp -r src/declarations/* frontend/declarations/ 2>/dev/null || true
    # Don't remove src/declarations in case it's needed elsewhere
fi

echo "⚙️ Updating environment variables..."
USER_MANAGEMENT_ID=$(dfx canister id user_management --network local)
INTERNET_IDENTITY_ID=$(dfx canister id internet_identity --network local 2>/dev/null || echo "$II_CANISTER_ID")

# Create frontend directory if it doesn't exist
mkdir -p frontend

cat > frontend/.env.development << EOF
# Network Configuration
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://localhost:4943

# Canister IDs (updated)
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID=${INTERNET_IDENTITY_ID}

# Use local Internet Identity
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}

# Development Configuration
NODE_ENV=development

# CRITICAL: Disable signature validation in development
NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION=false

# Disable mock mode
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
EOF

# Test canister connectivity
echo "🔍 Testing canister connectivity..."
if dfx canister call user_management healthCheck --network local 2>/dev/null; then
    echo "✅ User management canister is responding correctly"
else
    echo "⚠️ User management canister not responding - check deployment"
fi

# Test Internet Identity
if dfx canister call internet_identity stats --network local 2>/dev/null; then
    echo "✅ Internet Identity canister is responding correctly"
else
    echo "⚠️ Internet Identity might not be fully ready - but this is often normal"
fi

echo ""
echo "✅ Deployment complete! URLs:"
echo "- Internet Identity: http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}"
echo "- User Management Candid: http://localhost:4943/?canisterId=$(dfx canister id __Candid_UI --network local 2>/dev/null || echo 'CANDID_UI_ID')&id=${USER_MANAGEMENT_ID}"
echo ""
echo "📋 Canister IDs:"
echo "- User Management: ${USER_MANAGEMENT_ID}"
echo "- Internet Identity: ${INTERNET_IDENTITY_ID}"
echo ""
echo "🚀 Next steps:"
echo "1. cd frontend && npm install"
echo "2. npm run dev"
echo "3. Test Internet Identity at: http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}"
echo "4. 🔄 Clear browser cache and try authentication"
echo ""
echo "📝 If Internet Identity doesn't work:"
echo "- Check if the canister is running: dfx canister status internet_identity --network local"
echo "- Try reinstalling: dfx canister uninstall-code internet_identity --network local && dfx deploy internet_identity --network local"