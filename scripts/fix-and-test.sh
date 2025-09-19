#!/bin/bash
# scripts/fix-and-test.sh

set -e

echo "🔧 Fixing declarations and setting up testing options..."

# 1. Fix declarations location
echo "📁 Moving declarations to correct location..."
mkdir -p frontend/declarations
if [ -d "src/declarations" ]; then
    mv src/declarations/* frontend/declarations/ 2>/dev/null || true
    rm -rf src/declarations
    echo "✅ Declarations moved to frontend/declarations/"
else
    echo "ℹ️ No declarations found in src/ - generating new ones..."
    dfx generate
    if [ -d "src/declarations" ]; then
        mv src/declarations/* frontend/declarations/
        rm -rf src/declarations
    fi
fi

# 2. Update environment to use mainnet Internet Identity
echo "🌐 Updating environment to use reliable mainnet Internet Identity..."
cat > frontend/.env.development << 'EOF'
# Network Configuration
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://localhost:4943

# Canister IDs (your local canisters)
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=uzt4z-lp777-77774-qaabq-cai
NEXT_PUBLIC_WALLET_CANISTER_ID=umunu-kh777-77774-qaaca-cai
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=ulvla-h7777-77774-qaacq-cai
NEXT_PUBLIC_ESCROW_CANISTER_ID=ucwa4-rx777-77774-qaada-cai
NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID=ufxgi-4p777-77774-qaadq-cai

# Use mainnet Internet Identity (more reliable)
NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app

# NFID Configuration
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate

# Development Configuration
NODE_ENV=development

# Disable mock mode to test real authentication
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
EOF

echo "✅ Environment updated to use mainnet Internet Identity"

# 3. Test canister connectivity
echo "🔍 Testing local canister connectivity..."
if dfx canister call user_management healthCheck > /dev/null 2>&1; then
    echo "✅ Local canisters are responding"
else
    echo "❌ Local canisters not responding - please run 'dfx start --background'"
    exit 1
fi

# 4. Check declarations
echo "📋 Checking TypeScript declarations..."
if [ -f "frontend/declarations/user_management/index.ts" ]; then
    echo "✅ User management declarations found"
else
    echo "⚠️ User management declarations missing - generating..."
    dfx generate
    if [ -d "src/declarations" ]; then
        mv src/declarations/* frontend/declarations/
        rm -rf src/declarations
    fi
fi

echo ""
echo "🎯 Testing Options Available:"
echo ""
echo "📱 Option 1: Mock Authentication (Guaranteed to work)"
echo "   - Add NEXT_PUBLIC_ENABLE_MOCK_AUTH=true to frontend/.env.development"
echo "   - Restart frontend: cd frontend && npm run dev"
echo "   - Test full user flow without Internet Identity issues"
echo ""
echo "🌐 Option 2: Mainnet Internet Identity (Recommended)"
echo "   - Already configured in your .env.development"
echo "   - Restart frontend: cd frontend && npm run dev"
echo "   - Uses reliable mainnet Internet Identity"
echo "   - Your local canisters still work"
echo ""
echo "🧪 Option 3: Deploy to IC Testnet"
echo "   - Run: dfx deploy --network ic"
echo "   - Test with real Internet Identity on testnet"
echo ""
echo "✅ Setup complete! Choose your testing option:"
echo "   Mock Mode:     cd frontend && echo 'NEXT_PUBLIC_ENABLE_MOCK_AUTH=true' >> .env.development && npm run dev"
echo "   Mainnet II:    cd frontend && npm run dev"
echo "   IC Testnet:    dfx deploy --network ic"