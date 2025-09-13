#!/bin/bash
# scripts/deploy-mainnet.sh

set -e

echo "🌐 Deploying TradeChain to IC Mainnet..."

# Verify cycles balance
echo "💰 Checking cycles balance..."
dfx wallet balance --network ic

# Confirm deployment
read -p "Are you sure you want to deploy to mainnet? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Install dependencies
echo "📦 Installing Motoko dependencies..."
mops install

# Deploy canisters to mainnet
echo "🏗️ Deploying TradeChain canisters to mainnet..."
dfx deploy user_management --network ic
dfx deploy wallet --network ic
dfx deploy marketplace --network ic
dfx deploy escrow --network ic
dfx deploy ai_insights --network ic

# Generate TypeScript declarations
echo "🔗 Generating TypeScript declarations..."
dfx generate --network ic

# Update environment variables for production
echo "⚙️ Updating production environment variables..."
USER_MANAGEMENT_ID=$(dfx canister id user_management --network ic)
WALLET_ID=$(dfx canister id wallet --network ic)
MARKETPLACE_ID=$(dfx canister id marketplace --network ic)
ESCROW_ID=$(dfx canister id escrow --network ic)
AI_INSIGHTS_ID=$(dfx canister id ai_insights --network ic)

# Create production environment file
cat > frontend/.env.production << EOF
NEXT_PUBLIC_DFX_NETWORK=ic
NEXT_PUBLIC_IC_HOST=https://icp-api.io

NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
NEXT_PUBLIC_WALLET_CANISTER_ID=${WALLET_ID}
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=${MARKETPLACE_ID}
NEXT_PUBLIC_ESCROW_CANISTER_ID=${ESCROW_ID}
NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID=${AI_INSIGHTS_ID}

NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate

NODE_ENV=production
EOF

# Test canister health on mainnet
echo "🔍 Testing canister health on mainnet..."
dfx canister call user_management healthCheck --network ic

# Build frontend for production
echo "🏗️ Building frontend for production..."
cd frontend
npm run build
cd ..

echo "✅ Mainnet deployment complete!"
echo ""
echo "📋 Production Deployment Summary:"
echo "- User Management: ${USER_MANAGEMENT_ID}"
echo "- Wallet: ${WALLET_ID}"
echo "- Marketplace: ${MARKETPLACE_ID}"
echo "- Escrow: ${ESCROW_ID}"
echo "- AI Insights: ${AI_INSIGHTS_ID}"
echo ""
echo "🌐 Production URLs:"
echo "- Candid UI: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=${USER_MANAGEMENT_ID}"
echo "- Frontend: Deploy to Vercel or similar with production env vars"
echo ""
echo "💡 Next steps:"
echo "1. Deploy frontend to Vercel/Netlify with production environment variables"
echo "2. Update DNS records if using custom domain"
echo "3. Test authentication flows on production"