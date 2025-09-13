# Complete ICP Mainnet Deployment Guide for TradeChain

## Table of Contents
1. [Prerequisites & Setup](#prerequisites--setup)
2. [Identity Management](#identity-management)
3. [ICP Token Acquisition](#icp-token-acquisition)
4. [Cycles Wallet Creation](#cycles-wallet-creation)
5. [Pre-Deployment Checks](#pre-deployment-checks)
6. [Mainnet Deployment](#mainnet-deployment)
7. [Frontend Deployment](#frontend-deployment)
8. [Production Testing](#production-testing)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites & Setup

### System Requirements
- **Operating System:** Linux/macOS/WSL2 (Windows)
- **Node.js:** Version 16+ 
- **DFX:** Latest version (Internet Computer SDK)
- **Vessel:** Motoko package manager
- **Git:** Version control

### Installation Commands
```bash
# Install DFX (Internet Computer SDK)
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Verify installation
dfx --version

# Install Vessel (Motoko package manager)
# Download from: https://github.com/dfinity/vessel/releases
curl -L https://github.com/dfinity/vessel/releases/latest/download/vessel-linux64 -o vessel
chmod +x vessel
sudo mv vessel /usr/local/bin/

# Install Node.js dependencies
cd frontend
npm install
cd ..
```

---

## Identity Management

### Step 1: Create Mainnet Identity
```bash
# Navigate to your project directory
cd /mnt/c/Users/Home/OneDrive/Desktop/tradechain

# Create new identity for mainnet
dfx identity new mainnet-deployer

# Use the new identity
dfx identity use mainnet-deployer

# Get your principal ID (save this!)
dfx identity get-principal
```

**Example Output:**
```
Your seed phrase: truth trend cabbage book resist organ weekend...
Principal ID: 7tswm-bthk2-fnvec-7wcse-4sbhh-5jr2m-qke2z-pxzf5-yhqlb-ir3fn-yae
```

### Step 2: Backup Your Identity
```bash
# Get your account ID for receiving ICP
dfx ledger account-id

# Backup seed phrase securely
echo "SAVE THIS SEED PHRASE SECURELY:"
# Copy the seed phrase from Step 1 output
```

**Critical:** Write down your seed phrase and store it securely. This is your only way to recover your identity.

### Step 3: Identity Verification
```bash
# Verify current identity
dfx identity whoami

# List all identities
dfx identity list

# Switch identities if needed
dfx identity use <identity-name>
```

---

## ICP Token Acquisition

### Method 1: Buy from Cryptocurrency Exchange (Recommended)

**Step 1: Choose Exchange**
- Coinbase (easiest for beginners)
- Binance (lowest fees)
- Kraken (high security)
- KuCoin (wide availability)

**Step 2: Purchase ICP Tokens**
- Minimum needed: 2 ICP tokens (~$20-40 USD)
- Recommended: 5 ICP tokens (~$50-100 USD)

**Step 3: Get Your CLI Wallet Address**
```bash
dfx ledger account-id
```
**Your Address:** `0b6612f507cea1647d2f1058d2c0749646acdef8fb9612d38e67dabaccb6374b`

**Step 4: Withdraw from Exchange**
1. Go to exchange withdrawal page
2. Select ICP token
3. Enter address: `0b6612f507cea1647d2f1058d2c0749646acdef8fb9612d38e67dabaccb6374b`
4. Amount: 2-5 ICP
5. Confirm withdrawal

**Step 5: Wait for Transfer**
- Time: 10-60 minutes depending on exchange
- Check balance: `dfx ledger balance --network ic`

### Method 2: Transfer from NNS App

**Step 1: Fund NNS Account**
1. Go to [nns.ic0.app](https://nns.ic0.app)
2. Login with Internet Identity
3. Go to "Accounts" section
4. Click "Add ICP" and purchase with card/bank

**Step 2: Transfer to CLI Identity**
1. In NNS app, click "Send ICP"
2. Enter recipient address: `0b6612f507cea1647d2f1058d2c0749646acdef8fb9612d38e67dabaccb6374b`
3. Amount: 2-5 ICP
4. Confirm transfer

**Step 3: Verify Transfer**
```bash
dfx ledger balance --network ic
```

### Method 3: Free Cycles (Testing Only)
```bash
# Get limited free cycles
curl -X POST https://faucet.dfinity.org/give \
  -H "Content-Type: application/json" \
  -d '{"principal": "7tswm-bthk2-fnvec-7wcse-4sbhh-5jr2m-qke2z-pxzf5-yhqlb-ir3fn-yae"}'
```

---

## Cycles Wallet Creation

### Step 1: Verify ICP Balance
```bash
dfx ledger balance --network ic
```
Should show: `2.00000000 ICP` or similar

### Step 2: Create Cycles Wallet
```bash
# Create wallet canister with 0.5 ICP
dfx ledger create-canister $(dfx identity get-principal) --amount 0.5 --network ic
```

**Expected Output:**
```
Canister created with id: "rdmx6-jaaaa-aaaaa-aaadq-cai"
```

### Step 3: Verify Wallet Setup
```bash
# Check cycles balance
dfx wallet balance --network ic
```

**Expected Output:**
```
1.346 TC (trillion cycles)
```

### Step 4: Top Up Wallet (If Needed)
```bash
# Add more cycles if balance is low
dfx ledger top-up --amount 0.5 <wallet-canister-id> --network ic
```

---

## Pre-Deployment Checks

### Step 1: Project Structure Verification
```bash
# Verify all required files exist
ls -la backend/src/user_management/main.mo
ls -la backend/src/wallet/main.mo
ls -la backend/src/marketplace/main.mo
ls -la backend/src/escrow/main.mo
ls -la backend/src/ai_insights/main.mo
```

### Step 2: Dependencies Installation
```bash
# Install Motoko dependencies
vessel install

# Install frontend dependencies
cd frontend && npm ci && cd ..
```

### Step 3: Local Testing
```bash
# Test local deployment first
dfx start --background --clean
dfx deploy --network local

# Test health check
dfx canister call user_management healthCheck --network local

# Stop local replica
dfx stop
```

### Step 4: Cycles Estimation
```bash
# Check current cycles balance
dfx wallet balance --network ic
```

**Required Cycles:**
- 5 Canisters × 0.2T cycles = 1.0T cycles
- Initial storage: ~0.5T cycles
- Buffer for operations: ~0.5T cycles
- **Total needed: ~2.0T cycles**

---

## Mainnet Deployment

### Step 1: Environment Setup
```bash
# Ensure correct identity
dfx identity whoami  # Should show: mainnet-deployer

# Check cycles balance
dfx wallet balance --network ic  # Should show >2T cycles
```

### Step 2: Deploy Canisters
```bash
# Make deployment script executable
chmod +x scripts/deploy-mainnet.sh

# Run deployment
./scripts/deploy-mainnet.sh
```

### Step 3: Manual Deployment (Alternative)
```bash
# Deploy each canister individually
dfx deploy user_management --network ic --with-cycles 200000000000
dfx deploy wallet --network ic --with-cycles 200000000000
dfx deploy marketplace --network ic --with-cycles 200000000000
dfx deploy escrow --network ic --with-cycles 200000000000
dfx deploy ai_insights --network ic --with-cycles 200000000000
```

### Step 4: Verify Deployments
```bash
# Check canister status
dfx canister status user_management --network ic
dfx canister status wallet --network ic
dfx canister status marketplace --network ic
dfx canister status escrow --network ic
dfx canister status ai_insights --network ic
```

### Step 5: Test Health Checks
```bash
# Test each canister
dfx canister call user_management healthCheck --network ic
dfx canister call wallet healthCheck --network ic
dfx canister call marketplace healthCheck --network ic
```

### Step 6: Get Canister IDs
```bash
# Save these IDs securely
USER_MANAGEMENT_ID=$(dfx canister id user_management --network ic)
WALLET_ID=$(dfx canister id wallet --network ic)
MARKETPLACE_ID=$(dfx canister id marketplace --network ic)
ESCROW_ID=$(dfx canister id escrow --network ic)
AI_INSIGHTS_ID=$(dfx canister id ai_insights --network ic)

echo "User Management: $USER_MANAGEMENT_ID"
echo "Wallet: $WALLET_ID"
echo "Marketplace: $MARKETPLACE_ID"
echo "Escrow: $ESCROW_ID"
echo "AI Insights: $AI_INSIGHTS_ID"
```

---

## Frontend Deployment

### Option A: Deploy to IC Canister

**Step 1: Build Frontend**
```bash
cd frontend
npm run build
npm run export  # For static export
cd ..
```

**Step 2: Create Frontend Canister Config**
```json
// dfx.frontend.json
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
```

**Step 3: Deploy Frontend**
```bash
dfx deploy frontend --network ic -c dfx.frontend.json --with-cycles 200000000000
```

**Step 4: Get Frontend URL**
```bash
FRONTEND_ID=$(dfx canister id frontend --network ic -c dfx.frontend.json)
echo "Frontend URL: https://$FRONTEND_ID.icp0.io"
```

### Option B: Deploy to Vercel/Netlify

**Step 1: Create Production Environment**
```bash
# Create .env.production
cat > frontend/.env.production << EOF
NEXT_PUBLIC_DFX_NETWORK=ic
NEXT_PUBLIC_IC_HOST=https://icp-api.io
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=$USER_MANAGEMENT_ID
NEXT_PUBLIC_WALLET_CANISTER_ID=$WALLET_ID
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=$MARKETPLACE_ID
NEXT_PUBLIC_ESCROW_CANISTER_ID=$ESCROW_ID
NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID=$AI_INSIGHTS_ID
NEXT_PUBLIC_INTERNET_IDENTITY_URL=https://identity.ic0.app
NEXT_PUBLIC_NFID_URL=https://nfid.one/authenticate
NODE_ENV=production
NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION=false
NEXT_PUBLIC_ENABLE_MOCK_AUTH=false
EOF
```

**Step 2: Deploy to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

**Step 3: Configure Environment Variables**
In Vercel dashboard, add all environment variables from `.env.production`

---

## Production Testing

### Test Checklist

**Step 1: Access Application**
- IC Frontend: `https://<frontend-canister-id>.icp0.io`
- External Frontend: Your Vercel/Netlify URL
- Candid UI: `https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=<canister-id>`

**Step 2: Authentication Testing**
```bash
# Test authentication flows
1. Internet Identity login
2. NFID wallet login
3. User registration process
4. Role selection (buyer/seller)
```

**Step 3: Core Functionality Testing**
```bash
# Test user flows
1. Complete user registration
2. KYC document submission
3. Profile updates
4. Wallet operations
5. Dashboard navigation
6. Settings modifications
```

**Step 4: Backend API Testing**
```bash
# Test canister calls
dfx canister call user_management getCurrentUser --network ic
dfx canister call wallet getWallet --network ic
dfx canister call marketplace healthCheck --network ic
```

**Step 5: Error Handling Testing**
- Test with invalid inputs
- Test network disconnections
- Test unauthorized access attempts

---

## Monitoring & Maintenance

### Cycles Monitoring
```bash
# Check all canister cycles
dfx canister status user_management --network ic | grep "Balance"
dfx canister status wallet --network ic | grep "Balance"
dfx canister status marketplace --network ic | grep "Balance"
dfx canister status escrow --network ic | grep "Balance"
dfx canister status ai_insights --network ic | grep "Balance"

# Check wallet cycles
dfx wallet balance --network ic
```

### Automated Monitoring Script
```bash
#!/bin/bash
# monitoring.sh - Save as executable script

echo "=== TradeChain Canister Status ==="
echo "Date: $(date)"
echo ""

CANISTERS=("user_management" "wallet" "marketplace" "escrow" "ai_insights")

for canister in "${CANISTERS[@]}"; do
    echo "--- $canister ---"
    dfx canister status $canister --network ic 2>/dev/null || echo "Error checking $canister"
    echo ""
done

echo "--- Wallet Balance ---"
dfx wallet balance --network ic
```

### Top-Up Procedures
```bash
# Top up individual canister
dfx ledger top-up --amount 0.5 <canister-id> --network ic

# Top up cycles wallet
dfx ledger create-canister $(dfx identity get-principal) --amount 0.5 --network ic
```

### Health Check Automation
```bash
#!/bin/bash
# health-check.sh

CANISTERS=("user_management" "wallet" "marketplace")

for canister in "${CANISTERS[@]}"; do
    result=$(dfx canister call $canister healthCheck --network ic 2>/dev/null)
    if [[ $result == *"healthy"* ]]; then
        echo "✅ $canister: Healthy"
    else
        echo "❌ $canister: Unhealthy - $result"
    fi
done
```

---

## Troubleshooting

### Common Issues & Solutions

**Issue 1: "No wallet configured"**
```bash
# Solution: Create cycles wallet
dfx ledger create-canister $(dfx identity get-principal) --amount 0.5 --network ic
```

**Issue 2: "Insufficient ICP balance"**
```bash
# Solution: Add more ICP tokens
# Check balance: dfx ledger balance --network ic
# Buy more ICP from exchange
```

**Issue 3: "Canister is out of cycles"**
```bash
# Solution: Top up canister
dfx ledger top-up --amount 0.5 <canister-id> --network ic
```

**Issue 4: "Failed to compile Motoko"**
```bash
# Solution: Check Motoko syntax
# Verify vessel dependencies: vessel install
# Check types.mo files exist
```

**Issue 5: Authentication errors in production**
```bash
# Solution: Verify environment variables
# Check .env.production has correct canister IDs
# Ensure DISABLE_SIGNATURE_VALIDATION=false in production
```

**Issue 6: Frontend build fails**
```bash
# Solution: Check dependencies
cd frontend && npm ci
npm run build
# Check for TypeScript errors
```

### Recovery Procedures

**If Identity is Lost:**
```bash
# Recover from seed phrase
dfx identity recover <identity-name> <seed-phrase>
```

**If Canisters are Inaccessible:**
```bash
# Check canister controllers
dfx canister info <canister-id> --network ic
# If you're still controller, redeploy
dfx deploy <canister-name> --network ic
```

---

## Cost Management

### Deployment Costs
- **Initial deployment:** ~2T cycles (~$2.60)
- **Monthly operations:** ~300M cycles (~$0.40)
- **High traffic:** ~5T cycles/month (~$6.50)

### Cost Optimization
1. **Efficient queries:** Use query calls instead of updates when possible
2. **Batch operations:** Group multiple operations together
3. **Regular monitoring:** Set up alerts for low cycles
4. **Clean up unused data:** Remove old transactions/logs
5. **Optimize storage:** Compress data when possible

### Budget Planning
- **Development:** 5-10T cycles (~$6.50-13)
- **Production (small):** 10-20T cycles/month (~$13-26)
- **Production (medium):** 50-100T cycles/month (~$65-130)
- **Enterprise:** 500T+ cycles/month (~$650+)

---

## Security Best Practices

### Identity Security
- Backup seed phrase in multiple secure locations
- Use strong passphrase for identity encryption
- Never share principal ID or seed phrase
- Consider using hardware security keys

### Canister Security
- Implement proper access controls
- Validate all inputs
- Use stable memory for persistent data
- Regular security audits
- Monitor for unusual activity

### Frontend Security
- Validate all user inputs
- Implement proper error boundaries
- Use HTTPS only
- Secure environment variables
- Regular dependency updates

---

---

## Updates & Change Management

### Canister Updates (Backend Code Changes)

**When You Modify Motoko Code:**
```bash
# Update specific canister
dfx deploy user_management --network ic

# Or update all canisters
dfx deploy --network ic
```

**What Happens During Updates:**
- Canister code gets updated with new version
- **All data persists** - users, wallets, transactions remain intact
- Same canister ID - no frontend configuration changes needed
- Zero downtime - users stay connected during updates
- Cost: 10-50M cycles per update (~$0.01-0.07)

**Example Update Workflow:**
```bash
# 1. Edit your Motoko code
vim backend/src/user_management/main.mo

# 2. Test locally first
dfx start --background
dfx deploy --network local
dfx canister call user_management healthCheck --network local
dfx stop

# 3. Deploy to mainnet
dfx deploy user_management --network ic

# 4. Verify update
dfx canister call user_management healthCheck --network ic
```

### Frontend Updates

**Option A: IC Frontend Canister**
```bash
# After making frontend changes
cd frontend
npm run build
cd ..
dfx deploy frontend --network ic -c dfx.frontend.json
```

**Option B: Vercel/Netlify (Recommended)**
```bash
# Simply push to git - auto-deploys
git add .
git commit -m "Update frontend features"
git push origin main
# Vercel automatically builds and deploys
```

### Update Strategies

**Development Workflow:**
1. Make changes in development environment
2. Test locally: `dfx deploy --network local`
3. Test all functionality thoroughly
4. Deploy to mainnet: `dfx deploy --network ic`
5. Monitor for issues

**Safe Update Practices:**
```bash
# Always backup before major updates
dfx canister call user_management exportData --network ic > backup.json

# Deploy during low-traffic periods
# Monitor cycles consumption after updates
dfx wallet balance --network ic

# Test critical paths immediately after deployment
```

**Handling Breaking Changes:**
```bash
# For major data structure changes, include migration logic
# Example: Adding new fields to user records
# 1. Update types.mo with optional new fields
# 2. Add migration function in main.mo
# 3. Deploy update
# 4. Run migration if needed
dfx canister call user_management migrateUserData --network ic
```

### Update Costs

**Per Update Costs:**
- Small bug fix: ~10-20M cycles (~$0.01-0.03)
- Feature addition: ~20-50M cycles (~$0.03-0.07)
- Major refactor: ~50-100M cycles (~$0.07-0.13)
- Frontend update: ~20-50M cycles (~$0.03-0.07)

**Much cheaper than initial deployment** - updates are routine operational costs.

### Rollback Procedures

**If Update Causes Issues:**
```bash
# Option 1: Quick fix and redeploy
# Fix the issue and deploy again
dfx deploy user_management --network ic

# Option 2: Reinstall previous version (if you have the WASM)
dfx canister install user_management --wasm previous_version.wasm --network ic --mode reinstall

# Option 3: Stop and reinstall (last resort - loses data)
dfx canister stop user_management --network ic
dfx canister delete user_management --network ic
# Redeploy from scratch (requires new canister ID)
```

### Version Control & Release Management

**Recommended Workflow:**
```bash
# Use git tags for releases
git tag -a v1.0.1 -m "Bug fixes and performance improvements"
git push origin v1.0.1

# Keep deployment logs
echo "$(date): Deployed v1.0.1 to mainnet" >> deployment.log
```

**Canister Version Tracking:**
```motoko
// In your main.mo, track versions
public query func getVersion() : async Text {
    "1.0.1"
};
```

### Environment Variable Updates

**When Updating Frontend Environment:**
```bash
# Update .env.production
# Redeploy frontend
# No backend changes needed unless canister IDs change
```

**When Adding New Canisters:**
```bash
# Deploy new canister
dfx deploy new_feature --network ic

# Get new canister ID
NEW_CANISTER_ID=$(dfx canister id new_feature --network ic)

# Update frontend environment
echo "NEXT_PUBLIC_NEW_FEATURE_CANISTER_ID=$NEW_CANISTER_ID" >> frontend/.env.production

# Redeploy frontend
```

### Monitoring Updates

**Post-Update Checks:**
```bash
#!/bin/bash
# post-update-check.sh

echo "Running post-update verification..."

# Check all canisters are healthy
dfx canister call user_management healthCheck --network ic
dfx canister call wallet healthCheck --network ic
dfx canister call marketplace healthCheck --network ic

# Check cycles consumption
dfx wallet balance --network ic

# Test key user flows
# (Add specific tests for your application)
```

**Update Notification System:**
```bash
# Notify team of successful deployment
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-type: application/json' \
  -d '{"text":"TradeChain v1.0.1 deployed successfully to mainnet"}'
```

---

## Conclusion

This guide provides complete documentation for deploying TradeChain to ICP mainnet. Follow each step carefully and maintain regular backups and monitoring.

**Key Success Factors:**
1. Secure identity management
2. Adequate cycles budgeting
3. Thorough testing procedures
4. Regular monitoring and maintenance
5. Proper backup and recovery procedures
6. Efficient update and change management

**Next Steps After Deployment:**
1. Set up monitoring alerts
2. Implement analytics tracking
3. Plan for scaling requirements
4. Create user documentation
5. Develop customer support procedures
6. Establish update and release procedures

**Update Management Summary:**
- Updates are frequent, inexpensive operations
- Data persists across updates automatically
- Test locally before mainnet deployment
- Monitor cycles and functionality post-update
- Maintain version control and rollback capabilities

For additional support, consult the [IC Developer Documentation](https://internetcomputer.org/docs) or join the [IC Developer Forum](https://forum.dfinity.org).