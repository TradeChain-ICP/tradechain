// main.mo - Main canister entry point
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

import UserModule "user";
import WalletModule "wallet";
import MarketplaceModule "marketplace";
import EscrowModule "escrow";
import AnalyticsModule "analytics";
import Types "types";

shared ({ caller = deployer }) actor class TradeChain() {
    type Result<T, E> = Types.Result<T, E>;
    type UserProfile = Types.UserProfile;
    type Wallet = Types.Wallet;
    type CommodityListing = Types.CommodityListing;
    type EscrowContract = Types.EscrowContract;
    type TradeChainError = Types.TradeChainError;

    private let userManager = UserModule.UserManager();
    private let walletManager = WalletModule.WalletManager();
    private let marketplaceManager = MarketplaceModule.MarketplaceManager();
    private let escrowManager = EscrowModule.EscrowManager();
    private let analyticsManager = AnalyticsModule.AnalyticsManager();

    // User Management

    public shared ({ caller }) func createUser(
        internetIdentity: Principal,
        role: Types.UserRole,
        name: Text,
        email: ?Text
    ): async Result<UserProfile, TradeChainError> {
        userManager.createUser(caller, internetIdentity, role, name, email)
    };

    public query func getUserProfile(userId: Principal): async Result<UserProfile, TradeChainError> {
        userManager.getUserProfile(userId)
    };

    // Wallet Management

    public shared ({ caller }) func createWallet(
        walletType: Types.WalletType
    ): async Result<Wallet, TradeChainError> {
        walletManager.createWallet(caller, walletType)
    };

    public query func getWallet(walletId: Text): async Result<Wallet, TradeChainError> {
        walletManager.getWallet(walletId)
    };

    // Marketplace Management

    public shared ({ caller }) func createListing(
        request: Types.CreateListingRequest
    ): async Result<CommodityListing, TradeChainError> {
        marketplaceManager.createListing(caller, request)
    };

    public query func getListing(listingId: Text): async Result<CommodityListing, TradeChainError> {
        marketplaceManager.getListing(listingId)
    };

    // Escrow Management

    public shared ({ caller }) func createEscrow(
        request: Types.CreateEscrowRequest,
        amount: Nat,
        currency: Types.WalletType
    ): async Result<EscrowContract, TradeChainError> {
        escrowManager.createEscrow(request, amount, currency)
    };

    public shared ({ caller }) func fundEscrow(escrowId: Text): async Result<EscrowContract, TradeChainError> {
        escrowManager.fundEscrow(escrowId, caller)
    };

    public shared ({ caller }) func resolveDispute(
        escrowId: Text,
        adminNotes: Text,
        refundAmount: Nat
    ): async Result<EscrowContract, TradeChainError> {
        escrowManager.resolveDispute(escrowId, adminNotes, refundAmount, caller)
    };

    // Initial Testing Functions

    public shared ({ caller }) func testCreateUser(): async Result<UserProfile, TradeChainError> {
        let internetIdentity = Principal.fromText("aaaaa-aa"); // Placeholder
        let role = #buyer;
        let name = "Test User";
        let email = ?"test@example.com";
        userManager.createUser(caller, internetIdentity, role, name, email)
    };

    public shared ({ caller }) func testCreateWallet(): async Result<Wallet, TradeChainError> {
        walletManager.createWallet(caller, #icp)
    };

    public shared ({ caller }) func testCreateListing(): async Result<CommodityListing, TradeChainError> {
        let request: Types.CreateListingRequest = {
            title = "Test Commodity";
            description = "This is a test commodity listing.";
            category = #metals;
            subcategory = #gold;
            quantity = 100;
            unit = "kg";
            pricePerUnit = 5000;
            currency = #icp;
            images = ["image1.jpg"];
            location = "Test Location";
            quality = ?"High";
            certifications = ["Cert1"];
            minimumOrder = ?10;
            availableUntil = ?(Time.now() + 30 * 24 * 60 * 60 * 1_000_000_000);
            tags = ["test", "commodity"];
        };
        marketplaceManager.createListing(caller, request)
    };

    public shared ({ caller }) func testCreateEscrow(): async Result<EscrowContract, TradeChainError> {
        let listingRequest: Types.CreateListingRequest = {
            title = "Test Commodity";
            description = "This is a test commodity listing.";
            category = #metals;
            subcategory = #gold;
            quantity = 100;
            unit = "kg";
            pricePerUnit = 5000;
            currency = #icp;
            images = ["image1.jpg"];
            location = "Test Location";
            quality = ?"High";
            certifications = ["Cert1"];
            minimumOrder = ?10;
            availableUntil = ?(Time.now() + 30 * 24 * 60 * 60 * 1_000_000_000);
            tags = ["test", "commodity"];
        };
        let listingResult = await marketplaceManager.createListing(caller, listingRequest);
        switch (listingResult) {
            case (#ok(listing)) {
                let escrowRequest: Types.CreateEscrowRequest = {
                    listingId = listing.id;
                    quantity = 10;
                    buyer = caller;
                    seller = caller; // Using same principal for simplicity
                };
                escrowManager.createEscrow(escrowRequest, 50000, #icp)
            };
            case (#err(e)) { #err(e) };
        }
    };
};
