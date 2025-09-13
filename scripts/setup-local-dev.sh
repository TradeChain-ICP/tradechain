#!/bin/bash
# scripts/setup-local-dev.sh

set -e

echo "🚀 Setting up TradeChain local development environment (Fixed)..."

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
echo "📋 Node.js version: $NODE_VERSION"

# Clean any existing local deployment
echo "🧹 Cleaning previous local deployment..."
dfx stop 2>/dev/null || true
rm -rf .dfx 2>/dev/null || true
dfx start --background --clean

# Wait for replica to start
echo "⏳ Waiting for local replica to start..."
sleep 8

# Vessel setup
echo "🔧 Setting up Vessel for Motoko dependencies..."
vessel install

# Deploy Internet Identity first
echo "🔐 Deploying Internet Identity..."
dfx deploy internet_identity

# Create other minimal canisters
for canister in wallet marketplace escrow ai_insights; do
    mkdir -p backend/src/$canister
    cat > backend/src/$canister/main.mo << EOF
import Debug "mo:base/Debug";
import Time "mo:base/Time";

persistent actor {
    public query func healthCheck() : async {status: Text; timestamp: Int} {
        {
            status = "healthy";
            timestamp = Time.now();
        }
    };
}
EOF
done

# Deploy TradeChain canisters one by one
echo "🏗️ Deploying TradeChain canisters..."
dfx deploy user_management
dfx deploy wallet
dfx deploy marketplace
dfx deploy escrow
dfx deploy ai_insights

# Generate canister interfaces
echo "🔗 Generating frontend interfaces..."
dfx generate

# Create frontend directory if it doesn't exist
echo "📁 Setting up frontend structure..."
mkdir -p frontend/lib
mkdir -p frontend/contexts
mkdir -p frontend/declarations

# Install frontend dependencies with legacy peer deps to fix React conflicts
echo "📦 Installing frontend dependencies..."
cd frontend

# Fix React version conflicts
npm install --legacy-peer-deps

cd ..

# Get canister IDs and create environment file
echo "⚙️ Setting up environment variables..."
USER_MANAGEMENT_ID=$(dfx canister id user_management)
WALLET_ID=$(dfx canister id wallet)
MARKETPLACE_ID=$(dfx canister id marketplace)
ESCROW_ID=$(dfx canister id escrow)
AI_INSIGHTS_ID=$(dfx canister id ai_insights)
INTERNET_IDENTITY_ID=$(dfx canister id internet_identity)

# Ensure frontend directory exists
mkdir -p frontend

# Create environment file
cat > frontend/.env.local << EOF
# Network Configuration
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://localhost:4943

# Canister IDs
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
NEXT_PUBLIC_WALLET_CANISTER_ID=${WALLET_ID}
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=${MARKETPLACE_ID}
NEXT_PUBLIC_ESCROW_CANISTER_ID=${ESCROW_ID}
NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID=${AI_INSIGHTS_ID}

# Internet Identity Configuration
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=${INTERNET_IDENTITY_ID}

# NFID Configuration
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate

# Development Configuration
NODE_ENV=development
EOF

# Test canister health
echo "🔍 Testing canister health..."
dfx canister call user_management healthCheck

echo "✅ Local development environment setup complete!"
echo ""
echo "📋 Deployment Summary:"
echo "- User Management: ${USER_MANAGEMENT_ID}"
echo "- Wallet: ${WALLET_ID}"
echo "- Marketplace: ${MARKETPLACE_ID}"
echo "- Escrow: ${ESCROW_ID}"
echo "- AI Insights: ${AI_INSIGHTS_ID}"
echo "- Internet Identity: ${INTERNET_IDENTITY_ID}"
echo ""
echo "📋 Next steps:"
echo "1. Start the frontend: cd frontend && npm run dev"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Test authentication with Internet Identity"
echo ""
echo "🔧 Useful commands:"
echo "- dfx canister status --all (check canister status)"
echo "- dfx logs (view canister logs)"
echo "- dfx stop (stop local replica)"
echo "- dfx start --background (restart local replica)"