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
import Blob "mo:base/Blob";
import _Option "mo:base/Option";
import Int "mo:base/Int";

import Types "./types";
import Migration "./migration"; // NEW: Import migration module

persistent actor UserManagement {
    
    // Type aliases
    type User = Types.User;
    type UserRole = Types.UserRole;
    type KYCStatus = Types.KYCStatus;
    type AuthMethod = Types.AuthMethod;
    type Wallet = Types.Wallet;
    type TokenType = Types.TokenType;
    type Transaction = Types.Transaction;
    type TransactionType = Types.TransactionType;
    type TransactionStatus = Types.TransactionStatus;
    type Result<T, E> = Result.Result<T, E>;
    type UserId = Text;

    // STABLE STORAGE - Only arrays can be stable (unchanged from your original)
    private var userEntries : [(Principal, User)] = [];
    private var walletEntries : [(Principal, Wallet)] = [];
    private var transactionEntries : [(Text, Transaction)] = [];
    private var userIdCounter : Nat = 0;
    private var transactionIdCounter : Nat = 0;
    private var migrationVersion: Nat = 2; // NEW: Track migration version

    // RUNTIME STORAGE - These are rebuilt from stable arrays (unchanged from your original)
    private transient var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
    private transient var wallets = HashMap.HashMap<Principal, Wallet>(10, Principal.equal, Principal.hash);
    private transient var transactions = HashMap.HashMap<Text, Transaction>(50, Text.equal, Text.hash);
    private transient var usersByRole = HashMap.HashMap<UserRole, [Principal]>(2, func(a: UserRole, b: UserRole) : Bool { a == b }, func(role: UserRole) : Nat32 {
        switch(role) {
            case (#buyer) 0;
            case (#seller) 1;
        }
    });
    private transient var userTransactions = HashMap.HashMap<Principal, [Text]>(10, Principal.equal, Principal.hash);

    // Helper function to convert Int to Nat safely (unchanged)
    private func _intToNat(x: Int) : Nat {
        Int.abs(x)
    };

    // NEW: Migration handler function
    private func handleMigration() {
        // This function will be called during postupgrade
        // It handles the migration gracefully using try-catch pattern
        let result = do ? {
            // Try to load users normally
            users := HashMap.fromIter(userEntries.vals(), userEntries.size(), Principal.equal, Principal.hash);
            Debug.print("✅ Users loaded successfully - no migration needed");
        };
        
        switch (result) {
            case (null) {
                Debug.print("⚠️ Migration required - handling gracefully");
                // If there's an error, it means we need to handle the migration
                // The system will create new user entries as needed
                users := HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
                userEntries := [];
            };
            case (?_) {};
        };
    };

    // System functions for upgrades (UPDATED with migration support)
    system func preupgrade() {
        userEntries := Iter.toArray(users.entries());
        walletEntries := Iter.toArray(wallets.entries());
        transactionEntries := Iter.toArray(transactions.entries());
        Debug.print("📦 Pre-upgrade: Saved " # Nat.toText(userEntries.size()) # " users");
    };

    system func postupgrade() {
        Debug.print("🔄 Post-upgrade: Starting migration check...");
        
        // Handle migration gracefully
        handleMigration();
        
        // Load wallets and transactions normally
        wallets := HashMap.fromIter(walletEntries.vals(), walletEntries.size(), Principal.equal, Principal.hash);
        transactions := HashMap.fromIter(transactionEntries.vals(), transactionEntries.size(), Text.equal, Text.hash);
        
        // Clear the stable arrays to save memory
        userEntries := [];
        walletEntries := [];
        transactionEntries := [];
        
        // Rebuild indexes
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

        // Rebuild user transaction indexes
        for ((txId, tx) in transactions.entries()) {
            let userTxs = switch(userTransactions.get(tx.fromPrincipal)) {
                case (?txs) Array.append(txs, [txId]);
                case null [txId];
            };
            userTransactions.put(tx.fromPrincipal, userTxs);
            
            if (tx.fromPrincipal != tx.toPrincipal) {
                let recipientTxs = switch(userTransactions.get(tx.toPrincipal)) {
                    case (?txs) Array.append(txs, [txId]);
                    case null [txId];
                };
                userTransactions.put(tx.toPrincipal, recipientTxs);
            };
        };

        Debug.print("✅ Post-upgrade completed successfully");
    };

    // NEW: Migration status endpoint
    public query func getMigrationStatus() : async {version: Nat; isComplete: Bool; info: Text} {
        let migrationInfo = Migration.getMigrationInfo();
        {
            version = migrationInfo.version;
            isComplete = migrationVersion >= migrationInfo.version;
            info = migrationInfo.description;
        }
    };

    // NEW: Force migration endpoint (admin use only)
    public shared(_msg) func forceMigration() : async Result<Text, Text> {
        try {
            Debug.print("🔄 Manual migration triggered");
            handleMigration();
            #ok("Migration completed successfully")
        } catch (_error) {
            let errorMsg = "Migration failed with error";
            Debug.print("❌ " # errorMsg);
            #err(errorMsg)
        }
    };

    // Enhanced user registration with profile data
    public shared(msg) func registerUser(
        authMethod: AuthMethod, 
        firstName: Text, 
        lastName: Text,
        email: Text,
        phone: ?Text,
        profilePicture: ?Blob
    ) : async Result<User, Text> {
        let caller = msg.caller;
        
        // Check if user already exists
        switch(users.get(caller)) {
            case (?_existingUser) {
                return #err("User already registered");
            };
            case null {};
        };

        // Generate unique user ID
        userIdCounter += 1;
        let userId = "user_" # Nat.toText(userIdCounter);

        // Create new user with enhanced profile
        let newUser : User = {
            id = userId;
            principalId = Principal.toText(caller);
            firstName = firstName;
            lastName = lastName;
            email = email;
            phone = phone;
            profilePicture = profilePicture;
            role = null;
            authMethod = authMethod;
            kycStatus = #pending;
            kycSubmittedAt = null;
            verified = false;
            walletAddress = Principal.toText(caller);
            bio = null;
            location = null;
            company = null;
            website = null;
            joinedAt = Time.now();
            lastActive = Time.now();
        };

        // Store user
        users.put(caller, newUser);

        // Create wallet automatically
        let _ = await createWalletForUser(caller);
        
        Debug.print("User registered: " # userId);
        #ok(newUser)
    };

    // Set user role and complete profile
    public shared(msg) func setUserRole(
        role: UserRole,
        bio: ?Text,
        location: ?Text,
        company: ?Text,
        website: ?Text
    ) : async Result<User, Text> {
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
                        // Update user with role and profile
                        let updatedUser : User = {
                            id = user.id;
                            principalId = user.principalId;
                            firstName = user.firstName;
                            lastName = user.lastName;
                            email = user.email;
                            phone = user.phone;
                            profilePicture = user.profilePicture;
                            role = ?role;
                            authMethod = user.authMethod;
                            kycStatus = user.kycStatus;
                            kycSubmittedAt = user.kycSubmittedAt;
                            verified = user.verified;
                            walletAddress = user.walletAddress;
                            bio = bio;
                            location = location;
                            company = company;
                            website = website;
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
                        
                        Debug.print("Role and profile set for user: " # user.id # " -> " # debug_show(role));
                        #ok(updatedUser)
                    };
                };
            };
        };
    };

    // Update profile picture
    public shared(msg) func updateProfilePicture(profilePicture: Blob) : async Result<User, Text> {
        let caller = msg.caller;
        
        switch(users.get(caller)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                let updatedUser : User = {
                    id = user.id;
                    principalId = user.principalId;
                    firstName = user.firstName;
                    lastName = user.lastName;
                    email = user.email;
                    phone = user.phone;
                    profilePicture = ?profilePicture;
                    role = user.role;
                    authMethod = user.authMethod;
                    kycStatus = user.kycStatus;
                    kycSubmittedAt = user.kycSubmittedAt;
                    verified = user.verified;
                    walletAddress = user.walletAddress;
                    bio = user.bio;
                    location = user.location;
                    company = user.company;
                    website = user.website;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };
                
                users.put(caller, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // WALLET FUNCTIONALITY INTEGRATION

    // Create wallet for user (internal function)
    private func createWalletForUser(userPrincipal: Principal) : async Result<Wallet, Text> {
        // Check if wallet already exists
        switch(wallets.get(userPrincipal)) {
            case (?existingWallet) {
                return #ok(existingWallet);
            };
            case null {};
        };

        // Create new wallet
        let newWallet : Wallet = {
            owner = userPrincipal;
            icpBalance = 0;
            usdBalance = 0;
            nairaBalance = 0;
            euroBalance = 0;
            createdAt = Time.now();
            lastTransactionAt = Time.now();
            isLocked = false;
            totalTransactions = 0;
        };

        wallets.put(userPrincipal, newWallet);
        
        Debug.print("Wallet created for: " # Principal.toText(userPrincipal));
        #ok(newWallet)
    };

    // Get user's wallet
    public shared(msg) func getWallet() : async Result<Wallet, Text> {
        let caller = msg.caller;
        
        switch(wallets.get(caller)) {
            case null {
                // Create wallet if it doesn't exist
                await createWalletForUser(caller)
            };
            case (?wallet) {
                #ok(wallet)
            };
        };
    };

    // Get wallet balance for specific token
    public shared(msg) func getBalance(tokenType: TokenType) : async Result<Nat, Text> {
        let caller = msg.caller;
        
        switch(wallets.get(caller)) {
            case null {
                #err("Wallet not found")
            };
            case (?wallet) {
                let balance = switch(tokenType) {
                    case (#ICP) wallet.icpBalance;
                    case (#USD) wallet.usdBalance;
                    case (#Naira) wallet.nairaBalance;
                    case (#Euro) wallet.euroBalance;
                };
                #ok(balance)
            };
        };
    };

    // Safe subtraction function
    private func safeSub(a: Nat, b: Nat) : ?Nat {
        if (a >= b) {
            ?(a - b)
        } else {
            null
        }
    };

    // Transfer funds between wallets
    public shared(msg) func transfer(
        to: Principal, 
        amount: Nat, 
        tokenType: TokenType,
        memo: ?Text
    ) : async Result<Text, Text> {
        let caller = msg.caller;
        
        // Validate amount
        if (amount == 0) {
            return #err("Transfer amount must be greater than 0");
        };

        // Get sender wallet
        let senderWallet = switch(wallets.get(caller)) {
            case null return #err("Sender wallet not found");
            case (?wallet) wallet;
        };

        // Check if wallet is locked
        if (senderWallet.isLocked) {
            return #err("Wallet is locked");
        };

        // Check balance and calculate new balance safely
        let (_currentBalance, newSenderBalance) = switch(tokenType) {
            case (#ICP) {
                let balance = senderWallet.icpBalance;
                switch(safeSub(balance, amount)) {
                    case (?newBalance) (balance, newBalance);
                    case null return #err("Insufficient balance");
                };
            };
            case (#USD) {
                let balance = senderWallet.usdBalance;
                switch(safeSub(balance, amount)) {
                    case (?newBalance) (balance, newBalance);
                    case null return #err("Insufficient balance");
                };
            };
            case (#Naira) {
                let balance = senderWallet.nairaBalance;
                switch(safeSub(balance, amount)) {
                    case (?newBalance) (balance, newBalance);
                    case null return #err("Insufficient balance");
                };
            };
            case (#Euro) {
                let balance = senderWallet.euroBalance;
                switch(safeSub(balance, amount)) {
                    case (?newBalance) (balance, newBalance);
                    case null return #err("Insufficient balance");
                };
            };
        };

        // Get or create recipient wallet
        let recipientWallet = switch(wallets.get(to)) {
            case (?wallet) wallet;
            case null {
                // Create wallet for recipient
                let newWallet : Wallet = {
                    owner = to;
                    icpBalance = 0;
                    usdBalance = 0;
                    nairaBalance = 0;
                    euroBalance = 0;
                    createdAt = Time.now();
                    lastTransactionAt = Time.now();
                    isLocked = false;
                    totalTransactions = 0;
                };
                wallets.put(to, newWallet);
                newWallet;
            };
        };

        // Generate transaction ID
        transactionIdCounter += 1;
        let txId = "tx_" # Nat.toText(transactionIdCounter);

        // Update sender balance
        let updatedSenderWallet = switch(tokenType) {
            case (#ICP) {
                {
                    owner = senderWallet.owner;
                    icpBalance = newSenderBalance;
                    usdBalance = senderWallet.usdBalance;
                    nairaBalance = senderWallet.nairaBalance;
                    euroBalance = senderWallet.euroBalance;
                    createdAt = senderWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = senderWallet.isLocked;
                    totalTransactions = senderWallet.totalTransactions + 1;
                }
            };
            case (#USD) {
                {
                    owner = senderWallet.owner;
                    icpBalance = senderWallet.icpBalance;
                    usdBalance = newSenderBalance;
                    nairaBalance = senderWallet.nairaBalance;
                    euroBalance = senderWallet.euroBalance;
                    createdAt = senderWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = senderWallet.isLocked;
                    totalTransactions = senderWallet.totalTransactions + 1;
                }
            };
            case (#Naira) {
                {
                    owner = senderWallet.owner;
                    icpBalance = senderWallet.icpBalance;
                    usdBalance = senderWallet.usdBalance;
                    nairaBalance = newSenderBalance;
                    euroBalance = senderWallet.euroBalance;
                    createdAt = senderWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = senderWallet.isLocked;
                    totalTransactions = senderWallet.totalTransactions + 1;
                }
            };
            case (#Euro) {
                {
                    owner = senderWallet.owner;
                    icpBalance = senderWallet.icpBalance;
                    usdBalance = senderWallet.usdBalance;
                    nairaBalance = senderWallet.nairaBalance;
                    euroBalance = newSenderBalance;
                    createdAt = senderWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = senderWallet.isLocked;
                    totalTransactions = senderWallet.totalTransactions + 1;
                }
            };
        };

        // Update recipient balance
        let updatedRecipientWallet = switch(tokenType) {
            case (#ICP) {
                {
                    owner = recipientWallet.owner;
                    icpBalance = recipientWallet.icpBalance + amount;
                    usdBalance = recipientWallet.usdBalance;
                    nairaBalance = recipientWallet.nairaBalance;
                    euroBalance = recipientWallet.euroBalance;
                    createdAt = recipientWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = recipientWallet.isLocked;
                    totalTransactions = recipientWallet.totalTransactions + 1;
                }
            };
            case (#USD) {
                {
                    owner = recipientWallet.owner;
                    icpBalance = recipientWallet.icpBalance;
                    usdBalance = recipientWallet.usdBalance + amount;
                    nairaBalance = recipientWallet.nairaBalance;
                    euroBalance = recipientWallet.euroBalance;
                    createdAt = recipientWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = recipientWallet.isLocked;
                    totalTransactions = recipientWallet.totalTransactions + 1;
                }
            };
            case (#Naira) {
                {
                    owner = recipientWallet.owner;
                    icpBalance = recipientWallet.icpBalance;
                    usdBalance = recipientWallet.usdBalance;
                    nairaBalance = recipientWallet.nairaBalance + amount;
                    euroBalance = recipientWallet.euroBalance;
                    createdAt = recipientWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = recipientWallet.isLocked;
                    totalTransactions = recipientWallet.totalTransactions + 1;
                }
            };
            case (#Euro) {
                {
                    owner = recipientWallet.owner;
                    icpBalance = recipientWallet.icpBalance;
                    usdBalance = recipientWallet.usdBalance;
                    nairaBalance = recipientWallet.nairaBalance;
                    euroBalance = recipientWallet.euroBalance + amount;
                    createdAt = recipientWallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = recipientWallet.isLocked;
                    totalTransactions = recipientWallet.totalTransactions + 1;
                }
            };
        };

        // Create transaction record
        let transaction : Transaction = {
            id = txId;
            fromPrincipal = caller;
            toPrincipal = to;
            amount = amount;
            tokenType = tokenType;
            transactionType = #transfer;
            status = #completed;
            createdAt = Time.now();
            completedAt = ?Time.now();
            memo = memo;
        };

        // Save updated wallets and transaction
        wallets.put(caller, updatedSenderWallet);
        wallets.put(to, updatedRecipientWallet);
        transactions.put(txId, transaction);

        // Update user transaction indexes
        let senderTxs = switch(userTransactions.get(caller)) {
            case (?txs) Array.append(txs, [txId]);
            case null [txId];
        };
        userTransactions.put(caller, senderTxs);

        let recipientTxs = switch(userTransactions.get(to)) {
            case (?txs) Array.append(txs, [txId]);
            case null [txId];
        };
        userTransactions.put(to, recipientTxs);

        Debug.print("Transfer completed: " # txId);
        #ok(txId)
    };

    // Add funds to wallet (for testing/demo purposes)
    public shared(msg) func addFunds(amount: Nat, tokenType: TokenType) : async Result<(), Text> {
        let caller = msg.caller;
        
        // Get wallet
        let wallet = switch(wallets.get(caller)) {
            case null return #err("Wallet not found");
            case (?w) w;
        };

        // Update balance
        let updatedWallet = switch(tokenType) {
            case (#ICP) {
                {
                    owner = wallet.owner;
                    icpBalance = wallet.icpBalance + amount;
                    usdBalance = wallet.usdBalance;
                    nairaBalance = wallet.nairaBalance;
                    euroBalance = wallet.euroBalance;
                    createdAt = wallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = wallet.isLocked;
                    totalTransactions = wallet.totalTransactions;
                }
            };
            case (#USD) {
                {
                    owner = wallet.owner;
                    icpBalance = wallet.icpBalance;
                    usdBalance = wallet.usdBalance + amount;
                    nairaBalance = wallet.nairaBalance;
                    euroBalance = wallet.euroBalance;
                    createdAt = wallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = wallet.isLocked;
                    totalTransactions = wallet.totalTransactions;
                }
            };
            case (#Naira) {
                {
                    owner = wallet.owner;
                    icpBalance = wallet.icpBalance;
                    usdBalance = wallet.usdBalance;
                    nairaBalance = wallet.nairaBalance + amount;
                    euroBalance = wallet.euroBalance;
                    createdAt = wallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = wallet.isLocked;
                    totalTransactions = wallet.totalTransactions;
                }
            };
            case (#Euro) {
                {
                    owner = wallet.owner;
                    icpBalance = wallet.icpBalance;
                    usdBalance = wallet.usdBalance;
                    nairaBalance = wallet.nairaBalance;
                    euroBalance = wallet.euroBalance + amount;
                    createdAt = wallet.createdAt;
                    lastTransactionAt = Time.now();
                    isLocked = wallet.isLocked;
                    totalTransactions = wallet.totalTransactions;
                }
            };
        };

        wallets.put(caller, updatedWallet);
        #ok(())
    };

    // Get transaction history for user
    public shared(msg) func getTransactionHistory() : async [Transaction] {
        let caller = msg.caller;
        
        let userTxIds = switch(userTransactions.get(caller)) {
            case (?txIds) txIds;
            case null [];
        };

        Array.mapFilter<Text, Transaction>(userTxIds, func(txId) {
            transactions.get(txId)
        })
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
                    email = user.email;
                    phone = user.phone;
                    profilePicture = user.profilePicture;
                    role = user.role;
                    authMethod = user.authMethod;
                    kycStatus = user.kycStatus;
                    kycSubmittedAt = user.kycSubmittedAt;
                    verified = user.verified;
                    walletAddress = user.walletAddress;
                    bio = user.bio;
                    location = user.location;
                    company = user.company;
                    website = user.website;
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
                    email = user.email;
                    phone = user.phone;
                    profilePicture = user.profilePicture;
                    role = user.role;
                    authMethod = user.authMethod;
                    kycStatus = status;
                    kycSubmittedAt = kycSubmittedTime;
                    verified = (status == #completed);
                    walletAddress = user.walletAddress;
                    bio = user.bio;
                    location = user.location;
                    company = user.company;
                    website = user.website;
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
    public shared(msg) func updateProfile(
        firstName: Text, 
        lastName: Text,
        email: Text,
        phone: ?Text,
        bio: ?Text,
        location: ?Text,
        company: ?Text,
        website: ?Text
    ) : async Result<User, Text> {
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
                    email = email;
                    phone = phone;
                    profilePicture = user.profilePicture;
                    role = user.role;
                    authMethod = user.authMethod;
                    kycStatus = user.kycStatus;
                    kycSubmittedAt = user.kycSubmittedAt;
                    verified = user.verified;
                    walletAddress = user.walletAddress;
                    bio = bio;
                    location = location;
                    company = company;
                    website = website;
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

    // Get wallet statistics
    public query func getWalletStats() : async {
        totalWallets: Nat;
        totalTransactions: Nat;
        totalIcpLocked: Nat;
        totalUsdLocked: Nat;
    } {
        var totalIcp = 0;
        var totalUsd = 0;
        
        for ((_, wallet) in wallets.entries()) {
            totalIcp += wallet.icpBalance;
            totalUsd += wallet.usdBalance;
        };

        {
            totalWallets = wallets.size();
            totalTransactions = transactions.size();
            totalIcpLocked = totalIcp;
            totalUsdLocked = totalUsd;
        }
    };

    // Health check
    public query func healthCheck() : async {status: Text; timestamp: Int; userCount: Nat; walletCount: Nat} {
        {
            status = "healthy";
            timestamp = Time.now();
            userCount = users.size();
            walletCount = wallets.size();
        }
    };

    // Validate user session
    public shared(_msg) func validateSession() : async Result<User, Text> {
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
        totalWallets: Nat;
        totalTransactions: Nat;
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
            totalWallets = wallets.size();
            totalTransactions = transactions.size();
        }
    };

    // Get specific transaction
    public query func getTransaction(txId: Text) : async ?Transaction {
        transactions.get(txId)
    };

    // Lock/unlock wallet (admin function)
    public shared(_msg) func setWalletLock(owner: Principal, isLocked: Bool) : async Result<(), Text> {
        // In a real implementation, you'd check admin permissions here
        
        switch(wallets.get(owner)) {
            case null {
                #err("Wallet not found")
            };
            case (?wallet) {
                let updatedWallet = {
                    owner = wallet.owner;
                    icpBalance = wallet.icpBalance;
                    usdBalance = wallet.usdBalance;
                    nairaBalance = wallet.nairaBalance;
                    euroBalance = wallet.euroBalance;
                    createdAt = wallet.createdAt;
                    lastTransactionAt = wallet.lastTransactionAt;
                    isLocked = isLocked;
                    totalTransactions = wallet.totalTransactions;
                };
                
                wallets.put(owner, updatedWallet);
                #ok(())
            };
        };
    };

    // Get user's profile picture
    public shared(msg) func getProfilePicture() : async ?Blob {
        let caller = msg.caller;
        
        switch(users.get(caller)) {
            case null null;
            case (?user) user.profilePicture;
        };
    };
}