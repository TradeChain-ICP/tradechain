// backend/src/user_management/main.mo

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";

import Types "./types";

persistent actor UserManagement {
    
    // Type aliases
    type User = Types.User;
    type UserRole = Types.UserRole;
    type KYCStatus = Types.KYCStatus;
    type AuthMethod = Types.AuthMethod;
    type Result<T, E> = Result.Result<T, E>;
    type UserId = Text;

    // Stable storage for upgrades
    private stable var userEntries : [(Principal, User)] = [];
    private stable var userIdCounter : Nat = 0;

    // Runtime storage - explicitly marked as transient
    private transient var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
    private transient var usersByRole = HashMap.HashMap<UserRole, [Principal]>(2, func(a: UserRole, b: UserRole) : Bool { a == b }, func(role: UserRole) : Nat32 {
        switch(role) {
            case (#buyer) 0;
            case (#seller) 1;
        }
    });

    // Initialize from stable storage
    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
    };

    system func postupgrade() {
        users := HashMap.fromIter(userEntries.vals(), userEntries.size(), Principal.equal, Principal.hash);
        userEntries := [];
        
        // Rebuild role indexes
        for ((principal, user) in users.entries()) {
            switch(user.role) {
                case (?role) {
                    let existing = switch(usersByRole.get(role)) {
                        case (?principals) principals;
                        case null [];
                    };
                    usersByRole.put(role, Array.append(existing, [principal]));
                };
                case null {};
            };
        };
    };

    // User registration with Internet Identity or NFID
    public shared(msg) func registerUser(authMethod: AuthMethod, firstName: Text, lastName: Text) : async Result<User, Text> {
        let caller = msg.caller;
        
        // Check if user already exists
        switch(users.get(caller)) {
            case (?existingUser) {
                return #err("User already registered");
            };
            case null {};
        };

        // Generate unique user ID
        userIdCounter += 1;
        let userId = "user_" # Nat.toText(userIdCounter);

        // Create new user
        let newUser : User = {
            id = userId;
            principalId = Principal.toText(caller);
            firstName = firstName;
            lastName = lastName;
            role = null; // Role will be set separately
            authMethod = authMethod;
            kycStatus = #pending;
            kycSubmittedAt = null;
            verified = false;
            walletAddress = Principal.toText(caller); // Using principal as wallet address for now
            joinedAt = Time.now();
            lastActive = Time.now();
        };

        // Store user
        users.put(caller, newUser);
        
        Debug.print("User registered: " # userId);
        #ok(newUser)
    };

    // Set user role after registration
    public shared(msg) func setUserRole(role: UserRole) : async Result<User, Text> {
        let caller = msg.caller;
        
        switch(users.get(caller)) {
            case null {
                #err("User not found. Please register first.")
            };
            case (?user) {
                // Check if role already set
                switch(user.role) {
                    case (?existingRole) {
                        #err("User role already set to " # debug_show(existingRole))
                    };
                    case null {
                        // Update user with role
                        let updatedUser : User = {
                            id = user.id;
                            principalId = user.principalId;
                            firstName = user.firstName;
                            lastName = user.lastName;
                            role = ?role;
                            authMethod = user.authMethod;
                            kycStatus = user.kycStatus;
                            kycSubmittedAt = user.kycSubmittedAt;
                            verified = user.verified;
                            walletAddress = user.walletAddress;
                            joinedAt = user.joinedAt;
                            lastActive = Time.now();
                        };

                        users.put(caller, updatedUser);
                        
                        // Update role index
                        let existing = switch(usersByRole.get(role)) {
                            case (?principals) principals;
                            case null [];
                        };
                        usersByRole.put(role, Array.append(existing, [caller]));
                        
                        Debug.print("Role set for user: " # user.id # " -> " # debug_show(role));
                        #ok(updatedUser)
                    };
                };
            };
        };
    };

    // Get current user profile
    public shared(msg) func getCurrentUser() : async Result<User, Text> {
        let caller = msg.caller;
        
        switch(users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                // Update last active time
                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    firstName = user.firstName;
                    lastName = user.lastName;
                    role = user.role;
                    authMethod = user.authMethod;
                    kycStatus = user.kycStatus;
                    kycSubmittedAt = user.kycSubmittedAt;
                    verified = user.verified;
                    walletAddress = user.walletAddress;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };
                
                users.put(caller, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Update KYC status
    public shared(msg) func updateKYCStatus(status: KYCStatus) : async Result<User, Text> {
        let caller = msg.caller;
        
        switch(users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                let kycSubmittedTime = if (status == #inReview and user.kycSubmittedAt == null) {
                    ?Time.now()
                } else {
                    user.kycSubmittedAt
                };

                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    firstName = user.firstName;
                    lastName = user.lastName;
                    role = user.role;
                    authMethod = user.authMethod;
                    kycStatus = status;
                    kycSubmittedAt = kycSubmittedTime;
                    verified = (status == #completed);
                    walletAddress = user.walletAddress;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };

                users.put(caller, updatedUser);
                Debug.print("KYC status updated for user: " # user.id # " -> " # debug_show(status));
                #ok(updatedUser)
            };
        };
    };

    // Update user profile
    public shared(msg) func updateProfile(firstName: Text, lastName: Text) : async Result<User, Text> {
        let caller = msg.caller;
        
        switch(users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    firstName = firstName;
                    lastName = lastName;
                    role = user.role;
                    authMethod = user.authMethod;
                    kycStatus = user.kycStatus;
                    kycSubmittedAt = user.kycSubmittedAt;
                    verified = user.verified;
                    walletAddress = user.walletAddress;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };

                users.put(caller, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Get users by role (admin function)
    public query func getUsersByRole(role: UserRole) : async [User] {
        let principals = switch(usersByRole.get(role)) {
            case (?principals) principals;
            case null [];
        };
        
        Array.mapFilter<Principal, User>(principals, func(principal) {
            users.get(principal)
        })
    };

    // Get user by principal (admin function)
    public query func getUserByPrincipal(principal: Principal) : async ?User {
        users.get(principal)
    };

    // Get total user count
    public query func getTotalUsers() : async Nat {
        users.size()
    };

    // Get users count by role
    public query func getUserCountByRole() : async [(UserRole, Nat)] {
        let buyers = switch(usersByRole.get(#buyer)) {
            case (?principals) principals.size();
            case null 0;
        };
        
        let sellers = switch(usersByRole.get(#seller)) {
            case (?principals) principals.size();
            case null 0;
        };
        
        [(#buyer, buyers), (#seller, sellers)]
    };

    // Health check
    public query func healthCheck() : async {status: Text; timestamp: Int; userCount: Nat} {
        {
            status = "healthy";
            timestamp = Time.now();
            userCount = users.size();
        }
    };

    // Validate user session - Fixed to return the correct type
    public shared(msg) func validateSession() : async Result<User, Text> {
        await getCurrentUser()
    };

    // Check if user exists
    public shared(msg) func userExists() : async Bool {
        switch(users.get(msg.caller)) {
            case null false;
            case (?_) true;
        };
    };

    // Get user statistics
    public query func getUserStats() : async {
        totalUsers: Nat;
        verifiedUsers: Nat;
        kycPending: Nat;
        kycInReview: Nat;
        kycCompleted: Nat;
        kycRejected: Nat;
    } {
        var verifiedCount = 0;
        var kycPendingCount = 0;
        var kycInReviewCount = 0;
        var kycCompletedCount = 0;
        var kycRejectedCount = 0;

        for ((_, user) in users.entries()) {
            if (user.verified) {
                verifiedCount += 1;
            };
            
            switch(user.kycStatus) {
                case (#pending) kycPendingCount += 1;
                case (#inReview) kycInReviewCount += 1;
                case (#completed) kycCompletedCount += 1;
                case (#rejected) kycRejectedCount += 1;
            };
        };

        {
            totalUsers = users.size();
            verifiedUsers = verifiedCount;
            kycPending = kycPendingCount;
            kycInReview = kycInReviewCount;
            kycCompleted = kycCompletedCount;
            kycRejected = kycRejectedCount;
        }
    };
}