#!/bin/bash
# scripts/fix-internet-identity.sh

set -e

echo "🔧 Fixing Internet Identity deployment for local development..."

# Stop the current replica to ensure clean state
echo "⏹️ Stopping current replica..."
dfx stop

# Clean up any existing Internet Identity deployment
echo "🧹 Cleaning up existing deployment..."
rm -rf .dfx/local/canister_ids.json 2>/dev/null || true

# Start fresh replica
echo "🚀 Starting fresh replica..."
dfx start --background --clean

# Wait for replica to be ready
echo "⏳ Waiting for replica to be ready..."
sleep 8

# Create canisters directory and download correct Internet Identity files
echo "📁 Setting up Internet Identity files..."
mkdir -p canisters/internet_identity

# Download the correct development version of Internet Identity
echo "📥 Downloading Internet Identity development files..."

# Download the Candid interface
curl -sSL https://raw.githubusercontent.com/dfinity/internet-identity/main/src/internet_identity/internet_identity.did \
     -o canisters/internet_identity/internet_identity.did

# Download the development WASM (this includes the frontend)
curl -sSL https://github.com/dfinity/internet-identity/releases/latest/download/internet_identity_dev.wasm.gz \
     -o canisters/internet_identity/internet_identity_dev.wasm.gz

# Update dfx.json to use the local Internet Identity without remote override
echo "⚙️ Updating dfx.json configuration..."
cat > dfx.json << 'EOF'
{
  "version": 1,
  "canisters": {
    "user_management": {
      "type": "motoko",
      "main": "backend/src/user_management/main.mo"
    },
    "internet_identity": {
      "type": "custom",
      "candid": "canisters/internet_identity/internet_identity.did",
      "wasm": "canisters/internet_identity/internet_identity_dev.wasm.gz"
    }
  },
  "defaults": {
    "build": {
      "packtool": "vessel sources"
    },
    "generate": {
      "output": "frontend/declarations"
    }
  },
  "output_env_file": ".env",
  "networks": {
    "local": {
      "bind": "127.0.0.1:4943",
      "type": "ephemeral"
    },
    "ic": {
      "providers": [
        "https://icp-api.io"
      ],
      "type": "persistent"
    }
  }
}
EOF

# Deploy Internet Identity first
echo "🔐 Deploying Internet Identity with frontend assets..."
dfx deploy internet_identity --argument '(null)'

# Get the Internet Identity canister ID
II_CANISTER_ID=$(dfx canister id internet_identity)
echo "✅ Internet Identity deployed with canister ID: $II_CANISTER_ID"

# Deploy other canisters
echo "🏗️ Deploying TradeChain canisters..."
dfx deploy user_management
dfx deploy wallet
dfx deploy marketplace
dfx deploy escrow
dfx deploy ai_insights

# Update environment file
echo "📝 Updating environment variables..."
USER_MANAGEMENT_ID=$(dfx canister id user_management)
WALLET_ID=$(dfx canister id wallet)
MARKETPLACE_ID=$(dfx canister id marketplace)
ESCROW_ID=$(dfx canister id escrow)
AI_INSIGHTS_ID=$(dfx canister id ai_insights)

cat > frontend/.env.development << EOF
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
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=${II_CANISTER_ID}

# NFID Configuration
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate

# Development Configuration
NODE_ENV=development

# Disable mock mode
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
EOF

# Test Internet Identity directly
echo "🔍 Testing Internet Identity access..."
echo "Internet Identity URL: http://localhost:4943/?canisterId=${II_CANISTER_ID}"

# Test if the canister responds to HTTP requests
if curl -f -s "http://localhost:4943/?canisterId=${II_CANISTER_ID}" > /dev/null; then
    echo "✅ Internet Identity canister is responding to HTTP requests"
else
    echo "⚠️ Internet Identity canister might not be fully ready yet"
fi

# Generate declarations
echo "🔗 Generating TypeScript declarations..."
dfx generate

echo ""
echo "✅ Internet Identity setup complete!"
echo ""
echo "📋 Deployment Summary:"
echo "- Internet Identity: ${II_CANISTER_ID}"
echo "- User Management: ${USER_MANAGEMENT_ID}"
echo "- Wallet: ${WALLET_ID}"
echo "- Marketplace: ${MARKETPLACE_ID}"
echo "- Escrow: ${ESCROW_ID}"
echo "- AI Insights: ${AI_INSIGHTS_ID}"
echo ""
echo "🌐 URLs to test:"
echo "- Internet Identity: http://localhost:4943/?canisterId=${II_CANISTER_ID}"
echo "- Candid UI: http://localhost:4943/_/candid"
echo ""
echo "🚀 Next steps:"
echo "1. Restart your frontend: cd frontend && npm run dev"
echo "2. Test authentication at http://localhost:3000"
echo "3. Click Internet Identity - it should now show the login interface"
echo ""
echo "💡 If the Internet Identity page is still blank, wait 30 seconds and try again."
echo "The canister needs time to fully initialize its frontend assets."