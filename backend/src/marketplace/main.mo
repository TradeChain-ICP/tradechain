import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";

import Types "./types";

persistent actor Marketplace {
    
    // Type aliases
    type Product = Types.Product;
    type TokenType = Types.TokenType;
    type ProductStatus = Types.ProductStatus;
    type Category = Types.Category;
    type CreateProductRequest = Types.CreateProductRequest;
    type UpdateProductRequest = Types.UpdateProductRequest;
    type SearchFilter = Types.SearchFilter;
    type Pagination = Types.Pagination;
    type ProductPage = Types.ProductPage;
    type SellerProductsSummary = Types.SellerProductsSummary;
    type MarketplaceStats = Types.MarketplaceStats;
    type Result<T, E> = Result.Result<T, E>;

    // Stable storage for upgrades (using arrays instead of HashMap)
    private var products : [(Text, Product)] = [];
    private var categories : [(Text, Category)] = [];
    private var productIdCounter : Nat = 0;

    // Helper functions for array-based storage
    private func findProduct(id: Text) : ?Product {
        switch (Array.find<(Text, Product)>(products, func((prodId, _)) = prodId == id)) {
            case (?(_id, product)) ?product;
            case null null;
        }
    };

    private func findCategory(id: Text) : ?Category {
        switch (Array.find<(Text, Category)>(categories, func((catId, _)) = catId == id)) {
            case (?(_id, category)) ?category;
            case null null;
        }
    };

    private func updateProductInStorage(id: Text, product: Product) {
        products := Array.map<(Text, Product), (Text, Product)>(products, func((prodId, prod)) {
            if (prodId == id) (prodId, product) else (prodId, prod)
        });
    };

    private func addProduct(id: Text, product: Product) {
        let buffer = Buffer.fromArray<(Text, Product)>(products);
        buffer.add((id, product));
        products := Buffer.toArray(buffer);
    };

    private func getProductsBySeller(seller: Principal) : [Product] {
        Array.mapFilter<(Text, Product), Product>(products, func((_, product)) {
            if (product.seller == seller) ?product else null
        })
    };

    private func getProductsByStatus(status: ProductStatus) : [Product] {
        Array.mapFilter<(Text, Product), Product>(products, func((_, product)) {
            if (product.status == status) ?product else null
        })
    };

    private func getProductsByCategory(categoryId: Text) : [Product] {
        Array.mapFilter<(Text, Product), Product>(products, func((_, product)) {
            if (product.categoryId == categoryId) ?product else null
        })
    };

    // Initialize categories (predefined)
    private func initCategories() {
        if (categories.size() == 0) {
            let predefinedCategories : [(Text, Category)] = [
                ("metals", { id = "metals"; name = "Precious Metals"; description = ?("Gold, Silver, Platinum") }),
                ("energy", { id = "energy"; name = "Energy"; description = ?("Crude Oil, Natural Gas") }),
                ("agri", { id = "agri"; name = "Agricultural"; description = ?("Grains, Coffee, Cocoa") }),
                ("timber", { id = "timber"; name = "Timber"; description = ?("Sustainable wood products") })
            ];
            categories := predefinedCategories;
        };
    };

    // Initialize on first run
    initCategories();

    // Create a new product listing (seller only)
    public shared(msg) func createProduct(req: CreateProductRequest) : async Result<Product, Text> {
        let caller = msg.caller;

        // Validate category exists
        switch(findCategory(req.categoryId)) {
            case null return #err("Invalid category");
            case _ {};
        };

        // Validate quantity and price
        if (req.quantity == 0 or req.price == 0) {
            return #err("Quantity and price must be greater than 0");
        };

        productIdCounter += 1;
        let productId = "prod_" # Nat.toText(productIdCounter);

        let now = Time.now();
        let newProduct : Product = {
            id = productId;
            title = req.title;
            description = req.description;
            price = req.price;
            tokenType = req.tokenType;
            categoryId = req.categoryId;
            seller = caller;
            status = #active;  // Products are active by default
            quantity = req.quantity;
            images = req.images;
            createdAt = now;
            updatedAt = now;
        };

        addProduct(productId, newProduct);

        Debug.print("Product created: " # productId # " by " # Principal.toText(caller));
        #ok(newProduct)
    };

    // Update product (seller only)
    public shared(msg) func updateProduct(productId: Text, req: UpdateProductRequest) : async Result<Product, Text> {
        let caller = msg.caller;

        switch(findProduct(productId)) {
            case null #err("Product not found");
            case (?product) {
                if (product.seller != caller) {
                    return #err("Unauthorized: Not the product owner");
                };

                let now = Time.now();
                let newQuantity = switch(req.quantity) { case (?q) q; case null product.quantity };
                let newStatus = if (newQuantity == 0) #soldOut else #active;

                let updatedProduct : Product = {
                    id = product.id;
                    title = switch(req.title) { case (?t) t; case null product.title };
                    description = switch(req.description) { case (?d) d; case null product.description };
                    price = switch(req.price) { case (?p) p; case null product.price };
                    tokenType = switch(req.tokenType) { case (?tt) tt; case null product.tokenType };
                    categoryId = product.categoryId;  // Cannot change category for simplicity
                    seller = product.seller;
                    status = newStatus;
                    quantity = newQuantity;
                    images = switch(req.images) { case (?imgs) imgs; case null product.images };
                    createdAt = product.createdAt;
                    updatedAt = now;
                };

                updateProductInStorage(productId, updatedProduct);

                Debug.print("Product updated: " # productId);
                #ok(updatedProduct)
            };
        };
    };

    // Get product by ID
    public query func getProduct(productId: Text) : async ?Product {
        findProduct(productId)
    };

    // Search products with filters and pagination
    public query func searchProducts(filter: SearchFilter, pagination: Pagination) : async ProductPage {
        // Start with all products
        var filteredProducts = Array.map<(Text, Product), Product>(products, func((_, product)) = product);

        // Apply filters
        if (Option.isSome(filter.keyword)) {
            let keyword = switch (filter.keyword) { case (?k) k; case null "" };
            filteredProducts := Array.filter<Product>(filteredProducts, func(prod: Product): Bool {
                Text.contains(prod.title # " " # prod.description, #text keyword)
            });
        };

        if (Option.isSome(filter.categoryId)) {
            let catId = switch (filter.categoryId) { case (?c) c; case null "" };
            filteredProducts := Array.filter<Product>(filteredProducts, func(prod: Product): Bool {
                prod.categoryId == catId
            });
        };

        if (Option.isSome(filter.minPrice) or Option.isSome(filter.maxPrice)) {
            let minP = switch (filter.minPrice) { case (?m) m; case null 0 };
            let maxP = switch (filter.maxPrice) { case (?m) m; case null 999999999999999999 : Nat };
            filteredProducts := Array.filter<Product>(filteredProducts, func(prod: Product): Bool {
                prod.price >= minP and prod.price <= maxP
            });
        };

        if (Option.isSome(filter.tokenType)) {
            let tt = switch (filter.tokenType) { case (?t) t; case null #ICP };
            filteredProducts := Array.filter<Product>(filteredProducts, func(prod: Product): Bool {
                prod.tokenType == tt
            });
        };

        // Apply pagination
        let total = filteredProducts.size();
        let start = pagination.offset * pagination.limit;
        let end = Nat.min(start + pagination.limit, total);
        
        let pageProducts = if (start >= total) {
            []
        } else {
            Array.tabulate<Product>(end - start, func(i: Nat): Product {
                filteredProducts[start + i]
            })
        };

        let hasMore = end < total;

        {
            products = pageProducts;
            total = total;
            hasMore = hasMore;
        }
    };

    // Get seller's products
    public shared(msg) func getMyProducts(pagination: Pagination) : async SellerProductsSummary {
        let caller = msg.caller;
        let sellerProducts = getProductsBySeller(caller);

        // Apply pagination
        let total = sellerProducts.size();
        let start = pagination.offset * pagination.limit;
        let end = Nat.min(start + pagination.limit, total);
        
        let pageProducts = if (start >= total) {
            []
        } else {
            Array.tabulate<Product>(end - start, func(i: Nat): Product {
                sellerProducts[start + i]
            })
        };

        // Calculate summary
        var totalListings = 0;
        var activeCount = 0;
        var totalValue = 0;

        for (prod in sellerProducts.vals()) {
            totalListings += 1;
            switch(prod.status) {
                case (#active) {
                    activeCount += 1;
                    totalValue += prod.price;
                };
                case _ {};
            };
        };

        {
            products = pageProducts;
            totalListings = totalListings;
            activeCount = activeCount;
            totalValue = totalValue;
        }
    };

    // Get all categories
    public query func getCategories() : async [Category] {
        Array.map<(Text, Category), Category>(categories, func((_, category)) = category)
    };

    // Get marketplace statistics
    public query func getMarketplaceStats() : async MarketplaceStats {
        let allProducts = Array.map<(Text, Product), Product>(products, func((_, product)) = product);
        let activeProducts = Array.filter<Product>(allProducts, func(prod) = prod.status == #active);

        var totalPriceSum : Nat = 0;
        var countForAvg : Nat = 0;

        for (prod in allProducts.vals()) {
            totalPriceSum += prod.price;
            countForAvg += 1;
        };

        let avgPrice = if (countForAvg > 0) totalPriceSum / countForAvg else 0;

        // Count unique sellers
        let sellers = Array.mapFilter<Product, Principal>(allProducts, func(prod) = ?prod.seller);
        let uniqueSellers = Array.foldLeft<Principal, [Principal]>(sellers, [], func(acc, seller) {
            if (Option.isNull(Array.find<Principal>(acc, func(s) = s == seller))) {
                Array.append<Principal>(acc, [seller])
            } else {
                acc
            }
        });

        {
            totalProducts = allProducts.size();
            activeProducts = activeProducts.size();
            totalListings = allProducts.size();
            activeSellers = uniqueSellers.size();
            totalCategories = categories.size();
            avgPrice = avgPrice;
        }
    };

    // Health check
    public query func healthCheck() : async {status: Text; timestamp: Int; productCount: Nat} {
        {
            status = "healthy";
            timestamp = Time.now();
            productCount = products.size();
        }
    };
}