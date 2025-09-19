#!/bin/bash
# scripts/test-integration.sh

set -e

echo "🧪 Testing TradeChain Integration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_passed() {
    echo -e "${GREEN}✅ $1${NC}"
}

test_failed() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

test_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

# Check if replica is running
echo "🔍 Checking local replica status..."
if dfx ping > /dev/null 2>&1; then
    test_passed "Local replica is running"
else
    test_failed "Local replica is not running. Run 'dfx start --background' first."
fi

# Check if canisters are deployed
echo "🔍 Checking canister deployments..."
if dfx canister status user_management > /dev/null 2>&1; then
    test_passed "User management canister is deployed"
else
    test_failed "User management canister not found. Run './scripts/deploy-local.sh' first."
fi

# Test canister health
echo "🔍 Testing canister health..."
HEALTH_RESULT=$(dfx canister call user_management healthCheck 2>/dev/null || echo "error")
if [[ $HEALTH_RESULT == *"healthy"* ]]; then
    test_passed "User management canister is healthy"
else
    test_failed "User management canister health check failed"
fi

# Test basic canister functions
echo "🔍 Testing canister functions..."

# Test getTotalUsers
TOTAL_USERS=$(dfx canister call user_management getTotalUsers 2>/dev/null || echo "error")
if [[ $TOTAL_USERS =~ ^[0-9]+$ ]]; then
    test_passed "getTotalUsers function works (Current users: $TOTAL_USERS)"
else
    test_failed "getTotalUsers function failed"
fi

# Test getUserStats
USER_STATS=$(dfx canister call user_management getUserStats 2>/dev/null || echo "error")
if [[ $USER_STATS == *"totalUsers"* ]]; then
    test_passed "getUserStats function works"
else
    test_failed "getUserStats function failed"
fi

# Check environment file
echo "🔍 Checking frontend environment..."
if [ -f "frontend/.env.development" ]; then
    test_passed "Frontend environment file exists"
    
    # Check if canister IDs are set
    if grep -q "NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID" frontend/.env.development; then
        test_passed "Canister IDs are configured"
    else
        test_warning "Canister IDs not found in environment file"
    fi
else
    test_warning "Frontend environment file not found"
fi

# Check frontend dependencies
echo "🔍 Checking frontend setup..."
if [ -f "frontend/package.json" ] && [ -d "frontend/node_modules" ]; then
    test_passed "Frontend dependencies are installed"
else
    test_warning "Frontend dependencies not installed. Run 'cd frontend && npm install'"
fi

# Check TypeScript declarations
echo "🔍 Checking TypeScript declarations..."
if [ -d "frontend/declarations/user_management" ]; then
    test_passed "TypeScript declarations are generated"
else
    test_warning "TypeScript declarations not found. Run 'dfx generate'"
fi

# Test Internet Identity canister
echo "🔍 Testing Internet Identity..."
if dfx canister status internet_identity > /dev/null 2>&1; then
    test_passed "Internet Identity canister is deployed"
else
    test_warning "Internet Identity canister not found. Authentication may not work."
fi

# Summary
echo ""
echo "📊 Test Summary:"
echo "=================="

# Count canister IDs that should exist
EXPECTED_CANISTERS=("user_management" "wallet" "marketplace" "escrow" "ai_insights")
DEPLOYED_COUNT=0

for canister in "${EXPECTED_CANISTERS[@]}"; do
    if dfx canister status $canister > /dev/null 2>&1; then
        ((DEPLOYED_COUNT++))
    fi
done

echo "Deployed Canisters: $DEPLOYED_COUNT/${#EXPECTED_CANISTERS[@]}"

if [ $DEPLOYED_COUNT -eq ${#EXPECTED_CANISTERS[@]} ]; then
    test_passed "All canisters are deployed"
elif [ $DEPLOYED_COUNT -gt 0 ]; then
    test_warning "Some canisters are missing. Run './scripts/deploy-local.sh'"
else
    test_failed "No canisters are deployed"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Start frontend: cd frontend && npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Test authentication with Internet Identity or NFID"
echo "4. Check browser console for any errors"
echo ""
echo "🔧 Useful URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Candid UI: http://localhost:4943/_/candid"
echo "- Replica Dashboard: http://localhost:4943/_/dashboard"

echo ""
test_passed "Integration test completed successfully!"