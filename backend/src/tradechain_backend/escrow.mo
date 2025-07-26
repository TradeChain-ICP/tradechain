// escrow.mo - Escrow Smart Contracts Module
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

import Types "./types";

module EscrowModule {
    type Result<T, E> = Types.Result<T, E>;
    type EscrowContract = Types.EscrowContract;
    type EscrowStatus = Types.EscrowStatus;
    type DisputeReason = Types.DisputeReason;
    type WalletType = Types.WalletType;
    type CreateEscrowRequest = Types.CreateEscrowRequest;
    type TradeChainError = Types.TradeChainError;

    public class EscrowManager() {
        // Storage
        private stable var escrowEntries : [(Text, EscrowContract)] = [];
        private var escrows = HashMap.HashMap<Text, EscrowContract>(100, Text.equal, Text.hash);

        // Indexes for efficient queries
        private stable var buyerIndexEntries : [(Principal, [Text])] = [];
        private var buyerIndex = HashMap.HashMap<Principal, [Text]>(50, Principal.equal, Principal.hash);

        private stable var sellerIndexEntries : [(Principal, [Text])] = [];
        private var sellerIndex = HashMap.HashMap<Principal, [Text]>(50, Principal.equal, Principal.hash);

        private stable var listingIndexEntries : [(Text, [Text])] = [];
        private var listingIndex = HashMap.HashMap<Text, [Text]>(100, Text.equal, Text.hash);

        // Counter
        private stable var escrowCounter : Nat = 0;

        // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
        private stable var platformFeeRate : Nat = 250; // 2.5%

        // System upgrade hooks
        system func preupgrade() {
            escrowEntries := Iter.toArray(escrows.entries());
            buyerIndexEntries := Iter.toArray(buyerIndex.entries());
            sellerIndexEntries := Iter.toArray(sellerIndex.entries());
            listingIndexEntries := Iter.toArray(listingIndex.entries());
        };

        system func postupgrade() {
            escrows := HashMap.fromIter<Text, EscrowContract>(escrowEntries.vals(), escrowEntries.size(), Text.equal, Text.hash);
            buyerIndex := HashMap.fromIter<Principal, [Text]>(buyerIndexEntries.vals(), buyerIndexEntries.size(), Principal.equal, Principal.hash);
            sellerIndex := HashMap.fromIter<Principal, [Text]>(sellerIndexEntries.vals(), sellerIndexEntries.size(), Principal.equal, Principal.hash);
            listingIndex := HashMap.fromIter<Text, [Text]>(listingIndexEntries.vals(), listingIndexEntries.size(), Text.equal, Text.hash);
            
            escrowEntries := [];
            buyerIndexEntries := [];
            sellerIndexEntries := [];
            listingIndexEntries := [];
        };

        // Utility Functions
        private func generateEscrowId(): Text {
            escrowCounter += 1;
            "escrow_" # Nat.toText(escrowCounter) # "_" # Int.toText(Time.now())
        };

        private func calculatePlatformFee(amount: Nat): Nat {
            (amount * platformFeeRate) / 10000
        };

        private func addToBuyerIndex(buyer: Principal, escrowId: Text) {
            let currentEscrows = Option.get(buyerIndex.get(buyer), []);
            let updatedEscrows = Array.append(currentEscrows, [escrowId]);
            buyerIndex.put(buyer, updatedEscrows);
        };

        private func addToSellerIndex(seller: Principal, escrowId: Text) {
            let currentEscrows = Option.get(sellerIndex.get(seller), []);
            let updatedEscrows = Array.append(currentEscrows, [escrowId]);
            sellerIndex.put(seller, updatedEscrows);
        };

        private func addToListingIndex(listingId: Text, escrowId: Text) {
            let currentEscrows = Option.get(listingIndex.get(listingId), []);
            let updatedEscrows = Array.append(currentEscrows, [escrowId]);
            listingIndex.put(listingId, updatedEscrows);
        };

        // Escrow Creation & Management

        public func createEscrow(
            request: CreateEscrowRequest,
            amount: Nat,
            currency: WalletType
        ): Result<EscrowContract, TradeChainError> {
            if (amount == 0) {
                return #err(#InvalidInput);
            };

            if (request.buyer == request.seller) {
                return #err(#InvalidInput);
            };

            let escrowId = generateEscrowId();
            let now = Time.now();
            let feeAmount = calculatePlatformFee(amount);

            let newEscrow: EscrowContract = {
                id = escrowId;
                buyer = request.buyer;
                seller = request.seller;
                listingId = request.listingId;
                amount = amount;
                currency = currency;
                status = #created;
                createdAt = now;
                fundedAt = null;
                lockedAt = null;
                deliveryConfirmedAt = null;
                completedAt = null;
                disputeReason = null;
                disputeDetails = null;
                adminNotes = null;
                logisticsReference = null;
                refundAmount = null;
                feeAmount = feeAmount;
            };

            // Check if escrow already exists for this listing and buyer
            switch (listingIndex.get(request.listingId)) {
                case (?existingEscrows) {
                    let buyerHasEscrow = Array.find<Text>(existingEscrows, func(escrowId) {
                        switch (escrows.get(escrowId)) {
                            case (?escrow) { escrow.buyer == request.buyer and escrow.status != #completed and escrow.status != #cancelled and escrow.status != #refunded };
                            case null { false };
                        }
                    });
                    
                    switch (buyerHasEscrow) {
                        case (?_) { return #err(#EscrowAlreadyExists) };
                        case null {};
                    };
                };
                case null {};
            };

            escrows.put(escrowId, newEscrow);
            addToBuyerIndex(request.buyer, escrowId);
            addToSellerIndex(request.seller, escrowId);
            addToListingIndex(request.listingId, escrowId);

            #ok(newEscrow)
        };

        public func fundEscrow(escrowId: Text, caller: Principal): Result<EscrowContract, TradeChainError> {
            switch (escrows.get(escrowId)) {
                case (?escrow) {
                    if (escrow.buyer != caller) {
                        return #err(#UnauthorizedAccess);
                    };

                    if (escrow.status != #created) {
                        return #err(#InvalidEscrowStatus);
                    };

                    let updatedEscrow: EscrowContract = {
                        escrow with
                        status = #funded;
                        fundedAt = ?Time.now();
                    };

                    escrows.put(escrowId, updatedEscrow);
                    #ok(updatedEscrow)
                };
                case null { #err(#EscrowNotFound) };
            }
        };

        public func lockEscrow(escrowId: Text): Result<EscrowContract, TradeChainError> {
            switch (escrows.get(escrowId)) {
                case (?escrow) {
                    if (escrow.status != #funded) {
                        return #err(#InvalidEscrowStatus);
                    };

                    let updatedEscrow: EscrowContract = {
                        escrow with
                        status = #locked;
                        lockedAt = ?Time.now();
                    };

                    escrows.put(escrowId, updatedEscrow);
                    #ok(updatedEscrow)
                };
                case null { #err(#EscrowNotFound) };
            }
        };

        public func confirmDelivery(
            escrowId: Text,
            caller: Principal,
            logisticsReference: ?Text
        ): Result<EscrowContract, TradeChainError> {
            switch (escrows.get(escrowId)) {
                case (?escrow) {
                    if (escrow.buyer != caller) {
                        return #err(#UnauthorizedAccess);
                    };

                    if (escrow.status != #locked) {
                        return #err(#InvalidEscrowStatus);
                    };

                    let updatedEscrow: EscrowContract = {
                        escrow with
                        status = #delivery_confirmed;
                        deliveryConfirmedAt = ?Time.now();
                        logisticsReference = logisticsReference;
                    };

                    escrows.put(escrowId, updatedEscrow);
                    #ok(updatedEscrow)
                };
                case null { #err(#EscrowNotFound) };
            }
        };

        public func completeEscrow(escrowId: Text): Result<EscrowContract, TradeChainError> {
            switch (escrows.get(escrowId)) {
                case (?escrow) {
                    if (escrow.status != #delivery_confirmed) {
                        return #err(#InvalidEscrowStatus);
                    };

                    let updatedEscrow: EscrowContract = {
                        escrow with
                        status = #completed;
                        completedAt = ?Time.now();
                    };

                    escrows.put(escrowId, updatedEscrow);
                    #ok(updatedEscrow)
                };
                case null { #err(#EscrowNotFound) };
            }
        };

        // Dispute Management

        public func raiseDispute(
            escrowId: Text,
            caller: Principal,
            reason: DisputeReason,
            details: Text
        ): Result<EscrowContract, TradeChainError> {
            switch (escrows.get(escrowId)) {
                case (?escrow) {
                    if (escrow.buyer != caller and escrow.seller != caller) {
                        return #err(#UnauthorizedAccess);
                    };

                    if (escrow.status != #locked and escrow.status != #delivery_confirmed) {
                        return #err(#InvalidEscrowStatus);
                    };

                    let updatedEscrow: EscrowContract = {
                        escrow with
                        status = #disputed;
                        disputeReason = ?reason;
                        disputeDetails = ?details;
                    };

                    escrows.put(escrowId, updatedEscrow);
                    #ok(updatedEscrow)
                };
                case null { #err(#EscrowNotFound) };
            }
        };

        public func resolveDispute(
            escrowId: Text,
            adminNotes: Text,
            refundAmount: Nat,
            caller: Principal
        ): Result<EscrowContract, TradeChainError> {
            switch (escrows.get(escrowId)) {
                case (?escrow) {
                    if (escrow.status != #disputed) {
                        return #err(#InvalidEscrowStatus);
                    };

                    // Only admin can resolve disputes (placeholder admin check)
                    if (not isAdmin(caller)) {
                        return #err(#UnauthorizedAccess);
                    };

                    if (refundAmount > escrow.amount) {
                        return #err(#InvalidInput);
                    };

                    let updatedEscrow: EscrowContract = {
                        escrow with
                        status = #refunded;
                        refundAmount = ?refundAmount;
                        adminNotes = ?adminNotes;
                        completedAt = ?Time.now();
                    };

                    escrows.put(escrowId, updatedEscrow);
                    #ok(updatedEscrow)
                };
                case null { #err(#EscrowNotFound) };
            }
        };

        // Helper function to check if caller is admin
        private func isAdmin(caller: Principal): Bool {
            // Placeholder: In a real implementation, check against an admin list
            true
        };
    }
}
