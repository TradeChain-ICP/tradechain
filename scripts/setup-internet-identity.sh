#!/bin/bash
# scripts/setup-internet-identity.sh

set -e

echo "🔐 Setting up Internet Identity for local development..."

# Create canisters directory if it doesn't exist
mkdir -p canisters/internet_identity

# Download Internet Identity files if they don't exist
if [ ! -f "canisters/internet_identity/internet_identity.did" ]; then
    echo "📥 Downloading Internet Identity Candid file..."
    curl -sSL https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did \
         -o canisters/internet_identity/internet_identity.did
fi

if [ ! -f "canisters/internet_identity/internet_identity_dev.wasm.gz" ]; then
    echo "📥 Downloading Internet Identity WASM file..."
    curl -sSL https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz \
         -o canisters/internet_identity/internet_identity_dev.wasm.gz
fi

# Stop and clean any existing deployment
echo "🧹 Cleaning existing Internet Identity deployment..."
dfx canister stop internet_identity 2>/dev/null || true
dfx canister delete internet_identity 2>/dev/null || true

# Deploy Internet Identity
echo "🚀 Deploying Internet Identity..."
dfx deploy internet_identity

# Get the new canister ID
II_CANISTER_ID=$(dfx canister id internet_identity)
echo "✅ Internet Identity deployed with canister ID: $II_CANISTER_ID"

# Update the environment file with correct Internet Identity URL
if [ -f "frontend/.env.development" ]; then
    echo "⚙️ Updating environment file..."
    
    # Remove old Internet Identity URL line
    grep -v "NEXT_PUBLIC_INTERNET_IDENTITY_URL" frontend/.env.development > frontend/.env.development.tmp || true
    mv frontend/.env.development.tmp frontend/.env.development
    
    # Add new Internet Identity URL
    echo "NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=${II_CANISTER_ID}" >> frontend/.env.development
    
    echo "✅ Updated .env.development with new Internet Identity canister ID"
fi

# Test Internet Identity
echo "🔍 Testing Internet Identity deployment..."
if curl -f "http://localhost:4943/?canisterId=${II_CANISTER_ID}" > /dev/null 2>&1; then
    echo "✅ Internet Identity is accessible at: http://localhost:4943/?canisterId=${II_CANISTER_ID}"
else
    echo "❌ Internet Identity is not accessible. There may be an issue with the deployment."
fi

echo ""
echo "📋 Internet Identity Setup Complete:"
echo "- Canister ID: ${II_CANISTER_ID}"
echo "- URL: http://localhost:4943/?canisterId=${II_CANISTER_ID}"
echo ""
echo "🔄 Please restart your frontend development server:"
echo "cd frontend && npm run dev"