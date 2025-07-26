import Time "mo:base/Time";
import SharedTypes "../shared/types";

module {
    public type UserId = SharedTypes.UserId;
    public type Principal = SharedTypes.Principal;
    public type Time = SharedTypes.Time;
    public type Result<T, E> = SharedTypes.Result<T, E>;
    public type TokenType = SharedTypes.TokenType;
    public type TransactionType = SharedTypes.TransactionType;
    public type TransactionStatus = SharedTypes.TransactionStatus;
    public type WalletError = SharedTypes.WalletError;

    // Wallet Types (matching frontend wallet page)
    public type TokenBalance = {
        symbol: Text;
        name: Text;
        balance: Float;
        usdValue: Float;
        change24h: Float;
        color: Text;
    };

    public type WalletInfo = {
        userId: UserId;
        principal: Principal;
        address: Text; // ICP address
        totalBalance: Float;
        totalUsdValue: Float;
        tokens: [TokenBalance];
        createdAt: Time;
        lastActivity: Time;
    };

    // Transaction Types (matching frontend transaction history)
    public type Transaction = {
        id: Text;
        userId: UserId;
        transactionType: TransactionType;
        tokenType: TokenType;
        amount: Float;
        usdValue: Float;
        fromAddress: ?Text;
        toAddress: ?Text;
        status: TransactionStatus;
        timestamp: Time;
        description: Text;
        fee: Float;
        hash: ?Text; // Transaction hash
    };

    // Transfer Request (for frontend transfers)
    public type TransferRequest = {
        toAddress: Text;
        amount: Float;
        tokenType: TokenType;
        description: ?Text;
    };

    // Deposit Request (for frontend deposits)
    public type DepositRequest = {
        amount: Float;
        tokenType: TokenType;
    };

    // Withdrawal Request (for frontend withdrawals)
    public type WithdrawalRequest = {
        toAddress: Text;
        amount: Float;
        tokenType: TokenType;
    };

    // Portfolio Stats (for frontend dashboard)
    public type PortfolioStats = {
        totalValue: Float;
        dayChange: Float;
        dayChangePercent: Float;
        monthChange: Float;
        monthChangePercent: Float;
        totalTransactions: Nat;
        averageTransaction: Float;
        largestTransaction: Float;
    };

    // Token Price Data (for frontend display)
    public type TokenPrice = {
        symbol: Text;
        priceUsd: Float;
        change24h: Float;
        lastUpdated: Time;
    };

    // AI Investment Insight (for frontend AI recommendations)
    public type InvestmentInsight = {
        insightType: Text; // "diversification", "timing", "risk"
        title: Text;
        description: Text;
        priority: Text; // "high", "medium", "low"
        color: Text; // for UI styling
    };
}