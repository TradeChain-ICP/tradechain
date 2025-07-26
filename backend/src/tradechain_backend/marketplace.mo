// marketplace.mo - Marketplace Logic Module
import Time "mo:base/Time";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Order "mo:base/Order";

import Types "./types";

module MarketplaceModule {
    type Result<T, E> = Types.Result<T, E>;
    type CommodityListing = Types.CommodityListing;
    type CommodityCategory = Types.CommodityCategory;
    type CommoditySubcategory = Types.CommoditySubcategory;
    type ListingStatus = Types.ListingStatus;
    type WalletType = Types.WalletType;
    type Cart = Types.Cart;
    type CartItem = Types.CartItem;
    type CreateListingRequest = Types.CreateListingRequest;
    type UpdateListingRequest = Types.UpdateListingRequest;
    type PaginatedResponse = Types.PaginatedResponse;
    type TradeChainError = Types.TradeChainError;

    public class MarketplaceManager() {
        // Storage
        private stable var listingEntries : [(Text, CommodityListing)] = [];
        private var listings = HashMap.HashMap<Text, CommodityListing>(100, Text.equal, Text.hash);

        private stable var cartEntries : [(Text, Cart)] = [];
        private var carts = HashMap.HashMap<Text, Cart>(50, Text.equal, Text.hash);

        // Indexes for efficient queries
        private stable var categoryIndexEntries : [(CommodityCategory, [Text])] = [];
        private var categoryIndex = HashMap.HashMap<CommodityCategory, [Text]>(10, func(a: CommodityCategory, b: CommodityCategory): Bool { a == b }, func(category: CommodityCategory): Nat32 {
            switch (category) {
                case (#metals) { 0 };
                case (#energy) { 1 };
                case (#timber) { 2 };
                case (#agriculture) { 3 };
                case (#other) { 4 };
            }
        });

        private stable var sellerIndexEntries : [(Principal, [Text])] = [];
        private var sellerIndex = HashMap.HashMap<Principal, [Text]>(50, Principal.equal, Principal.hash);

        private stable var userCartEntries : [(Principal, Text)] = [];
        private var userCartIndex = HashMap.HashMap<Principal, Text>(50, Principal.equal, Principal.hash);

        // Counters
        private stable var listingCounter : Nat = 0;
        private stable var cartCounter : Nat = 0;

        // System upgrade hooks
        system func preupgrade() {
            listingEntries := Iter.toArray(listings.entries());
            cartEntries := Iter.toArray(carts.entries());
            categoryIndexEntries := Iter.toArray(categoryIndex.entries());
            sellerIndexEntries := Iter.toArray(sellerIndex.entries());
            userCartEntries := Iter.toArray(userCartIndex.entries());
        };

        system func postupgrade() {
            listings := HashMap.fromIter<Text, CommodityListing>(listingEntries.vals(), listingEntries.size(), Text.equal, Text.hash);
            carts := HashMap.fromIter<Text, Cart>(cartEntries.vals(), cartEntries.size(), Text.equal, Text.hash);
            categoryIndex := HashMap.fromIter<CommodityCategory, [Text]>(categoryIndexEntries.vals(), categoryIndexEntries.size(), func(a: CommodityCategory, b: CommodityCategory): Bool { a == b }, func(category: CommodityCategory): Nat32 {
                switch (category) {
                    case (#metals) { 0 };
                    case (#energy) { 1 };
                    case (#timber) { 2 };
                    case (#agriculture) { 3 };
                    case (#other) { 4 };
                }
            });
            sellerIndex := HashMap.fromIter<Principal, [Text]>(sellerIndexEntries.vals(), sellerIndexEntries.size(), Principal.equal, Principal.hash);
            userCartIndex := HashMap.fromIter<Principal, Text>(userCartEntries.vals(), userCartEntries.size(), Principal.equal, Principal.hash);
            
            listingEntries := [];
            cartEntries := [];
            categoryIndexEntries := [];
            sellerIndexEntries := [];
            userCartEntries := [];
        };

        // Utility Functions
        private func generateListingId(): Text {
            listingCounter += 1;
            "listing_" # Nat.toText(listingCounter) # "_" # Int.toText(Time.now())
        };

        private func generateCartId(): Text {
            cartCounter += 1;
            "cart_" # Nat.toText(cartCounter) # "_" # Int.toText(Time.now())
        };

        private func addToSellerIndex(seller: Principal, listingId: Text) {
            let currentListings = Option.get(sellerIndex.get(seller), []);
            let updatedListings = Array.append(currentListings, [listingId]);
            sellerIndex.put(seller, updatedListings);
        };

        private func removeFromSellerIndex(seller: Principal, listingId: Text) {
            switch (sellerIndex.get(seller)) {
                case (?listings) {
                    let updatedListings = Array.filter<Text>(listings, func(id) { id != listingId });
                    sellerIndex.put(seller, updatedListings);
                };
                case null {};
            };
        };

        private func addToCategoryIndex(category: CommodityCategory, listingId: Text) {
            let currentListings = Option.get(categoryIndex.get(category), []);
            let updatedListings = Array.append(currentListings, [listingId]);
            categoryIndex.put(category, updatedListings);
        };

        private func removeFromCategoryIndex(category: CommodityCategory, listingId: Text) {
            switch (categoryIndex.get(category)) {
                case (?listings) {
                    let updatedListings = Array.filter<Text>(listings, func(id) { id != listingId });
                    categoryIndex.put(category, updatedListings);
                };
                case null {};
            };
        };

        // Listing Management

        public func createListing(
            seller: Principal,
            request: CreateListingRequest
        ): Result<CommodityListing, TradeChainError> {
            // Validate input
            if (Text.size(request.title) < 3 or Text.size(request.title) > 200) {
                return #err(#InvalidInput);
            };
            
            if (Text.size(request.description) < 10 or Text.size(request.description) > 2000) {
                return #err(#InvalidInput);
            };
            
            if (request.quantity == 0 or request.pricePerUnit == 0) {
                return #err(#InvalidInput);
            };

            let listingId = generateListingId();
            let now = Time.now();
            let totalPrice = request.quantity * request.pricePerUnit;

            let newListing: CommodityListing = {
                id = listingId;
                seller = seller;
                title = request.title;
                description = request.description;
                category = request.category;
                subcategory = request.subcategory;
                quantity = request.quantity;
                unit = request.unit;
                pricePerUnit = request.pricePerUnit;
                currency = request.currency;
                totalPrice = totalPrice;
                images = request.images;
                location = request.location;
                quality = request.quality;
                certifications = request.certifications;
                minimumOrder = request.minimumOrder;
                availableUntil = request.availableUntil;
                status = #active;
                tags = request.tags;
                views = 0;
                favorites = 0;
                createdAt = now;
                updatedAt = now;
                aiScore = null;
            };

            listings.put(listingId, newListing);
            addToSellerIndex(seller, listingId);
            addToCategoryIndex(request.category, listingId);

            #ok(newListing)
        };

        public func getListing(listingId: Text): Result<CommodityListing, TradeChainError> {
            switch (listings.get(listingId)) {
                case (?listing) { #ok(listing) };
                case null { #err(#ListingNotFound) };
            }
        };

        public func updateListing(
            caller: Principal,
            request: UpdateListingRequest
        ): Result<CommodityListing, TradeChainError> {
            switch (listings.get(request.listingId)) {
                case (?listing) {
                    if (listing.seller != caller) {
                        return #err(#UnauthorizedAccess);
                    };

                    let updatedListing: CommodityListing = {
                        listing with
                        title = Option.get(request.title, listing.title);
                        description = Option.get(request.description, listing.description);
                        quantity = Option.get(request.quantity, listing.quantity);
                        pricePerUnit = Option.get(request.pricePerUnit, listing.pricePerUnit);
                        totalPrice = Option.get(request.quantity, listing.quantity) * Option.get(request.pricePerUnit, listing.pricePerUnit);
                        images = Option.get(request.images, listing.images);
                        location = Option.get(request.location, listing.location);
                        quality = switch (request.quality) {
                            case (?newQuality) { ?newQuality };
                            case null { listing.quality };
                        };
                        certifications = Option.get(request.certifications, listing.certifications);
                        minimumOrder = Option.get(request.minimumOrder, listing.minimumOrder);
                        availableUntil = Option.get(request.availableUntil, listing.availableUntil);
                        tags = Option.get(request.tags, listing.tags);
                        status = Option.get(request.status, listing.status);
                        updatedAt = Time.now();
                    };

                    listings.put(request.listingId, updatedListing);
                    #ok(updatedListing)
                };
                case null { #err(#ListingNotFound) };
            }
        };

        public func deleteListing(listingId: Text, caller: Principal): Result<(), TradeChainError> {
            switch (listings.get(listingId)) {
                case (?listing) {
                    if (listing.seller != caller) {
                        return #err(#UnauthorizedAccess);
                    };

                    listings.delete(listingId);
                    removeFromSellerIndex(listing.seller, listingId);
                    removeFromCategoryIndex(listing.category, listingId);
                    #ok(())
                };
                case null { #err(#ListingNotFound) };
            }
        };

        public func updateListingStatus(
            listingId: Text,
            newStatus: ListingStatus,
            caller: Principal
        ): Result<CommodityListing, TradeChainError> {
            switch (listings.get(listingId)) {
                case (?listing) {
                    if (listing.seller != caller) {
                        return #err(#UnauthorizedAccess);
                    };

                    let updatedListing: CommodityListing = {
                        listing with
                        status = newStatus;
                        updatedAt = Time.now();
                    };

                    listings.put(listingId, updatedListing);
                    #ok(updatedListing)
                };
                case null { #err(#ListingNotFound) };
            }
        };

        // Listing Queries & Search

        public func getAllListings(): [CommodityListing] {
            Iter.toArray(listings.vals())
        };

        public func getActiveListings(): [CommodityListing] {
            let activeListings = Iter.filter(listings.vals(), func(listing: CommodityListing): Bool {
                listing.status == #active and (
                    switch (listing.availableUntil) {
                        case (?until) { until > Time.now() };
                        case null { true };
                    }
                )
            });
            Iter.toArray(activeListings)
        };

        public func getListingsPaginated(
            page: Nat,
            limit: Nat,
            category: ?CommodityCategory,
            status: ?ListingStatus
        ): PaginatedResponse<CommodityListing> {
            let allListings = switch (category) {
                case (?cat) {
                    switch (categoryIndex.get(cat)) {
                        case (?listingIds) {
                            Array.mapFilter<Text, CommodityListing>(listingIds, func(id) { listings.get(id) })
                        };
                        case null { [] };
                    }
                };
                case null { Iter.toArray(listings.vals()) };
            };

            let filteredListings = switch (status) {
                case (?stat) {
                    Array.filter<CommodityListing>(allListings, func(listing) { listing.status == stat })
                };
                case null { allListings };
            };

            let total = filteredListings.size();
            let startIndex = page * limit;
            let endIndex = Nat.min(startIndex + limit, total);

            let items = if (startIndex >= total) {
                []
            } else {
                Array.tabulate<CommodityListing>(endIndex - startIndex, func(i) = filteredListings[startIndex + i])
            };

            {
                items = items;
                total = total;
                page = page;
                limit = limit;
                hasNext = endIndex < total;
                hasPrev = page > 0;
            }
        };

        public func getSellerListings(seller: Principal): [CommodityListing] {
            switch (sellerIndex.get(seller)) {
                case (?listingIds) {
                    Array.mapFilter<Text, CommodityListing>(listingIds, func(id) { listings.get(id) })
                };
                case null { [] };
            }
        };

        public func searchListings(
            query: Text,
            category: ?CommodityCategory,
            minPrice: ?Nat,
            maxPrice: ?Nat,
            location: ?Text
        ): [CommodityListing] {
            let allListings = getActiveListings();
            let queryLower = Text.map(query, func(c) { 
                if (c >= 'A' and c <= 'Z') { 
                    Char.fromNat32(Char.toNat32(c) + 32) 
                } else { c } 
            });

            Array.filter<CommodityListing>(allListings, func(listing) {
                let titleMatch = if (query == "") { true } else {
                    let titleLower = Text.map(listing.title, func(c) { 
                        if (c >= 'A' and c <= 'Z') { 
                            Char.fromNat32(Char.toNat32(c) + 32) 
                        } else { c } 
                    });
                    Text.contains(titleLower, #text queryLower)
                };

                let categoryMatch = switch (category) {
                    case (?cat) { listing.category == cat };
                    case null { true };
                };

                let priceMatch = switch (minPrice, maxPrice) {
                    case (?min, ?max) { listing.pricePerUnit >= min and listing.pricePerUnit <= max };
                    case (?min, null) { listing.pricePerUnit >= min };
                    case (null, ?max) { listing.pricePerUnit <= max };
                    case (null, null) { true };
                };

                let locationMatch = switch (location) {
                    case (?loc) { 
                        let locationLower = Text.map(listing.location, func(c) { 
                            if (c >= 'A' and c <= 'Z') { 
                                Char.fromNat32(Char.toNat32(c) + 32) 
                            } else { c } 
                        });
                        let locLower = Text.map(loc, func(c) { 
                            if (c >= 'A' and c <= 'Z') { 
                                Char.fromNat32(Char.toNat32(c) + 32) 
                            } else { c } 
                        });
                        Text.contains(locationLower, #text locLower)
                    };
                    case null { true };
                };

                titleMatch and categoryMatch and priceMatch and locationMatch
            })
        };

        // Listing Analytics

        public func incrementListingViews(listingId: Text): Result<CommodityListing, TradeChainError> {
            switch (listings.get(listingId)) {
                case (?listing) {
                    let updatedListing: CommodityListing = {
                        listing with
                        views = listing.views + 1;
                        updatedAt = Time.now();
                    };
                    listings.put(listingId, updatedListing);
                    #ok(updatedListing)
                };
                case null { #err(#ListingNotFound) };
            }
        };

        public func incrementListingFavorites(listingId: Text): Result<CommodityListing, TradeChainError> {
            switch (listings.get(listingId)) {
                case (?listing) {
                    let updatedListing: CommodityListing = {
                        listing with
                        favorites = listing.favorites + 1;
                        updatedAt = Time.now();
                    };
                    listings.put(listingId, updatedListing);
                    #ok(updatedListing)
                };
                case null { #err(#ListingNotFound) };
            }
        };

        public func updateListingAIScore(listingId: Text, aiScore: Float): Result<CommodityListing, TradeChainError> {
            switch (listings.get(listingId)) {
                case (?listing) {
                    let updatedListing: CommodityListing = {
                        listing with
                        aiScore = ?aiScore;
                        updatedAt = Time.now();
                    };
                    listings.put(listingId, updatedListing);
                    #ok(updatedListing)
                };
                case null { #err(#ListingNotFound) };
            }
        };

        // Cart Management

        public func getOrCreateCart(buyer: Principal): Cart {
            switch (userCartIndex.get(buyer)) {
                case (?cartId) {
                    switch (carts.get(cartId)) {
                        case (?cart) { cart };
                        case null { createNewCart(buyer) };
                    }
                };
                case null { createNewCart(buyer) };
            }
        };

        private func createNewCart(buyer: Principal): Cart {
            let cartId = generateCartId();
            let now = Time.now();
            
            let newCart: Cart = {
                id = cartId;
                buyer = buyer;
                items = [];
                totalValue = 0;
                createdAt = now;
                updatedAt = now;
            };

            carts.put(cartId, newCart);
            userCartIndex.put(buyer, cartId);
            newCart
        };

        public func addToCart(
            buyer: Principal,
            listingId: Text,
            quantity: Nat
        ): Result<Cart, TradeChainError> {
            if (quantity == 0) {
                return #err(#InvalidInput);
            };

            switch (listings.get(listingId)) {
                case (?listing) {
                    if (listing.status != #active) {
                        return #err(#ListingNotActive);
                    };

                    if (quantity > listing.quantity) {
                        return #err(#InvalidInput);
                    };

                    // Check minimum order requirement
                    switch (listing.minimumOrder) {
                        case (?minOrder) {
                            if (quantity < minOrder) {
                                return #err(#InvalidInput);
                            };
                        };
                        case null {};
                    };

                    let cart = getOrCreateCart(buyer);
                    let itemPrice = quantity * listing.pricePerUnit;
                    
                    let newItem: CartItem = {
                        listingId = listingId;
                        quantity = quantity;
                        pricePerUnit = listing.pricePerUnit;
                        totalPrice = itemPrice;
                        addedAt = Time.now();
                    };

                    // Check if item already exists in cart
                    let existingItems = Array.filter<CartItem>(cart.items, func(item) { item.listingId != listingId });
                    let updatedItems = Array.append(existingItems, [newItem]);
                    
                    let newTotalValue = Array.foldLeft<CartItem, Nat>(updatedItems, 0, func(acc, item) {
                        acc + item.totalPrice
                    });

                    let updatedCart: Cart = {
                        cart with
                        items = updatedItems;
                        totalValue = newTotalValue;
                        updatedAt = Time.now();
                    };

                    carts.put(cart.id, updatedCart);
                    #ok(updatedCart)
                };
                case null { #err(#ListingNotFound) };
            }
        };

        public func removeFromCart(
            buyer: Principal,
            listingId: Text
        ): Result<Cart, TradeChainError> {
            let cart = getOrCreateCart(buyer);
            
            let updatedItems = Array.filter<CartItem>(cart.items, func(item) { item.listingId != listingId });
            
            let newTotalValue = Array.foldLeft<CartItem, Nat>(updatedItems, 0, func(acc, item) {
                acc + item.totalPrice
            });

            let updatedCart: Cart = {
                cart with
                items = updatedItems;
                totalValue = newTotalValue;
                updatedAt = Time.now();
            };

            carts.put(cart.id, updatedCart);
            #ok(updatedCart)
        };

        public func updateCartItemQuantity(
            buyer: Principal,
            listingId: Text,
            newQuantity: Nat
        ): Result<Cart, TradeChainError> {
            if (newQuantity == 0) {
                return removeFromCart(buyer, listingId);
            };

            switch (listings.get(listingId)) {
                case (?listing) {
                    if (newQuantity > listing.quantity) {
                        return #err(#InvalidInput);
                    };

                    let cart = getOrCreateCart(buyer);
                    
                    let updatedItems = Array.map<CartItem, CartItem>(cart.items, func(item) {
                        if (item.listingId == listingId) {
                            {
                                item with
                                quantity = newQuantity;
                                totalPrice = newQuantity * item.pricePerUnit;
                            }
                        } else {
                            item
                        }
                    });

                    let newTotalValue = Array.foldLeft<CartItem, Nat>(updatedItems, 0, func(acc, item) {
                        acc + item.totalPrice
                    });

                    let updatedCart: Cart = {
                        cart with
                        items = updatedItems;
                        totalValue = newTotalValue;
                        updatedAt = Time.now();
                    };

                    carts.put(cart.id, updatedCart);
                    #ok(updatedCart)
                };
                case null { #err(#ListingNotFound) };
            }
        };

        public func clearCart(buyer: Principal): Result<Cart, TradeChainError> {
            let cart = getOrCreateCart(buyer);
            
            let clearedCart: Cart = {
                cart with
                items = [];
                totalValue = 0;
                updatedAt = Time.now();
            };

            carts.put(cart.id, clearedCart);
            #ok(clearedCart)
        };

        public func getCart(buyer: Principal): Cart {
            getOrCreateCart(buyer)
        };

        // Statistics & Analytics

        public func getListingsCount(): Nat {
            listings.size()
        };

        public func getActiveListingsCount(): Nat {
            let activeListings = getActiveListings();
            activeListings.size()
        };

        public func getListingsByCategory(): [(CommodityCategory, Nat)] {
            let categories: [CommodityCategory] = [#metals, #energy, #timber, #agriculture, #other];
            Array.map<CommodityCategory, (CommodityCategory, Nat)>(categories, func(category) {
                let categoryListings = switch (categoryIndex.get(category)) {
                    case (?listingIds) { listingIds.size() };
                    case null { 0 };
                };
                (category, categoryListings)
            })
        };

        public func getTopViewedListings(limit: Nat): [CommodityListing] {
            let allListings = Iter.toArray(listings.vals());
            let sortedListings = Array.sort(allListings, func(a: CommodityListing, b: CommodityListing): Order.Order {
                if (a.views > b.views) { #less }
                else if (a.views < b.views) { #greater }
                else { #equal }
            });
            
            let limitedSize = if (limit > sortedListings.size()) sortedListings.size() else limit;
            Array.tabulate<CommodityListing>(limitedSize, func(i) = sortedListings[i])
        };

        public func getMostFavoritedListings(limit: Nat): [CommodityListing] {
            let allListings = Iter.toArray(listings.vals());
            let sortedListings = Array.sort(allListings, func(a: CommodityListing, b: CommodityListing): Order.Order {
                if (a.favorites > b.favorites) { #less }
                else if (a.favorites < b.favorites) { #greater }
                else { #equal }
            });
            
            let limitedSize = if (limit > sortedListings.size()) sortedListings.size() else limit;
            Array.tabulate<CommodityListing>(limitedSize, func(i) = sortedListings[i])
        };

        // Validation

        public func validateListingOwnership(listingId: Text, caller: Principal): Bool {
            switch (listings.get(listingId)) {
                case (?listing) { listing.seller == caller };
                case null { false };
            }
        };

        public func isListingActive(listingId: Text): Bool {
            switch (listings.get(listingId)) {
                case (?listing) { 
                    listing.status == #active and (
                        switch (listing.availableUntil) {
                            case (?until) { until > Time.now() };
                            case null { true };
                        }
                    )
                };
                case null { false };
            }
        };

        public func hasAvailableQuantity(listingId: Text, requestedQuantity: Nat): Bool {
            switch (listings.get(listingId)) {
                case (?listing) { listing.quantity >= requestedQuantity };
                case null { false };
            }
        };
    }
}
