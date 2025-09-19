// backend/src/user_management/migration.mo

import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

import Types "./types";

module {
    
    // CORRECT OLD USER TYPE (Version 1 - what's actually deployed on mainnet)
    // This matches exactly the initial original deployed canister code
    public type UserV1 = {
        id: Text;
        principalId: Text;
        firstName: Text;
        lastName: Text;
        role: ?Types.UserRole;
        authMethod: Types.AuthMethod;
        kycStatus: Types.KYCStatus;
        kycSubmittedAt: ?Int;
        verified: Bool;
        walletAddress: Text;
        joinedAt: Int;
        lastActive: Int;
        // NOTE: NO EMAIL FIELD - this was not in your original deployed code
        // NOTE: NO PHONE, PROFILE PICTURE, BIO, LOCATION, COMPANY, WEBSITE - these are all new
    };

    // Migration function from V1 to V2 (current with all new fields)
    public func migrateUserFromV1ToV2(oldUser: UserV1): Types.User {
        {
            id = oldUser.id;
            principalId = oldUser.principalId;
            firstName = oldUser.firstName;
            lastName = oldUser.lastName;
            email = ""; // NEW field - set to empty string for migrated users (they'll need to update)
            phone = null; // NEW field
            profilePicture = null; // NEW field
            role = oldUser.role;
            authMethod = oldUser.authMethod;
            kycStatus = oldUser.kycStatus;
            kycSubmittedAt = oldUser.kycSubmittedAt;
            verified = oldUser.verified;
            walletAddress = oldUser.walletAddress;
            bio = null; // NEW field
            location = null; // NEW field
            company = null; // NEW field
            website = null; // NEW field
            joinedAt = oldUser.joinedAt;
            lastActive = oldUser.lastActive;
        }
    };

    // Helper to check if migration is needed
    public func needsMigration(userEntries: [(Principal, Types.User)]): Bool {
        userEntries.size() == 0
    };

    // Batch migration function
    public func migrateAllUsers(oldUserEntries: [(Principal, UserV1)]): [(Principal, Types.User)] {
        Debug.print("🔄 Starting migration of " # debug_show(oldUserEntries.size()) # " users from V1 to V2");
        
        Array.map<(Principal, UserV1), (Principal, Types.User)>(
            oldUserEntries,
            func((principal, oldUser)) {
                let newUser = migrateUserFromV1ToV2(oldUser);
                Debug.print("✅ Migrated user: " # oldUser.id # " (added email, phone, profile fields)");
                (principal, newUser)
            }
        )
    };

    // Migration status check
    public func getMigrationInfo(): {version: Nat; description: Text} {
        {
            version = 2;
            description = "Added email, phone, profilePicture, bio, location, company, website fields to User type. Added KYC document handling system.";
        }
    };

    // Check if a user needs profile completion (missing email)
    public func userNeedsProfileCompletion(user: Types.User): Bool {
        user.email == ""
    };

    // Get migration summary for admin purposes
    public func getMigrationSummary(
        totalUsers: Nat,
        usersWithEmail: Nat,
        usersWithPhone: Nat,
        usersWithProfilePicture: Nat
    ): Text {
        let emailCompletion = if (totalUsers > 0) {
            (usersWithEmail * 100) / totalUsers
        } else { 0 };
        
        let phoneCompletion = if (totalUsers > 0) {
            (usersWithPhone * 100) / totalUsers
        } else { 0 };
        
        let profilePictureCompletion = if (totalUsers > 0) {
            (usersWithProfilePicture * 100) / totalUsers
        } else { 0 };

        "Migration Summary: " #
        "Total Users: " # debug_show(totalUsers) # ", " #
        "Email Completion: " # debug_show(emailCompletion) # "%, " #
        "Phone Completion: " # debug_show(phoneCompletion) # "%, " #
        "Profile Picture Completion: " # debug_show(profilePictureCompletion) # "%"
    };

    // Helper to identify users that need profile updates
    public func getUsersNeedingProfileUpdate(users: [(Principal, Types.User)]): [(Principal, Types.User)] {
        Array.filter<(Principal, Types.User)>(users, func((principal, user)) {
            userNeedsProfileCompletion(user)
        })
    };

    // Version compatibility check
    public func isCompatibleVersion(version: Nat): Bool {
        version >= 1 and version <= 2
    };

    // Get migration steps for UI display
    public func getMigrationSteps(): [Text] {
        [
            "✅ V1 to V2: Added user profile fields (email, phone, bio, etc.)",
            "✅ V2: Added KYC document handling system",
            "✅ V2: Enhanced wallet integration",
            "🔄 Future: Additional features planned"
        ]
    };
}