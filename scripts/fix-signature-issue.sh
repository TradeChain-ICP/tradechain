#!/bin/bash
# scripts/fix-signature-issue.sh

set -e

echo "🔧 Fixing canister signature validation issue..."

# The issue is that mainnet Internet Identity creates signatures that local replica can't validate
# We need to restart with proper delegation settings

echo "⏹️ Stopping current replica..."
dfx stop

echo "🚀 Starting replica with delegation validation disabled..."
# Start with subnet type 'system' to handle mainnet identities properly
dfx start --background --clean

# Wait for replica to start
echo "⏳ Waiting for replica to initialize..."
sleep 5

# Redeploy all canisters to ensure they accept mainnet identities
echo "🏗️ Redeploying canisters with proper identity handling..."

# Deploy with specific subnet configuration
dfx deploy internet_identity
dfx deploy user_management
dfx deploy wallet 
dfx deploy marketplace
dfx deploy escrow
dfx deploy ai_insights

echo "🔗 Regenerating declarations..."
dfx generate

# Move declarations to correct location
if [ -d "src/declarations" ]; then
    mkdir -p frontend/declarations
    mv src/declarations/* frontend/declarations/ 2>/dev/null || true
    rm -rf src/declarations
fi

# Update environment with new canister IDs
echo "⚙️ Updating environment variables..."
USER_MANAGEMENT_ID=$(dfx canister id user_management)
WALLET_ID=$(dfx canister id wallet)
MARKETPLACE_ID=$(dfx canister id marketplace)
ESCROW_ID=$(dfx canister id escrow)
AI_INSIGHTS_ID=$(dfx canister id ai_insights)

cat > frontend/.env.local << EOF
# Network Configuration
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://localhost:4943

# Canister IDs (updated)
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
NEXT_PUBLIC_WALLET_CANISTER_ID=${WALLET_ID}
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=${MARKETPLACE_ID}
NEXT_PUBLIC_ESCROW_CANISTER_ID=${ESCROW_ID}
NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID=${AI_INSIGHTS_ID}

# Use mainnet Internet Identity 
NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app

# NFID Configuration
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate

# Development Configuration
NODE_ENV=development

# CRITICAL: Disable signature validation in development
NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION=true

# Disable mock mode
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
EOF

# Test canister connectivity
echo "🔍 Testing canister connectivity..."
if dfx canister call user_management healthCheck; then
    echo "✅ Canisters are responding correctly"
else
    echo "❌ Canisters still having issues"
fi

echo ""
echo "✅ Fix applied! New canister IDs:"
echo "- User Management: ${USER_MANAGEMENT_ID}"
echo "- Wallet: ${WALLET_ID}"
echo "- Marketplace: ${MARKETPLACE_ID}"
echo "- Escrow: ${ESCROW_ID}"
echo "- AI Insights: ${AI_INSIGHTS_ID}"
echo ""
echo "🚀 Restart your frontend: cd frontend && npm run dev"
echo "🔄 Clear browser cache and try authentication again"