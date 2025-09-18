#!/bin/bash
# scripts/deploy-frontend-to-icp.sh

set -e

echo "🚀 Deploying TradeChain Frontend to ICP..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dfx is installed
if ! command -v dfx &> /dev/null; then
    echo -e "${RED}❌ dfx not found. Please install DFX first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install Node.js and npm first.${NC}"
    exit 1
fi

# Build the frontend
echo -e "${YELLOW}📦 Building Next.js frontend...${NC}"
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm ci

# Create production environment file
echo "Creating production environment..."
cat > .env.production << EOF
NEXT_PUBLIC_DFX_NETWORK=ic
NEXT_PUBLIC_IC_HOST=https://icp-api.io
NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=wuprw-oqaaa-aaaae-qfx4a-cai
NODE_ENV=production
NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION=false
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
EOF

# Build the application
echo "Building application..."
npm run build

# Check if build was successful
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Build failed - .next directory not found${NC}"
    exit 1
fi

# Export static files (needed for asset canister)
echo "Exporting static files..."
npx next export

# Check if export was successful
if [ ! -d "out" ]; then
    echo -e "${RED}❌ Export failed - out directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build completed successfully${NC}"

# Go back to root directory
cd ..

# Deploy to ICP
echo -e "${YELLOW}🌐 Deploying to ICP mainnet...${NC}"

# Check if user is authenticated
if ! dfx identity whoami &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with dfx. Please run 'dfx identity use <your-identity>'${NC}"
    exit 1
fi

# Check cycles balance
echo "Checking cycles balance..."
CYCLES=$(dfx cycles balance --network ic 2>/dev/null | grep -o '[0-9,]*' | head -1 | tr -d ',')
if [ -z "$CYCLES" ] || [ "$CYCLES" -lt 1000000000 ]; then
    echo -e "${YELLOW}⚠️  Low cycles balance. You may need to convert ICP to cycles.${NC}"
    echo "Run: dfx cycles convert --amount 0.5 --network ic"
fi

# Deploy frontend canister
echo "Deploying frontend canister..."
dfx deploy frontend --network ic --with-cycles 500000000000

# Get the frontend canister ID
FRONTEND_CANISTER_ID=$(dfx canister id frontend --network ic)

echo -e "${GREEN}🎉 Frontend deployed successfully!${NC}"
echo -e "${GREEN}📱 Frontend URL: https://${FRONTEND_CANISTER_ID}.icp0.io${NC}"
echo -e "${GREEN}🔗 Candid Interface: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=${FRONTEND_CANISTER_ID}${NC}"

# Save deployment info
echo "FRONTEND_CANISTER_ID=${FRONTEND_CANISTER_ID}" >> deployment.log
echo "DEPLOYMENT_DATE=$(date)" >> deployment.log
echo "FRONTEND_URL=https://${FRONTEND_CANISTER_ID}.icp0.io" >> deployment.log

echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Update your environment variables with the new frontend canister ID"
echo "2. Test the deployed frontend thoroughly"
echo "3. Update any external integrations or documentation"

echo -e "${GREEN}✅ Deployment complete!${NC}"