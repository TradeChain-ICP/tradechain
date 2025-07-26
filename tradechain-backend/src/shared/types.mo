import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

module {
    // Common Types
    public type Result<T, E> = Result.Result<T, E>;
    public type Time = Time.Time;
    public type Principal = Principal.Principal;

    // User Types
    public type UserId = Text;
    public type Email = Text;
    
    public type UserRole = {
        #Buyer;
        #Seller;
        #Admin;
    };

    public type KYCStatus = {
        #Pending;
        #Verified;
        #Rejected;
        #NotStarted;
    };

    public type AuthProvider = {
        #InternetIdentity;
        #Email;
    };

    // Wallet Types
    public type TokenType = {
        #ICP;
        #ckBTC;
        #ckETH;
        #ckUSDC;
    };

    public type TransactionType = {
        #Deposit;
        #Withdraw;
        #Purchase;
        #Sale;
        #Transfer;
    };

    public type TransactionStatus = {
        #Pending;
        #Completed;
        #Failed;
        #Cancelled;
    };

    // Marketplace Types
    public type ProductCategory = {
        #PreciousMetals;
        #OilGas;
        #Agriculture;
        #Timber;
    };

    public type ProductCondition = {
        #New;
        #Used;
        #Refurbished;
    };

    public type OrderStatus = {
        #Pending;
        #Confirmed;
        #Processing;
        #Shipped;
        #Delivered;
        #Cancelled;
        #Disputed;
    };

    public type ListingStatus = {
        #Active;
        #Inactive;
        #Sold;
        #Expired;
        #Removed;
    };

    // Error Types
    public type UserError = {
        #UserNotFound;
        #UserAlreadyExists;
        #InvalidCredentials;
        #Unauthorized;
        #InvalidInput: Text;
        #InternalError: Text;
    };

    public type WalletError = {
        #WalletNotFound;
        #InsufficientFunds;
        #InvalidAmount;
        #InvalidAddress;
        #TransactionFailed;
        #TokenNotSupported;
        #Unauthorized;
        #InternalError: Text;
    };

    public type MarketplaceError = {
        #ProductNotFound;
        #OrderNotFound;
        #InsufficientStock;
        #InvalidProductData;
        #UnauthorizedSeller;
        #ProductNotActive;
        #InvalidOrderStatus;
        #PaymentFailed;
        #Unauthorized;
        #InternalError: Text;
    };

    // Notification Types
    public type NotificationType = {
        #Welcome;
        #KYCApproved;
        #KYCRejected;
        #ProfileUpdated;
        #SecurityAlert;
        #TransactionCompleted;
        #DepositReceived;
        #WithdrawalProcessed;
        #ProductListed;
        #OrderPlaced;
        #OrderShipped;
        #OrderDelivered;
        #PaymentReceived;
    };
}