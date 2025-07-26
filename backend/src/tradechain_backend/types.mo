// types.mo - Type definitions for TradeChain
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

module {
    // Core Types
    public type Result<T, E> = Result.Result<T, E>;
    public type Time = Time.Time;
    public type Principal = Principal.Principal;

    // User Types
    public type UserRole = {
        #buyer;
        #seller;
        #admin;
    };

    public type UserProfile = {
        id: Principal;
        internetIdentity: Principal;
        role: UserRole;
        email: ?Text;
        name: Text;
        verified: Bool;
        createdAt: Time;
        updatedAt: Time;
        walletId: ?Text;
        totalTrades: Nat;
        rating: Float;
        isActive: Bool;
    };

    // Wallet Types
    public type WalletType = {
        #icp;
        #fiat_usd;
        #fiat_eur;
        #fiat_ngn;
    };

    public type Wallet = {
        id: Text;
        owner: Principal;
        walletType: WalletType;
        balance: Nat;
        isActive: Bool;
        createdAt: Time;
        lastTransactionAt: ?Time;
    };

    public type TransactionType = {
        #deposit;
        #withdrawal;
        #transfer;
        #escrow_lock;
        #escrow_release;
        #refund;
        #fee;
    };

    public type TransactionStatus = {
        #pending;
        #completed;
        #failed;
        #cancelled;
    };

    public type Transaction = {
        id: Text;
        from: ?Principal;
        to: ?Principal;
        amount: Nat;
        transactionType: TransactionType;
        status: TransactionStatus;
        currency: WalletType;
        reference: ?Text;
        createdAt: Time;
        completedAt: ?Time;
        metadata: ?Text;
    };

    // Marketplace Types
    public type CommodityCategory = {
        #metals; // Gold, Silver, Copper, etc.
        #energy; // Oil, Gas, Coal
        #timber; // Logs, Lumber
        #agriculture; // Cash crops, Grains
        #other;
    };

    public type CommoditySubcategory = {
        // Metals
        #gold;
        #silver;
        #copper;
        #platinum;
        
        // Energy  
        #crude_oil;
        #natural_gas;
        #coal;
        
        // Timber
        #hardwood;
        #softwood;
        #lumber;
        
        // Agriculture
        #wheat;
        #corn;
        #cocoa;
        #coffee;
        #cotton;
        
        #other_commodity;
    };

    public type ListingStatus = {
        #active;
        #sold;
        #cancelled;
        #suspended;
        #pending_approval;
    };

    public type CommodityListing = {
        id: Text;
        seller: Principal;
        title: Text;
        description: Text;
        category: CommodityCategory;
        subcategory: CommoditySubcategory;
        quantity: Nat; // in appropriate units (kg, tons, barrels, etc.)
        unit: Text; // "kg", "tons", "barrels", "m3"
        pricePerUnit: Nat; // in smallest currency unit
        currency: WalletType;
        totalPrice: Nat;
        images: [Text]; // URLs or IPFS hashes
        location: Text;
        quality: ?Text; // Quality grade/certificate
        certifications: [Text]; // Quality certificates
        minimumOrder: ?Nat;
        availableUntil: ?Time;
        status: ListingStatus;
        tags: [Text]; // AI-generated or manual tags
        views: Nat;
        favorites: Nat;
        createdAt: Time;
        updatedAt: Time;
        aiScore: ?Float; // AI recommendation score
    };

    public type CartItem = {
        listingId: Text;
        quantity: Nat;
        pricePerUnit: Nat;
        totalPrice: Nat;
        addedAt: Time;
    };

    public type Cart = {
        id: Text;
        buyer: Principal;
        items: [CartItem];
        totalValue: Nat;
        createdAt: Time;
        updatedAt: Time;
    };

    // Escrow Types
    public type EscrowStatus = {
        #created;
        #funded;
        #locked;
        #delivery_confirmed;
        #completed;
        #disputed;
        #refunded;
        #cancelled;
    };

    public type DisputeReason = {
        #quality_issues;
        #quantity_mismatch;
        #delivery_failure;
        #fraud_suspected;
        #other;
    };

    public type EscrowContract = {
        id: Text;
        buyer: Principal;
        seller: Principal;
        listingId: Text;
        amount: Nat;
        currency: WalletType;
        status: EscrowStatus;
        createdAt: Time;
        fundedAt: ?Time;
        lockedAt: ?Time;
        deliveryConfirmedAt: ?Time;
        completedAt: ?Time;
        disputeReason: ?DisputeReason;
        disputeDetails: ?Text;
        adminNotes: ?Text;
        logisticsReference: ?Text; // Reference to logistics API
        refundAmount: ?Nat;
        feeAmount: Nat; // Platform fee
    };

    // Analytics Types
    public type ListingAnalytics = {
        listingId: Text;
        views: Nat;
        favorites: Nat;
        inquiries: Nat;
        priceViews: Nat;
        avgViewDuration: ?Float;
        conversionRate: Float;
        lastAnalyzed: Time;
    };

    public type SellerAnalytics = {
        seller: Principal;
        totalListings: Nat;
        activeListings: Nat;
        soldListings: Nat;
        totalRevenue: Nat;
        avgListingPrice: Float;
        avgSaleTime: ?Float; // in days
        rating: Float;
        totalViews: Nat;
        conversionRate: Float;
        topCategories: [(CommodityCategory, Nat)];
        monthlyRevenue: [(Text, Nat)]; // "YYYY-MM" -> revenue
        lastUpdated: Time;
    };

    public type MarketAnalytics = {
        totalUsers: Nat;
        totalListings: Nat;
        totalTransactions: Nat;
        totalVolume: Nat;
        avgTransactionValue: Float;
        topCategories: [(CommodityCategory, Nat)];
        activeUsers: Nat; // last 30 days
        newUsersThisMonth: Nat;
        lastUpdated: Time;
    };

    // AI/ML Types
    public type AITag = {
        tag: Text;
        confidence: Float;
        category: Text;
    };

    public type PriceSuggestion = {
        suggestedPrice: Nat;
        confidence: Float;
        marketAverage: Nat;
        reasoning: Text;
        dataPoints: Nat;
        lastUpdated: Time;
    };

    public type AIInsights = {
        demandTrend: Text; // "increasing", "decreasing", "stable"
        seasonalFactors: ?Text;
        competitorCount: Nat;
        priceRange: {min: Nat; max: Nat; avg: Nat};
        suggestedTags: [AITag];
        marketPosition: Text; // "premium", "competitive", "budget"
    };

    // API Response Types
    public type ApiResponse<T> = {
        success: Bool;
        data: ?T;
        error: ?Text;
        timestamp: Time;
    };

    public type PaginatedResponse<T> = {
        items: [T];
        total: Nat;
        page: Nat;
        limit: Nat;
        hasNext: Bool;
        hasPrev: Bool;
    };

    // Request Types
    public type CreateListingRequest = {
        title: Text;
        description: Text;
        category: CommodityCategory;
        subcategory: CommoditySubcategory;
        quantity: Nat;
        unit: Text;
        pricePerUnit: Nat;
        currency: WalletType;
        images: [Text];
        location: Text;
        quality: ?Text;
        certifications: [Text];
        minimumOrder: ?Nat;
        availableUntil: ?Time;
        tags: [Text];
    };

    public type UpdateListingRequest = {
        listingId: Text;
        title: ?Text;
        description: ?Text;
        quantity: ?Nat;
        pricePerUnit: ?Nat;
        images: ?[Text];
        location: ?Text;
        quality: ?Text;
        certifications: ?[Text];
        minimumOrder: ?Nat;
        availableUntil: ?Time;
        tags: ?[Text];
        status: ?ListingStatus;
    };

    public type TransferRequest = {
        to: Principal;
        amount: Nat;
        currency: WalletType;
        reference: ?Text;
    };

    public type CreateEscrowRequest = {
        listingId: Text;
        quantity: Nat;
        buyer: Principal;
        seller: Principal;
    };

    // Error Types
    public type TradeChainError = {
        #UserNotFound;
        #InsufficientBalance;
        #WalletNotFound;
        #ListingNotFound;
        #ListingNotActive;
        #UnauthorizedAccess;
        #InvalidInput;
        #EscrowNotFound;
        #EscrowAlreadyExists;
        #InvalidEscrowStatus;
        #TransactionFailed;
        #InternalError: Text;
        #NotImplemented;
    };
}
