import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Float "mo:base/Float";

import Types "types";
import Utils "utils";

actor Wallet {
    // Type imports
    type WalletInfo = Types.WalletInfo;
    type TokenBalance = Types.TokenBalance;
    type Transaction = Types.Transaction;
    type TokenType = Types.TokenType;
    type TransactionType = Types.TransactionType;
    type TransactionStatus = Types.TransactionStatus;
    type TransferRequest = Types.TransferRequest;
    type DepositRequest = Types.DepositRequest;
    type WithdrawalRequest = Types.WithdrawalRequest;
    type PortfolioStats = Types.PortfolioStats;
    type InvestmentInsight = Types.InvestmentInsight;
    type WalletError = Types.WalletError;
    type Result<T, E> = Types.Result<T, E>;

    // Storage
    private stable var walletEntries: [(Text, WalletInfo)] = [];
    private stable var transactionEntries: [(Text, Transaction)] = [];
    private stable var userTransactionEntries: [(Text, [Text])] = [];

    private var wallets = HashMap.HashMap<Text, WalletInfo>(10, Text.equal, Text.hash);
    private var transactions = HashMap.HashMap<Text, Transaction>(100, Text.equal, Text.hash);
    private var userTransactions = HashMap.HashMap<Text, [Text]>(10, Text.equal, Text.hash);

    // Initialize system
    system func preupgrade() {
        walletEntries := Iter.toArray(wallets.entries());
        transactionEntries := Iter.toArray(transactions.entries());
        userTransactionEntries := Iter.toArray(userTransactions.entries());
    };

    system func postupgrade() {
        wallets := HashMap.fromIter<Text, WalletInfo>(walletEntries.vals(), walletEntries.size(), Text.equal, Text.hash);
        transactions := HashMap.fromIter<Text, Transaction>(transactionEntries.vals(), transactionEntries.size(), Text.equal, Text.hash);
        userTransactions := HashMap.fromIter<Text, [Text]>(userTransactionEntries.vals(), userTransactionEntries.size(), Text.equal, Text.hash);
        
        Utils.logInfo("Wallet system initialized");
    };

    // Initialize demo data
    private func initializeDemoWallets() {
        let dummyPrincipal = Utils.getAnonymousPrincipal();
        
        let buyerWallet = Utils.createDemoWallet("buyer", dummyPrincipal);
        let sellerWallet = Utils.createDemoWallet("seller", dummyPrincipal);
        
        wallets.put(buyerWallet.userId, buyerWallet);
        wallets.put(sellerWallet.userId, sellerWallet);
        
        createDemoTransactions();
        
        Utils.logInfo("Demo wallets initialized");
    };

    // Create demo transactions
    private func createDemoTransactions() {
        let now = Time.now();
        let buyerUserId = "wallet_buyer_demo";
        
        let demoTransactions: [Transaction] = [
            {
                id = "txn_1";
                userId = buyerUserId;
                transactionType = #Purchase;
                tokenType = #ICP;
                amount = 278.57;
                usdValue = 1950.0;
                fromAddress = ?"user_wallet_addr";
                toAddress = ?"seller_wallet_addr";
                status = #Completed;
                timestamp = now - (24 * 60 * 60 * 1000000000);
                description = "Gold Bullion Purchase";
                fee = 0.01;
                hash = ?"0x1234...abcd";
            },
            {
                id = "txn_2";
                userId = buyerUserId;
                transactionType = #Deposit;
                tokenType = #ICP;
                amount = 500.0;
                usdValue = 3500.0;
                fromAddress = ?"external_wallet";
                toAddress = ?"user_wallet_addr";
                status = #Completed;
                timestamp = now - (2 * 24 * 60 * 60 * 1000000000);
                description = "ICP Deposit";
                fee = 0.0001;
                hash = ?"0x5678...efgh";
            },
            {
                id = "txn_3";
                userId = buyerUserId;
                transactionType = #Purchase;
                tokenType = #ICP;
                amount = 40.0;
                usdValue = 280.0;
                fromAddress = ?"user_wallet_addr";
                toAddress = ?"seller_wallet_addr";
                status = #Completed;
                timestamp = now - (4 * 24 * 60 * 60 * 1000000000);
                description = "Silver Bars Purchase";
                fee = 0.01;
                hash = ?"0x9abc...ijkl";
            },
            {
                id = "txn_4";
                userId = buyerUserId;
                transactionType = #Withdraw;
                tokenType = #ICP;
                amount = 100.0;
                usdValue = 700.0;
                fromAddress = ?"user_wallet_addr";
                toAddress = ?"external_wallet";
                status = #Completed;
                timestamp = now - (6 * 24 * 60 * 60 * 1000000000);
                description = "ICP Withdrawal";
                fee = 0.0001;
                hash = ?"0xdefg...mnop";
            },
            {
                id = "txn_5";
                userId = buyerUserId;
                transactionType = #Purchase;
                tokenType = #ICP;
                amount = 412.86;
                usdValue = 2890.0;
                fromAddress = ?"user_wallet_addr";
                toAddress = ?"seller_wallet_addr";
                status = #Completed;
                timestamp = now - (11 * 24 * 60 * 60 * 1000000000);
                description = "Agricultural Products";
                fee = 0.01;
                hash = ?"0xqrst...uvwx";
            }
        ];

        for (txn in demoTransactions.vals()) {
            transactions.put(txn.id, txn);
        };

        let transactionIds = Array.map<Transaction, Text>(demoTransactions, func(txn: Transaction): Text { txn.id });
        userTransactions.put(buyerUserId, transactionIds);
    };

    // Call initialization
    initializeDemoWallets();

    // PUBLIC FUNCTIONS

    // 1. GET WALLET INFO
    public shared(msg) func getWalletInfo(): async Result<WalletInfo, WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting wallet info for: " # userId);

        switch (wallets.get(userId)) {
            case (?wallet) {
                let updatedWallet = Utils.updateWalletActivity(wallet);
                wallets.put(userId, updatedWallet);
                #ok(updatedWallet)
            };
            case null {
                #err(#WalletNotFound)
            };
        }
    };

    // 2. CREATE WALLET
    public shared(msg) func createWallet(): async Result<WalletInfo, WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Creating wallet for: " # userId);

        switch (wallets.get(userId)) {
            case (?_existingWallet) {
                #err(#InternalError("Wallet already exists"))
            };
            case null {
                let newWallet = Utils.createDefaultWallet(userId, caller);
                wallets.put(userId, newWallet);
                Utils.logInfo("Wallet created successfully: " # userId);
                #ok(newWallet)
            };
        }
    };

    // 3. GET DEMO WALLET
    public func getDemoWallet(userType: Text): async Result<WalletInfo, WalletError> {
        let userId = "wallet_" # userType # "_demo";
        Utils.logInfo("Getting demo wallet for: " # userId);

        switch (wallets.get(userId)) {
            case (?wallet) { #ok(wallet) };
            case null {
                let dummyPrincipal = Utils.getAnonymousPrincipal();
                let demoWallet = Utils.createDemoWallet(userType, dummyPrincipal);
                wallets.put(userId, demoWallet);
                #ok(demoWallet)
            };
        }
    };

    // 4. TRANSFER TOKENS
    public shared(msg) func transfer(request: TransferRequest): async Result<Transaction, WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Transfer request from: " # userId);

        if (not Utils.isValidAddress(request.toAddress)) {
            return #err(#InvalidAddress);
        };

        if (not Utils.isValidAmount(request.amount)) {
            return #err(#InvalidAmount);
        };

        switch (wallets.get(userId)) {
            case (?wallet) {
                if (not Utils.hasSufficientBalance(wallet, request.amount, request.tokenType)) {
                    return #err(#InsufficientFunds);
                };

                let txnId = Utils.generateTransactionId();
                let fee = Utils.calculateFee(request.amount, request.tokenType);
                let usdValue = Utils.calculateUsdValue(request.amount, request.tokenType);
                
                let transaction: Transaction = {
                    id = txnId;
                    userId = userId;
                    transactionType = #Transfer;
                    tokenType = request.tokenType;
                    amount = request.amount;
                    usdValue = usdValue;
                    fromAddress = ?wallet.address;
                    toAddress = ?request.toAddress;
                    status = #Completed;
                    timestamp = Time.now();
                    description = switch (request.description) { case (?desc) { desc }; case null { "Token Transfer" } };
                    fee = fee;
                    hash = ?("0x" # txnId); // FIXED: Wrap in ?() for optional
                };

                transactions.put(txnId, transaction);
                
                let currentTxns = switch (userTransactions.get(userId)) {
                    case (?txns) { txns };
                    case null { [] };
                };
                let updatedTxns = Array.append(currentTxns, [txnId]);
                userTransactions.put(userId, updatedTxns);

                Utils.logInfo("Transfer completed: " # txnId);
                #ok(transaction)
            };
            case null {
                #err(#WalletNotFound)
            };
        }
    };

    // 5. DEPOSIT TOKENS
    public shared(msg) func deposit(request: DepositRequest): async Result<Transaction, WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Deposit request from: " # userId);

        if (not Utils.isValidAmount(request.amount)) {
            return #err(#InvalidAmount);
        };

        switch (wallets.get(userId)) {
            case (?wallet) {
                let txnId = Utils.generateTransactionId();
                let fee = Utils.calculateFee(request.amount, request.tokenType);
                let usdValue = Utils.calculateUsdValue(request.amount, request.tokenType);
                
                let transaction: Transaction = {
                    id = txnId;
                    userId = userId;
                    transactionType = #Deposit;
                    tokenType = request.tokenType;
                    amount = request.amount;
                    usdValue = usdValue;
                    fromAddress = ?"external_address";
                    toAddress = ?wallet.address;
                    status = #Completed;
                    timestamp = Time.now();
                    description = Utils.getTokenName(request.tokenType) # " Deposit";
                    fee = fee;
                    hash = ?("0x" # txnId); // FIXED: Wrap in ?() for optional
                };

                transactions.put(txnId, transaction);
                
                let currentTxns = switch (userTransactions.get(userId)) {
                    case (?txns) { txns };
                    case null { [] };
                };
                let updatedTxns = Array.append(currentTxns, [txnId]);
                userTransactions.put(userId, updatedTxns);

                Utils.logInfo("Deposit completed: " # txnId);
                #ok(transaction)
            };
            case null {
                #err(#WalletNotFound)
            };
        }
    };

    // 6. WITHDRAW TOKENS
    public shared(msg) func withdraw(request: WithdrawalRequest): async Result<Transaction, WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Withdrawal request from: " # userId);

        if (not Utils.isValidAddress(request.toAddress)) {
            return #err(#InvalidAddress);
        };

        if (not Utils.isValidAmount(request.amount)) {
            return #err(#InvalidAmount);
        };

        switch (wallets.get(userId)) {
            case (?wallet) {
                if (not Utils.hasSufficientBalance(wallet, request.amount, request.tokenType)) {
                    return #err(#InsufficientFunds);
                };

                let txnId = Utils.generateTransactionId();
                let fee = Utils.calculateFee(request.amount, request.tokenType);
                let usdValue = Utils.calculateUsdValue(request.amount, request.tokenType);
                
                let transaction: Transaction = {
                    id = txnId;
                    userId = userId;
                    transactionType = #Withdraw;
                    tokenType = request.tokenType;
                    amount = request.amount;
                    usdValue = usdValue;
                    fromAddress = ?wallet.address;
                    toAddress = ?request.toAddress;
                    status = #Completed;
                    timestamp = Time.now();
                    description = Utils.getTokenName(request.tokenType) # " Withdrawal";
                    fee = fee;
                    hash = ?("0x" # txnId); // FIXED: Wrap in ?() for optional
                };

                transactions.put(txnId, transaction);
                
                let currentTxns = switch (userTransactions.get(userId)) {
                    case (?txns) { txns };
                    case null { [] };
                };
                let updatedTxns = Array.append(currentTxns, [txnId]);
                userTransactions.put(userId, updatedTxns);

                Utils.logInfo("Withdrawal completed: " # txnId);
                #ok(transaction)
            };
            case null {
                #err(#WalletNotFound)
            };
        }
    };

    // 7. GET TRANSACTION HISTORY
    public shared(msg) func getTransactionHistory(): async Result<[Transaction], WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting transaction history for: " # userId);

        let transactionIds = switch (userTransactions.get(userId)) {
            case (?txnIds) { txnIds };
            case null { [] };
        };

        let userTxns = Array.mapFilter<Text, Transaction>(transactionIds, func(txnId: Text): ?Transaction {
            transactions.get(txnId)
        });

        let sortedTxns = Array.sort<Transaction>(userTxns, func(a: Transaction, b: Transaction): { #less; #equal; #greater } {
            if (a.timestamp > b.timestamp) { #less }
            else if (a.timestamp < b.timestamp) { #greater }
            else { #equal }
        });

        #ok(sortedTxns)
    };

    // 8. GET DEMO TRANSACTION HISTORY
    public func getDemoTransactionHistory(userType: Text): async Result<[Transaction], WalletError> {
        let userId = "wallet_" # userType # "_demo";
        Utils.logInfo("Getting demo transaction history for: " # userId);

        let transactionIds = switch (userTransactions.get(userId)) {
            case (?txnIds) { txnIds };
            case null { [] };
        };

        let userTxns = Array.mapFilter<Text, Transaction>(transactionIds, func(txnId: Text): ?Transaction {
            transactions.get(txnId)
        });

        let sortedTxns = Array.sort<Transaction>(userTxns, func(a: Transaction, b: Transaction): { #less; #equal; #greater } {
            if (a.timestamp > b.timestamp) { #less }
            else if (a.timestamp < b.timestamp) { #greater }
            else { #equal }
        });

        #ok(sortedTxns)
    };

    // 9. GET PORTFOLIO STATS
    public shared(msg) func getPortfolioStats(): async Result<PortfolioStats, WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting portfolio stats for: " # userId);

        switch (wallets.get(userId)) {
            case (?wallet) {
                let transactionIds = switch (userTransactions.get(userId)) {
                    case (?txnIds) { txnIds };
                    case null { [] };
                };

                let userTxns = Array.mapFilter<Text, Transaction>(transactionIds, func(txnId: Text): ?Transaction {
                    transactions.get(txnId)
                });

                let stats = Utils.calculatePortfolioStats(userTxns, wallet.totalUsdValue);
                #ok(stats)
            };
            case null {
                #err(#WalletNotFound)
            };
        }
    };

    // 10. GET INVESTMENT INSIGHTS
    public shared(msg) func getInvestmentInsights(): async Result<[InvestmentInsight], WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting investment insights for: " # userId);

        switch (wallets.get(userId)) {
            case (?wallet) {
                let insights = Utils.generateInvestmentInsights(wallet);
                #ok(insights)
            };
            case null {
                #err(#WalletNotFound)
            };
        }
    };

    // 11. GET TOKEN BALANCES
    public shared(msg) func getTokenBalances(): async Result<[TokenBalance], WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        switch (wallets.get(userId)) {
            case (?wallet) { #ok(wallet.tokens) };
            case null { #err(#WalletNotFound) };
        }
    };

    // 12. UPDATE TOKEN BALANCE
    public shared(msg) func updateTokenBalance(tokenType: TokenType, amount: Float, operation: Text): async Result<(), WalletError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Updating token balance for: " # userId);

        switch (wallets.get(userId)) {
            case (?wallet) {
                Utils.logInfo("Token balance update: " # operation # " " # Float.toText(amount) # " " # Utils.tokenTypeToText(tokenType));
                #ok(())
            };
            case null {
                #err(#WalletNotFound)
            };
        }
    };

    // UTILITY FUNCTIONS

    public query func getAllWallets(): async [WalletInfo] {
        Iter.toArray(wallets.vals())
    };

    public query func getWalletByAddress(address: Text): async ?WalletInfo {
        let walletsArray = Iter.toArray(wallets.vals());
        Array.find<WalletInfo>(walletsArray, func(wallet: WalletInfo): Bool {
            wallet.address == address
        })
    };

    public query func getSystemStats(): async {
        totalWallets: Nat;
        totalTransactions: Nat;
        totalVolume: Float;
        activeWallets: Nat;
    } {
        let allWallets = Iter.toArray(wallets.vals());
        let allTransactions = Iter.toArray(transactions.vals());
        
        let totalVolume = Array.foldLeft<Transaction, Float>(allTransactions, 0.0, func(acc: Float, txn: Transaction): Float {
            acc + txn.usdValue
        });

        let thirtyDaysAgo = Time.now() - (30 * 24 * 60 * 60 * 1000000000);
        let activeWallets = Array.foldLeft<WalletInfo, Nat>(allWallets, 0, func(acc: Nat, wallet: WalletInfo): Nat {
            if (wallet.lastActivity > thirtyDaysAgo) { acc + 1 } else { acc }
        });

        {
            totalWallets = allWallets.size();
            totalTransactions = allTransactions.size();
            totalVolume = totalVolume;
            activeWallets = activeWallets;
        }
    };

    public query func healthCheck(): async Text {
        "Wallet canister is running. Total wallets: " # debug_show(wallets.size())
    };
}