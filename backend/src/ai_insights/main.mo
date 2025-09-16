// backend/src/ai_insights/main.mo

import Debug "mo:base/Debug";
import Time "mo:base/Time";

persistent actor {
    public query func healthCheck() : async {status: Text; timestamp: Int} {
        {
            status = "healthy";
            timestamp = Time.now();
        }
    };
}
