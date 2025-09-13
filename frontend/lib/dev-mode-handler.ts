// frontend/lib/dev-mode-handler.ts
// Enhanced development mode error suppression and mock handling

export const DEV_MODE_CONFIG = {
  SUPPRESS_SIGNATURE_ERRORS: process.env.NODE_ENV === 'development',
  ENABLE_MOCK_FALLBACK: process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true',
  LOG_SUPPRESSED_ERRORS: true, // Set to false to reduce console noise
};

export const isSignatureValidationError = (error: any): boolean => {
  const errorMessage = error?.message || error?.toString() || '';
  
  const signatureErrorPatterns = [
    'Invalid delegation',
    'signature could not be verified',
    'Invalid canister signature',
    'Invalid request expiry',
    'Specified ingress_expiry not within expected range',
    'User not found in development mode',
    'AgentCallError'
  ];
  
  return signatureErrorPatterns.some(pattern => 
    errorMessage.includes(pattern)
  );
};

export const handleDevelopmentError = (error: any, context: string): boolean => {
  if (!DEV_MODE_CONFIG.SUPPRESS_SIGNATURE_ERRORS) {
    return false; // Don't suppress in production
  }
  
  if (isSignatureValidationError(error)) {
    if (DEV_MODE_CONFIG.LOG_SUPPRESSED_ERRORS) {
      console.log(`🔕 [${context}] Suppressed signature validation error:`, error.message);
    }
    return true; // Error was suppressed
  }
  
  return false; // Error was not suppressed
};

export const createMockSuccessResponse = (context: string) => {
  console.log(`🎭 [${context}] Creating mock success response for development`);
  
  return {
    ok: {
      id: `dev_user_${Date.now()}`,
      principalId: 'development_principal',
      firstName: 'Dev',
      lastName: 'User',
      role: ['seller'], // Default role for testing
      authMethod: { internetIdentity: null },
      kycStatus: { pending: null },
      verified: false,
      walletAddress: 'dev_wallet_address',
      joinedAt: BigInt(Date.now() * 1000000),
      lastActive: BigInt(Date.now() * 1000000),
      kycSubmittedAt: [],
    }
  };
};