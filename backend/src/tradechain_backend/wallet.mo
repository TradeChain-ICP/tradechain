// wallet.mo - Wallet & Payments Module
import Time "mo:base/Time";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Random "mo:base/Random";
import Blob "mo:base/Blob";

import Types "./types";

module WalletModule {
    type Result<T, E> = Types.Result<T, E>;
    type Wallet = Types.Wallet;
    type WalletType = Types.WalletType;
    type Transaction = Types.Transaction;
    type TransactionType = Types.TransactionType;
    type TransactionStatus = Types.TransactionStatus;
    type TransferRequest = Types.TransferRequest;
    type TradeChainError = Types.TradeChainError;

    public class WalletManager() {
        // Storage
        private stable var walletEntries : [(Text, Wallet)] = [];
        private var wallets = HashMap.HashMap<Text, Wallet>(10, Text.equal, Text.hash);

        private stable var transactionEntries : [(Text, Transaction)] = [];
        private var transactions = HashMap.HashMap<Text, Transaction>(10, Text.equal, Text.hash);

        // User wallet mapping (Principal -> [WalletId])
        private stable var userWalletEntries : [(Principal, [Text])] = [];
        private var userWallets = HashMap.HashMap<Principal, [Text]>(10, Principal.equal, Principal.hash);

        // Counter for generating unique IDs
        private stable var walletCounter : Nat = 0;
        private stable var transactionCounter : Nat = 0;

        // System upgrade hooks
        system func preupgrade() {
            walletEntries := Iter.toArray(wallets.entries());
            transactionEntries := Iter.toArray(transactions.entries());
            userWalletEntries := Iter.toArray(userWallets.entries());
        };

        system func postupgrade() {
            wallets := HashMap.fromIter<Text, Wallet>(walletEntries.vals(), walletEntries.size(), Text.equal, Text.hash);
            transactions := HashMap.fromIter<Text, Transaction>(transactionEntries.vals(), transactionEntries.size(), Text.equal, Text.hash);
            userWallets := HashMap.fromIter<Principal, [Text]>(userWalletEntries.vals(), userWalletEntries.size(), Principal.equal, Principal.hash);
            walletEntries := [];
            transactionEntries := [];
            userWalletEntries := [];
        };

        // Utility Functions
        private func generateWalletId(): Text {
            walletCounter += 1;
            "wallet_" # Nat.toText(walletCounter) # "_" # Int.toText(Time.now())
        };

        private func generateTransactionId(): Text {
            transactionCounter += 1;
            "tx_" # Nat.toText(transactionCounter) # "_" # Int.toText(Time.now())
        };

        // Wallet Management Functions

        public func createWallet(
            owner: Principal,
            walletType: WalletType
        ): Result<Wallet, TradeChainError> {
            let walletId = generateWalletId();
            let now = Time.now();

            let newWallet: Wallet = {
                id = walletId;
                owner = owner;
                walletType = walletType;
                balance = 0;
                isActive = true;
                createdAt = now;
                lastTransactionAt = null;
            };

            wallets.put(walletId, newWallet);
            
            // Update user wallet mapping
            let currentWallets = Option.get(userWallets.get(owner), []);
            let updatedWallets = Array.append(currentWallets, [walletId]);
            userWallets.put(owner, updatedWallets);

            #ok(newWallet)
        };

        public func getWallet(walletId: Text): Result<Wallet, TradeChainError> {
            switch (wallets.get(walletId)) {
                case (?wallet) { #ok(wallet) };
                case null { #err(#WalletNotFound) };
            }
        };

        public func getUserWallets(owner: Principal): [Wallet] {
            switch (userWallets.get(owner)) {
                case (?walletIds) {
                    Array.mapFilter<Text, Wallet>(walletIds, func(walletId) {
                        wallets.get(walletId)
                    })
                };
                case null { [] };
            }
        };

        public func getUserWalletByType(owner: Principal, walletType: WalletType): Result<Wallet, TradeChainError> {
            let userWalletList = getUserWallets(owner);
            let matchingWallet = Array.find<Wallet>(userWalletList, func(wallet) {
                wallet.walletType == walletType and wallet.isActive
            });
            
            switch (matchingWallet) {
                case (?wallet) { #ok(wallet) };
                case null { #err(#WalletNotFound) };
            }
        };

        public func deactivateWallet(walletId: Text, caller: Principal): Result<Wallet, TradeChainError> {
            switch (wallets.get(walletId)) {
                case (?wallet) {
                    if (wallet.owner != caller) {
                        return #err(#UnauthorizedAccess);
                    };
                    
                    let updatedWallet: Wallet = {
                        wallet with
                        isActive = false;
                    };
                    wallets.put(walletId, updatedWallet);
                    #ok(updatedWallet)
                };
                case null { #err(#WalletNotFound) };
            }
        };

        // Balance Management

        public func getBalance(walletId: Text): Result<Nat, TradeChainError> {
            switch (wallets.get(walletId)) {
                case (?wallet) { #ok(wallet.balance) };
                case null { #err(#WalletNotFound) };
            }
        };

        private func updateWalletBalance(walletId: Text, newBalance: Nat): Result<Wallet, TradeChainError> {
            switch (wallets.get(walletId)) {
                case (?wallet) {
                    let updatedWallet: Wallet = {
                        wallet with
                        balance = newBalance;
                        lastTransactionAt = ?Time.now();
                    };
                    wallets.put(walletId, updatedWallet);
                    #ok(updatedWallet)
                };
                case null { #err(#WalletNotFound) };
            }
        };

        // Transaction Functions

        public func deposit(
            walletId: Text,
            amount: Nat,
            reference: ?Text
        ): Result<Transaction, TradeChainError> {
            if (amount == 0) {
                return #err(#InvalidInput);
            };

            switch (wallets.get(walletId)) {
                case (?wallet) {
                    if (not wallet.isActive) {
                        return #err(#InternalError("Wallet is not active"));
                    };

                    let newBalance = wallet.balance + amount;
                    let _ = updateWalletBalance(walletId, newBalance);
                    
                    let transactionId = generateTransactionId();
                    let transaction: Transaction = {
                        id = transactionId;
                        from = null;
                        to = ?wallet.owner;
                        amount = amount;
                        transactionType = #deposit;
                        status = #completed;
                        currency = wallet.walletType;
                        reference = reference;
                        createdAt = Time.now();
                        completedAt = ?Time.now();
                        metadata = ?("Deposit to wallet " # walletId);
                    };

                    transactions.put(transactionId, transaction);
                    #ok(transaction)
                };
                case null { #err(#WalletNotFound) };
            }
        };

        public func withdraw(
            walletId: Text,
            amount: Nat,
            caller: Principal,
            reference: ?Text
        ): Result<Transaction, TradeChainError> {
            if (amount == 0) {
                return #err(#InvalidInput);
            };

            switch (wallets.get(walletId)) {
                case (?wallet) {
                    if (wallet.owner != caller) {
                        return #err(#UnauthorizedAccess);
                    };
                    
                    if (not wallet.isActive) {
                        return #err(#InternalError("Wallet is not active"));
                    };

                    if (wallet.balance < amount) {
                        return #err(#InsufficientBalance);
                    };

                    let newBalance = wallet.balance - amount;
                    let _ = updateWalletBalance(walletId, newBalance);
                    
                    let transactionId = generateTransactionId();
                    let transaction: Transaction = {
                        id = transactionId;
                        from = ?wallet.owner;
                        to = null;
                        amount = amount;
                        transactionType = #withdrawal;
                        status = #completed;
                        currency = wallet.walletType;
                        reference = reference;
                        createdAt = Time.now();
                        completedAt = ?Time.now();
                        metadata = ?("Withdrawal from wallet " # walletId);
                    };

                    transactions.put(transactionId, transaction);
                    #ok(transaction)
                };
                case null { #err(#WalletNotFound) };
            }
        };

        public func transfer(
            fromWalletId: Text,
            toWalletId: Text,
            amount: Nat,
            caller: Principal,
            reference: ?Text
        ): Result<Transaction, TradeChainError> {
            if (amount == 0) {
                return #err(#InvalidInput);
            };

            if (fromWalletId == toWalletId) {
                return #err(#InvalidInput);
            };

            switch (wallets.get(fromWalletId), wallets.get(toWalletId)) {
                case (?fromWallet, ?toWallet) {
                    if (fromWallet.owner != caller) {
                        return #err(#UnauthorizedAccess);
                    };
                    
                    if (not fromWallet.isActive or not toWallet.isActive) {
                        return #err(#InternalError("One or both wallets are not active"));
                    };

                    if (fromWallet.walletType != toWallet.walletType) {
                        return #err(#InternalError("Currency mismatch"));
                    };

                    if (fromWallet.balance < amount) {
                        return #err(#InsufficientBalance);
                    };

                    // Update balances
                    let newFromBalance = fromWallet.balance - amount;
                    let newToBalance = toWallet.balance + amount;
                    
                    let _ = updateWalletBalance(fromWalletId, newFromBalance);
                    let _ = updateWalletBalance(toWalletId, newToBalance);
                    
                    let transactionId = generateTransactionId();
                    let transaction: Transaction = {
                        id = transactionId;
                        from = ?fromWallet.owner;
                        to = ?toWallet.owner;
                        amount = amount;
                        transactionType = #transfer;
                        status = #completed;
                        currency = fromWallet.walletType;
                        reference = reference;
                        createdAt = Time.now();
                        completedAt = ?Time.now();
                        metadata = ?("Transfer from " # fromWalletId # " to " # toWalletId);
                    };

                    transactions.put(transactionId, transaction);
                    #ok(transaction)
                };
                case (null, _) { #err(#WalletNotFound) };
                case (_, null) { #err(#WalletNotFound) };
            }
        };

        // Escrow-specific functions

        public func lockFunds(
            walletId: Text,
            amount: Nat,
            escrowId: Text,
            caller: Principal
        ): Result<Transaction, TradeChainError> {
            if (amount == 0) {
                return #err(#InvalidInput);
            };

            switch (wallets.get(walletId)) {
                case (?wallet) {
                    if (wallet.owner != caller) {
                        return #err(#UnauthorizedAccess);
                    };
                    
                    if (not wallet.isActive) {
                        return #err(#InternalError("Wallet is not active"));
                    };

                    if (wallet.balance < amount) {
                        return #err(#InsufficientBalance);
                    };

                    let newBalance = wallet.balance - amount;
                    let _ = updateWalletBalance(walletId, newBalance);
                    
                    let transactionId = generateTransactionId();
                    let transaction: Transaction = {
                        id = transactionId;
                        from = ?wallet.owner;
                        to = null;
                        amount = amount;
                        transactionType = #escrow_lock;
                        status = #completed;
                        currency = wallet.walletType;
                        reference = ?escrowId;
                        createdAt = Time.now();
                        completedAt = ?Time.now();
                        metadata = ?("Funds locked for escrow " # escrowId);
                    };

                    transactions.put(transactionId, transaction);
                    #ok(transaction)
                };
                case null { #err(#WalletNotFound) };
            }
        };

        public func releaseFunds(
            walletId: Text,
            amount: Nat,
            escrowId: Text
        ): Result<Transaction, TradeChainError> {
            if (amount == 0) {
                return #err(#InvalidInput);
            };

            switch (wallets.get(walletId)) {
                case (?wallet) {
                    if (not wallet.isActive) {
                        return #err(#InternalError("Wallet is not active"));
                    };

                    let newBalance = wallet.balance + amount;
                    let _ = updateWalletBalance(walletId, newBalance);
                    
                    let transactionId = generateTransactionId();
                    let transaction: Transaction = {
                        id = transactionId;
                        from = null;
                        to = ?wallet.owner;
                        amount = amount;
                        transactionType = #escrow_release;
                        status = #completed;
                        currency = wallet.walletType;
                        reference = ?escrowId;
                        createdAt = Time.now();
                        completedAt = ?Time.now();
                        metadata = ?("Funds released from escrow " # escrowId);
                    };

                    transactions.put(transactionId, transaction);
                    #ok(transaction)
                };
                case null { #err(#WalletNotFound) };
            }
        };

        // Transaction History & Queries

        public func getTransaction(transactionId: Text): Result<Transaction, TradeChainError> {
            switch (transactions.get(transactionId)) {
                case (?transaction) { #ok(transaction) };
                case null { #err(#InternalError("Transaction not found")) };
            }
        };

        public func getUserTransactions(userId: Principal): [Transaction] {
            let userTransactions = Iter.filter(transactions.vals(), func(tx: Transaction): Bool {
                switch (tx.from, tx.to) {
                    case (?from, ?to) { from == userId or to == userId };
                    case (?from, null) { from == userId };
                    case (null, ?to) { to == userId };
                    case (null, null) { false };
                }
            });
            Iter.toArray(userTransactions)
        };

        public func getWalletTransactions(walletId: Text): [Transaction] {
            switch (wallets.get(walletId)) {
                case (?wallet) {
                    let walletTransactions = Iter.filter(transactions.vals(), func(tx: Transaction): Bool {
                        switch (tx.from, tx.to) {
                            case (?from, ?to) { from == wallet.owner or to == wallet.owner };
                            case (?from, null) { from == wallet.owner };
                            case (null, ?to) { to == wallet.owner };
                            case (null, null) { false };
                        }
                    });
                    Iter.toArray(walletTransactions)
                };
                case null { [] };
            }
        };

        public func getTransactionsByDateRange(
            userId: Principal,
            startTime: Time.Time,
            endTime: Time.Time
        ): [Transaction] {
            let userTransactions = getUserTransactions(userId);
            Array.filter<Transaction>(userTransactions, func(tx) {
                tx.createdAt >= startTime and tx.createdAt <= endTime
            })
        };

        public func getTransactionsByType(
            userId: Principal,
            transactionType: TransactionType
        ): [Transaction] {
            let userTransactions = getUserTransactions(userId);
            Array.filter<Transaction>(userTransactions, func(tx) {
                tx.transactionType == transactionType
            })
        };

        // Analytics & Statistics

        public func getTotalBalance(userId: Principal): Nat {
            let userWalletList = getUserWallets(userId);
            Array.foldLeft<Wallet, Nat>(userWalletList, 0, func(acc, wallet) {
                acc + wallet.balance
            })
        };

        public func getTotalBalanceByType(userId: Principal, walletType: WalletType): Nat {
            let userWalletList = getUserWallets(userId);
            let matchingWallets = Array.filter<Wallet>(userWalletList, func(wallet) {
                wallet.walletType == walletType and wallet.isActive
            });
            Array.foldLeft<Wallet, Nat>(matchingWallets, 0, func(acc, wallet) {
                acc + wallet.balance
            })
        };

        public func getTransactionVolume(userId: Principal): Nat {
            let userTransactions = getUserTransactions(userId);
            Array.foldLeft<Transaction, Nat>(userTransactions, 0, func(acc, tx) {
                if (tx.status == #completed) {
                    acc + tx.amount
                } else {
                    acc
                }
            })
        };

        // Validation & Security

        public func validateWalletAccess(walletId: Text, caller: Principal): Bool {
            switch (wallets.get(walletId)) {
                case (?wallet) { wallet.owner == caller };
                case null { false };
            }
        };

        public func isWalletActive(walletId: Text): Bool {
            switch (wallets.get(walletId)) {
                case (?wallet) { wallet.isActive };
                case null { false };
            }
        };

        public func hasInsufficientBalance(walletId: Text, amount: Nat): Bool {
            switch (wallets.get(walletId)) {
                case (?wallet) { wallet.balance < amount };
                case null { true };
            }
        };

        // System queries

        public func getAllWallets(): [Wallet] {
            Iter.toArray(wallets.vals())
        };

        public func getAllTransactions(): [Transaction] {
            Iter.toArray(transactions.vals())
        };

        public func getWalletsCount(): Nat {
            wallets.size()
        };

        public func getTransactionsCount(): Nat {
            transactions.size()
        };
    }
}
