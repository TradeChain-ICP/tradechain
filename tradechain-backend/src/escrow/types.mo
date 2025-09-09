// src/escrow/types.mo
import Time "mo:base/Time";
import SharedTypes "../shared/types";

module {
    public type UserId = SharedTypes.UserId;
    public type Principal = SharedTypes.Principal;
    public type Time = SharedTypes.Time;
    public type Result<T, E> = SharedTypes.Result<T, E>;
    public type TokenType = SharedTypes.TokenType;
    public type OrderStatus = SharedTypes.OrderStatus;

    // Escrow Types
    public type EscrowId = Text;
    public type DisputeId = Text;

    public type EscrowStatus = {
        #Created;
        #Funded;
        #Active;
        #Disputed;
        #Resolved;
        #Released;
        #Refunded;
        #Cancelled;
    };

    public type DisputeStatus = {
        #Open;
        #InReview;
        #Resolved;
        #Closed;
    };

    public type DisputeResolution = {
        #ReleaseToSeller;
        #RefundToBuyer;
        #PartialRefund: Float; // Percentage to refund (0.0 - 1.0)
    };

    public type EscrowParty = {
        #Buyer;
        #Seller;
        #Arbitrator;
    };

    // Escrow Agreement
    public type EscrowAgreement = {
        id: EscrowId;
        orderId: Text; // Link to marketplace order
        buyerId: UserId;
        sellerId: UserId;
        arbitratorId: ?UserId; // Optional third-party arbitrator
        amount: Float;
        tokenType: TokenType;
        status: EscrowStatus;
        conditions: [EscrowCondition];
        createdAt: Time;
        updatedAt: Time;
        fundedAt: ?Time;
        releasedAt: ?Time;
        expiresAt: Time;
        autoRelease: Bool;
        autoReleaseDelay: Int; // Hours after delivery confirmation
    };

    // Escrow Conditions
    public type EscrowCondition = {
        id: Text;
        description: Text;
        required: Bool;
        fulfilled: Bool;
        fulfilledBy: ?UserId;
        fulfilledAt: ?Time;
        evidence: [Text]; // URLs or hashes of evidence
    };

    // Escrow Creation Request
    public type EscrowRequest = {
        orderId: Text;
        buyerId: UserId;
        sellerId: UserId;
        arbitratorId: ?UserId;
        amount: Float;
        tokenType: TokenType;
        conditions: [Text]; // Condition descriptions
        autoRelease: Bool;
        autoReleaseDelay: Int;
        expiryDays: Nat;
    };

    // Fund Escrow Request
    public type FundEscrowRequest = {
        escrowId: EscrowId;
        amount: Float;
        tokenType: TokenType;
    };

    // Release Funds Request
    public type ReleaseFundsRequest = {
        escrowId: EscrowId;
        releaseType: {
            #Full;
            #Partial: Float; // Amount to release
        };
        conditions: [Text]; // Condition IDs being fulfilled
    };

    // Dispute System
    public type Dispute = {
        id: DisputeId;
        escrowId: EscrowId;
        initiatorId: UserId;
        respondentId: UserId;
        arbitratorId: ?UserId;
        reason: Text;
        description: Text;
        evidence: [DisputeEvidence];
        status: DisputeStatus;
        resolution: ?DisputeResolution;
        resolutionReason: ?Text;
        createdAt: Time;
        updatedAt: Time;
        resolvedAt: ?Time;
    };

    public type DisputeEvidence = {
        id: Text;
        submittedBy: UserId;
        evidenceType: {
            #Document;
            #Image;
            #Video;
            #Message;
            #Other: Text;
        };
        title: Text;
        description: Text;
        fileUrl: ?Text;
        fileHash: ?Text;
        submittedAt: Time;
    };

    // Dispute Creation Request
    public type DisputeRequest = {
        escrowId: EscrowId;
        reason: Text;
        description: Text;
        evidence: [DisputeEvidence];
    };

    // Escrow Analytics
    public type EscrowStats = {
        totalEscrows: Nat;
        activeEscrows: Nat;
        completedEscrows: Nat;
        disputedEscrows: Nat;
        totalVolume: Float;
        averageEscrowAmount: Float;
        successRate: Float; // Percentage completed without dispute
        averageResolutionTime: Int; // Hours
    };

    public type UserEscrowStats = {
        totalEscrows: Nat;
        successfulEscrows: Nat;
        disputedEscrows: Nat;
        totalVolume: Float;
        averageAmount: Float;
        successRate: Float;
        reputationScore: Float;
    };

    // Notification Events
    public type EscrowEvent = {
        #EscrowCreated;
        #EscrowFunded;
        #ConditionFulfilled;
        #FundsReleased;
        #DisputeRaised;
        #DisputeResolved;
        #EscrowExpired;
        #AutoReleasePending;
    };

    // Error Types
    public type EscrowError = {
        #EscrowNotFound;
        #DisputeNotFound;
        #InsufficientFunds;
        #EscrowAlreadyFunded;
        #EscrowNotFunded;
        #EscrowExpired;
        #InvalidAmount;
        #InvalidCondition;
        #ConditionNotMet;
        #DisputeAlreadyExists;
        #UnauthorizedAccess;
        #InvalidParty;
        #EscrowNotActive;
        #AlreadyResolved;
        #InvalidResolution;
        #Unauthorized;
        #InternalError: Text;
    };
}