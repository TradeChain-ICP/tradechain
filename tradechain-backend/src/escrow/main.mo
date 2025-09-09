// src/escrow/main.mo
import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Option "mo:base/Option";

import Types "types";
import Utils "utils";

actor Escrow {
    // Type imports
    type EscrowAgreement = Types.EscrowAgreement;
    type EscrowRequest = Types.EscrowRequest;
    type FundEscrowRequest = Types.FundEscrowRequest;
    type ReleaseFundsRequest = Types.ReleaseFundsRequest;
    type Dispute = Types.Dispute;
    type DisputeRequest = Types.DisputeRequest;
    type DisputeEvidence = Types.DisputeEvidence;
    type EscrowCondition = Types.EscrowCondition;
    type EscrowStatus = Types.EscrowStatus;
    type DisputeStatus = Types.DisputeStatus;
    type DisputeResolution = Types.DisputeResolution;
    type EscrowStats = Types.EscrowStats;
    type UserEscrowStats = Types.UserEscrowStats;
    type EscrowError = Types.EscrowError;
    type Result<T, E> = Types.Result<T, E>;

    // Storage
    private stable var escrowEntries: [(Text, EscrowAgreement)] = [];
    private stable var disputeEntries: [(Text, Dispute)] = [];
    private stable var userEscrowEntries: [(Text, [Text])] = [];
    private stable var orderEscrowEntries: [(Text, Text)] = [];

    private var escrows = HashMap.HashMap<Text, EscrowAgreement>(50, Text.equal, Text.hash);
    private var disputes = HashMap.HashMap<Text, Dispute>(20, Text.equal, Text.hash);
    private var userEscrows = HashMap.HashMap<Text, [Text]>(30, Text.equal, Text.hash);
    private var orderEscrowMap = HashMap.HashMap<Text, Text>(50, Text.equal, Text.hash);

    // System initialization
    system func preupgrade() {
        escrowEntries := Iter.toArray(escrows.entries());
        disputeEntries := Iter.toArray(disputes.entries());
        userEscrowEntries := Iter.toArray(userEscrows.entries());
        orderEscrowEntries := Iter.toArray(orderEscrowMap.entries());
    };

    system func postupgrade() {
        escrows := HashMap.fromIter<Text, EscrowAgreement>(escrowEntries.vals(), escrowEntries.size(), Text.equal, Text.hash);
        disputes := HashMap.fromIter<Text, Dispute>(disputeEntries.vals(), disputeEntries.size(), Text.equal, Text.hash);
        userEscrows := HashMap.fromIter<Text, [Text]>(userEscrowEntries.vals(), userEscrowEntries.size(), Text.equal, Text.hash);
        orderEscrowMap := HashMap.fromIter<Text, Text>(orderEscrowEntries.vals(), orderEscrowEntries.size(), Text.equal, Text.hash);
        
        // Initialize demo data
        initializeDemoData();
    };

    // Initialize demo escrow data
    private func initializeDemoData() {
        let buyerId = "user_buyer_demo";
        let sellerId = "user_seller_demo";
        
        // Create demo escrows
        let goldEscrow = Utils.createDemoEscrow("gold-purchase", buyerId, sellerId);
        let silverEscrow = Utils.createDemoEscrow("silver-purchase", buyerId, sellerId);
        let wheatEscrow = Utils.createDemoEscrow("wheat-purchase", buyerId, sellerId);
        
        // Store escrows
        escrows.put(goldEscrow.id, goldEscrow);
        escrows.put(silverEscrow.id, silverEscrow);
        escrows.put(wheatEscrow.id, wheatEscrow);
        
        // Map users to their escrows
        let buyerEscrowIds = [goldEscrow.id, silverEscrow.id, wheatEscrow.id];
        let sellerEscrowIds = [goldEscrow.id, silverEscrow.id, wheatEscrow.id];
        
        userEscrows.put(buyerId, buyerEscrowIds);
        userEscrows.put(sellerId, sellerEscrowIds);
        
        // Map orders to escrows
        orderEscrowMap.put(goldEscrow.orderId, goldEscrow.id);
        orderEscrowMap.put(silverEscrow.orderId, silverEscrow.id);
        orderEscrowMap.put(wheatEscrow.orderId, wheatEscrow.id);
        
        // Create demo dispute for wheat escrow
        let wheatDispute = Utils.createDemoDispute(wheatEscrow.id, buyerId, sellerId);
        disputes.put(wheatDispute.id, wheatDispute);
        
        Utils.logInfo("Demo escrow data initialized");
    };

    // Call initialization
    initializeDemoData();

    // PUBLIC FUNCTIONS

    // 1. CREATE ESCROW AGREEMENT
    public shared(msg) func createEscrow(request: EscrowRequest): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let callerUserId = Utils.generateUserId(caller);

        Utils.logInfo("Creating escrow for order: " # request.orderId);

        // Validate caller authorization (should be buyer or seller)
        if (callerUserId != request.buyerId and callerUserId != request.sellerId) {
            return #err(#UnauthorizedAccess);
        };

        // Validate escrow data
        if (not Utils.isValidAmount(request.amount)) {
            return #err(#InvalidAmount);
        };

        if (not Utils.validateConditions(request.conditions)) {
            return #err(#InvalidCondition);
        };

        if (not Utils.meetsSecurityRequirements(request.amount, request.tokenType)) {
            return #err(#InvalidAmount);
        };

        // Check if escrow already exists for this order
        switch (orderEscrowMap.get(request.orderId)) {
            case (?_) {
                return #err(#InternalError("Escrow already exists for this order"));
            };
            case null {};
        };

        let escrowId = Utils.generateEscrowId();
        let now = Time.now();
        let expiryTime = Utils.calculateExpiryTime(request.expiryDays);
        let conditions = Utils.createDefaultConditions(request.conditions);

        let escrow: EscrowAgreement = {
            id = escrowId;
            orderId = request.orderId;
            buyerId = request.buyerId;
            sellerId = request.sellerId;
            arbitratorId = request.arbitratorId;
            amount = request.amount;
            tokenType = request.tokenType;
            status = #Created;
            conditions = conditions;
            createdAt = now;
            updatedAt = now;
            fundedAt = null;
            releasedAt = null;
            expiresAt = expiryTime;
            autoRelease = request.autoRelease;
            autoReleaseDelay = request.autoReleaseDelay;
        };

        // Store escrow
        escrows.put(escrowId, escrow);
        orderEscrowMap.put(request.orderId, escrowId);

        // Add to user escrow lists
        addEscrowToUser(request.buyerId, escrowId);
        addEscrowToUser(request.sellerId, escrowId);

        Utils.logInfo("Escrow created successfully: " # escrowId);
        #ok(escrow)
    };

    // 2. FUND ESCROW
    public shared(msg) func fundEscrow(request: FundEscrowRequest): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Funding escrow: " # request.escrowId);

        switch (escrows.get(request.escrowId)) {
            case (?escrow) {
                // Validate funding authorization
                if (not Utils.canFundEscrow(escrow, userId)) {
                    return #err(#UnauthorizedAccess);
                };

                // Validate amount matches escrow amount
                if (request.amount != escrow.amount or request.tokenType != escrow.tokenType) {
                    return #err(#InvalidAmount);
                };

                // Check escrow status
                if (escrow.status != #Created) {
                    return #err(#EscrowAlreadyFunded);
                };

                // Check if expired
                if (Utils.isEscrowExpired(escrow)) {
                    return #err(#EscrowExpired);
                };

                // Update escrow status to funded
                let now = Time.now();
                let updatedEscrow = {
                    escrow with
                    status = #Funded;
                    fundedAt = ?now;
                    updatedAt = now;
                };

                // In a real implementation, this would interact with wallet canister
                // to lock the funds. For demo purposes, we'll mark as funded.
                
                // Transition to active immediately for demo
                let activeEscrow = {
                    updatedEscrow with
                    status = #Active;
                };

                escrows.put(request.escrowId, activeEscrow);

                Utils.logInfo("Escrow funded and activated: " # request.escrowId);
                #ok(activeEscrow)
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 3. FULFILL CONDITION
    public shared(msg) func fulfillCondition(
        escrowId: Text,
        conditionId: Text,
        evidence: [Text]
    ): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Fulfilling condition " # conditionId # " for escrow: " # escrowId);

        switch (escrows.get(escrowId)) {
            case (?escrow) {
                // Check access permissions
                if (not Utils.hasEscrowAccess(escrow, userId)) {
                    return #err(#UnauthorizedAccess);
                };

                // Check if escrow is active
                if (escrow.status != #Active) {
                    return #err(#EscrowNotActive);
                };

                // Update conditions
                let updatedConditions = Utils.fulfillCondition(escrow.conditions, conditionId, userId, evidence);
                let now = Time.now();

                let updatedEscrow = {
                    escrow with
                    conditions = updatedConditions;
                    updatedAt = now;
                };

                escrows.put(escrowId, updatedEscrow);

                Utils.logInfo("Condition fulfilled successfully: " # conditionId);
                #ok(updatedEscrow)
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 4. RELEASE FUNDS
    public shared(msg) func releaseFunds(request: ReleaseFundsRequest): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Release funds request for escrow: " # request.escrowId);

        switch (escrows.get(request.escrowId)) {
            case (?escrow) {
                // Check release permissions
                if (not Utils.canReleaseFunds(escrow, userId)) {
                    return #err(#UnauthorizedAccess);
                };

                // Check if all required conditions are fulfilled
                if (not Utils.areConditionsFulfilled(escrow.conditions)) {
                    return #err(#ConditionNotMet);
                };

                // Check escrow status
                if (escrow.status != #Active and escrow.status != #Resolved) {
                    return #err(#EscrowNotActive);
                };

                let now = Time.now();
                let updatedEscrow = {
                    escrow with
                    status = #Released;
                    releasedAt = ?now;
                    updatedAt = now;
                };

                escrows.put(request.escrowId, updatedEscrow);

                // In a real implementation, this would transfer funds to seller
                Utils.logInfo("Funds released successfully: " # request.escrowId);
                #ok(updatedEscrow)
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 5. REFUND ESCROW
    public shared(msg) func refundEscrow(escrowId: Text, reason: Text): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Refund request for escrow: " # escrowId);

        switch (escrows.get(escrowId)) {
            case (?escrow) {
                // Check refund permissions
                if (not Utils.canRefundEscrow(escrow, userId)) {
                    return #err(#UnauthorizedAccess);
                };

                let now = Time.now();
                let updatedEscrow = {
                    escrow with
                    status = #Refunded;
                    updatedAt = now;
                };

                escrows.put(escrowId, updatedEscrow);

                // In a real implementation, this would return funds to buyer
                Utils.logInfo("Escrow refunded successfully: " # escrowId);
                #ok(updatedEscrow)
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 6. CREATE DISPUTE
    public shared(msg) func createDispute(request: DisputeRequest): async Result<Dispute, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Creating dispute for escrow: " # request.escrowId);

        switch (escrows.get(request.escrowId)) {
            case (?escrow) {
                // Check if user can initiate dispute
                if (not Utils.canInitiateDispute(escrow, userId)) {
                    return #err(#UnauthorizedAccess);
                };

                // Check if dispute already exists
                let existingDispute = Array.find<Dispute>(Iter.toArray(disputes.vals()), func(d: Dispute): Bool {
                    d.escrowId == request.escrowId and (d.status == #Open or d.status == #InReview)
                });

                switch (existingDispute) {
                    case (?_) {
                        return #err(#InternalError("Active dispute already exists for this escrow"));
                    };
                    case null {};
                };

                let disputeId = Utils.generateDisputeId();
                let respondentId = if (userId == escrow.buyerId) { escrow.sellerId } else { escrow.buyerId };
                let now = Time.now();

                let dispute: Dispute = {
                    id = disputeId;
                    escrowId = request.escrowId;
                    initiatorId = userId;
                    respondentId = respondentId;
                    arbitratorId = escrow.arbitratorId;
                    reason = request.reason;
                    description = request.description;
                    evidence = request.evidence;
                    status = #Open;
                    resolution = null;
                    resolutionReason = null;
                    createdAt = now;
                    updatedAt = now;
                    resolvedAt = null;
                };

                // Store dispute
                disputes.put(disputeId, dispute);

                // Update escrow status to disputed
                let updatedEscrow = {
                    escrow with
                    status = #Disputed;
                    updatedAt = now;
                };
                escrows.put(request.escrowId, updatedEscrow);

                Utils.logInfo("Dispute created successfully: " # disputeId);
                #ok(dispute)
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 7. RESOLVE DISPUTE
    public shared(msg) func resolveDispute(
        disputeId: Text,
        resolution: DisputeResolution,
        reason: Text
    ): async Result<Dispute, EscrowError> {
        let caller = msg.caller;
        let arbitratorId = Utils.generateUserId(caller);

        Utils.logInfo("Resolving dispute: " # disputeId);

        switch (disputes.get(disputeId)) {
            case (?dispute) {
                // Check arbitrator permissions
                if (not Utils.canResolveDispute(dispute, arbitratorId)) {
                    return #err(#UnauthorizedAccess);
                };

                let now = Time.now();
                let resolvedDispute = {
                    dispute with
                    status = #Resolved;
                    resolution = ?resolution;
                    resolutionReason = ?reason;
                    updatedAt = now;
                    resolvedAt = ?now;
                };

                disputes.put(disputeId, resolvedDispute);

                // Update escrow based on resolution
                switch (escrows.get(dispute.escrowId)) {
                    case (?escrow) {
                        let updatedEscrow = {
                            escrow with
                            status = #Resolved;
                            updatedAt = now;
                        };
                        escrows.put(dispute.escrowId, updatedEscrow);
                    };
                    case null {};
                };

                Utils.logInfo("Dispute resolved successfully: " # disputeId);
                #ok(resolvedDispute)
            };
            case null {
                #err(#DisputeNotFound)
            };
        }
    };

    // 8. GET ESCROW BY ID
    public shared(msg) func getEscrow(escrowId: Text): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting escrow: " # escrowId);

        switch (escrows.get(escrowId)) {
            case (?escrow) {
                if (Utils.canAccessEscrow(escrow, userId)) {
                    #ok(escrow)
                } else {
                    #err(#UnauthorizedAccess)
                }
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 9. GET USER ESCROWS
    public shared(msg) func getUserEscrows(): async Result<[EscrowAgreement], EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting escrows for user: " # userId);

        let escrowIds = switch (userEscrows.get(userId)) {
            case (?ids) { ids };
            case null { [] };
        };

        let userEscrowList = Array.mapFilter<Text, EscrowAgreement>(escrowIds, func(id: Text): ?EscrowAgreement {
            escrows.get(id)
        });

        // Sort by creation date (newest first)
        let sortedEscrows = Array.sort<EscrowAgreement>(userEscrowList, func(a: EscrowAgreement, b: EscrowAgreement): { #less; #equal; #greater } {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        });

        #ok(sortedEscrows)
    };

    // 10. GET DEMO USER ESCROWS
    public func getDemoUserEscrows(userType: Text): async Result<[EscrowAgreement], EscrowError> {
        let userId = "user_" # userType # "_demo";
        Utils.logInfo("Getting demo escrows for: " # userId);

        let escrowIds = switch (userEscrows.get(userId)) {
            case (?ids) { ids };
            case null { [] };
        };

        let userEscrowList = Array.mapFilter<Text, EscrowAgreement>(escrowIds, func(id: Text): ?EscrowAgreement {
            escrows.get(id)
        });

        // Sort by creation date (newest first)
        let sortedEscrows = Array.sort<EscrowAgreement>(userEscrowList, func(a: EscrowAgreement, b: EscrowAgreement): { #less; #equal; #greater } {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        });

        #ok(sortedEscrows)
    };

    // 11. GET ESCROW BY ORDER
    public shared(msg) func getEscrowByOrder(orderId: Text): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting escrow for order: " # orderId);

        switch (orderEscrowMap.get(orderId)) {
            case (?escrowId) {
                switch (escrows.get(escrowId)) {
                    case (?escrow) {
                        if (Utils.canAccessEscrow(escrow, userId)) {
                            #ok(escrow)
                        } else {
                            #err(#UnauthorizedAccess)
                        }
                    };
                    case null {
                        #err(#EscrowNotFound)
                    };
                }
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 12. GET DISPUTE BY ID
    public shared(msg) func getDispute(disputeId: Text): async Result<Dispute, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting dispute: " # disputeId);

        switch (disputes.get(disputeId)) {
            case (?dispute) {
                // Check if user is involved in the dispute
                if (dispute.initiatorId == userId or 
                    dispute.respondentId == userId or 
                    (switch (dispute.arbitratorId) { case null { false }; case (?arbId) { arbId == userId } })) {
                    #ok(dispute)
                } else {
                    #err(#UnauthorizedAccess)
                }
            };
            case null {
                #err(#DisputeNotFound)
            };
        }
    };

    // 13. GET USER DISPUTES
    public shared(msg) func getUserDisputes(): async Result<[Dispute], EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting disputes for user: " # userId);

        let allDisputes = Iter.toArray(disputes.vals());
        let userDisputes = Array.filter<Dispute>(allDisputes, func(dispute: Dispute): Bool {
            dispute.initiatorId == userId or 
            dispute.respondentId == userId or 
            (switch (dispute.arbitratorId) { case null { false }; case (?arbId) { arbId == userId } })
        });

        // Sort by creation date (newest first)
        let sortedDisputes = Array.sort<Dispute>(userDisputes, func(a: Dispute, b: Dispute): { #less; #equal; #greater } {
            if (a.createdAt > b.createdAt) { #less }
            else if (a.createdAt < b.createdAt) { #greater }
            else { #equal }
        });

        #ok(sortedDisputes)
    };

    // 14. ADD DISPUTE EVIDENCE
    public shared(msg) func addDisputeEvidence(
        disputeId: Text,
        evidence: DisputeEvidence
    ): async Result<Dispute, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Adding evidence to dispute: " # disputeId);

        switch (disputes.get(disputeId)) {
            case (?dispute) {
                // Check if user is involved in the dispute
                if (dispute.initiatorId != userId and 
                    dispute.respondentId != userId and 
                    (switch (dispute.arbitratorId) { case null { true }; case (?arbId) { arbId != userId } })) {
                    return #err(#UnauthorizedAccess);
                };

                // Validate evidence
                if (not Utils.validateEvidence(evidence)) {
                    return #err(#InternalError("Invalid evidence format"));
                };

                let updatedEvidence = Array.append(dispute.evidence, [evidence]);
                let now = Time.now();

                let updatedDispute = {
                    dispute with
                    evidence = updatedEvidence;
                    updatedAt = now;
                };

                disputes.put(disputeId, updatedDispute);

                Utils.logInfo("Evidence added successfully to dispute: " # disputeId);
                #ok(updatedDispute)
            };
            case null {
                #err(#DisputeNotFound)
            };
        }
    };

    // 15. CANCEL ESCROW
    public shared(msg) func cancelEscrow(escrowId: Text): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Cancel escrow request: " # escrowId);

        switch (escrows.get(escrowId)) {
            case (?escrow) {
                // Only buyer or seller can cancel, and only before funding
                if (escrow.buyerId != userId and escrow.sellerId != userId) {
                    return #err(#UnauthorizedAccess);
                };

                if (escrow.status != #Created) {
                    return #err(#InternalError("Cannot cancel funded escrow"));
                };

                let now = Time.now();
                let cancelledEscrow = {
                    escrow with
                    status = #Cancelled;
                    updatedAt = now;
                };

                escrows.put(escrowId, cancelledEscrow);

                Utils.logInfo("Escrow cancelled successfully: " # escrowId);
                #ok(cancelledEscrow)
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // 16. PROCESS AUTO-RELEASE
    public func processAutoReleases(): async Text {
        Utils.logInfo("Processing auto-releases");

        let allEscrows = Iter.toArray(escrows.vals());
        let autoReleaseEscrows = Array.filter<EscrowAgreement>(allEscrows, func(escrow: EscrowAgreement): Bool {
            Utils.isAutoReleaseDue(escrow)
        });

        var processedCount = 0;
        for (escrow in autoReleaseEscrows.vals()) {
            let now = Time.now();
            let releasedEscrow = {
                escrow with
                status = #Released;
                releasedAt = ?now;
                updatedAt = now;
            };
            escrows.put(escrow.id, releasedEscrow);
            processedCount += 1;
            Utils.logInfo("Auto-released escrow: " # escrow.id);
        };

        "Processed " # debug_show(processedCount) # " auto-releases"
    };

    // UTILITY FUNCTIONS

    // Add escrow to user's list
    private func addEscrowToUser(userId: Text, escrowId: Text) {
        let currentEscrows = switch (userEscrows.get(userId)) {
            case (?escrowIds) { escrowIds };
            case null { [] };
        };
        let updatedEscrows = Array.append(currentEscrows, [escrowId]);
        userEscrows.put(userId, updatedEscrows);
    };

    // Get all escrows (admin function)
    public shared(msg) func getAllEscrows(): async Result<[EscrowAgreement], EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        // In a real implementation, check if user is admin
        let allEscrows = Iter.toArray(escrows.vals());
        #ok(allEscrows)
    };

    // Get all disputes (admin function)
    public shared(msg) func getAllDisputes(): async Result<[Dispute], EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        // In a real implementation, check if user is admin
        let allDisputes = Iter.toArray(disputes.vals());
        #ok(allDisputes)
    };

    // Get escrow statistics
    public query func getEscrowStats(): async EscrowStats {
        let allEscrows = Iter.toArray(escrows.vals());
        Utils.calculateEscrowStats(allEscrows)
    };

    // Get user escrow statistics
    public shared(msg) func getUserEscrowStats(): async Result<UserEscrowStats, EscrowError> {
        let caller = msg.caller;
        let userId = Utils.generateUserId(caller);

        Utils.logInfo("Getting escrow stats for user: " # userId);

        let allEscrows = Iter.toArray(escrows.vals());
        let stats = Utils.calculateUserEscrowStats(allEscrows, userId);
        #ok(stats)
    };

    // Get demo user escrow statistics
    public func getDemoUserEscrowStats(userType: Text): async Result<UserEscrowStats, EscrowError> {
        let userId = "user_" # userType # "_demo";
        Utils.logInfo("Getting demo escrow stats for: " # userId);

        let allEscrows = Iter.toArray(escrows.vals());
        let stats = Utils.calculateUserEscrowStats(allEscrows, userId);
        #ok(stats)
    };

    // Get active disputes requiring arbitration
    public shared(msg) func getActiveDisputes(): async Result<[Dispute], EscrowError> {
        let caller = msg.caller;
        let arbitratorId = Utils.generateUserId(caller);

        Utils.logInfo("Getting active disputes for arbitrator: " # arbitratorId);

        let allDisputes = Iter.toArray(disputes.vals());
        let activeDisputes = Array.filter<Dispute>(allDisputes, func(dispute: Dispute): Bool {
            dispute.status == #Open or dispute.status == #InReview
        });

        // Sort by creation date (oldest first for priority)
        let sortedDisputes = Array.sort<Dispute>(activeDisputes, func(a: Dispute, b: Dispute): { #less; #equal; #greater } {
            if (a.createdAt < b.createdAt) { #less }
            else if (a.createdAt > b.createdAt) { #greater }
            else { #equal }
        });

        #ok(sortedDisputes)
    };

    // Get disputes for specific escrow
    public query func getEscrowDisputes(escrowId: Text): async [Dispute] {
        let allDisputes = Iter.toArray(disputes.vals());
        Array.filter<Dispute>(allDisputes, func(dispute: Dispute): Bool {
            dispute.escrowId == escrowId
        })
    };

    // Check for expired escrows
    public func checkExpiredEscrows(): async Text {
        Utils.logInfo("Checking for expired escrows");

        let allEscrows = Iter.toArray(escrows.vals());
        let expiredEscrows = Array.filter<EscrowAgreement>(allEscrows, func(escrow: EscrowAgreement): Bool {
            Utils.isEscrowExpired(escrow) and (escrow.status == #Created or escrow.status == #Active)
        });

        var processedCount = 0;
        for (escrow in expiredEscrows.vals()) {
            let now = Time.now();
            let expiredEscrow = {
                escrow with
                status = if (escrow.status == #Created) { #Cancelled } else { #Refunded };
                updatedAt = now;
            };
            escrows.put(escrow.id, expiredEscrow);
            processedCount += 1;
            Utils.logInfo("Processed expired escrow: " # escrow.id);
        };

        "Processed " # debug_show(processedCount) # " expired escrows"
    };

    // Emergency functions for admin
    public shared(msg) func emergencyReleaseEscrow(escrowId: Text, reason: Text): async Result<EscrowAgreement, EscrowError> {
        let caller = msg.caller;
        let adminId = Utils.generateUserId(caller);

        Utils.logInfo("Emergency release request for escrow: " # escrowId);

        // In a real implementation, verify admin role
        
        switch (escrows.get(escrowId)) {
            case (?escrow) {
                let now = Time.now();
                let releasedEscrow = {
                    escrow with
                    status = #Released;
                    releasedAt = ?now;
                    updatedAt = now;
                };

                escrows.put(escrowId, releasedEscrow);

                Utils.logInfo("Emergency release completed: " # escrowId # " - Reason: " # reason);
                #ok(releasedEscrow)
            };
            case null {
                #err(#EscrowNotFound)
            };
        }
    };

    // System maintenance functions
    public query func getSystemHealth(): async {
        totalEscrows: Nat;
        activeEscrows: Nat;
        pendingDisputes: Nat;
        systemLoad: Text;
        lastProcessed: Int;
    } {
        let allEscrows = Iter.toArray(escrows.vals());
        let allDisputes = Iter.toArray(disputes.vals());
        
        let activeEscrows = Array.filter<EscrowAgreement>(allEscrows, func(e: EscrowAgreement): Bool {
            e.status == #Active or e.status == #Funded
        });

        let pendingDisputes = Array.filter<Dispute>(allDisputes, func(d: Dispute): Bool {
            d.status == #Open or d.status == #InReview
        });

        let systemLoad = if (activeEscrows.size() > 100) { "High" }
                        else if (activeEscrows.size() > 50) { "Medium" }
                        else { "Low" };

        {
            totalEscrows = allEscrows.size();
            activeEscrows = activeEscrows.size();
            pendingDisputes = pendingDisputes.size();
            systemLoad = systemLoad;
            lastProcessed = Int64.toInt(Time.now() / 1000000000);
        }
    };

    // Health check
    public query func healthCheck(): async Text {
        "Escrow canister is running. Total escrows: " # debug_show(escrows.size()) # 
        ", Active disputes: " # debug_show(disputes.size())
    };
}