// user.mo - User Management Module
import Time "mo:base/Time";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Float "mo:base/Float";

import Types "./types";

module UserModule {
    type Result<T, E> = Types.Result<T, E>;
    type UserProfile = Types.UserProfile;
    type UserRole = Types.UserRole;
    type TradeChainError = Types.TradeChainError;

    public class UserManager() {
        // Storage
        private stable var userEntries : [(Principal, UserProfile)] = [];
        private var users = HashMap.HashMap<Principal, UserProfile>(10, Principal.equal, Principal.hash);

        // Email to Principal mapping for lookups
        private stable var emailEntries : [(Text, Principal)] = [];
        private var emailToPrincipal = HashMap.HashMap<Text, Principal>(10, Text.equal, Text.hash);

        // System upgrade hooks
        system func preupgrade() {
            userEntries := Iter.toArray(users.entries());
            emailEntries := Iter.toArray(emailToPrincipal.entries());
        };

        system func postupgrade() {
            users := HashMap.fromIter<Principal, UserProfile>(userEntries.vals(), userEntries.size(), Principal.equal, Principal.hash);
            emailToPrincipal := HashMap.fromIter<Text, Principal>(emailEntries.vals(), emailEntries.size(), Text.equal, Text.hash);
            userEntries := [];
            emailEntries := [];
        };

        // User Management Functions

        public func createUser(
            caller: Principal,
            internetIdentity: Principal,
            role: UserRole,
            name: Text,
            email: ?Text
        ): Result<UserProfile, TradeChainError> {
            
            // Check if user already exists
            switch (users.get(caller)) {
                case (?existingUser) {
                    return #err(#InternalError("User already exists"));
                };
                case null {};
            };

            // Check email uniqueness if provided
            switch (email) {
                case (?emailAddress) {
                    switch (emailToPrincipal.get(emailAddress)) {
                        case (?_) {
                            return #err(#InternalError("Email already registered"));
                        };
                        case null {
                            emailToPrincipal.put(emailAddress, caller);
                        };
                    };
                };
                case null {};
            };

            let now = Time.now();
            let newUser: UserProfile = {
                id = caller;
                internetIdentity = internetIdentity;
                role = role;
                email = email;
                name = name;
                verified = false;
                createdAt = now;
                updatedAt = now;
                walletId = null;
                totalTrades = 0;
                rating = 0.0;
                isActive = true;
            };

            users.put(caller, newUser);
            #ok(newUser)
        };

        public func getUserProfile(userId: Principal): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) { #ok(user) };
                case null { #err(#UserNotFound) };
            }
        };

        public func updateUserProfile(
            caller: Principal,
            name: ?Text,
            email: ?Text
        ): Result<UserProfile, TradeChainError> {
            switch (users.get(caller)) {
                case (?user) {
                    // Handle email update
                    let updatedEmail = switch (email) {
                        case (?newEmail) {
                            // Remove old email mapping if exists
                            switch (user.email) {
                                case (?oldEmail) {
                                    emailToPrincipal.delete(oldEmail);
                                };
                                case null {};
                            };
                            
                            // Check if new email is already taken
                            switch (emailToPrincipal.get(newEmail)) {
                                case (?_) {
                                    return #err(#InternalError("Email already registered"));
                                };
                                case null {
                                    emailToPrincipal.put(newEmail, caller);
                                    ?newEmail;
                                };
                            };
                        };
                        case null { user.email };
                    };

                    let updatedUser: UserProfile = {
                        user with
                        name = Option.get(name, user.name);
                        email = updatedEmail;
                        updatedAt = Time.now();
                    };

                    users.put(caller, updatedUser);
                    #ok(updatedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func verifyUser(userId: Principal): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) {
                    let verifiedUser: UserProfile = {
                        user with
                        verified = true;
                        updatedAt = Time.now();
                    };
                    users.put(userId, verifiedUser);
                    #ok(verifiedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func updateUserRole(userId: Principal, newRole: UserRole): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) {
                    let updatedUser: UserProfile = {
                        user with
                        role = newRole;
                        updatedAt = Time.now();
                    };
                    users.put(userId, updatedUser);
                    #ok(updatedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func updateUserRating(userId: Principal, newRating: Float): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) {
                    let updatedUser: UserProfile = {
                        user with
                        rating = newRating;
                        updatedAt = Time.now();
                    };
                    users.put(userId, updatedUser);
                    #ok(updatedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func incrementUserTrades(userId: Principal): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) {
                    let updatedUser: UserProfile = {
                        user with
                        totalTrades = user.totalTrades + 1;
                        updatedAt = Time.now();
                    };
                    users.put(userId, updatedUser);
                    #ok(updatedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func setUserWallet(userId: Principal, walletId: Text): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) {
                    let updatedUser: UserProfile = {
                        user with
                        walletId = ?walletId;
                        updatedAt = Time.now();
                    };
                    users.put(userId, updatedUser);
                    #ok(updatedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func deactivateUser(userId: Principal): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) {
                    let deactivatedUser: UserProfile = {
                        user with
                        isActive = false;
                        updatedAt = Time.now();
                    };
                    users.put(userId, deactivatedUser);
                    #ok(deactivatedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func reactivateUser(userId: Principal): Result<UserProfile, TradeChainError> {
            switch (users.get(userId)) {
                case (?user) {
                    let reactivatedUser: UserProfile = {
                        user with
                        isActive = true;
                        updatedAt = Time.now();
                    };
                    users.put(userId, reactivatedUser);
                    #ok(reactivatedUser)
                };
                case null { #err(#UserNotFound) };
            }
        };

        // Query Functions

        public func getAllUsers(): [UserProfile] {
            Iter.toArray(users.vals())
        };

        public func getUsersByRole(role: UserRole): [UserProfile] {
            let filteredUsers = Iter.filter(users.vals(), func(user: UserProfile): Bool {
                user.role == role and user.isActive
            });
            Iter.toArray(filteredUsers)
        };

        public func getUserByEmail(email: Text): Result<UserProfile, TradeChainError> {
            switch (emailToPrincipal.get(email)) {
                case (?principal) {
                    getUserProfile(principal)
                };
                case null { #err(#UserNotFound) };
            }
        };

        public func getUsersCount(): Nat {
            users.size()
        };

        public func getActiveUsersCount(): Nat {
            let activeUsers = Iter.filter(users.vals(), func(user: UserProfile): Bool {
                user.isActive
            });
            Iter.size(activeUsers)
        };

        public func getVerifiedUsersCount(): Nat {
            let verifiedUsers = Iter.filter(users.vals(), func(user: UserProfile): Bool {
                user.verified and user.isActive
            });
            Iter.size(verifiedUsers)
        };

        public func getTopRatedUsers(limit: Nat): [UserProfile] {
            let allUsers = Iter.toArray(users.vals());
            let sortedUsers = Array.sort(allUsers, func(a: UserProfile, b: UserProfile): {#less; #equal; #greater} {
                if (a.rating > b.rating) { #less }
                else if (a.rating < b.rating) { #greater }
                else { #equal }
            });
            
            let limitedSize = if (limit > sortedUsers.size()) sortedUsers.size() else limit;
            Array.tabulate<UserProfile>(limitedSize, func(i) = sortedUsers[i])
        };

        // Authentication & Authorization

        public func isUserAuthorized(caller: Principal, targetUser: Principal, requiredRole: ?UserRole): Bool {
            // Admin can access everything
            switch (users.get(caller)) {
                case (?user) {
                    if (user.role == #admin) { return true };
                    
                    // User can access their own data
                    if (caller == targetUser) { return true };
                    
                    // Check role requirements
                    switch (requiredRole) {
                        case (?role) {
                            user.role == role
                        };
                        case null { false };
                    };
                };
                case null { false };
            }
        };

        public func isAdmin(caller: Principal): Bool {
            switch (users.get(caller)) {
                case (?user) { user.role == #admin };
                case null { false };
            }
        };

        public func isSeller(caller: Principal): Bool {
            switch (users.get(caller)) {
                case (?user) { user.role == #seller };
                case null { false };
            }
        };

        public func isBuyer(caller: Principal): Bool {
            switch (users.get(caller)) {
                case (?user) { user.role == #buyer };
                case null { false };
            }
        };

        public func isUserActive(userId: Principal): Bool {
            switch (users.get(userId)) {
                case (?user) { user.isActive };
                case null { false };
            }
        };

        public func isUserVerified(userId: Principal): Bool {
            switch (users.get(userId)) {
                case (?user) { user.verified };
                case null { false };
            }
        };

        // Utility Functions

        public func userExists(userId: Principal): Bool {
            switch (users.get(userId)) {
                case (?_) { true };
                case null { false };
            }
        };

        public func validateUserInput(name: Text, email: ?Text): Result<(), TradeChainError> {
            if (Text.size(name) < 2 or Text.size(name) > 100) {
                return #err(#InvalidInput);
            };
            
            switch (email) {
                case (?emailAddress) {
                    if (Text.size(emailAddress) < 5 or Text.size(emailAddress) > 254) {
                        return #err(#InvalidInput);
                    };
                    // Basic email validation (contains @ and .)
                    if (not Text.contains(emailAddress, #char '@') or not Text.contains(emailAddress, #char '.')) {
                        return #err(#InvalidInput);
                    };
                };
                case null {};
            };
            
            #ok(())
        };

        // Analytics helper functions
        public func getUsersByDateRange(startTime: Time.Time, endTime: Time.Time): [UserProfile] {
            let filteredUsers = Iter.filter(users.vals(), func(user: UserProfile): Bool {
                user.createdAt >= startTime and user.createdAt <= endTime
            });
            Iter.toArray(filteredUsers)
        };

        public func getRecentlyActiveUsers(daysBack: Int): [UserProfile] {
            let cutoffTime = Time.now() - (daysBack * 24 * 60 * 60 * 1_000_000_000);
            let activeUsers = Iter.filter(users.vals(), func(user: UserProfile): Bool {
                user.updatedAt >= cutoffTime and user.isActive
            });
            Iter.toArray(activeUsers)
        };
    }
}
