// backend/src/wallet/main.mo

import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";

import Types "./types";

persistent actor WalletManagement {
    
    // Type aliases
    type Wallet = Types.Wallet;
    type TokenType = Types.TokenType;
    type Transaction = Types.Transaction;
    type TransactionType = Types.TransactionType;
    type TransactionStatus = Types.TransactionStatus;
    type Result<T, E> = Result.Result<T, E>;

    // Stable storage for upgrades (remove redundant stable keywords)
    private stable var walletEntries : [(Principal, Wallet)] = [];
    private stable var transactionEntries : [(Text, Transaction)] = [];
    private stable var transactionIdCounter : Nat = 0;

    // Runtime storage (explicitly marked as transient)
    private transient var wallets = HashMap.HashMap<Principal, Wallet>(10, Principal.equal, Principal.hash);
    private transient var transactions = HashMap.HashMap<Text, Transaction>(50, Text.equal, Text.hash);
    private transient var userTransactions = HashMap.HashMap<Principal, [Text]>(10, Principal.equal, Principal.hash);

    // System functions for upgrades
    system func preupgrade() {
        walletEntries := Iter.toArray(wallets.entries());
        transactionEntries := Iter.toArray(transactions.entries());
    };

    system func postupgrade() {
        wallets := HashMap.fromIter(walletEntries.vals(), walletEntries.size(), Principal.equal, Principal.hash);
        transactions := HashMap.fromIter(transactionEntries.vals(), transactionEntries.size(), Text.equal, Text.hash);
        walletEntries := [];
        transactionEntries := [];
        
        // Rebuild user transaction indexes
        for ((txId, tx) in transactions.entries()) {
            let userTxs = switch(userTransactions.get(tx.fromPrincipal)) {
                case (?txs) Array.append(txs, [txId]);
                case null [txId];
            };
            userTransactions.put(tx.fromPrincipal, userTxs);
            
            // Also add to recipient's transactions if different
            if (tx.fromPrincipal != tx.toPrincipal) {
                let recipientTxs = switch(userTransactions.get(tx.toPrincipal)) {
                    case (?txs) Array.append(txs, [txId]);
                    case null [txId];
                };
                userTransactions.put(tx.toPrincipal, recipientTxs);
            };
        };
    };

    // Create or get wallet for a user
    public shared(msg) func createWallet() : async Result<Wallet, Text> {
        let caller = msg.caller;
        
        // Check if wallet already exists
        switch(wallets.get(caller)) {
            case (?existingWallet) {
                return #ok(existingWallet);
            };
            case null {};
        };

        // Create new wallet
        let newWallet : Wallet = {
            owner = caller;
            icpBalance = 0;
            usdBalance = 0;
            nairaBalance = 0;
            euroBalance = 0;
            createdAt = Time.now();
            lastTransactionAt = Time.now();
            isLocked = false;
            totalTransactions = 0;
        };

        wallets.put(caller, newWallet);
        
        Debug.print("Wallet created for: " # Principal.toText(caller));
        #ok(newWallet)
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

    // Get full wallet information
    public shared(msg) func getWallet() : async Result<Wallet, Text> {
        let caller = msg.caller;
        
        switch(wallets.get(caller)) {
            case null {
                #err("Wallet not found")
            };
            case (?wallet) {
                #ok(wallet)
            };
        };
    };

    // Safe subtraction function to avoid traps
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

    // Get specific transaction
    public query func getTransaction(txId: Text) : async ?Transaction {
        transactions.get(txId)
    };

    // Lock/unlock wallet (admin function)
    public shared(msg) func setWalletLock(owner: Principal, isLocked: Bool) : async Result<(), Text> {
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
    public query func healthCheck() : async {status: Text; timestamp: Int; walletCount: Nat} {
        {
            status = "healthy";
            timestamp = Time.now();
            walletCount = wallets.size();
        }
    };
}