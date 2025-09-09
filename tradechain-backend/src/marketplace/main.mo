// src/marketplace/main.mo
import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Nat "mo:base/Nat";

import Types "types";
import Utils "utils";

actor Marketplace {
    // Type imports
    type Product = Types.Product;
    type ProductRequest = Types.ProductRequest;
    type Order = Types.Order;
    type OrderRequest = Types.OrderRequest;
    type OrderItem = Types.OrderItem;
    type Review = Types.Review;
    type ReviewRequest = Types.ReviewRequest;
    type SearchFilters = Types.SearchFilters;
    type SortOption = Types.SortOption;
    type Category = Types.Category;
    type SellerProfile = Types.SellerProfile;
    type PricingRecommendation = Types.PricingRecommendation;
    type MarketplaceError = Types.MarketplaceError;
    type Result<T, E> = Types.Result<T, E>;

    // Storage
    private stable var productEntries: [(Text, Product)] = [];
    private stable var orderEntries: [(Text, Order)] = [];
    private stable var reviewEntries: [(Text, Review)] = [];
    private stable var sellerProductEntries: [(Text, [Text])] = [];
    private stable var buyerOrderEntries: [(Text, [Text])] = [];
    private stable var productReviewEntries: [(Text, [Text])] = [];

    private var products = HashMap.HashMap<Text, Product>(100, Text.equal, Text.hash);
    private var orders = HashMap.HashMap<Text, Order>(50, Text.equal, Text.hash);
    private var reviews = HashMap.HashMap<Text, Review>(200, Text.equal, Text.hash);
    private var sellerProducts = HashMap.HashMap<Text, [Text]>(20, Text.equal, Text.hash);
    private var buyerOrders = HashMap.HashMap<Text, [Text]>(50, Text.equal, Text.hash);
    private var productReviews = HashMap.HashMap<Text, [Text]>(100, Text.equal, Text.hash);

    // Categories (static data)
    private let categories = Utils.getDefaultCategories();

    // Initialize system
    system func preupgrade() {
        productEntries := Iter.toArray(products.entries());
        orderEntries := Iter.toArray(orders.entries());
        reviewEntries := Iter.toArray(reviews.entries());
        sellerProductEntries := Iter.toArray(sellerProducts.entries());
        buyerOrderEntries := Iter.toArray(buyerOrders.entries());
        productReviewEntries := Iter.toArray(productReviews.entries());
    };

    system func postupgrade() {
        products := HashMap.fromIter<Text, Product>(productEntries.vals(), productEntries.size(), Text.equal, Text.hash);
        orders := HashMap.fromIter<Text, Order>(orderEntries.vals(), orderEntries.size(), Text.equal, Text.hash);
        reviews := HashMap.fromIter<Text, Review>(reviewEntries.vals(), reviewEntries.size(), Text.equal, Text.hash);
        sellerProducts := HashMap.fromIter<Text, [Text]>(sellerProductEntries.vals(), sellerProductEntries.size(), Text.equal, Text.hash);
        buyerOrders := HashMap.fromIter<Text, [Text]>(buyerOrderEntries.vals(), buyerOrderEntries.size(), Text.equal, Text.hash);
        productReviews := HashMap.fromIter<Text, [Text]>(productReviewEntries.vals(), productReviewEntries.size(), Text.equal, Text.hash);
        
        // Initialize demo data
        initializeDemoData();
    };

    // Initialize demo data
    private func initializeDemoData() {
        let sellerUserId = "user_seller_demo";
        
        // Create demo products
        let goldProduct = Utils.createDemoProduct("gold-bullion", sellerUserId, #PreciousMetals);
        let silverProduct = Utils.createDemoProduct("silver-bars", sellerUserId, #PreciousMetals);
        let wheatProduct = Utils.createDemoProduct("wheat", sellerUserId, #Agriculture);
        
        // Store products
        products.put(goldProduct.id, goldProduct);
        products.put(silverProduct.id, silverProduct);
        products.put(wheatProduct.id, wheatProduct);
        
        // Map seller to products
        let productIds = [goldProduct.id, silverProduct.id, wheatProduct.id];
        sellerProducts.put(sellerUserId, productIds);
        
        Utils.logInfo("Demo marketplace data initialized");
    };

    // Call initialization
    initializeDemoData();

    // Helper function to get products with filters (internal use)
    private func getProductsInternal(
        filters: ?SearchFilters,
        sortBy: ?SortOption,
        limit: ?Nat,
        offset: ?Nat
    ): {
        products: [Product];
        total: Nat;
        hasMore: Bool;
    } {
        let allProducts = Iter.toArray(products.vals());
        
        // Apply filters
        let filteredProducts = switch (filters) {
            case null { allProducts };
            case (?f) {
                Array.filter<Product>(allProducts, func(product: Product): Bool {
                    Utils.matchesFilters(product, f)
                })
            };
        };

        // Sort products
        let sortedProducts = switch (sortBy) {
            case null { Utils.sortProducts(filteredProducts, #Featured) };
            case (?sort) { Utils.sortProducts(filteredProducts, sort) };
        };

        // Apply pagination
        let startIndex = switch (offset) { case null { 0 }; case (?o) { o } };
        let pageSize = switch (limit) { case null { 20 }; case (?l) { l } };
        let endIndex = Nat.min(startIndex + pageSize, sortedProducts.size());
        
        let paginatedProducts = if (startIndex >= sortedProducts.size()) {
            []
        } else {
            Array.tabulate<Product>(endIndex - startIndex, func(i: Nat): Product {
                sortedProducts[startIndex + i]
            })
        };

        {
            products = paginatedProducts;
            total = filteredProducts.size();
            hasMore = endIndex < sortedProducts.size();
        }
    };

    // PUBLIC FUNCTIONS (Frontend Integration)

    // 1. GET ALL PRODUCTS (matches frontend marketplace page)
    public query func getProducts(
        filters: ?SearchFilters,
        sortBy: ?SortOption,
        limit: ?Nat,
        offset: ?Nat
    ): async {
        products: [Product];
        total: Nat;
        hasMore: Bool;
    } {
        Utils.logInfo("Getting products with filters");
        getProductsInternal(filters, sortBy, limit, offset)
    };

    // 2. GET PRODUCT BY ID (matches frontend product detail page)
    public query func getProduct(productId: Text): async Result<Product, MarketplaceError> {
        Utils.logInfo("Getting product: " # productId);

        switch (products.get(productId)) {
            case (?product) { #ok(product) };
            case null { #err(#ProductNotFound) };
        }
    };

    // 3. CREATE PRODUCT (matches frontend add-product page)
    public shared(msg) func createProduct(request: ProductRequest): async Result<Product, MarketplaceError> {
        let caller = msg.caller;
        let sellerId = Utils.generateUserId(caller);

        Utils.logInfo("Creating product for seller: " # sellerId);

        // Validate product data
        if (not Utils.validateProduct(request.name, request.description, request.price, request.stock)) {
            return #err(#InvalidProductData);
        };

        let productId = Utils.generateProductId();
        let now = Time.now();

        let product: Product = {
            id = productId;
            sellerId = sellerId;
            name = request.name;
            description = request.description;
            category = request.category;
            subcategory = request.subcategory;
            price = request.price;
            originalPrice = request.originalPrice;
            unit = request.unit;
            minOrder = request.minOrder;
            maxOrder = request.maxOrder;
            stock = request.stock;
            images = request.images;
            specifications = request.specifications;
            tags = request.tags;
            condition = request.condition;
            location = null;
            weight = request.weight;
            dimensions = request.dimensions;
            certification = request.certification;
            purity = request.purity;
            origin = request.origin;
            sku = request.sku;
            status = #Active;
            featured = false;
            rating = 0.0;
            reviewCount = 0;
            totalSales = 0;
            createdAt = now;
            updatedAt = now;
            shippingWeight = request.shippingWeight;
            shippingDimensions = request.shippingDimensions;
            processingTime = request.processingTime;
            shippingOptions = request.shippingOptions;
            returnPolicy = request.returnPolicy;
            warranty = request.warranty;
        };

        // Store product
        products.put(productId, product);

        // Update seller's product list
        let currentProducts = switch (sellerProducts.get(sellerId)) {
            case (?prods) { prods };
            case null { [] };
        };
        let updatedProducts = Array.append(currentProducts, [productId]);
        sellerProducts.put(sellerId, updatedProducts);

        Utils.logInfo("Product created successfully: " # productId);
        #ok(product)
    };

    // 4. UPDATE PRODUCT (for sellers)
    public shared(msg) func updateProduct(productId: Text, request: ProductRequest): async Result<Product, MarketplaceError> {
        let caller = msg.caller;
        let sellerId = Utils.generateUserId(caller);

        Utils.logInfo("Updating product: " # productId);

        switch (products.get(productId)) {
            case (?product) {
                // Check if caller is the seller
                if (product.sellerId != sellerId) {
                    return #err(#UnauthorizedSeller);
                };

                let updatedProduct: Product = {
                    product with
                    name = request.name;
                    description = request.description;
                    category = request.category;
                    subcategory = request.subcategory;
                    price = request.price;
                    originalPrice = request.originalPrice;
                    unit = request.unit;
                    minOrder = request.minOrder;
                    maxOrder = request.maxOrder;
                    stock = request.stock;
                    images = request.images;
                    specifications = request.specifications;
                    tags = request.tags;
                    condition = request.condition;
                    weight = request.weight;
                    dimensions = request.dimensions;
                    certification = request.certification;
                    purity = request.purity;
                    origin = request.origin;
                    sku = request.sku;
                    updatedAt = Time.now();
                    shippingWeight = request.shippingWeight;
                    shippingDimensions = request.shippingDimensions;
                    processingTime = request.processingTime;
                    shippingOptions = request.shippingOptions;
                    returnPolicy = request.returnPolicy;
                    warranty = request.warranty;
                };

                products.put(productId, updatedProduct);
                Utils.logInfo("Product updated successfully: " # productId);
                #ok(updatedProduct)
            };
            case null {
                #err(#ProductNotFound)
            };
        }
    };

    // 5. DELETE PRODUCT (for sellers)
    public shared(msg) func deleteProduct(productId: Text): async Result<(), MarketplaceError> {
        let caller = msg.caller;
        let sellerId = Utils.generateUserId(caller);

        Utils.logInfo("Deleting product: " # productId);

        switch (products.get(productId)) {
            case (?product) {
                // Check if caller is the seller
                if (product.sellerId != sellerId) {
                    return #err(#UnauthorizedSeller);
                };

                // Mark as removed instead of deleting (for order history)
                let updatedProduct = {
                    product with
                    status = #Removed;
                    updatedAt = Time.now();
                };
                products.put(productId, updatedProduct);

                Utils.logInfo("Product removed successfully: " # productId);
                #ok(())
            };
            case null {
                #err(#ProductNotFound)
            };
        }
    };

    // 6. GET SELLER PRODUCTS (matches frontend seller inventory)
    public shared(msg) func getSellerProducts(): async Result<[Product], MarketplaceError> {
        let caller = msg.caller;
        let sellerId = Utils.generateUserId(caller);

        Utils.logInfo("Getting products for seller: " # sellerId);

        let productIds = switch (sellerProducts.get(sellerId)) {
            case (?ids) { ids };
            case null { [] };
        };

        let sellerProductList = Array.mapFilter<Text, Product>(productIds, func(id: Text): ?Product {
            products.get(id)
        });

        #ok(sellerProductList)
    };

    // 7. PLACE ORDER (matches frontend checkout page)
    public shared(msg) func placeOrder(request: OrderRequest): async Result<Order, MarketplaceError> {
        let caller = msg.caller;
        let buyerId = Utils.generateUserId(caller);

        Utils.logInfo("Placing order for buyer: " # buyerId);

        // Validate order items
        if (not Utils.validateOrderItems(request.items)) {
            return #err(#InvalidOrderStatus);
        };

        // Calculate totals
        let subtotal = Array.foldLeft<OrderItem, Float>(
            request.items,
            0.0,
            func(acc: Float, item: OrderItem): Float {
                acc + item.totalPrice
            }
        );

        let (shipping, tax, total) = Utils.calculateOrderTotals(subtotal, null);

        // Get seller ID from first item (assuming single seller per order)
        let firstProductId = request.items[0].productId;
        let sellerId = switch (products.get(firstProductId)) {
            case (?product) { product.sellerId };
            case null { return #err(#ProductNotFound) };
        };

        // Validate user can place order
        if (not Utils.canPlaceOrder(buyerId, sellerId, total)) {
            return #err(#Unauthorized);
        };

        let orderId = Utils.generateOrderId();
        let now = Time.now();

        let order: Order = {
            id = orderId;
            buyerId = buyerId;
            sellerId = sellerId;
            items = request.items;
            subtotal = subtotal;
            shipping = shipping;
            tax = tax;
            total = total;
            shippingAddress = request.shippingAddress;
            status = #Pending;
            paymentMethod = request.paymentMethod;
            paymentStatus = "Pending";
            trackingNumber = null;
            notes = request.notes;
            createdAt = now;
            updatedAt = now;
            estimatedDelivery = ?Utils.calculateEstimatedDelivery(null, "Standard");
        };

        // Store order
        orders.put(orderId, order);

        // Update buyer's order list
        let currentOrders = switch (buyerOrders.get(buyerId)) {
            case (?orderIds) { orderIds };
            case null { [] };
        };
        let updatedOrders = Array.append(currentOrders, [orderId]);
        buyerOrders.put(buyerId, updatedOrders);

        // Update product stock
        for (item in request.items.vals()) {
            switch (products.get(item.productId)) {
                case (?product) {
                    if (product.stock >= item.quantity) {
                        let updatedProduct = {
                            product with
                            stock = product.stock - item.quantity;
                            totalSales = product.totalSales + item.quantity;
                            updatedAt = now;
                        };
                        products.put(item.productId, updatedProduct);
                    };
                };
                case null {};
            };
        };

        Utils.logInfo("Order placed successfully: " # orderId);
        #ok(order)
    };

    // 8. GET ORDER (matches frontend order tracking)
    public shared(msg) func getOrder(orderId: Text): async Result<Order, MarketplaceError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting order: " # orderId);

        switch (orders.get(orderId)) {
            case (?order) {
                // Check if user is buyer or seller
                if (order.buyerId == userId or order.sellerId == userId) {
                    #ok(order)
                } else {
                    #err(#Unauthorized)
                }
            };
            case null {
                #err(#OrderNotFound)
            };
        }
    };

    // 9. GET BUYER ORDERS (matches frontend purchase history)
    public shared(msg) func getBuyerOrders(): async Result<[Order], MarketplaceError> {
        let caller = msg.caller;
        let buyerId = Utils.generateUserId(caller);

        Utils.logInfo("Getting orders for buyer: " # buyerId);

        let orderIds = switch (buyerOrders.get(buyerId)) {
            case (?ids) { ids };
            case null { [] };
        };

        let buyerOrderList = Array.mapFilter<Text, Order>(orderIds, func(id: Text): ?Order {
            orders.get(id)
        });

        // Sort by creation date (newest first)
        let sortedOrders = Array.sort<Order>(buyerOrderList, func(a: Order, b: Order): { #less; #equal; #greater } {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        });

        #ok(sortedOrders)
    };

    // 10. GET SELLER ORDERS (matches frontend seller orders)
    public shared(msg) func getSellerOrders(): async Result<[Order], MarketplaceError> {
        let caller = msg.caller;
        let sellerId = Utils.generateUserId(caller);

        Utils.logInfo("Getting orders for seller: " # sellerId);

        let allOrders = Iter.toArray(orders.vals());
        let sellerOrderList = Array.filter<Order>(allOrders, func(order: Order): Bool {
            order.sellerId == sellerId
        });

        // Sort by creation date (newest first)
        let sortedOrders = Array.sort<Order>(sellerOrderList, func(a: Order, b: Order): { #less; #equal; #greater } {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        });

        #ok(sortedOrders)
    };

    // 11. ADD REVIEW (matches frontend product reviews)
    public shared(msg) func addReview(request: ReviewRequest): async Result<Review, MarketplaceError> {
        let caller = msg.caller;
        let buyerId = Utils.generateUserId(caller);

        Utils.logInfo("Adding review for product: " # request.productId);

        // Validate review rating
        if (request.rating < 1 or request.rating > 5) {
            return #err(#InvalidOrderStatus);
        };

        let reviewId = Utils.generateReviewId();
        let now = Time.now();

        let review: Review = {
            id = reviewId;
            productId = request.productId;
            buyerId = buyerId;
            orderId = request.orderId;
            rating = request.rating;
            title = request.title;
            comment = request.comment;
            images = request.images;
            verified = true;
            helpful = 0;
            createdAt = now;
        };

        // Store review
        reviews.put(reviewId, review);

        // Update product review list
        let currentReviews = switch (productReviews.get(request.productId)) {
            case (?reviewIds) { reviewIds };
            case null { [] };
        };
        let updatedReviews = Array.append(currentReviews, [reviewId]);
        productReviews.put(request.productId, updatedReviews);

        // Update product rating
        switch (products.get(request.productId)) {
            case (?product) {
                let (newRating, newReviewCount) = Utils.updateProductRating(
                    product.rating,
                    product.reviewCount,
                    request.rating
                );
                let updatedProduct = {
                    product with
                    rating = newRating;
                    reviewCount = newReviewCount;
                    updatedAt = now;
                };
                products.put(request.productId, updatedProduct);
            };
            case null {};
        };

        Utils.logInfo("Review added successfully: " # reviewId);
        #ok(review)
    };

    // 12. GET PRODUCT REVIEWS (matches frontend product reviews)
    public query func getProductReviews(productId: Text): async Result<[Review], MarketplaceError> {
        Utils.logInfo("Getting reviews for product: " # productId);

        let reviewIds = switch (productReviews.get(productId)) {
            case (?ids) { ids };
            case null { [] };
        };

        let productReviewList = Array.mapFilter<Text, Review>(reviewIds, func(id: Text): ?Review {
            reviews.get(id)
        });

        // Sort by creation date (newest first)
        let sortedReviews = Array.sort<Review>(productReviewList, func(a: Review, b: Review): { #less; #equal; #greater } {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        });

        #ok(sortedReviews)
    };

    // 13. GET CATEGORIES (matches frontend category pages)
    public query func getCategories(): async [Category] {
        Utils.logInfo("Getting categories");
        categories
    };

    // 14. GET FEATURED PRODUCTS (matches frontend featured section)
    public query func getFeaturedProducts(limit: ?Nat): async [Product] {
        Utils.logInfo("Getting featured products");

        let allProducts = Iter.toArray(products.vals());
        let featuredProducts = Array.filter<Product>(allProducts, func(product: Product): Bool {
            product.featured and product.status == #Active
        });

        let pageSize = switch (limit) { case null { 10 }; case (?l) { l } };
        let limitedProducts = Array.take<Product>(featuredProducts, pageSize);

        limitedProducts
    };

    // 15. GET AI PRICING RECOMMENDATIONS (matches frontend AI insights)
    public shared(msg) func getPricingRecommendations(): async Result<[PricingRecommendation], MarketplaceError> {
        let caller = msg.caller;
        let sellerId = Utils.generateUserId(caller);

        Utils.logInfo("Getting pricing recommendations for seller: " # sellerId);

        let productIds = switch (sellerProducts.get(sellerId)) {
            case (?ids) { ids };
            case null { [] };
        };

        let recommendations = Array.mapFilter<Text, PricingRecommendation>(productIds, func(id: Text): ?PricingRecommendation {
            switch (products.get(id)) {
                case (?product) {
                    // Mock market average (in real app, this would be calculated from market data)
                    let marketAverage = product.price * 1.02; // 2% above current price
                    ?Utils.generatePricingRecommendation(product, marketAverage)
                };
                case null { null };
            }
        });

        #ok(recommendations)
    };

    // UTILITY FUNCTIONS

    // Get marketplace statistics
    public query func getMarketplaceStats(): async {
        totalProducts: Nat;
        activeProducts: Nat;
        totalOrders: Nat;
        totalSellers: Nat;
        totalReviews: Nat;
        averageRating: Float;
    } {
        let allProducts = Iter.toArray(products.vals());
        let activeProducts = Array.filter<Product>(allProducts, func(p: Product): Bool {
            p.status == #Active
        });

        let allOrders = Iter.toArray(orders.vals());
        let allReviews = Iter.toArray(reviews.vals());
        let allSellers = Iter.toArray(sellerProducts.keys());

        // Calculate average rating
        let totalRatingPoints = Array.foldLeft<Product, Float>(
            allProducts,
            0.0,
            func(acc: Float, product: Product): Float {
                acc + product.rating
            }
        );
        let averageRating = if (allProducts.size() > 0) {
            totalRatingPoints / Float.fromInt(allProducts.size())
        } else { 0.0 };

        {
            totalProducts = allProducts.size();
            activeProducts = activeProducts.size();
            totalOrders = allOrders.size();
            totalSellers = allSellers.size();
            totalReviews = allReviews.size();
            averageRating = averageRating;
        }
    };

    // Search products by text query - FIXED VERSION
    public query func searchProducts(query: Text, limit: ?Nat): async [Product] {
        let filters: SearchFilters = {
            query = ?query;
            category = null;
            subcategory = null;
            minPrice = null;
            maxPrice = null;
            condition = null;
            location = null;
            inStock = true;
            featured = null;
            sellerId = null;
        };

        // Use the internal helper function instead of calling getProducts
        let result = getProductsInternal(?filters, ?#Featured, limit, null);
        result.products
    };

    // Health check
    public query func healthCheck(): async Text {
        "Marketplace canister is running. Total products: # debug_show(products.size())
    };
}