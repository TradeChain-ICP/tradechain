// src/marketplace/utils.mo
import Time "mo:base/Time";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Types "types";

module {
    public type Product = Types.Product;
    public type ProductCategory = Types.ProductCategory;
    public type ProductCondition = Types.ProductCondition;
    public type ListingStatus = Types.ListingStatus;
    public type OrderStatus = Types.OrderStatus;
    public type Order = Types.Order;
    public type SearchFilters = Types.SearchFilters;
    public type SortOption = Types.SortOption;
    public type Category = Types.Category;

    // Generate user ID from principal (shared with other canisters)
    public func generateUserId(principal: Principal): Text {
        let principalText = Principal.toText(principal);
        "user_" # principalText
    };

    // Get anonymous principal for demo users
    public func getAnonymousPrincipal(): Principal {
        Principal.fromText("2vxsx-fae")
    };

    // Generate unique product ID
    public func generateProductId(): Text {
        let now = Time.now();
        "prod_" # Int.toText(now)
    };

    // Generate unique order ID
    public func generateOrderId(): Text {
        let now = Time.now();
        "ord_" # Int.toText(now)
    };

    // Generate unique review ID
    public func generateReviewId(): Text {
        let now = Time.now();
        "rev_" # Int.toText(now)
    };

    // Convert category to text
    public func categoryToText(category: ProductCategory): Text {
        switch (category) {
            case (#PreciousMetals) { "Precious Metals" };
            case (#OilGas) { "Oil & Gas" };
            case (#Agriculture) { "Agriculture" };
            case (#Timber) { "Timber" };
        }
    };

    // Convert condition to text
    public func conditionToText(condition: ProductCondition): Text {
        switch (condition) {
            case (#New) { "New" };
            case (#Used) { "Used" };
            case (#Refurbished) { "Refurbished" };
        }
    };

    // Convert order status to text
    public func orderStatusToText(status: OrderStatus): Text {
        switch (status) {
            case (#Pending) { "Pending" };
            case (#Confirmed) { "Confirmed" };
            case (#Processing) { "Processing" };
            case (#Shipped) { "Shipped" };
            case (#Delivered) { "Delivered" };
            case (#Cancelled) { "Cancelled" };
            case (#Disputed) { "Disputed" };
        }
    };

    // Validate product data
    public func validateProduct(name: Text, description: Text, price: Float, stock: Nat): Bool {
        Text.size(name) > 0 and
        Text.size(description) > 0 and
        price > 0.0 and
        stock >= 0
    };

    // Calculate discount percentage
    public func calculateDiscount(originalPrice: Float, currentPrice: Float): Float {
        if (originalPrice <= currentPrice) {
            0.0
        } else {
            ((originalPrice - currentPrice) / originalPrice) * 100.0
        }
    };

    // Check if product matches search filters
    public func matchesFilters(product: Product, filters: SearchFilters): Bool {
        // Check query (name, description, tags)
        let matchesQuery = switch (filters.query) {
            case null { true };
            case (?q) {
                let queryLower = Text.toLowercase(q);
                Text.contains(Text.toLowercase(product.name), #text queryLower) or
                Text.contains(Text.toLowercase(product.description), #text queryLower) or
                Array.find<Text>(product.tags, func(tag: Text): Bool {
                    Text.contains(Text.toLowercase(tag), #text queryLower)
                }) != null
            };
        };

        // Check category
        let matchesCategory = switch (filters.category) {
            case null { true };
            case (?cat) { product.category == cat };
        };

        // Check subcategory
        let matchesSubcategory = switch (filters.subcategory) {
            case null { true };
            case (?subcat) {
                switch (product.subcategory) {
                    case null { false };
                    case (?productSubcat) { productSubcat == subcat };
                }
            };
        };

        // Check price range
        let matchesPrice = (
            switch (filters.minPrice) {
                case null { true };
                case (?minP) { product.price >= minP };
            }
        ) and (
            switch (filters.maxPrice) {
                case null { true };
                case (?maxP) { product.price <= maxP };
            }
        );

        // Check condition
        let matchesCondition = switch (filters.condition) {
            case null { true };
            case (?cond) { product.condition == cond };
        };

        // Check stock availability
        let matchesStock = if (filters.inStock) {
            product.stock > 0
        } else { true };

        // Check if featured
        let matchesFeatured = switch (filters.featured) {
            case null { true };
            case (?feat) { product.featured == feat };
        };

        // Check seller
        let matchesSeller = switch (filters.sellerId) {
            case null { true };
            case (?sellerId) { product.sellerId == sellerId };
        };

        // Check if product is active
        let isActive = product.status == #Active;

        matchesQuery and matchesCategory and matchesSubcategory and matchesPrice and
        matchesCondition and matchesStock and matchesFeatured and matchesSeller and isActive
    };

    // Sort products based on sort option
    public func sortProducts(products: [Product], sortBy: SortOption): [Product] {
        Array.sort<Product>(products, func(a: Product, b: Product): { #less; #equal; #greater } {
            switch (sortBy) {
                case (#Featured) {
                    if (a.featured and not b.featured) { #less }
                    else if (not a.featured and b.featured) { #greater }
                    else if (a.rating > b.rating) { #less }
                    else if (a.rating < b.rating) { #greater }
                    else { #equal }
                };
                case (#PriceLowToHigh) {
                    if (a.price < b.price) { #less }
                    else if (a.price > b.price) { #greater }
                    else { #equal }
                };
                case (#PriceHighToLow) {
                    if (a.price > b.price) { #less }
                    else if (a.price < b.price) { #greater }
                    else { #equal }
                };
                case (#Newest) {
                    if (a.createdAt > b.createdAt) { #less }
                    else if (a.createdAt < b.createdAt) { #greater }
                    else { #equal }
                };
                case (#Rating) {
                    if (a.rating > b.rating) { #less }
                    else if (a.rating < b.rating) { #greater }
                    else { #equal }
                };
                case (#Popular) {
                    if (a.totalSales > b.totalSales) { #less }
                    else if (a.totalSales < b.totalSales) { #greater }
                    else { #equal }
                };
            }
        })
    };

    // Calculate order totals
    public func calculateOrderTotals(subtotal: Float, location: ?Text): (Float, Float, Float) {
        // Calculate shipping
        let shipping = if (subtotal >= 1000.0) { 0.0 } else { 25.0 };
        
        // Calculate tax (8% for demo)
        let tax = subtotal * 0.08;
        
        // Calculate total
        let total = subtotal + shipping + tax;
        
        (shipping, tax, total)
    };

    // Create demo product
    public func createDemoProduct(
        productType: Text,
        sellerId: Text,
        category: ProductCategory
    ): Product {
        let now = Time.now();
        let productId = generateProductId();
        
        switch (productType) {
            case "gold-bullion" {
                {
                    id = productId;
                    sellerId = sellerId;
                    name = "Gold Bullion - 1oz American Eagle";
                    description = "99.9% pure gold bullion coin from the U.S. Mint. Each coin contains one troy ounce of gold and is backed by the U.S. government for weight, content, and purity.";
                    category = #PreciousMetals;
                    subcategory = ?"Gold";
                    price = 1950.0;
                    originalPrice = ?2100.0;
                    unit = "per oz";
                    minOrder = 1;
                    maxOrder = ?100;
                    stock = 25;
                    images = [
                        "/placeholder.svg?height=500&width=500",
                        "/placeholder.svg?height=500&width=500"
                    ];
                    specifications = [
                        ("Purity", "99.9% Gold"),
                        ("Weight", "1 Troy Ounce"),
                        ("Mint", "U.S. Mint"),
                        ("Year", "2024")
                    ];
                    tags = ["gold", "bullion", "investment", "precious metals"];
                    condition = #New;
                    location = ?"New York, NY";
                    weight = ?"1 troy oz";
                    dimensions = ?"32.7mm x 2.87mm";
                    certification = ?"U.S. Mint Certificate";
                    purity = ?"99.9%";
                    origin = ?"United States";
                    sku = ?"GOLD-1OZ-AE-2024";
                    status = #Active;
                    featured = true;
                    rating = 4.8;
                    reviewCount = 127;
                    totalSales = 450;
                    createdAt = now - (30 * 24 * 60 * 60 * 1000000000); // 30 days ago
                    updatedAt = now;
                    shippingWeight = ?"2 lbs";
                    shippingDimensions = ?"4x4x2 inches";
                    processingTime = ?"1-2 business days";
                    shippingOptions = ["Standard", "Express", "Overnight"];
                    returnPolicy = ?"30-day return policy";
                    warranty = ?"Authenticity guaranteed";
                }
            };
            case "silver-bars" {
                {
                    id = productId;
                    sellerId = sellerId;
                    name = "Silver Bars - 10oz";
                    description = "Fine silver bars with certificate of authenticity. Perfect for investment and collection.";
                    category = #PreciousMetals;
                    subcategory = ?"Silver";
                    price = 280.0;
                    originalPrice = null;
                    unit = "per bar";
                    minOrder = 1;
                    maxOrder = ?50;
                    stock = 50;
                    images = ["/placeholder.svg?height=500&width=500"];
                    specifications = [
                        ("Purity", "99.9% Silver"),
                        ("Weight", "10 Troy Ounces"),
                        ("Brand", "APMEX")
                    ];
                    tags = ["silver", "bars", "investment"];
                    condition = #New;
                    location = ?"California";
                    weight = ?"10 troy oz";
                    dimensions = ?"3.25 x 1.5 x 0.25 inches";
                    certification = ?"Certificate of Authenticity";
                    purity = ?"99.9%";
                    origin = ?"United States";
                    sku = ?"SILVER-10OZ-BAR";
                    status = #Active;
                    featured = false;
                    rating = 4.6;
                    reviewCount = 89;
                    totalSales = 320;
                    createdAt = now - (15 * 24 * 60 * 60 * 1000000000); // 15 days ago
                    updatedAt = now;
                    shippingWeight = ?"1 lb";
                    shippingDimensions = ?"5x3x2 inches";
                    processingTime = ?"2-3 business days";
                    shippingOptions = ["Standard", "Express"];
                    returnPolicy = ?"30-day return policy";
                    warranty = ?"Quality guaranteed";
                }
            };
            case _ {
                // Default wheat product
                {
                    id = productId;
                    sellerId = sellerId;
                    name = "Premium Wheat - Grade A";
                    description = "High-quality hard red winter wheat, perfect for milling and baking applications.";
                    category = #Agriculture;
                    subcategory = ?"Grains";
                    price = 7.25;
                    originalPrice = null;
                    unit = "per bushel";
                    minOrder = 100;
                    maxOrder = ?10000;
                    stock = 5000;
                    images = ["/placeholder.svg?height=500&width=500"];
                    specifications = [
                        ("Grade", "Grade A"),
                        ("Moisture", "12.5%"),
                        ("Protein", "13.2%")
                    ];
                    tags = ["wheat", "agriculture", "grain"];
                    condition = #New;
                    location = ?"Kansas";
                    weight = ?"60 lbs per bushel";
                    dimensions = null;
                    certification = ?"USDA Certified";
                    purity = null;
                    origin = ?"Kansas, USA";
                    sku = ?"WHEAT-HRW-A";
                    status = #Active;
                    featured = false;
                    rating = 4.4;
                    reviewCount = 45;
                    totalSales = 1200;
                    createdAt = now - (7 * 24 * 60 * 60 * 1000000000); // 7 days ago
                    updatedAt = now;
                    shippingWeight = ?"Calculated by volume";
                    shippingDimensions = ?"Bulk shipping";
                    processingTime = ?"3-5 business days";
                    shippingOptions = ["Standard", "Bulk"];
                    returnPolicy = ?"Quality guarantee";
                    warranty = ?"Grade certification";
                }
            };
        }
    };

    // Get default categories
    public func getDefaultCategories(): [Category] {
        [
            {
                id = "precious-metals";
                name = "Precious Metals";
                description = "Gold, silver, platinum, and other precious metals";
                subcategories = ["Gold", "Silver", "Platinum", "Palladium"];
                productCount = 156;
                image = ?"/images/categories/precious-metals.jpg";
            },
            {
                id = "oil-gas";
                name = "Oil & Gas";
                description = "Crude oil, natural gas, and energy commodities";
                subcategories = ["Crude Oil", "Natural Gas", "Refined Products"];
                productCount = 89;
                image = ?"/images/categories/oil-gas.jpg";
            },
            {
                id = "agriculture";
                name = "Agriculture";
                description = "Grains, livestock, and agricultural products";
                subcategories = ["Grains", "Coffee", "Sugar", "Livestock"];
                productCount = 234;
                image = ?"/images/categories/agriculture.jpg";
            },
            {
                id = "timber";
                name = "Timber";
                description = "Wood and timber products";
                subcategories = ["Hardwood", "Softwood", "Plywood", "Lumber"];
                productCount = 78;
                image = ?"/images/categories/timber.jpg";
            }
        ]
    };

    // Logging functions
    public func logInfo(message: Text) {
        Debug.print("[INFO] " # message);
    };

    public func logError(message: Text) {
        Debug.print("[ERROR] " # message);
    };

    // Validate order items
    public func validateOrderItems(items: [Types.OrderItem]): Bool {
        if (items.size() == 0) {
            return false;
        };

        for (item in items.vals()) {
            if (item.quantity == 0 or item.price <= 0.0) {
                return false;
            };
        };

        true
    };

    // Check if user can place order
    public func canPlaceOrder(buyerId: Text, sellerId: Text, total: Float): Bool {
        // In a real implementation, this would check wallet balance, KYC status, etc.
        buyerId != sellerId and total > 0.0
    };

    // Calculate estimated delivery date
    public func calculateEstimatedDelivery(processingTime: ?Text, shippingMethod: Text): Time {
        let now = Time.now();
        let secondsInDay = 24 * 60 * 60 * 1000000000;
        
        // Default processing days based on shipping method
        let processingDays = switch (processingTime) {
            case (?time) {
                if (Text.contains(time, #text "1-2")) { 2 }
                else if (Text.contains(time, #text "2-3")) { 3 }
                else if (Text.contains(time, #text "3-5")) { 5 }
                else { 3 }
            };
            case null { 3 };
        };

        // Shipping days based on method
        let shippingDays = switch (shippingMethod) {
            case "Standard" { 5 };
            case "Express" { 2 };
            case "Overnight" { 1 };
            case "Bulk" { 7 };
            case _ { 5 };
        };

        let totalDays = processingDays + shippingDays;
        now + (Int64.fromInt(totalDays) * secondsInDay)
    };

    // Update product rating
    public func updateProductRating(currentRating: Float, currentCount: Nat, newRating: Nat): (Float, Nat) {
        let totalRatingPoints = currentRating * Float.fromInt(currentCount) + Float.fromInt(newRating);
        let newCount = currentCount + 1;
        let newAverage = totalRatingPoints / Float.fromInt(newCount);
        (newAverage, newCount)
    };

    // Generate pricing recommendation
    public func generatePricingRecommendation(product: Product, marketAverage: Float): Types.PricingRecommendation {
        let confidence = Float.abs(product.price - marketAverage) / marketAverage;
        let suggestedPrice = if (product.price < marketAverage * 0.95) {
            // Price is significantly lower than market
            marketAverage * 0.98 // Suggest slight increase
        } else if (product.price > marketAverage * 1.05) {
            // Price is significantly higher than market
            marketAverage * 1.02 // Suggest slight decrease
        } else {
            // Price is within 5% of market average
            product.price // No change needed
        };

        let reasoning = if (suggestedPrice > product.price) {
            "Your price is below market average. Consider increasing to be more competitive."
        } else if (suggestedPrice < product.price) {
            "Your price is above market average. Consider decreasing to attract more buyers."
        } else {
            "Your price is well aligned with current market conditions."
        };

        let expectedImpact = if (suggestedPrice > product.price) {
            "Expected to increase revenue per sale while maintaining similar sales volume."
        } else if (suggestedPrice < product.price) {
            "Expected to increase sales volume while maintaining similar total revenue."
        } else {
            "Current pricing strategy is optimal based on market data."
        };

        {
            productId = product.id;
            currentPrice = product.price;
            suggestedPrice = suggestedPrice;
            confidence = confidence;
            reasoning = reasoning;
            expectedImpact = expectedImpact;
        }
    };
};