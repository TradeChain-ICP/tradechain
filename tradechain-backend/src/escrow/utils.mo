// src/escrow/utils.mo
import Time "mo:base/Time";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";
import Types "types";

module {
    public type EscrowAgreement = Types.EscrowAgreement;
    public type EscrowCondition = Types.EscrowCondition;
    public type EscrowStatus = Types.EscrowStatus;
    public type Dispute = Types.Dispute;
    public type DisputeEvidence = Types.DisputeEvidence;
    public type DisputeStatus = Types.DisputeStatus;
    public type TokenType = Types.TokenType;
    public type UserId = Types.UserId;

    // Generate user ID from principal (shared across canisters)
    public func generateUserId(principal: Principal): Text {
        let principalText = Principal.toText(principal);
        "user_" # principalText
    };

    // Get anonymous principal for demo purposes
    public func getAnonymousPrincipal(): Principal {
        Principal.fromText("2vxsx-fae")
    };

    // Generate unique escrow ID
    public func generateEscrowId(): Text {
        let now = Time.now();
        "escrow_" # Int.toText(now)
    };

    // Generate unique dispute ID
    public func generateDisputeId(): Text {
        let now = Time.now();
        "dispute_" # Int.toText(now)
    };

    // Generate unique condition ID
    public func generateConditionId(): Text {
        let now = Time.now();
        "cond_" # Int.toText(now)
    };

    // Generate unique evidence ID
    public func generateEvidenceId(): Text {
        let now = Time.now();
        "evidence_" # Int.toText(now)
    };

    // Convert escrow status to text
    public func escrowStatusToText(status: EscrowStatus): Text {
        switch (status) {
            case (#Created) { "Created" };
            case (#Funded) { "Funded" };
            case (#Active) { "Active" };
            case (#Disputed) { "Disputed" };
            case (#Resolved) { "Resolved" };
            case (#Released) { "Released" };
            case (#Refunded) { "Refunded" };
            case (#Cancelled) { "Cancelled" };
        }
    };

    // Convert dispute status to text
    public func disputeStatusToText(status: DisputeStatus): Text {
        switch (status) {
            case (#Open) { "Open" };
            case (#InReview) { "In Review" };
            case (#Resolved) { "Resolved" };
            case (#Closed) { "Closed" };
        }
    };

    // Get token symbol as text
    public func tokenTypeToText(tokenType: TokenType): Text {
        switch (tokenType) {
            case (#ICP) { "ICP" };
            case (#ckBTC) { "ckBTC" };
            case (#ckETH) { "ckETH" };
            case (#ckUSDC) { "ckUSDC" };
        }
    };

    // Get current token price (mock data for demo)
    public func getTokenPrice(tokenType: TokenType): Float {
        switch (tokenType) {
            case (#ICP) { 7.0 };
            case (#ckBTC) { 43000.0 };
            case (#ckETH) { 2800.0 };
            case (#ckUSDC) { 1.0 };
        }
    };

    // Calculate USD value
    public func calculateUsdValue(amount: Float, tokenType: TokenType): Float {
        amount * getTokenPrice(tokenType)
    };

    // Calculate escrow fee (1% of amount)
    public func calculateEscrowFee(amount: Float): Float {
        amount * 0.01
    };

    // Validate escrow amount
    public func isValidAmount(amount: Float): Bool {
        amount > 0.0 and amount <= 10000000.0 // Max 10M units
    };

    // Validate escrow conditions
    public func validateConditions(conditions: [Text]): Bool {
        conditions.size() > 0 and conditions.size() <= 10
    };

    // Create default escrow conditions
    public func createDefaultConditions(conditionTexts: [Text]): [EscrowCondition] {
        Array.mapEntries<Text, EscrowCondition>(conditionTexts, func(text: Text, index: Nat): EscrowCondition {
            {
                id = generateConditionId();
                description = text;
                required = true;
                fulfilled = false;
                fulfilledBy = null;
                fulfilledAt = null;
                evidence = [];
            }
        })
    };

    // Check if all required conditions are fulfilled
    public func areConditionsFulfilled(conditions: [EscrowCondition]): Bool {
        Array.foldLeft<EscrowCondition, Bool>(conditions, true, func(acc: Bool, condition: EscrowCondition): Bool {
            acc and (not condition.required or condition.fulfilled)
        })
    };

    // Update condition fulfillment
    public func fulfillCondition(
        conditions: [EscrowCondition],
        conditionId: Text,
        userId: UserId,
        evidence: [Text]
    ): [EscrowCondition] {
        Array.map<EscrowCondition, EscrowCondition>(conditions, func(condition: EscrowCondition): EscrowCondition {
            if (condition.id == conditionId) {
                {
                    condition with
                    fulfilled = true;
                    fulfilledBy = ?userId;
                    fulfilledAt = ?Time.now();
                    evidence = evidence;
                }
            } else {
                condition
            }
        })
    };

    // Calculate escrow expiry time
    public func calculateExpiryTime(expiryDays: Nat): Time {
        let now = Time.now();
        let daysInNanoseconds = Int64.fromInt(expiryDays * 24 * 60 * 60) * 1000000000;
        now + daysInNanoseconds
    };

    // Calculate auto-release time
    public func calculateAutoReleaseTime(baseTime: Time, delayHours: Int): Time {
        let hoursInNanoseconds = Int64.fromInt(delayHours * 60 * 60) * 1000000000;
        baseTime + hoursInNanoseconds
    };

    // Check if escrow is expired
    public func isEscrowExpired(escrow: EscrowAgreement): Bool {
        Time.now() > escrow.expiresAt
    };

    // Check if auto-release is due
    public func isAutoReleaseDue(escrow: EscrowAgreement): Bool {
        if (not escrow.autoRelease or escrow.status != #Active) {
            return false;
        };

        switch (escrow.fundedAt) {
            case null { false };
            case (?fundedTime) {
                let autoReleaseTime = calculateAutoReleaseTime(fundedTime, escrow.autoReleaseDelay);
                Time.now() > autoReleaseTime and areConditionsFulfilled(escrow.conditions)
            };
        }
    };

    // Validate escrow party permissions
    public func hasEscrowAccess(escrow: EscrowAgreement, userId: UserId): Bool {
        escrow.buyerId == userId or 
        escrow.sellerId == userId or 
        (switch (escrow.arbitratorId) { case null { false }; case (?arbId) { arbId == userId } })
    };

    // Check if user can initiate dispute
    public func canInitiateDispute(escrow: EscrowAgreement, userId: UserId): Bool {
        escrow.status == #Active and (escrow.buyerId == userId or escrow.sellerId == userId)
    };

    // Check if user can resolve dispute
    public func canResolveDispute(dispute: Dispute, userId: UserId): Bool {
        switch (dispute.arbitratorId) {
            case null { false }; // No arbitrator assigned
            case (?arbId) { arbId == userId and dispute.status == #InReview };
        }
    };

    // Calculate dispute resolution amounts
    public func calculateResolutionAmounts(
        escrowAmount: Float,
        resolution: Types.DisputeResolution
    ): (Float, Float) { // (buyerAmount, sellerAmount)
        switch (resolution) {
            case (#ReleaseToSeller) { (0.0, escrowAmount) };
            case (#RefundToBuyer) { (escrowAmount, 0.0) };
            case (#PartialRefund(percentage)) {
                let refundAmount = escrowAmount * percentage;
                let sellerAmount = escrowAmount - refundAmount;
                (refundAmount, sellerAmount)
            };
        }
    };

    // Create demo escrow agreement
    public func createDemoEscrow(
        escrowType: Text,
        buyerId: UserId,
        sellerId: UserId
    ): EscrowAgreement {
        let now = Time.now();
        let escrowId = generateEscrowId();

        switch (escrowType) {
            case "gold-purchase" {
                let conditions = createDefaultConditions([
                    "Seller ships product within 2 business days",
                    "Buyer confirms receipt and product condition",
                    "Product matches description and specifications"
                ]);

                {
                    id = escrowId;
                    orderId = "ord_demo_gold";
                    buyerId = buyerId;
                    sellerId = sellerId;
                    arbitratorId = ?"arbitrator_premium_escrow";
                    amount = 278.57; // ICP amount for $1950 gold purchase
                    tokenType = #ICP;
                    status = #Active;
                    conditions = conditions;
                    createdAt = now - (3 * 24 * 60 * 60 * 1000000000); // 3 days ago
                    updatedAt = now;
                    fundedAt = ?(now - (3 * 24 * 60 * 60 * 1000000000));
                    releasedAt = null;
                    expiresAt = now + (27 * 24 * 60 * 60 * 1000000000); // 30 days from creation
                    autoRelease = true;
                    autoReleaseDelay = 72; // 72 hours after delivery confirmation
                }
            };
            case "silver-purchase" {
                let conditions = createDefaultConditions([
                    "Product shipped with tracking number",
                    "Insurance coverage confirmed",
                    "Quality inspection passed"
                ]);

                {
                    id = escrowId;
                    orderId = "ord_demo_silver";
                    buyerId = buyerId;
                    sellerId = sellerId;
                    arbitratorId = ?"arbitrator_secure_trade";
                    amount = 40.0; // ICP amount for $280 silver purchase
                    tokenType = #ICP;
                    status = #Released;
                    conditions = conditions;
                    createdAt = now - (10 * 24 * 60 * 60 * 1000000000); // 10 days ago
                    updatedAt = now - (2 * 24 * 60 * 60 * 1000000000); // Released 2 days ago
                    fundedAt = ?(now - (10 * 24 * 60 * 60 * 1000000000));
                    releasedAt = ?(now - (2 * 24 * 60 * 60 * 1000000000));
                    expiresAt = now + (20 * 24 * 60 * 60 * 1000000000); // 30 days from creation
                    autoRelease = true;
                    autoReleaseDelay = 48; // 48 hours
                }
            };
            case _ {
                // Default agriculture escrow
                let conditions = createDefaultConditions([
                    "Quality certificate provided",
                    "Delivery to specified warehouse",
                    "Grade verification completed"
                ]);

                {
                    id = escrowId;
                    orderId = "ord_demo_wheat";
                    buyerId = buyerId;
                    sellerId = sellerId;
                    arbitratorId = ?"arbitrator_agri_trade";
                    amount = 412.86; // ICP amount for $2890 agricultural purchase
                    tokenType = #ICP;
                    status = #Disputed;
                    conditions = conditions;
                    createdAt = now - (15 * 24 * 60 * 60 * 1000000000); // 15 days ago
                    updatedAt = now - (1 * 24 * 60 * 60 * 1000000000); // Updated yesterday
                    fundedAt = ?(now - (15 * 24 * 60 * 60 * 1000000000));
                    releasedAt = null;
                    expiresAt = now + (15 * 24 * 60 * 60 * 1000000000); // 30 days from creation
                    autoRelease = false;
                    autoReleaseDelay = 96; // 96 hours
                }
            };
        }
    };

    // Create demo dispute
    public func createDemoDispute(escrowId: Text, buyerId: UserId, sellerId: UserId): Dispute {
        let now = Time.now();
        let disputeId = generateDisputeId();

        let evidence: [DisputeEvidence] = [
            {
                id = generateEvidenceId();
                submittedBy = buyerId;
                evidenceType = #Image;
                title = "Product Quality Issues";
                description = "Photos showing product condition upon delivery";
                fileUrl = ?"/evidence/quality-issue-1.jpg";
                fileHash = ?"0xabc123...def456";
                submittedAt = now - (24 * 60 * 60 * 1000000000); // 1 day ago
            },
            {
                id = generateEvidenceId();
                submittedBy = sellerId;
                evidenceType = #Document;
                title = "Quality Certificate";
                description = "Official quality certificate from accredited lab";
                fileUrl = ?"/evidence/quality-cert.pdf";
                fileHash = ?"0x789xyz...abc123";
                submittedAt = now - (12 * 60 * 60 * 1000000000); // 12 hours ago
            }
        ];

        {
            id = disputeId;
            escrowId = escrowId;
            initiatorId = buyerId;
            respondentId = sellerId;
            arbitratorId = ?"arbitrator_agri_trade";
            reason = "Quality Mismatch";
            description = "Product received does not match the quality specifications outlined in the listing. Grade appears to be lower than advertised Grade A.";
            evidence = evidence;
            status = #InReview;
            resolution = null;
            resolutionReason = null;
            createdAt = now - (2 * 24 * 60 * 60 * 1000000000); // 2 days ago
            updatedAt = now - (6 * 60 * 60 * 1000000000); // 6 hours ago
            resolvedAt = null;
        }
    };

    // Check escrow security requirements
    public func meetsSecurityRequirements(amount: Float, tokenType: TokenType): Bool {
        let minAmount = switch (tokenType) {
            case (#ICP) { 1.0 };
            case (#ckBTC) { 0.001 };
            case (#ckETH) { 0.01 };
            case (#ckUSDC) { 10.0 };
        };
        amount >= minAmount
    };

    // Calculate reputation score based on escrow history
    public func calculateReputationScore(
        totalEscrows: Nat,
        successfulEscrows: Nat,
        disputedEscrows: Nat
    ): Float {
        if (totalEscrows == 0) {
            return 0.0;
        };

        let successRate = Float.fromInt(successfulEscrows) / Float.fromInt(totalEscrows);
        let disputeRate = Float.fromInt(disputedEscrows) / Float.fromInt(totalEscrows);
        
        // Base score from success rate (0-80 points)
        let baseScore = successRate * 80.0;
        
        // Penalty for disputes (max -20 points)
        let disputePenalty = disputeRate * 20.0;
        
        // Bonus for volume (up to +20 points)
        let volumeBonus = Float.min(Float.fromInt(totalEscrows) / 100.0 * 20.0, 20.0);
        
        let finalScore = baseScore - disputePenalty + volumeBonus;
        Float.max(0.0, Float.min(100.0, finalScore))
    };

    // Estimate resolution time based on dispute complexity
    public func estimateResolutionTime(dispute: Dispute): Int {
        let baseHours = 48; // 2 days base
        let evidenceCount = dispute.evidence.size();
        let complexityBonus = evidenceCount * 6; // 6 hours per evidence piece
        
        baseHours + complexityBonus
    };

    // Validate dispute evidence
    public func validateEvidence(evidence: DisputeEvidence): Bool {
        Text.size(evidence.title) > 0 and 
        Text.size(evidence.description) > 0 and
        (evidence.fileUrl != null or Text.size(evidence.description) >= 50)
    };

    // Check if user can access escrow
    public func canAccessEscrow(escrow: EscrowAgreement, userId: UserId): Bool {
        escrow.buyerId == userId or 
        escrow.sellerId == userId or 
        (switch (escrow.arbitratorId) { case null { false }; case (?arbId) { arbId == userId } })
    };

    // Check if escrow can be funded
    public func canFundEscrow(escrow: EscrowAgreement, userId: UserId): Bool {
        escrow.status == #Created and escrow.buyerId == userId
    };

    // Check if funds can be released
    public func canReleaseFunds(escrow: EscrowAgreement, userId: UserId): Bool {
        (escrow.status == #Active or escrow.status == #Resolved) and
        (escrow.sellerId == userId or 
         (switch (escrow.arbitratorId) { case null { false }; case (?arbId) { arbId == userId } })) and
        areConditionsFulfilled(escrow.conditions)
    };

    // Check if escrow can be refunded
    public func canRefundEscrow(escrow: EscrowAgreement, userId: UserId): Bool {
        (escrow.status == #Active or escrow.status == #Disputed or escrow.status == #Resolved) and
        (escrow.buyerId == userId or 
         (switch (escrow.arbitratorId) { case null { false }; case (?arbId) { arbId == userId } }))
    };

    // Generate escrow summary for display
    public func generateEscrowSummary(escrow: EscrowAgreement): Text {
        let statusText = escrowStatusToText(escrow.status);
        let tokenSymbol = tokenTypeToText(escrow.tokenType);
        let usdValue = calculateUsdValue(escrow.amount, escrow.tokenType);
        
        statusText # " escrow for " # Float.toText(escrow.amount) # " " # tokenSymbol # 
        " ($" # Float.toText(usdValue) # ")"
    };

    // Calculate escrow statistics
    public func calculateEscrowStats(escrows: [EscrowAgreement]): Types.EscrowStats {
        let total = escrows.size();
        
        if (total == 0) {
            return {
                totalEscrows = 0;
                activeEscrows = 0;
                completedEscrows = 0;
                disputedEscrows = 0;
                totalVolume = 0.0;
                averageEscrowAmount = 0.0;
                successRate = 0.0;
                averageResolutionTime = 0;
            };
        };

        var activeCount = 0;
        var completedCount = 0;
        var disputedCount = 0;
        var totalVolume = 0.0;
        var totalResolutionTime = 0;
        var resolvedCount = 0;

        for (escrow in escrows.vals()) {
            // Count by status
            switch (escrow.status) {
                case (#Active) { activeCount += 1; };
                case (#Released) { completedCount += 1; };
                case (#Disputed) { disputedCount += 1; };
                case (#Resolved) { 
                    completedCount += 1;
                    resolvedCount += 1;
                };
                case _ {};
            };

            // Calculate volume in USD
            totalVolume += calculateUsdValue(escrow.amount, escrow.tokenType);

            // Calculate resolution time for completed escrows
            switch (escrow.releasedAt) {
                case null {};
                case (?releaseTime) {
                    let resolutionTimeNs = releaseTime - escrow.createdAt;
                    let resolutionTimeHours = Int64.toInt(resolutionTimeNs / (60 * 60 * 1000000000));
                    totalResolutionTime += resolutionTimeHours;
                };
            };
        };

        let averageAmount = totalVolume / Float.fromInt(total);
        let successRate = Float.fromInt(completedCount) / Float.fromInt(total) * 100.0;
        let avgResolutionTime = if (resolvedCount > 0) {
            totalResolutionTime / resolvedCount
        } else { 0 };

        {
            totalEscrows = total;
            activeEscrows = activeCount;
            completedEscrows = completedCount;
            disputedEscrows = disputedCount;
            totalVolume = totalVolume;
            averageEscrowAmount = averageAmount;
            successRate = successRate;
            averageResolutionTime = avgResolutionTime;
        }
    };

    // Calculate user-specific escrow statistics
    public func calculateUserEscrowStats(escrows: [EscrowAgreement], userId: UserId): Types.UserEscrowStats {
        let userEscrows = Array.filter<EscrowAgreement>(escrows, func(escrow: EscrowAgreement): Bool {
            escrow.buyerId == userId or escrow.sellerId == userId
        });

        let total = userEscrows.size();
        
        if (total == 0) {
            return {
                totalEscrows = 0;
                successfulEscrows = 0;
                disputedEscrows = 0;
                totalVolume = 0.0;
                averageAmount = 0.0;
                successRate = 0.0;
                reputationScore = 0.0;
            };
        };

        var successfulCount = 0;
        var disputedCount = 0;
        var totalVolume = 0.0;

        for (escrow in userEscrows.vals()) {
            switch (escrow.status) {
                case (#Released) { successfulCount += 1; };
                case (#Resolved) { successfulCount += 1; };
                case (#Disputed) { disputedCount += 1; };
                case _ {};
            };

            totalVolume += calculateUsdValue(escrow.amount, escrow.tokenType);
        };

        let averageAmount = totalVolume / Float.fromInt(total);
        let successRate = Float.fromInt(successfulCount) / Float.fromInt(total) * 100.0;
        let reputationScore = calculateReputationScore(total, successfulCount, disputedCount);

        {
            totalEscrows = total;
            successfulEscrows = successfulCount;
            disputedEscrows = disputedCount;
            totalVolume = totalVolume;
            averageAmount = averageAmount;
            successRate = successRate;
            reputationScore = reputationScore;
        }
    };

    // Log debug information
    public func logInfo(message: Text) {
        Debug.print("Escrow: " # message);
    };

    public func logError(message: Text) {
        Debug.print("Escrow ERROR: " # message);
    };

    // Format time for display
    public func formatTimeRemaining(targetTime: Time): Text {
        let now = Time.now();
        if (targetTime <= now) {
            return "Expired";
        };

        let remainingNs = targetTime - now;
        let remainingHours = Int64.toInt(remainingNs / (60 * 60 * 1000000000));
        let remainingDays = remainingHours / 24;

        if (remainingDays > 0) {
            Int.toText(remainingDays) # " days remaining"
        } else if (remainingHours > 0) {
            Int.toText(remainingHours) # " hours remaining"
        } else {
            "Less than 1 hour remaining"
        }
    };

    // Validate escrow transition
    public func canTransitionStatus(from: EscrowStatus, to: EscrowStatus): Bool {
        switch (from, to) {
            case (#Created, #Funded) { true };
            case (#Created, #Cancelled) { true };
            case (#Funded, #Active) { true };
            case (#Funded, #Cancelled) { true };
            case (#Active, #Disputed) { true };
            case (#Active, #Released) { true };
            case (#Active, #Refunded) { true };
            case (#Disputed, #Resolved) { true };
            case (#Disputed, #Refunded) { true };
            case (#Resolved, #Released) { true };
            case (#Resolved, #Refunded) { true };
            case _ { false };
        }
    };
}