#!/bin/bash
# scripts/deploy-mainnet-reinstall.sh
# Deploy with reinstall mode to handle incompatible type changes

echo "🚨 WARNING: This will reinstall the canister and lose all existing data"
echo "📋 Current data will be wiped (users, wallets, transactions)"
echo ""
read -p "Are you sure you want to proceed? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo "🔄 Deploying with reinstall mode..."

# Deploy with reinstall mode
dfx deploy user_management --network ic --mode reinstall --no-wallet

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    
    CANISTER_ID=$(dfx canister id user_management --network ic)
    echo "📍 Canister ID: $CANISTER_ID"
    echo "🌐 Candid Interface: https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=$CANISTER_ID"
    
    # Test the deployment
    echo "🧪 Testing deployment..."
    dfx canister call user_management healthCheck --network ic
    
    # Check migration status
    echo "🔄 Checking migration status..."
    dfx canister call user_management getMigrationStatus --network ic
    
else
    echo "❌ Deployment failed"
    exit 1
fi