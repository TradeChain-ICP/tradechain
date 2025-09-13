// backend/src/wallet/types.mo

import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
    
    // Token types supported by the wallet
    public type TokenType = {
        #ICP;
        #USD;
        #Naira;
        #Euro;
    };

    // Transaction types
    public type TransactionType = {
        #transfer;
        #deposit;
        #withdrawal;
        #escrow;
        #payment;
        #refund;
    };

    // Transaction status
    public type TransactionStatus = {
        #pending;
        #completed;
        #failed;
        #cancelled;
    };

    // Main wallet type
    public type Wallet = {
        owner: Principal;
        icpBalance: Nat;
        usdBalance: Nat;
        nairaBalance: Nat;
        euroBalance: Nat;
        createdAt: Int;
        lastTransactionAt: Int;
        isLocked: Bool;
        totalTransactions: Nat;
    };

    // Transaction record
    public type Transaction = {
        id: Text;
        fromPrincipal: Principal;
        toPrincipal: Principal;
        amount: Nat;
        tokenType: TokenType;
        transactionType: TransactionType;
        status: TransactionStatus;
        createdAt: Int;
        completedAt: ?Int;
        memo: ?Text;
    };

    // Balance summary
    public type BalanceSummary = {
        icp: Nat;
        usd: Nat;
        naira: Nat;
        euro: Nat;
        totalValueUsd: Nat; // Calculated total value in USD
    };

    // Transfer request
    public type TransferRequest = {
        to: Principal;
        amount: Nat;
        tokenType: TokenType;
        memo: ?Text;
    };

    // Wallet statistics
    public type WalletStats = {
        totalWallets: Nat;
        totalTransactions: Nat;
        totalIcpLocked: Nat;
        totalUsdLocked: Nat;
        totalNairaLocked: Nat;
        totalEuroLocked: Nat;
    };

    // Error types
    public type WalletError = {
        #WalletNotFound;
        #InsufficientBalance;
        #WalletLocked;
        #InvalidAmount;
        #TransferFailed;
        #Unauthorized;
    };

    // Pagination for transaction history
    public type TransactionPage = {
        transactions: [Transaction];
        total: Nat;
        hasMore: Bool;
    };
}