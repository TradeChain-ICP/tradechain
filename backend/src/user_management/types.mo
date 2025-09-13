// backend/src/user_management/types.mo

import Time "mo:base/Time";

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

    // Main user type
    public type User = {
        id: Text;
        principalId: Text;
        firstName: Text;
        lastName: Text;
        role: ?UserRole;
        authMethod: AuthMethod;
        kycStatus: KYCStatus;
        kycSubmittedAt: ?Int;
        verified: Bool;
        walletAddress: Text;
        joinedAt: Int;
        lastActive: Int;
    };

    // User profile update request
    public type UserProfileUpdate = {
        firstName: Text;
        lastName: Text;
    };

    // User registration request
    public type UserRegistration = {
        authMethod: AuthMethod;
        firstName: Text;
        lastName: Text;
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
    };

    // Session info
    public type SessionInfo = {
        user: User;
        isValid: Bool;
        expiresAt: ?Int;
    };
}