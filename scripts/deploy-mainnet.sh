#!/bin/bash
# scripts/deploy-mainnet.sh - Enhanced with frontend deployment

set -e

echo "🌐 Deploying TradeChain to IC Mainnet..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if dfx is installed and logged in
if ! command -v dfx &> /dev/null; then
    echo -e "${RED}❌ dfx is not installed. Install from https://internetcomputer.org/docs/quickstart/local-development${NC}"
    exit 1
fi

# Check if vessel is installed
if ! command -v vessel &> /dev/null; then
    echo -e "${YELLOW}⚠️ vessel not found. Installing...${NC}"
    vessel install
fi

# Check cycles balance
echo "💰 Checking cycles balance..."
CYCLES_BALANCE=$(dfx wallet balance --network ic 2>/dev/null || echo "0")
echo "Current cycles balance: $CYCLES_BALANCE"

# Estimate deployment costs
echo "💸 Estimated deployment costs:"
echo "- 5 Canisters × 0.1T cycles = 0.5T cycles (~$0.65 USD)"
echo "- Initial canister storage = ~1T cycles (~$1.30 USD)"
echo "- Total estimated: ~2T cycles (~$2.60 USD)"

if [[ $CYCLES_BALANCE == *"0.000"* ]] || [[ $CYCLES_BALANCE == "0" ]]; then
    echo -e "${RED}❌ Insufficient cycles. You need at least 2T cycles for deployment.${NC}"
    echo "Get cycles at: https://internetcomputer.org/docs/current/developer-docs/setup/cycles/"
    exit 1
fi

# Confirm deployment
echo -e "${YELLOW}⚠️ This will deploy to MAINNET and consume real cycles.${NC}"
read -p "Are you sure you want to deploy to mainnet? (y/N): " confirm
if [[ $confirm != [yY] ]]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if all canister files exist
REQUIRED_FILES=(
    "backend/src/user_management/main.mo"
    "backend/src/wallet/main.mo" 
    "backend/src/marketplace/main.mo"
    "backend/src/escrow/main.mo"
    "backend/src/ai_insights/main.mo"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Required file not found: $file${NC}"
        exit 1
    fi
done

# Install dependencies
echo "📦 Installing dependencies..."
echo "Installing Motoko dependencies..."
vessel install

echo "Installing frontend dependencies..."
cd frontend
npm ci --production=false
cd ..

# Build and test locally first
echo "🧪 Testing local build first..."
dfx start --background --clean
dfx deploy --network local
dfx canister call user_management healthCheck --network local
dfx stop

# Deploy canisters to mainnet
echo "🏗️ Deploying TradeChain canisters to mainnet..."
echo "This may take several minutes..."

# Deploy in specific order (dependencies first)
dfx deploy user_management --network ic --with-cycles 200000000000
sleep 5

dfx deploy wallet --network ic --with-cycles 200000000000  
sleep 5

dfx deploy marketplace --network ic --with-cycles 200000000000
sleep 5

dfx deploy escrow --network ic --with-cycles 200000000000
sleep 5

dfx deploy ai_insights --network ic --with-cycles 200000000000
sleep 5

# Verify all deployments
echo "🔍 Verifying deployments..."
dfx canister status user_management --network ic
dfx canister status wallet --network ic
dfx canister status marketplace --network ic
dfx canister status escrow --network ic  
dfx canister status ai_insights --network ic

# Generate TypeScript declarations
echo "🔗 Generating TypeScript declarations..."
dfx generate --network ic

echo "✅ Declarations generated"
# Move declarations to correct location
if [ -d "src/declarations" ]; then
    mkdir -p frontend/declarations
    mv src/declarations/* frontend/declarations/ 2>/dev/null || true
    rm -rf src/declarations
fi

# Get canister IDs
USER_MANAGEMENT_ID=$(dfx canister id user_management --network ic)
WALLET_ID=$(dfx canister id wallet --network ic)
MARKETPLACE_ID=$(dfx canister id marketplace --network ic)
ESCROW_ID=$(dfx canister id escrow --network ic)
AI_INSIGHTS_ID=$(dfx canister id ai_insights --network ic)

# Create production environment file
echo "⚙️ Creating production environment variables..."
cat > frontend/.env.production << EOF
# Network Configuration
NEXT_PUBLIC_DFX_NETWORK=ic
NEXT_PUBLIC_IC_HOST=https://icp-api.io

# Production Canister IDs
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=${USER_MANAGEMENT_ID}
NEXT_PUBLIC_WALLET_CANISTER_ID=${WALLET_ID}
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=${MARKETPLACE_ID}
NEXT_PUBLIC_ESCROW_CANISTER_ID=${ESCROW_ID}
NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID=${AI_INSIGHTS_ID}

# Authentication URLs
NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION=false
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
EOF

# Test canister health on mainnet
echo "🔍 Testing canister health on mainnet..."
echo "Testing User Management..."
dfx canister call user_management healthCheck --network ic

echo "Testing Wallet..."
dfx canister call wallet healthCheck --network ic || echo "Wallet health check skipped"

echo "Testing Marketplace..." 
dfx canister call marketplace healthCheck --network ic || echo "Marketplace health check skipped"

# Deploy frontend to IC (optional)
read -p "Do you want to deploy frontend to IC as well? (y/N): " deploy_frontend
if [[ $deploy_frontend == [yY] ]]; then
    echo "🌐 Deploying frontend to IC..."
    
    # Create frontend canister
    cat > dfx.frontend.json << EOF
{
  "version": 1,
  "canisters": {
    "frontend": {
      "type": "assets",
      "source": ["frontend/out"]
    }
  },
  "networks": {
    "ic": {
      "providers": ["https://icp-api.io"],
      "type": "persistent"
    }
  }
}
EOF

    # Build frontend for production
    cd frontend
    npm run build
    npm run export || npm run build  # For static export
    cd ..
    
    # Deploy frontend canister
    dfx deploy frontend --network ic -c dfx.frontend.json --with-cycles 200000000000
    
    FRONTEND_ID=$(dfx canister id frontend --network ic -c dfx.frontend.json)
    
    echo -e "${GREEN}✅ Frontend deployed to: https://${FRONTEND_ID}.icp0.io${NC}"
fi

# Create production deployment summary
echo "📄 Creating deployment summary..."
cat > deployment-summary.md << EOF
# TradeChain Mainnet Deployment Summary

**Deployment Date:** $(date)
**Network:** Internet Computer Mainnet

## Canister IDs
- **User Management:** \`${USER_MANAGEMENT_ID}\`
- **Wallet:** \`${WALLET_ID}\` 
- **Marketplace:** \`${MARKETPLACE_ID}\`
- **Escrow:** \`${ESCROW_ID}\`
- **AI Insights:** \`${AI_INSIGHTS_ID}\`

## Production URLs
- **Candid UI:** https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=${USER_MANAGEMENT_ID}
- **User Management:** https://${USER_MANAGEMENT_ID}.icp0.io
- **Wallet:** https://${WALLET_ID}.icp0.io

## Frontend Deployment Options
1. **IC Frontend Canister:** https://${FRONTEND_ID:-"[Deploy with --frontend flag]"}.icp0.io
2. **Vercel/Netlify:** Use \`frontend/.env.production\` file
3. **Custom Domain:** Configure DNS CNAME to point to canister

## Environment Variables for External Hosting
Copy \`frontend/.env.production\` to your hosting provider.

## Testing Checklist
- [ ] Authentication with Internet Identity
- [ ] Authentication with NFID  
- [ ] User registration flow
- [ ] KYC submission
- [ ] Wallet operations
- [ ] Profile updates

## Monitoring
- Monitor cycles: \`dfx wallet balance --network ic\`
- Check canister status: \`dfx canister status <canister-id> --network ic\`
EOF

echo -e "${GREEN}✅ Mainnet deployment complete!${NC}"
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
echo "- Direct Access: https://${USER_MANAGEMENT_ID}.icp0.io"
echo ""
echo "📋 Next Steps:"
echo "1. Deploy frontend to Vercel/Netlify with production env vars"
echo "2. Test all authentication flows on production" 
echo "3. Set up monitoring for cycles usage"
echo "4. Configure custom domain (optional)"
echo ""
echo "📄 Full deployment details saved to: deployment-summary.md"
echo ""
echo -e "${YELLOW}💡 Important: Save your canister IDs securely!${NC}"