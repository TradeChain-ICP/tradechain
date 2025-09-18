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
import Option "mo:base/Option";
import Int "mo:base/Int";

import Types "./types";

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
    type Document = Types.Document;
    type Result<T, E> = Result.Result<T, E>;
    type UserId = Text;

    // Helper functions for type conversion
    private func blobToBytes(blob: Blob) : [Nat8] {
        Blob.toArray(blob)
    };

    private func bytesToBlob(bytes: [Nat8]) : Blob {
        Blob.fromArray(bytes)
    };

    private func principalToText(p: Principal) : Text {
        Principal.toText(p)
    };

    private func textToPrincipal(t: Text) : ?Principal {
        Principal.fromText(t)
    };

    // Simple counters (automatically persistent)
    private var userIdCounter : Nat = 0;
    private var transactionIdCounter : Nat = 0;

    // Runtime storage (automatically persistent with persistent actor - now using Text keys for Principals)
    private var users = HashMap.HashMap<Text, User>(10, Text.equal, Text.hash);
    private var wallets = HashMap.HashMap<Text, Wallet>(10, Text.equal, Text.hash);
    private var transactions = HashMap.HashMap<Text, Transaction>(50, Text.equal, Text.hash);
    private var documents = HashMap.HashMap<Text, Document>(50, Text.equal, Text.hash);
    private var usersByRole = HashMap.HashMap<UserRole, [Text]>(2, func(a: UserRole, b: UserRole) : Bool { a == b }, func(role: UserRole) : Nat32 {
        switch(role) {
            case (#buyer) 0;
            case (#seller) 1;
        }
    });
    private var userTransactions = HashMap.HashMap<Text, [Text]>(10, Text.equal, Text.hash);

    // Helper function to convert Int to Nat safely
    private func intToNat(x: Int) : Nat {
        Int.abs(x)
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
        let callerText = principalToText(caller);
        
        // Check if user already exists
        switch(users.get(callerText)) {
            case (?existingUser) {
                return #err("User already registered");
            };
            case null {};
        };

        // Generate unique user ID
        userIdCounter += 1;
        let userId = "user_" # Nat.toText(userIdCounter);

        // Convert Blob to [Nat8] if present
        let profilePictureBytes = switch(profilePicture) {
            case null null;
            case (?blob) ?blobToBytes(blob);
        };

        // Create new user with enhanced profile
        let newUser : User = {
            id = userId;
            principalId = callerText;
            firstName = firstName;
            lastName = lastName;
            email = email;
            phone = phone;
            profilePicture = profilePictureBytes;
            role = null;
            authMethod = authMethod;
            kycStatus = #pending;
            kycSubmittedAt = null;
            verified = false;
            walletAddress = callerText;
            bio = null;
            location = null;
            company = null;
            website = null;
            joinedAt = Time.now();
            lastActive = Time.now();
        };

        // Store user
        users.put(callerText, newUser);

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
        let callerText = principalToText(caller);
        
        switch(users.get(callerText)) {
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

                        users.put(callerText, updatedUser);
                        
                        // Update role index
                        let existing = switch(usersByRole.get(role)) {
                            case (?principals) principals;
                            case null [];
                        };
                        usersByRole.put(role, Array.append(existing, [callerText]));
                        
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
        let callerText = principalToText(caller);
        
        switch(users.get(callerText)) {
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
                    profilePicture = ?blobToBytes(profilePicture);
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
                
                users.put(callerText, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Upload KYC document
    public shared(msg) func uploadKYCDocument(
        docType: Text,
        fileName: Text,
        content: Blob,
        mimeType: Text
    ) : async Result<Text, Text> {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        // Check if user exists
        switch(users.get(callerText)) {
            case null return #err("User not found");
            case (?_) {};
        };

        let docId = "doc_" # Nat.toText(userIdCounter) # "_" # Nat.toText(intToNat(Time.now()));
        
        let document : Document = {
            id = docId;
            userId = callerText;
            docType = docType;
            fileName = fileName;
            content = blobToBytes(content);
            mimeType = mimeType;
            uploadedAt = Time.now();
            verified = false;
        };

        documents.put(docId, document);
        Debug.print("Document uploaded: " # docId);
        
        #ok(docId)
    };

    // Get user's KYC documents
    public shared(msg) func getUserDocuments() : async [Document] {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        let userDocs = Array.filter<Document>(
            Iter.toArray(documents.vals()),
            func(doc) = doc.userId == callerText
        );
        
        userDocs
    };

    // Submit KYC for review
    public shared(msg) func submitKYCForReview() : async Result<User, Text> {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        switch(users.get(callerText)) {
            case null {
                #err("User not found")
            };
            case (?user) {
                // Check if user has uploaded required documents
                let userDocs = await getUserDocuments();
                if (userDocs.size() < 3) {
                    return #err("Please upload all required documents before submitting KYC");
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
                    kycStatus = #inReview;
                    kycSubmittedAt = ?Time.now();
                    verified = false;
                    walletAddress = user.walletAddress;
                    bio = user.bio;
                    location = user.location;
                    company = user.company;
                    website = user.website;
                    joinedAt = user.joinedAt;
                    lastActive = Time.now();
                };

                users.put(callerText, updatedUser);
                Debug.print("KYC submitted for review: " # user.id);
                #ok(updatedUser)
            };
        };
    };

    // WALLET FUNCTIONALITY INTEGRATION

    // Create wallet for user (internal function)
    private func createWalletForUser(userPrincipal: Principal) : async Result<Wallet, Text> {
        let userText = principalToText(userPrincipal);
        
        // Check if wallet already exists
        switch(wallets.get(userText)) {
            case (?existingWallet) {
                return #ok(existingWallet);
            };
            case null {};
        };

        // Create new wallet
        let newWallet : Wallet = {
            owner = userText;
            icpBalance = 0;
            usdBalance = 0;
            nairaBalance = 0;
            euroBalance = 0;
            createdAt = Time.now();
            lastTransactionAt = Time.now();
            isLocked = false;
            totalTransactions = 0;
        };

        wallets.put(userText, newWallet);
        
        Debug.print("Wallet created for: " # userText);
        #ok(newWallet)
    };

    // Get user's wallet
    public shared(msg) func getWallet() : async Result<Wallet, Text> {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        switch(wallets.get(callerText)) {
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
        let callerText = principalToText(caller);
        
        switch(wallets.get(callerText)) {
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
        let callerText = principalToText(caller);
        let toText = principalToText(to);
        
        // Validate amount
        if (amount == 0) {
            return #err("Transfer amount must be greater than 0");
        };

        // Get sender wallet
        let senderWallet = switch(wallets.get(callerText)) {
            case null return #err("Sender wallet not found");
            case (?wallet) wallet;
        };

        // Check if wallet is locked
        if (senderWallet.isLocked) {
            return #err("Wallet is locked");
        };

        // Check balance and calculate new balance safely
        let (currentBalance, newSenderBalance) = switch(tokenType) {
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
        let recipientWallet = switch(wallets.get(toText)) {
            case (?wallet) wallet;
            case null {
                // Create wallet for recipient
                let newWallet : Wallet = {
                    owner = toText;
                    icpBalance = 0;
                    usdBalance = 0;
                    nairaBalance = 0;
                    euroBalance = 0;
                    createdAt = Time.now();
                    lastTransactionAt = Time.now();
                    isLocked = false;
                    totalTransactions = 0;
                };
                wallets.put(toText, newWallet);
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
            fromPrincipal = callerText;
            toPrincipal = toText;
            amount = amount;
            tokenType = tokenType;
            transactionType = #transfer;
            status = #completed;
            createdAt = Time.now();
            completedAt = ?Time.now();
            memo = memo;
        };

        // Save updated wallets and transaction
        wallets.put(callerText, updatedSenderWallet);
        wallets.put(toText, updatedRecipientWallet);
        transactions.put(txId, transaction);

        // Update user transaction indexes
        let senderTxs = switch(userTransactions.get(callerText)) {
            case (?txs) Array.append(txs, [txId]);
            case null [txId];
        };
        userTransactions.put(callerText, senderTxs);

        let recipientTxs = switch(userTransactions.get(toText)) {
            case (?txs) Array.append(txs, [txId]);
            case null [txId];
        };
        userTransactions.put(toText, recipientTxs);

        Debug.print("Transfer completed: " # txId);
        #ok(txId)
    };

    // Add funds to wallet (for testing/demo purposes)
    public shared(msg) func addFunds(amount: Nat, tokenType: TokenType) : async Result<(), Text> {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        // Get wallet
        let wallet = switch(wallets.get(callerText)) {
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

        wallets.put(callerText, updatedWallet);
        #ok(())
    };

    // Get transaction history for user
    public shared(msg) func getTransactionHistory() : async [Transaction] {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        let userTxIds = switch(userTransactions.get(callerText)) {
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
        let callerText = principalToText(caller);
        
        switch(users.get(callerText)) {
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
                
                users.put(callerText, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Update KYC status
    public shared(msg) func updateKYCStatus(status: KYCStatus) : async Result<User, Text> {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        switch(users.get(callerText)) {
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

                users.put(callerText, updatedUser);
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
        let callerText = principalToText(caller);
        
        switch(users.get(callerText)) {
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

                users.put(callerText, updatedUser);
                #ok(updatedUser)
            };
        };
    };

    // Get users by role (admin function)
    public query func getUsersByRole(role: UserRole) : async [User] {
        let principalTexts = switch(usersByRole.get(role)) {
            case (?texts) texts;
            case null [];
        };
        
        Array.mapFilter<Text, User>(principalTexts, func(principalText) {
            users.get(principalText)
        })
    };

    // Get user by principal (admin function)
    public query func getUserByPrincipal(principal: Principal) : async ?User {
        let principalText = principalToText(principal);
        users.get(principalText)
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
    public shared(msg) func validateSession() : async Result<User, Text> {
        await getCurrentUser()
    };

    // Check if user exists
    public shared(msg) func userExists() : async Bool {
        let callerText = principalToText(msg.caller);
        switch(users.get(callerText)) {
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
    public shared(msg) func setWalletLock(owner: Principal, isLocked: Bool) : async Result<(), Text> {
        let ownerText = principalToText(owner);
        
        switch(wallets.get(ownerText)) {
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
                
                wallets.put(ownerText, updatedWallet);
                #ok(())
            };
        };
    };

    // Get user's profile picture
    public shared(msg) func getProfilePicture() : async ?Blob {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        switch(users.get(callerText)) {
            case null null;
            case (?user) {
                switch(user.profilePicture) {
                    case null null;
                    case (?bytes) ?bytesToBlob(bytes);
                };
            };
        };
    };

    // Verify document (admin function)
    public shared(msg) func verifyDocument(docId: Text, verified: Bool) : async Result<(), Text> {
        switch(documents.get(docId)) {
            case null {
                #err("Document not found")
            };
            case (?doc) {
                let updatedDoc : Document = {
                    id = doc.id;
                    userId = doc.userId;
                    docType = doc.docType;
                    fileName = doc.fileName;
                    content = doc.content;
                    mimeType = doc.mimeType;
                    uploadedAt = doc.uploadedAt;
                    verified = verified;
                };
                
                documents.put(docId, updatedDoc);
                #ok(())
            };
        };
    };

    // Get all documents (admin function)
    public query func getAllDocuments() : async [Document] {
        Iter.toArray(documents.vals())
    };

    // Delete document
    public shared(msg) func deleteDocument(docId: Text) : async Result<(), Text> {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        switch(documents.get(docId)) {
            case null {
                #err("Document not found")
            };
            case (?doc) {
                if (doc.userId != callerText) {
                    return #err("Unauthorized to delete this document");
                };
                
                documents.delete(docId);
                #ok(())
            };
        };
    };

    // Get document by ID (for authorized users only)
    public shared(msg) func getDocument(docId: Text) : async Result<Document, Text> {
        let caller = msg.caller;
        let callerText = principalToText(caller);
        
        switch(documents.get(docId)) {
            case null {
                #err("Document not found")
            };
            case (?doc) {
                if (doc.userId != callerText) {
                    return #err("Unauthorized to access this document");
                };
                
                #ok(doc)
            };
        };
    };
}