#!/bin/bash
# scripts/deploy-local.sh

set -e

echo "🚀 Deploying TradeChain to local replica..."

# Check if replica is running
if ! dfx ping > /dev/null 2>&1; then
    echo "❌ Local replica is not running. Starting it now..."
    dfx start --background
    sleep 5
fi

# Install dependencies
echo "📦 Installing Motoko dependencies..."
mops install

# Deploy Internet Identity first
echo "🔐 Deploying Internet Identity..."
dfx deploy internet_identity

# Deploy TradeChain canisters
echo "🏗️ Deploying TradeChain canisters..."
dfx deploy user_management
dfx deploy wallet  
dfx deploy marketplace
dfx deploy escrow
dfx deploy ai_insights

# Generate TypeScript declarations
echo "🔗 Generating TypeScript declarations..."
dfx generate

# Update environment variables
echo "⚙️ Updating environment variables..."
USER_MANAGEMENT_ID=$(dfx canister id user_management)
WALLET_ID=$(dfx canister id wallet)
MARKETPLACE_ID=$(dfx canister id marketplace)  
ESCROW_ID=$(dfx canister id escrow)
AI_INSIGHTS_ID=$(dfx canister id ai_insights)
INTERNET_IDENTITY_ID=$(dfx canister id internet_identity)

# Update frontend environment file
cat > frontend/.env.local << EOF
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://localhost:4943

NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
NEXT_PUBLIC_WALLET_CANISTER_ID=${WALLET_ID}
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=${MARKETPLACE_ID}
NEXT_PUBLIC_ESCROW_CANISTER_ID=${ESCROW_ID}
NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID=${AI_INSIGHTS_ID}

NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate

NODE_ENV=development
EOF

# Test canister health
echo "🔍 Testing canister health..."
dfx canister call user_management healthCheck

echo "✅ Local deployment complete!"
echo ""
echo "📋 Deployment Summary:"
echo "- User Management: ${USER_MANAGEMENT_ID}"
echo "- Wallet: ${WALLET_ID}"
echo "- Marketplace: ${MARKETPLACE_ID}"
echo "- Escrow: ${ESCROW_ID}"
echo "- AI Insights: ${AI_INSIGHTS_ID}"
echo "- Internet Identity: ${INTERNET_IDENTITY_ID}"
echo ""
echo "🌐 Frontend URL: http://localhost:3000"
echo "🔧 Candid UI: http://localhost:4943/_/candid"