// backend/src/user_management/migration.mo

import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
import _HashMap "mo:base/HashMap";
import _Iter "mo:base/Iter";

import Types "./types";

module {
    
    // OLD USER TYPE (Version 1 - what's currently deployed)
    public type UserV1 = {
        id: Text;
        principalId: Text;
        firstName: Text;
        lastName: Text;
        email: Text;
        role: ?Types.UserRole;
        authMethod: Types.AuthMethod;
        kycStatus: Types.KYCStatus;
        kycSubmittedAt: ?Int;
        verified: Bool;
        walletAddress: Text;
        joinedAt: Int;
        lastActive: Int;
    };

    // Migration function from V1 to V2 (current)
    public func migrateUserFromV1ToV2(oldUser: UserV1): Types.User {
        {
            id = oldUser.id;
            principalId = oldUser.principalId;
            firstName = oldUser.firstName;
            lastName = oldUser.lastName;
            email = oldUser.email;
            phone = null; // New field
            profilePicture = null; // New field
            role = oldUser.role;
            authMethod = oldUser.authMethod;
            kycStatus = oldUser.kycStatus;
            kycSubmittedAt = oldUser.kycSubmittedAt;
            verified = oldUser.verified;
            walletAddress = oldUser.walletAddress;
            bio = null; // New field
            location = null; // New field
            company = null; // New field
            website = null; // New field
            joinedAt = oldUser.joinedAt;
            lastActive = oldUser.lastActive;
        }
    };

    // Helper to check if migration is needed
    public func needsMigration(userEntries: [(Principal, Types.User)]): Bool {
        // If we can successfully access all new fields, no migration needed
        // This is a simple check - in practice, you might want more sophisticated detection
        userEntries.size() == 0 // If empty, no migration needed
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
            description = "Added phone, profilePicture, bio, location, company, website fields to User type";
        }
    };
}