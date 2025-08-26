# TradeChain Escrow Canister - Deployment Guide

## 🎯 Overview

The Escrow canister provides secure transaction processing including:
- ✅ **Multi-party Escrow** - Secure fund holding for buyer-seller transactions
- ✅ **Smart Contracts** - Automated condition-based fund release
- ✅ **Dispute Resolution** - Third-party arbitration system
- ✅ **Auto-release Logic** - Conditional automatic fund release
- ✅ **Security Layer** - Multi-signature and time-locked transactions
- ✅ **Demo System** - Realistic escrow scenarios for demonstration

## 📁 File Structure

Ensure you have these files in your project:

```
tradechain-backend/
├── dfx.json                          # Updated with escrow canister
├── vessel.dhall                      # Package dependencies
├── src/
│   ├── shared/
│   │   └── types.mo                  # Updated with escrow types
│   ├── user_management/
│   │   ├── main.mo
│   │   ├── types.mo
│   │   └── utils.mo
│   ├── wallet/
│   │   ├── main.mo
│   │   ├── types.mo
│   │   └── utils.mo
│   ├── marketplace/
│   │   ├── main.mo
│   │   ├── types.mo
│   │   └── utils.mo
│   └── escrow/                       # NEW ESCROW FILES
│       ├── main.mo                   # Main escrow canister
│       ├── types.mo                  # Escrow type definitions
│       └── utils.mo                  # Escrow utility functions
```

## 🚀 Deployment Steps

### 1. Deploy Escrow Canister
```bash
# Make sure you're in the project directory
cd tradechain-backend

# Deploy escrow canister
dfx deploy escrow

# Get escrow canister ID
dfx canister id escrow
```

### 2. Test Escrow Functions
```bash
# Check escrow health
dfx canister call escrow healthCheck

# Get escrow system stats
dfx canister call escrow getEscrowStats

# Get demo user escrows
dfx canister call escrow getDemoUserEscrows '("buyer")'
```

### 3. Test System Health
```bash
# Check system health
dfx canister call escrow getSystemHealth

# Process auto-releases (maintenance function)
dfx canister call escrow processAutoReleases

# Check for expired escrows
dfx canister call escrow checkExpiredEscrows
```

## 🧪 Complete Testing Suite

### Test Escrow Creation
```bash
# Create a new escrow agreement
dfx canister call escrow createEscrow '(record {
  orderId = "ord_test_123";
  buyerId = "user_test_buyer";
  sellerId = "user_test_seller";
  arbitratorId = opt "arbitrator_secure_trade";
  amount = 100.0;
  tokenType = variant { ICP };
  conditions = vec { 
    "Product shipped within 24 hours";
    "Buyer confirms receipt";
    "Quality inspection passed"
  };
  autoRelease = true;
  autoReleaseDelay = 72;
  expiryDays = 30;
})'
```

### Test Escrow Funding
```bash
# Fund an escrow (as buyer)
dfx canister call escrow fundEscrow '(record {
  escrowId = "escrow_[your_escrow_id]";
  amount = 100.0;
  tokenType = variant { ICP };
})'
```

### Test Condition Fulfillment
```bash
# Fulfill a condition (as seller)
dfx canister call escrow fulfillCondition '(
  "escrow_[your_escrow_id]",
  "cond_[condition_id]",
  vec { "tracking_number_123"; "shipping_receipt.pdf" }
)'
```

### Test Fund Release
```bash
# Release funds (as seller or arbitrator)
dfx canister call escrow releaseFunds '(record {
  escrowId = "escrow_[your_escrow_id]";
  releaseType = variant { Full };
  conditions = vec { "cond_[condition_id_1]"; "cond_[condition_id_2]" };
})'
```

### Test Dispute System
```bash
# Create a dispute (as buyer or seller)
dfx canister call escrow createDispute '(record {
  escrowId = "escrow_[your_escrow_id]";
  reason = "Quality Mismatch";
  description = "Product does not match description provided in listing";
  evidence = vec {
    record {
      id = "evidence_1";
      submittedBy = "user_test_buyer";
      evidenceType = variant { Image };
      title = "Product Photos";
      description = "Photos showing product condition";
      fileUrl = opt "/evidence/product_photos.jpg";
      fileHash = opt "0xabc123...";
      submittedAt = 1640995200000000000;
    }
  };
})'
```

### Test Dispute Resolution
```bash
# Resolve dispute (as arbitrator)
dfx canister call escrow resolveDispute '(
  "dispute_[dispute_id]",
  variant { PartialRefund = 0.7 },
  "Product quality issues confirmed, 70% refund to buyer"
)'
```

## 🔗 Frontend Integration

### Update Environment Variables
Add the escrow canister ID to your frontend `.env.local`:

```bash
# Add this line to your existing .env.local
NEXT_PUBLIC_ESCROW_CANISTER_ID=your_escrow_canister_id

# Your complete .env.local should now have:
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=your_user_canister_id
NEXT_PUBLIC_WALLET_CANISTER_ID=your_wallet_canister_id
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=your_marketplace_canister_id
NEXT_PUBLIC_ESCROW_CANISTER_ID=your_escrow_canister_id
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:8000
```

### Frontend Integration Code
Create/update your `lib/escrow-agent.ts`:

```typescript
import { Actor, HttpAgent } from '@dfinity/agent';

// Escrow IDL
const escrowIdl = ({ IDL }) => {
  const TokenType = IDL.Variant({
    'ICP': IDL.Null,
    'ckBTC': IDL.Null,
    'ckETH': IDL.Null,
    'ckUSDC': IDL.Null,
  });

  const EscrowStatus = IDL.Variant({
    'Created': IDL.Null,
    'Funded': IDL.Null,
    'Active': IDL.Null,
    'Disputed': IDL.Null,
    'Resolved': IDL.Null,
    'Released': IDL.Null,
    'Refunded': IDL.Null,
    'Cancelled': IDL.Null,
  });

  const DisputeStatus = IDL.Variant({
    'Open': IDL.Null,
    'InReview': IDL.Null,
    'Resolved': IDL.Null,
    'Closed': IDL.Null,
  });

  const EscrowCondition = IDL.Record({
    'id': IDL.Text,
    'description': IDL.Text,
    'required': IDL.Bool,
    'fulfilled': IDL.Bool,
    'fulfilledBy': IDL.Opt(IDL.Text),
    'fulfilledAt': IDL.Opt(IDL.Int),
    'evidence': IDL.Vec(IDL.Text),
  });

  const EscrowAgreement = IDL.Record({
    'id': IDL.Text,
    'orderId': IDL.Text,
    'buyerId': IDL.Text,
    'sellerId': IDL.Text,
    'arbitratorId': IDL.Opt(IDL.Text),
    'amount': IDL.Float64,
    'tokenType': TokenType,
    'status': EscrowStatus,
    'conditions': IDL.Vec(EscrowCondition),
    'createdAt': IDL.Int,
    'updatedAt': IDL.Int,
    'fundedAt': IDL.Opt(IDL.Int),
    'releasedAt': IDL.Opt(IDL.Int),
    'expiresAt': IDL.Int,
    'autoRelease': IDL.Bool,
    'autoReleaseDelay': IDL.Int,
  });

  const DisputeEvidence = IDL.Record({
    'id': IDL.Text,
    'submittedBy': IDL.Text,
    'evidenceType': IDL.Variant({
      'Document': IDL.Null,
      'Image': IDL.Null,
      'Video': IDL.Null,
      'Message': IDL.Null,
      'Other': IDL.Text,
    }),
    'title': IDL.Text,
    'description': IDL.Text,
    'fileUrl': IDL.Opt(IDL.Text),
    'fileHash': IDL.Opt(IDL.Text),
    'submittedAt': IDL.Int,
  });

  const Dispute = IDL.Record({
    'id': IDL.Text,
    'escrowId': IDL.Text,
    'initiatorId': IDL.Text,
    'respondentId': IDL.Text,
    'arbitratorId': IDL.Opt(IDL.Text),
    'reason': IDL.Text,
    'description': IDL.Text,
    'evidence': IDL.Vec(DisputeEvidence),
    'status': DisputeStatus,
    'resolution': IDL.Opt(IDL.Variant({
      'ReleaseToSeller': IDL.Null,
      'RefundToBuyer': IDL.Null,
      'PartialRefund': IDL.Float64,
    })),
    'resolutionReason': IDL.Opt(IDL.Text),
    'createdAt': IDL.Int,
    'updatedAt': IDL.Int,
    'resolvedAt': IDL.Opt(IDL.Int),
  });

  const EscrowRequest = IDL.Record({
    'orderId': IDL.Text,
    'buyerId': IDL.Text,
    'sellerId': IDL.Text,
    'arbitratorId': IDL.Opt(IDL.Text),
    'amount': IDL.Float64,
    'tokenType': TokenType,
    'conditions': IDL.Vec(IDL.Text),
    'autoRelease': IDL.Bool,
    'autoReleaseDelay': IDL.Int,
    'expiryDays': IDL.Nat,
  });

  const EscrowStats = IDL.Record({
    'totalEscrows': IDL.Nat,
    'activeEscrows': IDL.Nat,
    'completedEscrows': IDL.Nat,
    'disputedEscrows': IDL.Nat,
    'totalVolume': IDL.Float64,
    'averageEscrowAmount': IDL.Float64,
    'successRate': IDL.Float64,
    'averageResolutionTime': IDL.Int,
  });

  return IDL.Service({
    'createEscrow': IDL.Func([EscrowRequest], [IDL.Variant({'ok': EscrowAgreement, 'err': IDL.Text})], []),
    'getEscrow': IDL.Func([IDL.Text], [IDL.Variant({'ok': EscrowAgreement, 'err': IDL.Text})], []),
    'getUserEscrows': IDL.Func([], [IDL.Variant({'ok': IDL.Vec(EscrowAgreement), 'err': IDL.Text})], []),
    'getDemoUserEscrows': IDL.Func([IDL.Text], [IDL.Variant({'ok': IDL.Vec(EscrowAgreement), 'err': IDL.Text})], []),
    'fundEscrow': IDL.Func([IDL.Record({
      'escrowId': IDL.Text,
      'amount': IDL.Float64,
      'tokenType': TokenType,
    })], [IDL.Variant({'ok': EscrowAgreement, 'err': IDL.Text})], []),
    'releaseFunds': IDL.Func([IDL.Record({
      'escrowId': IDL.Text,
      'releaseType': IDL.Variant({
        'Full': IDL.Null,
        'Partial': IDL.Float64,
      }),
      'conditions': IDL.Vec(IDL.Text),
    })], [IDL.Variant({'ok': EscrowAgreement, 'err': IDL.Text})], []),
    'createDispute': IDL.Func([IDL.Record({
      'escrowId': IDL.Text,
      'reason': IDL.Text,
      'description': IDL.Text,
      'evidence': IDL.Vec(DisputeEvidence),
    })], [IDL.Variant({'ok': Dispute, 'err': IDL.Text})], []),
    'getDispute': IDL.Func([IDL.Text], [IDL.Variant({'ok': Dispute, 'err': IDL.Text})], []),
    'getUserDisputes': IDL.Func([], [IDL.Variant({'ok': IDL.Vec(Dispute), 'err': IDL.Text})], []),
    'getEscrowStats': IDL.Func([], [EscrowStats], ['query']),
    'healthCheck': IDL.Func([], [IDL.Text], ['query']),
  });
};

// Create agent
const agent = new HttpAgent({
  host: process.env.NEXT_PUBLIC_IC_HOST,
});

// Create escrow actor
export const escrowActor = Actor.createActor(escrowIdl, {
  agent,
  canisterId: process.env.NEXT_PUBLIC_ESCROW_CANISTER_ID!,
});
```

### Frontend Usage Example
```typescript
// In your escrow/checkout components
import { escrowActor } from '@/lib/escrow-agent';

// Create escrow for an order
const createEscrowForOrder = async (orderData: any) => {
  try {
    const escrowRequest = {
      orderId: orderData.id,
      buyerId: orderData.buyerId,
      sellerId: orderData.sellerId,
      arbitratorId: ['arbitrator_secure_trade'], // Optional
      amount: orderData.total,
      tokenType: { ICP: null },
      conditions: [
        "Product shipped within 2 business days",
        "Buyer confirms receipt and condition",
        "Product matches specifications"
      ],
      autoRelease: true,
      autoReleaseDelay: 72, // 72 hours
      expiryDays: 30
    };

    const result = await escrowActor.createEscrow(escrowRequest);
    if ('ok' in result) {
      setEscrowData(result.ok);
    }
  } catch (error) {
    console.error('Failed to create escrow:', error);
  }
};

// Get user's escrows
const getUserEscrows = async () => {
  try {
    const result = await escrowActor.getDemoUserEscrows('buyer');
    if ('ok' in result) {
      setEscrows(result.ok);
    }
  } catch (error) {
    console.error('Failed to get escrows:', error);
  }
};

// Create dispute
const createDispute = async (escrowId: string, reason: string, description: string) => {
  try {
    const disputeRequest = {
      escrowId,
      reason,
      description,
      evidence: [{
        id: 'evidence_1',
        submittedAt: Date.now() * 1000000, // Convert to nanoseconds
      }]
    };

    const result = await escrowActor.createDispute(disputeRequest);
    if ('ok' in result) {
      setDispute(result.ok);
    }
  } catch (error) {
    console.error('Failed to create dispute:', error);
  }
};
```

## 🎯 Expected Test Results

### Successful Deployment
```bash
$ dfx deploy escrow
Deploying: escrow
escrow canister created with canister id: xyz456-ghi789...
Building canister 'escrow'.
Installed code for canister escrow

$ dfx canister call escrow healthCheck
("Escrow canister is running. Total escrows: 3, Active disputes: 1")
```

### Demo Escrows Test
```bash
$ dfx canister call escrow getDemoUserEscrows '("buyer")'
(
  variant {
    ok = vec {
      record {
        id = "escrow_[timestamp]";
        orderId = "ord_demo_gold";
        buyerId = "user_buyer_demo";
        sellerId = "user_seller_demo";
        amount = 278.57 : float64;
        tokenType = variant { ICP };
        status = variant { Active };
        autoRelease = true;
        // ... more fields
      };
      // ... more escrows
    };
  }
)
```

### System Stats Test
```bash
$ dfx canister call escrow getEscrowStats
(
  record {
    totalEscrows = 3 : nat;
    activeEscrows = 1 : nat;
    completedEscrows = 1 : nat;
    disputedEscrows = 1 : nat;
    totalVolume = 5139.43 : float64;
    averageEscrowAmount = 1713.14 : float64;
    successRate = 66.67 : float64;
    averageResolutionTime = 48 : int;
  }
)
```

## 🔧 Integration with Other Canisters

### Marketplace Integration
The escrow system integrates with your marketplace for secure transactions:

```motoko
// In marketplace canister, when order is placed:
public func placeOrderWithEscrow(orderRequest: OrderRequest): async Result<Order, MarketplaceError> {
  // ... create order logic ...
  
  // Create escrow agreement
  let escrowRequest = {
    orderId = order.id;
    buyerId = order.buyerId;
    sellerId = order.sellerId;
    amount = order.total;
    // ... escrow details
  };
  
  // Call escrow canister to create agreement
  // let escrowResult = await EscrowCanister.createEscrow(escrowRequest);
}
```

### Wallet Integration
The escrow system works with wallet for fund management:

```motoko
// In wallet canister, lock funds for escrow:
public func lockFundsForEscrow(escrowId: Text, amount: Float): async Result<(), WalletError> {
  // Lock specified amount in user's wallet
  // Mark as unavailable for other transactions
  // Associate with escrow ID
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Deployment Fails**
```bash
# Clean and rebuild
dfx stop
dfx start --background --clean
dfx deploy escrow
```

2. **Type Import Errors**
```bash
# Ensure shared types are updated
# Check that all imports are correct
# Verify file paths match exactly
```

3. **Function Call Errors**
```bash
# Check canister logs
dfx canister logs escrow

# Verify canister status
dfx canister status escrow
```

4. **Demo Data Issues**
```bash
# Reset demo data by redeploying
dfx deploy escrow --mode=reinstall
```

## 📊 Demo Data Features

Your escrow system includes comprehensive demo data:

### Demo Escrows
- **Gold Purchase Escrow** - Active escrow with pending conditions
- **Silver Purchase Escrow** - Successfully completed escrow
- **Wheat Purchase Escrow** - Disputed escrow with arbitration

### Demo Dispute
- **Quality Dispute** - Real-world dispute scenario with evidence
- **Evidence System** - Photo and document evidence submission
- **Arbitration Process** - Third-party dispute resolution

### Security Features
- **Multi-party Authorization** - Buyer, seller, and arbitrator roles
- **Condition-based Release** - Funds only released when conditions met
- **Time-locked Security** - Auto-expiry and auto-release mechanisms
- **Dispute Protection** - Comprehensive dispute resolution system

## ✅ Success Checklist

After successful deployment, you should be able to:

- [ ] Deploy escrow canister without errors
- [ ] Call `healthCheck()` successfully
- [ ] Get demo escrows with `getDemoUserEscrows('buyer')`
- [ ] See system stats showing 3 escrows and 1 dispute
- [ ] Create new escrow agreements
- [ ] Fund escrows and fulfill conditions
- [ ] Create and resolve disputes
- [ ] Process auto-releases and expired escrows
- [ ] Frontend can connect to escrow canister

## 🔐 Security Features Implemented

### Multi-layer Security
- **Fund Locking** - Buyer funds locked until conditions met
- **Condition Verification** - Multiple parties can verify delivery
- **Time Constraints** - Automatic expiry prevents indefinite locks
- **Dispute Resolution** - Third-party arbitration for conflicts
- **Emergency Controls** - Admin override for critical situations

### Trust Mechanisms
- **Reputation System** - Track user escrow success rates
- **Evidence System** - Document and photo evidence submission
- **Automatic Processing** - Reduce manual intervention needs
- **Transparency** - All parties can view escrow progress

## 🚀 Next Steps

Once the Escrow canister is working:

1. **Test All Functions** - Verify creation, funding, release, and disputes
2. **Frontend Integration** - Connect escrow features to your frontend
3. **End-to-end Testing** - Test complete purchase flow with escrow
4. **Security Validation** - Verify all security mechanisms work
5. **Demo Preparation** - Ensure demo scenarios work smoothly

## 📈 Advanced Features

### Smart Contract Automation
- **Condition-based Logic** - Automatic processing when conditions met
- **Multi-signature Support** - Require multiple approvals
- **Time-based Triggers** - Auto-release after specified periods
- **Event Logging** - Comprehensive audit trail

### AI-Enhanced Security
- **Fraud Detection** - Pattern recognition for suspicious activities
- **Risk Assessment** - Evaluate transaction risk levels
- **Automated Insights** - Predictive dispute prevention
- **Market Analysis** - Fair value verification

The Escrow canister provides enterprise-grade security for your commodity trading platform, ensuring safe transactions and building trust between buyers and sellers!dBy: 'user_buyer_demo',
        evidenceType: { Image: null },
        title: 'Product Quality Issue',
        description: 'Photos showing product condition',
        fileUrl: ['/evidence/quality-issue.jpg'],
        fileHash: ['0xabc123...'],
        submitte