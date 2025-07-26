import Time "mo:base/Time";
import SharedTypes "../shared/types";

module {
    public type UserId = SharedTypes.UserId;
    public type Email = SharedTypes.Email;
    public type UserRole = SharedTypes.UserRole;
    public type KYCStatus = SharedTypes.KYCStatus;
    public type AuthProvider = SharedTypes.AuthProvider;
    public type UserError = SharedTypes.UserError;
    public type Result<T, E> = SharedTypes.Result<T, E>;
    public type Time = SharedTypes.Time;
    public type Principal = SharedTypes.Principal;

    // User Profile Types (matches frontend profile pages)
    public type UserProfile = {
        id: UserId;
        principal: Principal;
        email: ?Email;
        firstName: ?Text;
        lastName: ?Text;
        role: UserRole;
        authProvider: AuthProvider;
        kycStatus: KYCStatus;
        verified: Bool;
        avatar: ?Text;
        bio: ?Text;
        location: ?Text;
        website: ?Text;
        company: ?Text;
        phone: ?Text;
        joinDate: Time;
        lastActive: Time;
        // Stats (for frontend display)
        totalTrades: Nat;
        rating: Float;
        successRate: Float;
    };

    // Registration Request (from frontend registration)
    public type RegisterRequest = {
        email: ?Email;
        role: UserRole;
        authProvider: AuthProvider;
        agreeTerms: Bool;
    };

    // Login Request (from frontend login)
    public type LoginRequest = {
        email: ?Email;
        authProvider: AuthProvider;
    };

    // KYC Information (from frontend KYC pages)
    public type KYCInfo = {
        // Personal Information
        firstName: Text;
        lastName: Text;
        dateOfBirth: Text;
        country: Text;
        // Contact Information
        address: Text;
        city: Text;
        postalCode: Text;
        phoneNumber: Text;
        // Document Information
        idType: Text;
        documentsUploaded: Bool;
        submissionDate: Time;
    };

    // Profile Update Request (from frontend profile pages)
    public type ProfileUpdateRequest = {
        firstName: ?Text;
        lastName: ?Text;
        email: ?Email;
        phone: ?Text;
        bio: ?Text;
        location: ?Text;
        website: ?Text;
        company: ?Text;
        avatar: ?Text;
    };

    // User Preferences (from frontend settings)
    public type UserPreferences = {
        // Notifications
        emailNotifications: Bool;
        pushNotifications: Bool;
        marketAlerts: Bool;
        priceAlerts: Bool;
        orderUpdates: Bool;
        newsletter: Bool;
        // Privacy
        publicProfile: Bool;
        showTradingStats: Bool;
        allowDirectMessages: Bool;
        // Security
        twoFactorAuth: Bool;
        loginAlerts: Bool;
    };

    // Session Information
    public type UserSession = {
        userId: UserId;
        principal: Principal;
        role: UserRole;
        loginTime: Time;
        lastActivity: Time;
        active: Bool;
    };

    // For demo users (matching frontend demo users)
    public type DemoUser = {
        email: Email;
        password: Text;
        profile: UserProfile;
    };
}