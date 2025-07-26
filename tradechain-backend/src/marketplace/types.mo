import Time "mo:base/Time";
import SharedTypes "../shared/types";

module {
    public type UserId = SharedTypes.UserId;
    public type Principal = SharedTypes.Principal;
    public type Time = SharedTypes.Time;
    public type Result<T, E> = SharedTypes.Result<T, E>;
    public type ProductCategory = SharedTypes.ProductCategory;
    public type ProductCondition = SharedTypes.ProductCondition;
    public type OrderStatus = SharedTypes.OrderStatus;
    public type ListingStatus = SharedTypes.ListingStatus;
    public type MarketplaceError = SharedTypes.MarketplaceError;

    // Product Types (matching frontend marketplace/product pages)
    public type ProductId = Text;
    public type OrderId = Text;
    public type ReviewId = Text;

    public type Product = {
        id: ProductId;
        sellerId: UserId;
        name: Text;
        description: Text;
        category: ProductCategory;
        subcategory: ?Text;
        price: Float;
        originalPrice: ?Float;
        unit: Text;
        minOrder: Nat;
        maxOrder: ?Nat;
        stock: Nat;
        images: [Text];
        specifications: [(Text, Text)]; // key-value pairs
        tags: [Text];
        condition: ProductCondition;
        location: ?Text;
        weight: ?Text;
        dimensions: ?Text;
        certification: ?Text;
        purity: ?Text;
        origin: ?Text;
        sku: ?Text;
        status: ListingStatus;
        featured: Bool;
        rating: Float;
        reviewCount: Nat;
        totalSales: Nat;
        createdAt: Time;
        updatedAt: Time;
        // Shipping info
        shippingWeight: ?Text;
        shippingDimensions: ?Text;
        processingTime: ?Text;
        shippingOptions: [Text];
        returnPolicy: ?Text;
        warranty: ?Text;
    };

    // Product Creation/Update (matching frontend add-product page)
    public type ProductRequest = {
        name: Text;
        description: Text;
        category: ProductCategory;
        subcategory: ?Text;
        price: Float;
        originalPrice: ?Float;
        unit: Text;
        minOrder: Nat;
        maxOrder: ?Nat;
        stock: Nat;
        images: [Text];
        specifications: [(Text, Text)];
        tags: [Text];
        condition: ProductCondition;
        weight: ?Text;
        dimensions: ?Text;
        certification: ?Text;
        purity: ?Text;
        origin: ?Text;
        sku: ?Text;
        shippingWeight: ?Text;
        shippingDimensions: ?Text;
        processingTime: ?Text;
        shippingOptions: [Text];
        returnPolicy: ?Text;
        warranty: ?Text;
    };

    // Search and Filter (matching frontend marketplace filters)
    public type SearchFilters = {
        query: ?Text;
        category: ?ProductCategory;
        subcategory: ?Text;
        minPrice: ?Float;
        maxPrice: ?Float;
        condition: ?ProductCondition;
        location: ?Text;
        inStock: Bool;
        featured: ?Bool;
        sellerId: ?UserId;
    };

    public type SortOption = {
        #Featured;
        #PriceLowToHigh;
        #PriceHighToLow;
        #Newest;
        #Rating;
        #Popular;
    };

    // Order Types (matching frontend checkout/cart pages)
    public type OrderItem = {
        productId: ProductId;
        quantity: Nat;
        price: Float; // Price at time of order
        totalPrice: Float;
    };

    public type ShippingAddress = {
        firstName: Text;
        lastName: Text;
        address: Text;
        city: Text;
        state: Text;
        zipCode: Text;
        country: Text;
        phone: ?Text;
    };

    public type Order = {
        id: OrderId;
        buyerId: UserId;
        sellerId: UserId;
        items: [OrderItem];
        subtotal: Float;
        shipping: Float;
        tax: Float;
        total: Float;
        shippingAddress: ShippingAddress;
        status: OrderStatus;
        paymentMethod: Text;
        paymentStatus: Text;
        trackingNumber: ?Text;
        notes: ?Text;
        createdAt: Time;
        updatedAt: Time;
        estimatedDelivery: ?Time;
    };

    // Order Creation (from frontend checkout)
    public type OrderRequest = {
        items: [OrderItem];
        shippingAddress: ShippingAddress;
        paymentMethod: Text;
        notes: ?Text;
    };

    // Review Types (matching frontend product reviews)
    public type Review = {
        id: ReviewId;
        productId: ProductId;
        buyerId: UserId;
        orderId: OrderId;
        rating: Nat; // 1-5
        title: ?Text;
        comment: Text;
        images: [Text];
        verified: Bool; // Verified purchase
        helpful: Nat; // Helpful votes
        createdAt: Time;
    };

    public type ReviewRequest = {
        productId: ProductId;
        orderId: OrderId;
        rating: Nat;
        title: ?Text;
        comment: Text;
        images: [Text];
    };

    // Category Information (for frontend category pages)
    public type Category = {
        id: Text;
        name: Text;
        description: Text;
        subcategories: [Text];
        productCount: Nat;
        image: ?Text;
    };

    // Seller Profile (for frontend seller pages)
    public type SellerProfile = {
        sellerId: UserId;
        businessName: Text;
        description: Text;
        rating: Float;
        totalSales: Nat;
        totalProducts: Nat;
        memberSince: Time;
        location: ?Text;
        verified: Bool;
        responseTime: Text;
        avatar: ?Text;
    };

    // Analytics Types (for frontend AI insights)
    public type ProductAnalytics = {
        productId: ProductId;
        views: Nat;
        favorites: Nat;
        cartAdds: Nat;
        purchases: Nat;
        conversionRate: Float;
        revenue: Float;
        avgRating: Float;
        topSearchTerms: [Text];
    };

    public type MarketTrend = {
        category: ProductCategory;
        trend: Text; // "up", "down", "stable"
        change: Float; // percentage change
        volume: Nat;
        avgPrice: Float;
        timeframe: Text;
    };

    // AI Recommendations (matching frontend AI features)
    public type PricingRecommendation = {
        productId: ProductId;
        currentPrice: Float;
        suggestedPrice: Float;
        confidence: Float;
        reasoning: Text;
        expectedImpact: Text;
    };

    public type ProductRecommendation = {
        productId: ProductId;
        reason: Text;
        confidence: Float;
        category: Text; // "similar", "trending", "popular"
    };
}