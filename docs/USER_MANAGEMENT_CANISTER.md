# TradeChain User Management - Deployment Guide

## 🚀 Complete Setup and Deployment Instructions

### Prerequisites Installation

1. **Install DFX SDK**
```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

2. **Install Vessel (Motoko Package Manager)**
```bash
# macOS/Linux
curl -L https://github.com/dfinity/vessel/releases/latest/download/vessel-macos -o vessel
chmod +x vessel
sudo mv vessel /usr/local/bin/

# Windows - download from GitHub releases
```

3. **Verify Installation**
```bash
dfx --version
vessel --version
```

## 📁 Project Setup

### 1. Create Project Structure
```bash
# Create backend directory
mkdir tradechain-backend
cd tradechain-backend

# Create folder structure
mkdir -p src/user_management
mkdir -p src/shared

# Initialize git (optional)
git init
```

### 2. Create Configuration Files
Create the following files in your project root:

**Create dfx.json** (use the dfx.json artifact)
**Create vessel.dhall** (use the vessel.dhall artifact)

<!-- ### 3. Create Source Files
Create the following files with the provided code:

- `src/shared/types.mo` (use shared_types_mo artifact)
- `src/user_management/types.mo` (use user_management_types_mo artifact)
- `src/user_management/utils.mo` (use user_management_utils_mo artifact)
- `src/user_management/main.mo` (use user_management_main_mo artifact) -->

## 🏗️ Local Development

### 1. Install Dependencies
```bash
# Install Vessel packages
vessel install
```

### 2. Start Local Replica
```bash
# Start DFX local replica (keep this running in a terminal)
dfx start --background --clean
```

### 3. Deploy Locally
```bash
# Deploy user management canister
dfx deploy user_management

# Get canister ID
dfx canister id user_management
```

### 4. Test Local Deployment
```bash
# Check if canister is running
dfx canister status user_management

# Test health check
dfx canister call user_management healthCheck

# Test system stats
dfx canister call user_management getSystemStats
```

## 🧪 Testing Functions

### Test Demo Login
```bash
# Test buyer demo login
dfx canister call user_management loginDemo '("buyer@demo.com", "demo123", variant { Buyer })'

# Test seller demo login
dfx canister call user_management loginDemo '("seller@demo.com", "demo123", variant { Seller })'
```

### Test Registration
```bash
# Test user registration
dfx canister call user_management registerUser '(record {
  email = opt "test@example.com";
  role = variant { Buyer };
  authProvider = variant { Email };
  agreeTerms = true;
})'
```

### Test KYC Submission
```bash
# Test KYC submission
dfx canister call user_management submitKYC '(record {
  firstName = "John";
  lastName = "Doe";
  dateOfBirth = "1990-01-01";
  country = "US";
  address = "123 Main St";
  city = "New York";
  postalCode = "10001";
  phoneNumber = "+1234567890";
  idType = "passport";
  documentsUploaded = true;
  submissionDate = 1640995200000000000;
})'
```

## 🌐 Mainnet Deployment

### 1. Prepare for Mainnet
```bash
# Make sure you have cycles (ICP tokens)
# Check wallet balance
dfx wallet balance --network ic
```

### 2. Deploy to Mainnet
```bash
# Deploy to IC mainnet
dfx deploy user_management --network ic

# Get mainnet canister ID
dfx canister id user_management --network ic
```

### 3. Verify Mainnet Deployment
```bash
# Check canister status on mainnet
dfx canister status user_management --network ic

# Test health check on mainnet
dfx canister call user_management healthCheck --network ic
```

## 🔗 Frontend Integration

### Environment Variables
After deployment, add these to your frontend `.env.local`:

```bash
# Local Development
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=your_local_canister_id
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://localhost:8000

# Production (after mainnet deployment)
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=your_mainnet_canister_id
NEXT_PUBLIC_DFX_NETWORK=ic
NEXT_PUBLIC_IC_HOST=https://ic0.app
```

### Frontend Integration Code
Create/update your `lib/icp-agent.ts`:

```typescript
import { Actor, HttpAgent } from '@dfinity/agent';

// Import IDL (will be generated after deployment)
const userManagementIdl = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'Admin' : IDL.Null,
    'Buyer' : IDL.Null,
    'Seller' : IDL.Null,
  });
  
  const AuthProvider = IDL.Variant({
    'Email' : IDL.Null,
    'InternetIdentity' : IDL.Null,
  });

  const RegisterRequest = IDL.Record({
    'agreeTerms' : IDL.Bool,
    'role' : UserRole,
    'email' : IDL.Opt(IDL.Text),
    'authProvider' : AuthProvider,
  });

  const UserProfile = IDL.Record({
    'id' : IDL.Text,
    'bio' : IDL.Opt(IDL.Text),
    'principal' : IDL.Principal,
    'lastName' : IDL.Opt(IDL.Text),
    'role' : UserRole,
    'verified' : IDL.Bool,
    'avatar' : IDL.Opt(IDL.Text),
    'website' : IDL.Opt(IDL.Text),
    'authProvider' : AuthProvider,
    'email' : IDL.Opt(IDL.Text),
    'phone' : IDL.Opt(IDL.Text),
    'totalTrades' : IDL.Nat,
    'company' : IDL.Opt(IDL.Text),
    'successRate' : IDL.Float64,
    'rating' : IDL.Float64,
    'firstName' : IDL.Opt(IDL.Text),
    'joinDate' : IDL.Int,
    'lastActive' : IDL.Int,
    'location' : IDL.Opt(IDL.Text),
    'kycStatus' : IDL.Variant({
      'Pending' : IDL.Null,
      'Verified' : IDL.Null,
      'NotStarted' : IDL.Null,
      'Rejected' : IDL.Null,
    }),
  });

  return IDL.Service({
    'getUserProfile' : IDL.Func([], [IDL.Variant({'ok' : UserProfile, 'err' : IDL.Text})], []),
    'loginDemo' : IDL.Func([IDL.Text, IDL.Text, UserRole], [IDL.Variant({'ok' : UserProfile, 'err' : IDL.Text})], []),
    'registerUser' : IDL.Func([RegisterRequest], [IDL.Variant({'ok' : UserProfile, 'err' : IDL.Text})], []),
    'healthCheck' : IDL.Func([], [IDL.Text], ['query']),
  });
};

// Create agent
const agent = new HttpAgent({
  host: process.env.NEXT_PUBLIC_IC_HOST,
});

// Create actor
export const userManagementActor = Actor.createActor(userManagementIdl, {
  agent,
  canisterId: process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID!,
});
```

## 🔧 Troubleshooting

### Common Issues

1. **Canister Creation Failed**
```bash
# Clear local state and restart
dfx stop
rm -rf .dfx
dfx start --background --clean
```

2. **Vessel Package Issues**
```bash
# Reinstall packages
rm -rf .vessel
vessel install
```

3. **Deployment Errors**
```bash
# Check canister logs
dfx canister logs user_management
```

4. **Network Issues**
```bash
# Check network connectivity
dfx ping local
dfx ping ic
```

### Performance Monitoring
```bash
# Check cycles consumption
dfx canister status user_management --network ic

# Monitor canister calls
dfx canister logs user_management --network ic
```

## ✅ Deployment Success Checklist

- [ ] Local replica started successfully
- [ ] Canister deployed locally without errors
- [ ] Health check returns success
- [ ] Demo login functions work
- [ ] Registration function works
- [ ] Frontend environment variables configured
- [ ] (Optional) Deployed to mainnet
- [ ] All tests pass

## 📝 Next Steps

After successful User Management deployment:

1. **Test Integration**: Verify frontend can connect to the canister
2. **Document Canister ID**: Save the canister ID for frontend integration
3. **Monitor Performance**: Check cycles consumption and response times
4. **Proceed to Wallet Canister**: Move to the next phase of development

## 🚨 Important Notes

- **Keep your canister ID secure** - you'll need it for frontend integration
- **Monitor cycles consumption** - canisters need cycles to run
- **Test thoroughly** - verify all functions work before proceeding
- **Backup important data** - export user data if needed

**Should you deploy after User Management?**

**YES** - Deploy and test User Management first before moving to the next canister. This ensures:
- Authentication works properly
- Frontend integration is successful
- No blocking issues before building dependent systems
- Early validation of your architecture

Once User Management is deployed and tested, proceed to the Wallet canister.