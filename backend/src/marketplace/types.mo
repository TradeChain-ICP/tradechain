import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
    
    // Token types (duplicated from wallet for independence)
    public type TokenType = {
        #ICP;
        #USD;
        #Naira;
        #Euro;
    };

    // Product status enumeration
    public type ProductStatus = {
        #pending;      // Awaiting admin approval
        #approved;     // Live on marketplace
        #rejected;     // Rejected by admin
        #soldOut;      // Out of stock
    };

    // Category type (simple for now, can be expanded)
    public type Category = {
        id: Text;
        name: Text;
        description: ?Text;
    };

    // Main product type
    public type Product = {
        id: Text;
        title: Text;
        description: Text;
        price: Nat;
        tokenType: TokenType;
        categoryId: Text;
        seller: Principal;
        status: ProductStatus;
        quantity: Nat;
        images: [Text];  // URLs to images
        createdAt: Int;
        updatedAt: Int;
    };

    // Create product request
    public type CreateProductRequest = {
        title: Text;
        description: Text;
        price: Nat;
        tokenType: TokenType;
        categoryId: Text;
        quantity: Nat;
        images: [Text];
    };

    // Update product request
    public type UpdateProductRequest = {
        title: ?Text;
        description: ?Text;
        price: ?Nat;
        tokenType: ?TokenType;
        quantity: ?Nat;
        images: ?[Text];
    };

    // Search filter
    public type SearchFilter = {
        keyword: ?Text;
        categoryId: ?Text;
        minPrice: ?Nat;
        maxPrice: ?Nat;
        status: ?ProductStatus;
        tokenType: ?TokenType;
    };

    // Pagination
    public type Pagination = {
        offset: Nat;
        limit: Nat;
    };

    // Product search result with pagination
    public type ProductPage = {
        products: [Product];
        total: Nat;
        hasMore: Bool;
    };

    // Seller's products summary
    public type SellerProductsSummary = {
        products: [Product];
        totalListings: Nat;
        approvedCount: Nat;
        pendingCount: Nat;
        totalValue: Nat;  // Sum of prices
    };

    // Marketplace statistics
    public type MarketplaceStats = {
        totalProducts: Nat;
        approvedProducts: Nat;
        totalListings: Nat;
        activeSellers: Nat;
        totalCategories: Nat;
        avgPrice: Nat;
    };

    // Error types
    public type MarketplaceError = {
        #ProductNotFound;
        #InvalidProductStatus;
        #InsufficientQuantity;
        #UnauthorizedSeller;
        #CategoryNotFound;
        #ValidationError: Text;
    };
}