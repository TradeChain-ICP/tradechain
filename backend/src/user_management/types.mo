// backend/src/user_management/types.mo

import _Time "mo:base/Time";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";

module {
    
    // User role enumeration
    public type UserRole = {
        #buyer;
        #seller;
    };

    // KYC status enumeration
    public type KYCStatus = {
        #pending;
        #inReview;
        #completed;
        #rejected;
    };

    // Authentication method enumeration
    public type AuthMethod = {
        #nfid;
        #internetIdentity;
    };

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

    // Enhanced user type with profile data
    public type User = {
        id: Text;
        principalId: Text;
        firstName: Text;
        lastName: Text;
        email: Text;
        phone: ?Text;
        profilePicture: ?Blob;
        role: ?UserRole;
        authMethod: AuthMethod;
        kycStatus: KYCStatus;
        kycSubmittedAt: ?Int;
        verified: Bool;
        walletAddress: Text;
        bio: ?Text;
        location: ?Text;
        company: ?Text;
        website: ?Text;
        joinedAt: Int;
        lastActive: Int;
    };

    // Wallet type
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

    // User profile update request
    public type UserProfileUpdate = {
        firstName: Text;
        lastName: Text;
        email: Text;
        phone: ?Text;
        bio: ?Text;
        location: ?Text;
        company: ?Text;
        website: ?Text;
    };

    // User registration request
    public type UserRegistration = {
        authMethod: AuthMethod;
        firstName: Text;
        lastName: Text;
        email: Text;
        phone: ?Text;
        profilePicture: ?Blob;
    };

    // Role selection with profile completion
    public type RoleSelection = {
        role: UserRole;
        bio: ?Text;
        location: ?Text;
        company: ?Text;
        website: ?Text;
    };

    // Balance summary
    public type BalanceSummary = {
        icp: Nat;
        usd: Nat;
        naira: Nat;
        euro: Nat;
        totalValueUsd: Nat;
    };

    // Transfer request
    public type TransferRequest = {
        to: Principal;
        amount: Nat;
        tokenType: TokenType;
        memo: ?Text;
    };

    // Error types
    public type UserError = {
        #UserNotFound;
        #UserAlreadyExists;
        #RoleAlreadySet;
        #InvalidRole;
        #KYCNotCompleted;
        #Unauthorized;
        #ValidationError: Text;
        #WalletNotFound;
        #InsufficientBalance;
        #WalletLocked;
        #InvalidAmount;
        #TransferFailed;
    };

    // Query filters
    public type UserFilter = {
        role: ?UserRole;
        kycStatus: ?KYCStatus;
        verified: ?Bool;
    };

    // Pagination
    public type Pagination = {
        offset: Nat;
        limit: Nat;
    };

    // User statistics
    public type UserStats = {
        totalUsers: Nat;
        verifiedUsers: Nat;
        kycPending: Nat;
        kycInReview: Nat;
        kycCompleted: Nat;
        kycRejected: Nat;
        buyerCount: Nat;
        sellerCount: Nat;
        totalWallets: Nat;
        totalTransactions: Nat;
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

    // Session info
    public type SessionInfo = {
        user: User;
        isValid: Bool;
        expiresAt: ?Int;
    };

    // Transaction page for pagination
    public type TransactionPage = {
        transactions: [Transaction];
        total: Nat;
        hasMore: Bool;
    };

    // KYC submission response (without document dependencies)
    public type KYCSubmissionResponse = {
        referenceId: Text;
        status: KYCStatus;
        submittedAt: Int;
        estimatedCompletion: ?Int;
    };
}