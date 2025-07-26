import Time "mo:base/Time";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Random "mo:base/Random";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Types "types";

module {
    public type WalletInfo = Types.WalletInfo;
    public type TokenBalance = Types.TokenBalance;
    public type Transaction = Types.Transaction;
    public type TokenType = Types.TokenType;
    public type TransactionType = Types.TransactionType;
    public type TransactionStatus = Types.TransactionStatus;
    public type PortfolioStats = Types.PortfolioStats;
    public type InvestmentInsight = Types.InvestmentInsight;

    // Generate user ID from principal
    public func generateUserId(principal: Principal): Text {
        let principalText = Principal.toText(principal);
        "user_" # principalText
    };

    // Generate wallet address from principal
    public func generateWalletAddress(principal: Principal): Text {
        let principalText = Principal.toText(principal);
        principalText
    };

    // Generate transaction ID
    public func generateTransactionId(): Text {
        let now = Time.now();
        "txn_" # Int.toText(now)
    };

    // Get anonymous principal for demo purposes
    public func getAnonymousPrincipal(): Principal {
        Principal.fromText("2vxsx-fae")
    };

    // Validate wallet address format
    public func isValidAddress(address: Text): Bool {
        Text.size(address) > 10 and Text.contains(address, #char '-')
    };

    // Validate transaction amount
    public func isValidAmount(_amount: Float): Bool {
        _amount > 0.0 and _amount <= 1000000.0
    };

    // Get token symbol as text
    public func tokenTypeToText(tokenType: TokenType): Text {
        switch (tokenType) {
            case (#ICP) { "ICP" };
            case (#ckBTC) { "ckBTC" };
            case (#ckETH) { "ckETH" };
            case (#ckUSDC) { "ckUSDC" };
        }
    };

    // Get token name
    public func getTokenName(tokenType: TokenType): Text {
        switch (tokenType) {
            case (#ICP) { "Internet Computer" };
            case (#ckBTC) { "Chain Key Bitcoin" };
            case (#ckETH) { "Chain Key Ethereum" };
            case (#ckUSDC) { "Chain Key USDC" };
        }
    };

    // Get token color for UI
    public func getTokenColor(tokenType: TokenType): Text {
        switch (tokenType) {
            case (#ICP) { "#29D0B0" };
            case (#ckBTC) { "#F7931A" };
            case (#ckETH) { "#627EEA" };
            case (#ckUSDC) { "#2775CA" };
        }
    };

    // Get current token price
    public func getTokenPrice(tokenType: TokenType): Float {
        switch (tokenType) {
            case (#ICP) { 7.0 };
            case (#ckBTC) { 43000.0 };
            case (#ckETH) { 2800.0 };
            case (#ckUSDC) { 1.0 };
        }
    };

    // Calculate USD value
    public func calculateUsdValue(amount: Float, tokenType: TokenType): Float {
        amount * getTokenPrice(tokenType)
    };

    // Helper function to calculate sum of token values
    private func calculateTotalUsdValue(tokens: [TokenBalance]): Float {
        Array.foldLeft<TokenBalance, Float>(tokens, 0.0, func(acc: Float, token: TokenBalance): Float {
            acc + token.usdValue
        })
    };

    // Create default wallet for new user
    public func createDefaultWallet(userId: Text, principal: Principal): WalletInfo {
        let now = Time.now();
        let address = generateWalletAddress(principal);
        
        let tokens: [TokenBalance] = [
            {
                symbol = "ICP";
                name = "Internet Computer";
                balance = 1245.67;
                usdValue = 8719.69;
                change24h = 2.5;
                color = "#29D0B0";
            },
            {
                symbol = "ckBTC";
                name = "Chain Key Bitcoin";
                balance = 0.15;
                usdValue = 6450.0;
                change24h = -1.2;
                color = "#F7931A";
            },
            {
                symbol = "ckETH";
                name = "Chain Key Ethereum";
                balance = 2.8;
                usdValue = 7840.0;
                change24h = 3.8;
                color = "#627EEA";
            },
            {
                symbol = "ckUSDC";
                name = "Chain Key USDC";
                balance = 5000.0;
                usdValue = 5000.0;
                change24h = 0.1;
                color = "#2775CA";
            }
        ];

        let totalUsdValue = calculateTotalUsdValue(tokens);

        {
            userId = userId;
            principal = principal;
            address = address;
            totalBalance = 1245.67;
            totalUsdValue = totalUsdValue;
            tokens = tokens;
            createdAt = now;
            lastActivity = now;
        }
    };

    // Create demo wallet
    public func createDemoWallet(userType: Text, principal: Principal): WalletInfo {
        let now = Time.now();
        let address = generateWalletAddress(principal);
        
        let tokens: [TokenBalance] = [
            {
                symbol = "ICP";
                name = "Internet Computer";
                balance = 1245.67;
                usdValue = 8719.69;
                change24h = 2.5;
                color = "#29D0B0";
            },
            {
                symbol = "ckBTC";
                name = "Chain Key Bitcoin";
                balance = 0.15;
                usdValue = 6450.0;
                change24h = -1.2;
                color = "#F7931A";
            },
            {
                symbol = "ckETH";
                name = "Chain Key Ethereum";
                balance = 2.8;
                usdValue = 7840.0;
                change24h = 3.8;
                color = "#627EEA";
            },
            {
                symbol = "ckUSDC";
                name = "Chain Key USDC";
                balance = 5000.0;
                usdValue = 5000.0;
                change24h = 0.1;
                color = "#2775CA";
            }
        ];

        {
            userId = "wallet_" # userType # "_demo";
            principal = principal;
            address = address;
            totalBalance = 1245.67;
            totalUsdValue = 28009.69;
            tokens = tokens;
            createdAt = now - (365 * 24 * 60 * 60 * 1000000000);
            lastActivity = now;
        }
    };

    // Update wallet activity
    public func updateWalletActivity(wallet: WalletInfo): WalletInfo {
        {
            wallet with
            lastActivity = Time.now();
        }
    };

    // Calculate portfolio stats
    public func calculatePortfolioStats(transactions: [Transaction], totalValue: Float): PortfolioStats {
        let totalTransactions = transactions.size();
        
        let averageTransaction = if (totalTransactions > 0) {
            let totalAmount = Array.foldLeft<Transaction, Float>(transactions, 0.0, func(acc: Float, txn: Transaction): Float {
                acc + txn.usdValue
            });
            totalAmount / Float.fromInt(totalTransactions)
        } else { 0.0 };

        let largestTransaction = Array.foldLeft<Transaction, Float>(transactions, 0.0, func(acc: Float, txn: Transaction): Float {
            if (txn.usdValue > acc) { txn.usdValue } else { acc }
        });

        {
            totalValue = totalValue;
            dayChange = 218.50;
            dayChangePercent = 2.5;
            monthChange = 2750.00;
            monthChangePercent = 12.5;
            totalTransactions = totalTransactions;
            averageTransaction = averageTransaction;
            largestTransaction = largestTransaction;
        }
    };

    // Generate investment insights
    public func generateInvestmentInsights(_wallet: WalletInfo): [InvestmentInsight] {
        [
            {
                insightType = "diversification";
                title = "Diversification Opportunity";
                description = "Consider adding more agricultural commodities to balance your precious metals holdings.";
                priority = "medium";
                color = "green";
            },
            {
                insightType = "timing";
                title = "Market Timing";
                description = "Gold prices are trending upward. Good time to increase your position.";
                priority = "high";
                color = "blue";
            },
            {
                insightType = "risk";
                title = "Risk Assessment";
                description = "Your portfolio has moderate risk. Consider adding stable assets like timber.";
                priority = "low";
                color = "amber";
            }
        ]
    };

    // Calculate transaction fee
    public func calculateFee(_amount: Float, tokenType: TokenType): Float {
        switch (tokenType) {
            case (#ICP) { 0.0001 };
            case (#ckBTC) { 0.00001 };
            case (#ckETH) { 0.001 };
            case (#ckUSDC) { 0.01 };
        }
    };

    // Validate sufficient balance
    public func hasSufficientBalance(wallet: WalletInfo, amount: Float, tokenType: TokenType): Bool {
        let tokenSymbol = tokenTypeToText(tokenType);
        let tokenBalance = Array.find<TokenBalance>(wallet.tokens, func(token: TokenBalance): Bool {
            token.symbol == tokenSymbol
        });
        
        switch (tokenBalance) {
            case (?token) {
                let fee = calculateFee(amount, tokenType);
                token.balance >= (amount + fee)
            };
            case null { false };
        }
    };

    // Log debug information
    public func logInfo(message: Text) {
        Debug.print("Wallet: " # message);
    };
}