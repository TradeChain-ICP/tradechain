// backend/src/user_management/types.mo

import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Blob "mo:base/Blob";

module {
    
    // User role enumeration - STABLE
    public type UserRole = {
        #buyer;
        #seller;
    };

    // KYC status enumeration - STABLE
    public type KYCStatus = {
        #pending;
        #inReview;
        #completed;
        #rejected;
    };

    // Authentication method enumeration - STABLE
    public type AuthMethod = {
        #nfid;
        #internetIdentity;
    };

    // Token types supported by the wallet - STABLE
    public type TokenType = {
        #ICP;
        #USD;
        #Naira;
        #Euro;
    };

    // Transaction types - STABLE
    public type TransactionType = {
        #transfer;
        #deposit;
        #withdrawal;
        #escrow;
        #payment;
        #refund;
    };

    // Transaction status - STABLE
    public type TransactionStatus = {
        #pending;
        #completed;
        #failed;
        #cancelled;
    };

    // Enhanced user type with profile data - MADE STABLE
    public type User = {
        id: Text;
        principalId: Text; // Changed from Principal to Text - STABLE
        firstName: Text;
        lastName: Text;
        email: Text;
        phone: ?Text;
        profilePicture: ?[Nat8]; // Changed from ?Blob to ?[Nat8] - STABLE
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

    // Wallet type - MADE STABLE
    public type Wallet = {
        owner: Text; // Changed from Principal to Text - STABLE
        icpBalance: Nat;
        usdBalance: Nat;
        nairaBalance: Nat;
        euroBalance: Nat;
        createdAt: Int;
        lastTransactionAt: Int;
        isLocked: Bool;
        totalTransactions: Nat;
    };

    // Transaction record - MADE STABLE
    public type Transaction = {
        id: Text;
        fromPrincipal: Text; // Changed from Principal to Text - STABLE
        toPrincipal: Text; // Changed from Principal to Text - STABLE
        amount: Nat;
        tokenType: TokenType;
        transactionType: TransactionType;
        status: TransactionStatus;
        createdAt: Int;
        completedAt: ?Int;
        memo: ?Text;
    };

    // Document type for KYC - MADE STABLE
    public type Document = {
        id: Text;
        userId: Text;
        docType: Text; // "id_front", "id_back", "selfie", "proof_address"
        fileName: Text;
        content: [Nat8]; // Changed from Blob to [Nat8] - STABLE
        mimeType: Text;
        uploadedAt: Int;
        verified: Bool;
    };

    // User profile update request - MADE STABLE
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

    // User registration request - MADE STABLE
    public type UserRegistration = {
        authMethod: AuthMethod;
        firstName: Text;
        lastName: Text;
        email: Text;
        phone: ?Text;
        profilePicture: ?[Nat8]; // Changed from ?Blob to ?[Nat8] - STABLE
    };

    // Role selection with profile completion - STABLE
    public type RoleSelection = {
        role: UserRole;
        bio: ?Text;
        location: ?Text;
        company: ?Text;
        website: ?Text;
    };

    // Balance summary - STABLE
    public type BalanceSummary = {
        icp: Nat;
        usd: Nat;
        naira: Nat;
        euro: Nat;
        totalValueUsd: Nat;
    };

    // Transfer request - MADE STABLE
    public type TransferRequest = {
        to: Text; // Changed from Principal to Text - STABLE
        amount: Nat;
        tokenType: TokenType;
        memo: ?Text;
    };

    // Error types - STABLE
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
        #DocumentNotFound;
        #DocumentUploadFailed;
    };

    // Query filters - STABLE
    public type UserFilter = {
        role: ?UserRole;
        kycStatus: ?KYCStatus;
        verified: ?Bool;
    };

    // Pagination - STABLE
    public type Pagination = {
        offset: Nat;
        limit: Nat;
    };

    // User statistics - STABLE
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

    // Wallet statistics - STABLE
    public type WalletStats = {
        totalWallets: Nat;
        totalTransactions: Nat;
        totalIcpLocked: Nat;
        totalUsdLocked: Nat;
        totalNairaLocked: Nat;
        totalEuroLocked: Nat;
    };

    // Session info - MADE STABLE
    public type SessionInfo = {
        user: User;
        isValid: Bool;
        expiresAt: ?Int;
    };

    // Document upload response - STABLE
    public type DocumentUploadResponse = {
        documentId: Text;
        status: Text;
        uploadedAt: Int;
    };

    // KYC submission response - STABLE
    public type KYCSubmissionResponse = {
        referenceId: Text;
        status: KYCStatus;
        submittedAt: Int;
        estimatedCompletion: ?Int;
    };

    // Transaction page for pagination - STABLE
    public type TransactionPage = {
        transactions: [Transaction];
        total: Nat;
        hasMore: Bool;
    };
}