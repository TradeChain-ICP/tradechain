import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

import Types "types";
import Utils "utils";

actor UserManagement {
    // Type imports
    type UserProfile = Types.UserProfile;
    type UserRole = Types.UserRole;
    type KYCStatus = Types.KYCStatus;
    type KYCInfo = Types.KYCInfo;
    type UserError = Types.UserError;
    type RegisterRequest = Types.RegisterRequest;
    type LoginRequest = Types.LoginRequest;
    type ProfileUpdateRequest = Types.ProfileUpdateRequest;
    type UserPreferences = Types.UserPreferences;
    type UserSession = Types.UserSession;
    type Result<T, E> = Types.Result<T, E>;

    // Storage
    private stable var userEntries: [(Text, UserProfile)] = [];
    private stable var kycEntries: [(Text, KYCInfo)] = [];
    private stable var preferencesEntries: [(Text, UserPreferences)] = [];
    private stable var sessionEntries: [(Text, UserSession)] = [];

    private var users = HashMap.HashMap<Text, UserProfile>(10, Text.equal, Text.hash);
    private var kycData = HashMap.HashMap<Text, KYCInfo>(10, Text.equal, Text.hash);
    private var userPreferences = HashMap.HashMap<Text, UserPreferences>(10, Text.equal, Text.hash);
    private var activeSessions = HashMap.HashMap<Text, UserSession>(10, Text.equal, Text.hash);

    // Demo user credentials for testing
    private let demoCredentials = HashMap.HashMap<Text, Text>(3, Text.equal, Text.hash);

    // Initialize system
    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
        kycEntries := Iter.toArray(kycData.entries());
        preferencesEntries := Iter.toArray(userPreferences.entries());
        sessionEntries := Iter.toArray(activeSessions.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter<Text, UserProfile>(userEntries.vals(), userEntries.size(), Text.equal, Text.hash);
        kycData := HashMap.fromIter<Text, KYCInfo>(kycEntries.vals(), kycEntries.size(), Text.equal, Text.hash);
        userPreferences := HashMap.fromIter<Text, UserPreferences>(preferencesEntries.vals(), preferencesEntries.size(), Text.equal, Text.hash);
        activeSessions := HashMap.fromIter<Text, UserSession>(sessionEntries.vals(), sessionEntries.size(), Text.equal, Text.hash);
        
        // Initialize demo users
        initializeDemoUsers();
    };

    // Initialize demo users and credentials
    private func initializeDemoUsers() {
        // Set up demo credentials
        demoCredentials.put("buyer@demo.com", "demo123");
        demoCredentials.put("seller@demo.com", "demo123");
        demoCredentials.put("admin@demo.com", "demo123");

        Utils.logInfo("Demo credentials initialized");
    };

    // Initialize on deployment
    private func initialize() {
        initializeDemoUsers();
    };

    // Call initialize on first deployment
    initialize();

    // PUBLIC FUNCTIONS (Frontend Integration)

    // 1. REGISTRATION (matches frontend register page)
    public shared(msg) func registerUser(request: RegisterRequest): async Result<UserProfile, UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Registration attempt for: " # userId);

        // Check if user already exists
        switch (users.get(userId)) {
            case (?_existingUser) {
                #err(#UserAlreadyExists)
            };
            case null {
                // Validate registration data
                if (not Utils.validateRegistration(request.email, request.role, request.agreeTerms)) {
                    return #err(#InvalidInput("Invalid registration data"));
                };

                // Create user profile
                let profile = Utils.createDefaultProfile(
                    caller,
                    request.role,
                    request.authProvider,
                    request.email
                );

                // Store user
                users.put(userId, profile);

                // Create default preferences
                let defaultPrefs: UserPreferences = {
                    emailNotifications = true;
                    pushNotifications = true;
                    marketAlerts = true;
                    priceAlerts = true;
                    orderUpdates = true;
                    newsletter = false;
                    publicProfile = true;
                    showTradingStats = true;
                    allowDirectMessages = true;
                    twoFactorAuth = false;
                    loginAlerts = true;
                };
                userPreferences.put(userId, defaultPrefs);

                Utils.logInfo("User registered successfully: " # userId);
                #ok(profile)
            };
        }
    };

    // 2. LOGIN (matches frontend login page)
    public shared(msg) func loginUser(_request: LoginRequest): async Result<UserProfile, UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Login attempt for: " # userId);

        switch (users.get(userId)) {
            case (?profile) {
                // Update last active time
                let updatedProfile = {
                    profile with
                    lastActive = Time.now();
                };
                users.put(userId, updatedProfile);

                // Create session
                let session: UserSession = {
                    userId = userId;
                    principal = caller;
                    role = profile.role;
                    loginTime = Time.now();
                    lastActivity = Time.now();
                    active = true;
                };
                activeSessions.put(userId, session);

                Utils.logInfo("User logged in successfully: " # userId);
                #ok(updatedProfile)
            };
            case null {
                #err(#UserNotFound)
            };
        }
    };

    // 3. DEMO LOGIN (for frontend demo users)
    public func loginDemo(email: Text, password: Text, role: UserRole): async Result<UserProfile, UserError> {
        Utils.logInfo("Demo login attempt for: " # email);

        // Check demo credentials
        switch (demoCredentials.get(email)) {
            case (?storedPassword) {
                if (storedPassword == password) {
                    // Find demo user profile
                    let userType = switch (role) {
                        case (#Buyer) { "buyer" };
                        case (#Seller) { "seller" };
                        case (#Admin) { "admin" };
                    };

                    // Use anonymous principal for demo
                    let dummyPrincipal = Utils.getAnonymousPrincipal();

                    switch (Utils.createDemoUserProfile(userType, dummyPrincipal)) {
                        case (?profile) {
                            // Update last active
                            let updatedProfile = {
                                profile with
                                lastActive = Time.now();
                            };
                            users.put(profile.id, updatedProfile);

                            Utils.logInfo("Demo user logged in: " # email);
                            #ok(updatedProfile)
                        };
                        case null {
                            #err(#UserNotFound)
                        };
                    }
                } else {
                    #err(#InvalidCredentials)
                }
            };
            case null {
                #err(#UserNotFound)
            };
        }
    };

    // 4. GET USER PROFILE (for frontend profile pages)
    public shared(msg) func getUserProfile(): async Result<UserProfile, UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        switch (users.get(userId)) {
            case (?profile) { #ok(profile) };
            case null { #err(#UserNotFound) };
        }
    };

    // 5. UPDATE PROFILE (matches frontend profile page)
    public shared(msg) func updateProfile(updates: ProfileUpdateRequest): async Result<UserProfile, UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        switch (users.get(userId)) {
            case (?currentProfile) {
                let updatedProfile = Utils.updateProfile(currentProfile, updates);
                users.put(userId, updatedProfile);
                Utils.logInfo("Profile updated for: " # userId);
                #ok(updatedProfile)
            };
            case null {
                #err(#UserNotFound)
            };
        }
    };

    // 6. KYC SUBMISSION (matches frontend KYC pages)
    public shared(msg) func submitKYC(kycInfo: KYCInfo): async Result<(), UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        switch (users.get(userId)) {
            case (?profile) {
                // Store KYC information
                kycData.put(userId, kycInfo);

                // Update user profile KYC status
                let updatedProfile = {
                    profile with
                    kycStatus = #Pending;
                    lastActive = Time.now();
                };
                users.put(userId, updatedProfile);

                Utils.logInfo("KYC submitted for: " # userId);
                #ok(())
            };
            case null {
                #err(#UserNotFound)
            };
        }
    };

    // 7. APPROVE KYC (admin function)
    public shared(msg) func approveKYC(targetUserId: Text): async Result<(), UserError> {
        let caller = msg.caller;
        let adminUserId = Utils.generateUserId(caller);

        // Check if caller is admin
        switch (users.get(adminUserId)) {
            case (?adminProfile) {
                if (adminProfile.role != #Admin) {
                    return #err(#Unauthorized);
                };

                // Update target user's KYC status
                switch (users.get(targetUserId)) {
                    case (?userProfile) {
                        let updatedProfile = {
                            userProfile with
                            kycStatus = #Verified;
                            verified = true;
                        };
                        users.put(targetUserId, updatedProfile);
                        Utils.logInfo("KYC approved for: " # targetUserId);
                        #ok(())
                    };
                    case null {
                        #err(#UserNotFound)
                    };
                }
            };
            case null {
                #err(#Unauthorized)
            };
        }
    };

    // 8. GET USER PREFERENCES (matches frontend settings)
    public shared(msg) func getUserPreferences(): async Result<UserPreferences, UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        switch (userPreferences.get(userId)) {
            case (?prefs) { #ok(prefs) };
            case null {
                // Return default preferences if none exist
                let defaultPrefs: UserPreferences = {
                    emailNotifications = true;
                    pushNotifications = true;
                    marketAlerts = true;
                    priceAlerts = true;
                    orderUpdates = true;
                    newsletter = false;
                    publicProfile = true;
                    showTradingStats = true;
                    allowDirectMessages = true;
                    twoFactorAuth = false;
                    loginAlerts = true;
                };
                #ok(defaultPrefs)
            };
        }
    };

    // 9. UPDATE PREFERENCES (matches frontend settings)
    public shared(msg) func updatePreferences(prefs: UserPreferences): async Result<(), UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        // Verify user exists
        switch (users.get(userId)) {
            case (?_) {
                userPreferences.put(userId, prefs);
                Utils.logInfo("Preferences updated for: " # userId);
                #ok(())
            };
            case null {
                #err(#UserNotFound)
            };
        }
    };

    // 10. LOGOUT
    public shared(msg) func logout(): async Result<(), UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        // Remove active session
        activeSessions.delete(userId);
        Utils.logInfo("User logged out: " # userId);
        #ok(())
    };

    // 11. GET ALL USERS (admin function)
    public shared(msg) func getAllUsers(): async Result<[UserProfile], UserError> {
        let caller = msg.caller;
        let adminUserId = Utils.generateUserId(caller);

        // Check if caller is admin
        switch (users.get(adminUserId)) {
            case (?adminProfile) {
                if (adminProfile.role != #Admin) {
                    return #err(#Unauthorized);
                };

                let allUsers = Iter.toArray(users.vals());
                #ok(allUsers)
            };
            case null {
                #err(#Unauthorized)
            };
        }
    };

    // 12. CHECK USER ROLE (for frontend role guards)
    public shared(msg) func getUserRole(): async Result<UserRole, UserError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        switch (users.get(userId)) {
            case (?profile) { #ok(profile.role) };
            case null { #err(#UserNotFound) };
        }
    };

    // UTILITY FUNCTIONS

    // Get system stats
    public query func getSystemStats(): async {
        totalUsers: Nat;
        totalBuyers: Nat;
        totalSellers: Nat;
        verifiedUsers: Nat;
        pendingKYC: Nat;
    } {
        let allUsers = Iter.toArray(users.vals());
        var totalBuyers = 0;
        var totalSellers = 0;
        var verifiedUsers = 0;
        var pendingKYC = 0;

        for (user in allUsers.vals()) {
            switch (user.role) {
                case (#Buyer) { totalBuyers += 1; };
                case (#Seller) { totalSellers += 1; };
                case (#Admin) {};
            };

            if (user.verified) {
                verifiedUsers += 1;
            };

            if (user.kycStatus == #Pending) {
                pendingKYC += 1;
            };
        };

        {
            totalUsers = allUsers.size();
            totalBuyers = totalBuyers;
            totalSellers = totalSellers;
            verifiedUsers = verifiedUsers;
            pendingKYC = pendingKYC;
        }
    };

    // Health check
    public query func healthCheck(): async Text {
        "UserManagement canister is running. Total users: " # debug_show(users.size())
    };
}