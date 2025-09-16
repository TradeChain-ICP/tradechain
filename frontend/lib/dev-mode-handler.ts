// frontend/lib/dev-mode-handler.ts
// Enhanced development mode error suppression for NFID compatibility

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
    'AgentCallError',
    'certificate verification failed',
    'threshold signature',
    'ThresBls12_381 signature could not be verified',
    'IcCanisterSignature signature could not be verified',
    'failed to verify threshold signature',
    'Invalid combined threshold signature',
  ];

  return signatureErrorPatterns.some((pattern) => errorMessage.includes(pattern));
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
    },
  };
};

// NFID-specific mock response for authentication issues
export const createNFIDMockResponse = (context: string) => {
  console.log(`🎭🆔 [${context}] Creating NFID mock success response for development`);

  return {
    ok: {
      id: `nfid_dev_user_${Date.now()}`,
      principalId: 'nfid_development_principal',
      firstName: 'NFID',
      lastName: 'User',
      role: ['buyer'], // Default to buyer for NFID testing
      authMethod: { nfid: null },
      kycStatus: { pending: null },
      verified: false,
      walletAddress: 'nfid_dev_wallet_address',
      joinedAt: BigInt(Date.now() * 1000000),
      lastActive: BigInt(Date.now() * 1000000),
      kycSubmittedAt: [],
    },
  };
};
