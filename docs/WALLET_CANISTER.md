# TradeChain Wallet Canister - Deployment Guide

## 🎯 Overview

The Wallet canister handles all financial operations including:
- ✅ **Multi-token support** (ICP, ckBTC, ckETH, ckUSDC)
- ✅ **Deposit/Withdrawal** functionality
- ✅ **Transaction history** and tracking
- ✅ **Portfolio statistics** and insights
- ✅ **AI investment recommendations**
- ✅ **Demo wallet system** (matches frontend)

## 📁 File Structure

Ensure you have these files in your project:

```
tradechain-backend/
├── dfx.json                          # Updated with wallet canister
├── vessel.dhall                      # Package dependencies
├── src/
│   ├── shared/
│   │   └── types.mo                  # Updated with wallet types
│   ├── user_management/
│   │   ├── main.mo
│   │   ├── types.mo
│   │   └── utils.mo
│   └── wallet/                       # NEW WALLET FILES
│       ├── main.mo                   # Main wallet canister
│       ├── types.mo                  # Wallet type definitions
│       └── utils.mo                  # Wallet utility functions
```

## 🚀 Deployment Steps

### 1. Deploy Wallet Canister
```bash
# Make sure you're in the project directory
cd tradechain-backend

# Deploy wallet canister
dfx deploy wallet

# Get wallet canister ID
dfx canister id wallet
```

### 2. Test Wallet Functions
```bash
# Check wallet health
dfx canister call wallet healthCheck

# Get system stats
dfx canister call wallet getSystemStats

# Test demo wallet
dfx canister call wallet getDemoWallet '("buyer")'
```

### 3. Test Demo Wallet Features
```bash
# Get demo wallet info
dfx canister call wallet getDemoWallet '("buyer")'

# Get demo transaction history
dfx canister call wallet getDemoTransactionHistory '("buyer")'

# Test deposit (you'll need to be authenticated)
dfx canister call wallet deposit '(record {
  amount = 100.0;
  tokenType = variant { ICP };
})'
```

## 🧪 Complete Testing Suite

### Test Wallet Creation
```bash
# Test wallet creation (as authenticated user)
dfx canister call wallet createWallet
```

### Test Token Operations
```bash
# Test transfer
dfx canister call wallet transfer '(record {
  toAddress = "rdmx6-jaaaa-aaaah-qcaiq-cai";
  amount = 10.0;
  tokenType = variant { ICP };
  description = opt "Test transfer";
})'

# Test withdrawal
dfx canister call wallet withdraw '(record {
  toAddress = "external-wallet-address";
  amount = 5.0;
  tokenType = variant { ICP };
})'
```

### Test Portfolio Features
```bash
# Get portfolio stats
dfx canister call wallet getPortfolioStats

# Get investment insights
dfx canister call wallet getInvestmentInsights

# Get token balances
dfx canister call wallet getTokenBalances
```

## 🔗 Frontend Integration

### Update Environment Variables
Add the wallet canister ID to your frontend `.env.local`:

```bash
# Add this line to your existing .env.local
NEXT_PUBLIC_WALLET_CANISTER_ID=your_wallet_canister_id

# Your complete .env.local should now have:
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=uxrrr-q7777-77774-qaaaq-cai
NEXT_PUBLIC_WALLET_CANISTER_ID=your_new_wallet_canister_id
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:8000
```

### Frontend Integration Code
Create/update your `lib/wallet-agent.ts`:

```typescript
import { Actor, HttpAgent } from '@dfinity/agent';

// Wallet IDL (simplified for demo)
const walletIdl = ({ IDL }) => {
  const TokenType = IDL.Variant({
    'ICP': IDL.Null,
    'ckBTC': IDL.Null,
    'ckETH': IDL.Null,
    'ckUSDC': IDL.Null,
  });

  const TokenBalance = IDL.Record({
    'symbol': IDL.Text,
    'name': IDL.Text,
    'balance': IDL.Float64,
    'usdValue': IDL.Float64,
    'change24h': IDL.Float64,
    'color': IDL.Text,
  });

  const WalletInfo = IDL.Record({
    'userId': IDL.Text,
    'principal': IDL.Principal,
    'address': IDL.Text,
    'totalBalance': IDL.Float64,
    'totalUsdValue': IDL.Float64,
    'tokens': IDL.Vec(TokenBalance),
    'createdAt': IDL.Int,
    'lastActivity': IDL.Int,
  });

  const TransactionType = IDL.Variant({
    'Deposit': IDL.Null,
    'Withdraw': IDL.Null,
    'Purchase': IDL.Null,
    'Sale': IDL.Null,
    'Transfer': IDL.Null,
  });

  const TransactionStatus = IDL.Variant({
    'Pending': IDL.Null,
    'Completed': IDL.Null,
    'Failed': IDL.Null,
    'Cancelled': IDL.Null,
  });

  const Transaction = IDL.Record({
    'id': IDL.Text,
    'userId': IDL.Text,
    'transactionType': TransactionType,
    'tokenType': TokenType,
    'amount': IDL.Float64,
    'usdValue': IDL.Float64,
    'fromAddress': IDL.Opt(IDL.Text),
    'toAddress': IDL.Opt(IDL.Text),
    'status': TransactionStatus,
    'timestamp': IDL.Int,
    'description': IDL.Text,
    'fee': IDL.Float64,
    'hash': IDL.Opt(IDL.Text),
  });

  const DepositRequest = IDL.Record({
    'amount': IDL.Float64,
    'tokenType': TokenType,
  });

  const WithdrawalRequest = IDL.Record({
    'toAddress': IDL.Text,
    'amount': IDL.Float64,
    'tokenType': TokenType,
  });

  return IDL.Service({
    'getWalletInfo': IDL.Func([], [IDL.Variant({'ok': WalletInfo, 'err': IDL.Text})], []),
    'getDemoWallet': IDL.Func([IDL.Text], [IDL.Variant({'ok': WalletInfo, 'err': IDL.Text})], []),
    'getTransactionHistory': IDL.Func([], [IDL.Variant({'ok': IDL.Vec(Transaction), 'err': IDL.Text})], []),
    'getDemoTransactionHistory': IDL.Func([IDL.Text], [IDL.Variant({'ok': IDL.Vec(Transaction), 'err': IDL.Text})], []),
    'deposit': IDL.Func([DepositRequest], [IDL.Variant({'ok': Transaction, 'err': IDL.Text})], []),
    'withdraw': IDL.Func([WithdrawalRequest], [IDL.Variant({'ok': Transaction, 'err': IDL.Text})], []),
    'healthCheck': IDL.Func([], [IDL.Text], ['query']),
  });
};

// Create agent
const agent = new HttpAgent({
  host: process.env.NEXT_PUBLIC_IC_HOST,
});

// Create wallet actor
export const walletActor = Actor.createActor(walletIdl, {
  agent,
  canisterId: process.env.NEXT_PUBLIC_WALLET_CANISTER_ID!,
});
```

### Frontend Usage Example
```typescript
// In your wallet page component
import { walletActor } from '@/lib/wallet-agent';

// Get wallet info
const getWalletData = async () => {
  try {
    const result = await walletActor.getDemoWallet('buyer');
    if ('ok' in result) {
      setWalletData(result.ok);
    }
  } catch (error) {
    console.error('Failed to get wallet data:', error);
  }
};

// Get transaction history
const getTransactions = async () => {
  try {
    const result = await walletActor.getDemoTransactionHistory('buyer');
    if ('ok' in result) {
      setTransactions(result.ok);
    }
  } catch (error) {
    console.error('Failed to get transactions:', error);
  }
};
```

## 🎯 Expected Test Results

### Successful Deployment
```bash
$ dfx deploy wallet
Deploying: wallet
wallet canister created with canister id: xyz123-abc789...
Building canister 'wallet'.
Installed code for canister wallet

$ dfx canister call wallet healthCheck
("Wallet canister is running. Total wallets: 2")
```

### Demo Wallet Test
```bash
$ dfx canister call wallet getDemoWallet '("buyer")'
(
  variant {
    ok = record {
      userId = "wallet_buyer_demo";
      address = "2vxsx-fae";
      totalBalance = 1245.67;
      totalUsdValue = 28009.69;
      tokens = vec {
        record {
          symbol = "ICP";
          name = "Internet Computer";
          balance = 1245.67;
          usdValue = 8719.69;
          change24h = 2.5;
          color = "#29D0B0";
        };
        // ... more tokens
      };
    }
  }
)
```

## 🔧 Troubleshooting

### Common Issues

1. **Deployment Fails**
```bash
# Clean and rebuild
dfx stop
dfx start --background --clean
dfx deploy wallet
```

2. **Function Call Errors**
```bash
# Check canister status
dfx canister status wallet

# Check logs
dfx canister logs wallet
```

3. **Type Errors**
```bash
# Ensure all types are properly imported
# Check that TokenType variants match exactly
```

## ✅ Success Checklist

After successful deployment, you should be able to:

- [ ] Deploy wallet canister without errors
- [ ] Call `healthCheck()` successfully
- [ ] Get demo wallet data with `getDemoWallet('buyer')`
- [ ] Retrieve demo transaction history
- [ ] See system stats showing 2 demo wallets
- [ ] Frontend can connect to wallet canister
- [ ] All wallet page features display correctly

## 🚀 Next Steps

Once the Wallet canister is working:

1. **Test Frontend Integration**: Connect your frontend wallet page to the canister
2. **Verify All Features**: Ensure deposits, withdrawals, and transactions work
3. **Check Demo Data**: Confirm demo users have proper wallet data
4. **Move to Marketplace**: Proceed with the Marketplace canister
5. **Integration Testing**: Test user management + wallet integration

The Wallet canister provides the financial foundation for your trading platform. Once deployed and tested, you'll have a complete financial system ready for marketplace integration!

## 📊 Demo Data Verification

Your wallet system includes realistic demo data that matches your frontend:
- **Multi-token portfolio** (ICP, ckBTC, ckETH, ckUSDC)
- **Transaction history** with 5 sample transactions
- **Portfolio statistics** and performance metrics
- **AI investment insights** for user guidance

This gives you a fully functional wallet system for your hackathon demo!