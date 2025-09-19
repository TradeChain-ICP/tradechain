// backend/src/user_management/migration.mo

import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";

import Types "./types";

module {
    
    // CORRECT OLD USER TYPE (Version 1 - what's actually deployed on mainnet)
    // This matches exactly your original deployed canister code
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
    };

    // Migration function from V1 to V2 (current)
    public func migrateUserFromV1ToV2(oldUser: UserV1): Types.User {
        {
            id = oldUser.id;
            principalId = oldUser.principalId;
            firstName = oldUser.firstName;
            lastName = oldUser.lastName;
            email = ""; // NEW field - set to empty string for migrated users
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
        Debug.print("Starting migration of " # debug_show(oldUserEntries.size()) # " users");
        
        Array.map<(Principal, UserV1), (Principal, Types.User)>(
            oldUserEntries,
            func((principal, oldUser)) {
                let newUser = migrateUserFromV1ToV2(oldUser);
                Debug.print("Migrated user: " # oldUser.id);
                (principal, newUser)
            }
        )
    };

    // Migration status check
    public func getMigrationInfo(): {version: Nat; description: Text} {
        {
            version = 2;
            description = "Added email, phone, profilePicture, bio, location, company, website fields to User type";
        }
    };
}