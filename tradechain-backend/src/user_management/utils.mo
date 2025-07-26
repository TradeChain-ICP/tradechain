import Time "mo:base/Time";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Types "types";

module {
    public type UserProfile = Types.UserProfile;
    public type UserId = Types.UserId;
    public type UserRole = Types.UserRole;
    public type Principal = Types.Principal;

    // Get anonymous principal for demo users
    public func getAnonymousPrincipal(): Principal {
        Principal.fromText("2vxsx-fae")  // anonymous principal
    };

    // Generate unique user ID from principal
    public func generateUserId(principal: Principal): UserId {
        let principalText = Principal.toText(principal);
        // Simple ID generation - in production, use more sophisticated method
        "user_" # principalText
    };

    // Validate email format (basic validation)
    public func isValidEmail(email: Text): Bool {
        Text.contains(email, #char '@') and Text.size(email) > 5
    };

    // Validate required fields for registration
    public func validateRegistration(email: ?Text, _role: UserRole, agreeTerms: Bool): Bool {
        switch (email) {
            case null { true }; // Internet Identity doesn't require email
            case (?e) { isValidEmail(e) and agreeTerms };
        }
    };

    // Create default user profile
    public func createDefaultProfile(
        principal: Principal,
        role: UserRole,
        authProvider: Types.AuthProvider,
        email: ?Text
    ): UserProfile {
        let now = Time.now();
        {
            id = generateUserId(principal);
            principal = principal;
            email = email;
            firstName = null;
            lastName = null;
            role = role;
            authProvider = authProvider;
            kycStatus = #NotStarted;
            verified = false;
            avatar = null;
            bio = null;
            location = null;
            website = null;
            company = null;
            phone = null;
            joinDate = now;
            lastActive = now;
            totalTrades = 0;
            rating = 0.0;
            successRate = 0.0;
        }
    };

    // Update profile with new information
    public func updateProfile(
        currentProfile: UserProfile,
        updates: Types.ProfileUpdateRequest
    ): UserProfile {
        {
            currentProfile with
            firstName = switch (updates.firstName) { case null { currentProfile.firstName }; case (?v) { ?v } };
            lastName = switch (updates.lastName) { case null { currentProfile.lastName }; case (?v) { ?v } };
            email = switch (updates.email) { case null { currentProfile.email }; case (?v) { ?v } };
            phone = switch (updates.phone) { case null { currentProfile.phone }; case (?v) { ?v } };
            bio = switch (updates.bio) { case null { currentProfile.bio }; case (?v) { ?v } };
            location = switch (updates.location) { case null { currentProfile.location }; case (?v) { ?v } };
            website = switch (updates.website) { case null { currentProfile.website }; case (?v) { ?v } };
            company = switch (updates.company) { case null { currentProfile.company }; case (?v) { ?v } };
            avatar = switch (updates.avatar) { case null { currentProfile.avatar }; case (?v) { ?v } };
            lastActive = Time.now();
        }
    };

    // Check if user has completed profile
    public func isProfileComplete(profile: UserProfile): Bool {
        switch (profile.firstName, profile.lastName, profile.email) {
            case (?_, ?_, ?_) { true };
            case _ { false };
        }
    };

    // Check if user can trade (verified and KYC approved)
    public func canTrade(profile: UserProfile): Bool {
        profile.verified and profile.kycStatus == #Verified
    };

    // Create demo user profiles (matching frontend demo users)
    public func createDemoUserProfile(userType: Text, dummyPrincipal: Principal): ?UserProfile {
        let now = Time.now();
        switch (userType) {
            case "buyer" {
                ?{
                    id = "user_buyer_demo";
                    principal = dummyPrincipal;
                    email = ?"buyer@demo.com";
                    firstName = ?"Alex";
                    lastName = ?"Johnson";
                    role = #Buyer;
                    authProvider = #Email;
                    kycStatus = #Verified;
                    verified = true;
                    avatar = ?"/placeholder.svg?height=40&width=40";
                    bio = ?"Experienced commodity trader with a focus on precious metals and agricultural products.";
                    location = ?"New York, NY";
                    website = ?"https://alexjohnson.com";
                    company = ?"Johnson Trading LLC";
                    phone = ?"+1 (555) 123-4567";
                    joinDate = now - (365 * 24 * 60 * 60 * 1000000000); // 1 year ago
                    lastActive = now;
                    totalTrades = 127;
                    rating = 4.8;
                    successRate = 98.5;
                }
            };
            case "seller" {
                ?{
                    id = "user_seller_demo";
                    principal = dummyPrincipal;
                    email = ?"seller@demo.com";
                    firstName = ?"Premium";
                    lastName = ?"Metals Co.";
                    role = #Seller;
                    authProvider = #Email;
                    kycStatus = #Verified;
                    verified = true;
                    avatar = ?"/placeholder.svg?height=40&width=40";
                    bio = ?"Leading supplier of precious metals with over 15 years of experience in the commodity trading industry.";
                    location = ?"New York, NY";
                    website = ?"https://premiummetals.com";
                    company = ?"Premium Metals Co.";
                    phone = ?"+1 (555) 987-6543";
                    joinDate = now - (365 * 24 * 60 * 60 * 1000000000); // 1 year ago
                    lastActive = now;
                    totalTrades = 1247;
                    rating = 4.9;
                    successRate = 99.2;
                }
            };
            case _ { null };
        }
    };

    // Log debug information
    public func logInfo(message: Text) {
        Debug.print("UserManagement: " # message);
    };
}