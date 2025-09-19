// frontend/lib/icp-agent.ts
import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import {
  handleDevelopmentError,
  createMockSuccessResponse,
  DEV_MODE_CONFIG,
} from './dev-mode-handler';

// Import IDL definitions with error handling
let userManagementIdl: any;

try {
  userManagementIdl = require('../declarations/user_management').idlFactory;
  console.log('✅ User management declaration loaded successfully');
} catch (error) {
  console.warn('⚠️ Could not import user management declaration, using mock mode');
}

// Configuration with updated canister IDs from your deployment
const CONFIG = {
  HOST: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943',
  INTERNET_IDENTITY_URL:
    process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL || 
    'http://localhost:4943/?canisterId=uxrrr-q7777-77774-qaaaq-cai',
  NFID_URL: process.env.NEXT_PUBLIC_NFID_URL || 'https://nfid.one/authenticate',
  USER_MANAGEMENT_CANISTER_ID:
    process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID || 'uzt4z-lp777-77774-qaabq-cai',
  INTERNET_IDENTITY_CANISTER_ID: 
    process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID || 'uxrrr-q7777-77774-qaaaq-cai',
  DISABLE_SIGNATURE_VALIDATION: process.env.NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION === 'true',
};

console.log('🔧 Updated ICP Agent Configuration:', {
  ...CONFIG,
  DISABLE_SIGNATURE_VALIDATION: CONFIG.DISABLE_SIGNATURE_VALIDATION,
  DEV_MODE: process.env.NODE_ENV === 'development',
});

class ICPAgentManager {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;
  private userManagementActor: any = null;
  private identity: Identity | null = null;

  async init(): Promise<void> {
    try {
      console.log('🚀 Initializing Enhanced ICP Agent...');

      this.authClient = await AuthClient.create({
        idleOptions: {
          idleTimeout: 1000 * 60 * 30, // 30 minutes
          disableDefaultIdleCallback: true,
        },
      });

      if (await this.authClient.isAuthenticated()) {
        console.log('✅ User already authenticated');
        this.identity = this.authClient.getIdentity();
        await this.createAgent();
        await this.createUserManagementActor();
      } else {
        console.log('ℹ️ User not authenticated');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced ICP agent:', error);
      await this.createMockActor();
    }
  }

  private async createAgent(): Promise<void> {
    if (!this.identity) {
      throw new Error('No identity available');
    }

    console.log('🔗 Creating HTTP agent...');

    this.agent = new HttpAgent({
      host: CONFIG.HOST,
      identity: this.identity,
      verifyQuerySignatures:
        !CONFIG.DISABLE_SIGNATURE_VALIDATION && process.env.NODE_ENV !== 'development',
    });

    if (process.env.NODE_ENV === 'development' || CONFIG.DISABLE_SIGNATURE_VALIDATION) {
      try {
        await this.agent.fetchRootKey();
        console.log('🔑 Root key fetched for local development');
      } catch (error) {
        console.warn('⚠️ Failed to fetch root key:', error);
      }
    }
  }

  private async createUserManagementActor(): Promise<void> {
    if (!this.agent || !userManagementIdl) {
      console.log('⚠️ Missing agent or IDL, creating mock actor');
      await this.createMockActor();
      return;
    }

    try {
      console.log('🎭 Creating user management actor...');
      console.log('📍 Using canister ID:', CONFIG.USER_MANAGEMENT_CANISTER_ID);

      const createActorOptions = {
        agent: this.agent,
        queryVerificationDisabled:
          process.env.NODE_ENV === 'development' || CONFIG.DISABLE_SIGNATURE_VALIDATION,
      };

      this.userManagementActor = this.createActor(
        userManagementIdl,
        CONFIG.USER_MANAGEMENT_CANISTER_ID,
        createActorOptions,
        'UserManagement'
      );

      console.log('✅ User management actor created successfully');
    } catch (error) {
      console.error('❌ Failed to create user management actor:', error);
      await this.createMockActor();
    }
  }

  private createActor(idl: any, canisterId: string, options: any, actorName: string) {
    const baseActor = Actor.createActor(idl, {
      ...options,
      canisterId,
    });

    return new Proxy(baseActor, {
      get: (target, prop) => {
        const originalMethod = target[prop as keyof typeof target];

        if (typeof originalMethod === 'function') {
          return async (...args: any[]) => {
            try {
              console.log(`📞 Calling ${actorName}.${String(prop)} with args:`, args);
              const result = await originalMethod.apply(target, args);
              console.log(`✅ ${actorName}.${String(prop)} result:`, result);
              return result;
            } catch (error: any) {
              console.error(`❌ ${actorName}.${String(prop)} error:`, error);
              if (handleDevelopmentError(error, `${actorName}.${String(prop)}`)) {
                return this.createMethodMockResponse(String(prop));
              }
              throw error;
            }
          };
        }

        return originalMethod;
      },
    });
  }

  private createMethodMockResponse(methodName: string) {
    console.log(`🎭 Creating mock response for ${methodName}...`);

    switch (methodName) {
      case 'userExists':
        return false; // Always return false for new user testing
      case 'getCurrentUser':
        return { err: 'User not found' }; // Force role selection flow
      case 'registerUser':
      case 'setUserRole':
        return createMockSuccessResponse(methodName);
      case 'healthCheck':
        return {
          status: 'healthy',
          timestamp: BigInt(Date.now() * 1000000),
          userCount: BigInt(1),
          walletCount: BigInt(1),
        };
      case 'getWallet':
        return {
          ok: {
            owner: Principal.fromText('2vxsx-fae'),
            icpBalance: BigInt(100000000),
            usdBalance: BigInt(10000),
            nairaBalance: BigInt(5000000),
            euroBalance: BigInt(8500),
            createdAt: BigInt(Date.now() * 1000000),
            lastTransactionAt: BigInt(Date.now() * 1000000),
            isLocked: false,
            totalTransactions: BigInt(5),
          },
        };
      case 'getBalance':
        return { ok: BigInt(100000000) };
      case 'transfer':
        return { ok: `tx_${Date.now()}` };
      case 'addFunds':
        return { ok: null };
      case 'getTransactionHistory':
        return [];
      case 'uploadKYCDocument':
        return { ok: `doc_${Date.now()}` };
      case 'getUserDocuments':
        return [];
      case 'submitKYCForReview':
        return createMockSuccessResponse('submitKYCForReview');
      case 'updateKYCStatus':
        return createMockSuccessResponse('updateKYCStatus');
      case 'updateProfile':
        return createMockSuccessResponse('updateProfile');
      case 'updateProfilePicture':
        return createMockSuccessResponse('updateProfilePicture');
      default:
        return { ok: 'mock_success' };
    }
  }

  private async createMockActor(): Promise<void> {
    console.log('🎭 Creating enhanced mock actor...');

    const createMockMethod =
      (methodName: string) =>
      async (...args: any[]) => {
        console.log(`🎭 Mock ${methodName} called with:`, args);
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
        return this.createMethodMockResponse(methodName);
      };

    this.userManagementActor = {
      userExists: createMockMethod('userExists'),
      getCurrentUser: createMockMethod('getCurrentUser'),
      registerUser: createMockMethod('registerUser'),
      setUserRole: createMockMethod('setUserRole'),
      updateKYCStatus: createMockMethod('updateKYCStatus'),
      updateProfile: createMockMethod('updateProfile'),
      updateProfilePicture: createMockMethod('updateProfilePicture'),
      uploadKYCDocument: createMockMethod('uploadKYCDocument'),
      getUserDocuments: createMockMethod('getUserDocuments'),
      submitKYCForReview: createMockMethod('submitKYCForReview'),
      getWallet: createMockMethod('getWallet'),
      getBalance: createMockMethod('getBalance'),
      transfer: createMockMethod('transfer'),
      addFunds: createMockMethod('addFunds'),
      getTransactionHistory: createMockMethod('getTransactionHistory'),
      healthCheck: createMockMethod('healthCheck'),
    };

    console.log('✅ Enhanced mock actor created');
  }

  async authenticateWithII(): Promise<boolean> {
    console.log('🔐 Starting Internet Identity authentication...');
    console.log('🌐 Using II URL:', CONFIG.INTERNET_IDENTITY_URL);

    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: CONFIG.INTERNET_IDENTITY_URL,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        onSuccess: async () => {
          try {
            console.log('✅ Internet Identity authentication successful');
            this.identity = this.authClient!.getIdentity();

            // Small delay to ensure identity is properly set
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await this.createAgent();
            await this.createUserManagementActor();
            resolve(true);
          } catch (error) {
            console.log('⚠️ Post-auth setup had issues, using mock fallback');
            if (handleDevelopmentError(error, 'II Post-Auth Setup')) {
              console.log('🎭 Using mock setup after II auth');
              await this.createMockActor();
              resolve(true);
            } else {
              reject(error);
            }
          }
        },
        onError: (error) => {
          console.error('❌ Internet Identity authentication failed:', error);
          reject(new Error('Internet Identity authentication failed'));
        },
      });
    });
  }

  async authenticateWithNFID(): Promise<boolean> {
    console.log('🔐 Starting NFID authentication...');

    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      this.authClient!.login({
        identityProvider: CONFIG.NFID_URL,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        windowOpenerFeatures:
          'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
        onSuccess: async () => {
          try {
            console.log('✅ NFID authentication successful');
            this.identity = this.authClient!.getIdentity();

            // Small delay to ensure identity is properly set
            await new Promise((resolve) => setTimeout(resolve, 1000));

            await this.createAgentForNFID();
            await this.createUserManagementActor();
            resolve(true);
          } catch (error) {
            console.log('⚠️ NFID signature validation failed, using mock setup');
            await this.createMockActor();
            resolve(true);
          }
        },
        onError: (error) => {
          console.error('❌ NFID authentication failed:', error);
          reject(new Error('NFID authentication failed'));
        },
      });
    });
  }

  private async createAgentForNFID(): Promise<void> {
    if (!this.identity) {
      throw new Error('No identity available');
    }

    console.log('🔗 Creating NFID-compatible HTTP agent...');

    this.agent = new HttpAgent({
      host: CONFIG.HOST,
      identity: this.identity,
      verifyQuerySignatures: false, // Disable for NFID in development
    });

    if (process.env.NODE_ENV === 'development') {
      try {
        await this.agent.fetchRootKey();
        console.log('🔑 Root key fetched for NFID development compatibility');
      } catch (error) {
        console.warn('⚠️ Failed to fetch root key for NFID:', error);
      }
    }
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      console.log('👋 Logging out...');
      await this.authClient.logout();
      this.identity = null;
      this.agent = null;
      this.userManagementActor = null;
      console.log('✅ Logout successful');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    const isAuth = this.authClient?.isAuthenticated() || false;
    console.log('🔍 Authentication status:', isAuth);
    return isAuth;
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getPrincipal(): Principal | null {
    const principal = this.identity?.getPrincipal() || null;
    console.log('🔑 Principal:', principal?.toText());
    return principal;
  }

  getUserManagementActor() {
    if (!this.userManagementActor) {
      console.warn('⚠️ User management actor not available, may need to re-initialize');
    }
    return this.userManagementActor;
  }

  async healthCheck(): Promise<boolean> {
    try {
      if (!this.userManagementActor) {
        console.log('⚠️ No actor available for health check');
        return false;
      }
      const result = await this.userManagementActor.healthCheck();
      const isHealthy = result?.status === 'healthy';
      console.log('🏥 Health check result:', isHealthy ? 'HEALTHY' : 'UNHEALTHY');
      return isHealthy;
    } catch (error) {
      if (handleDevelopmentError(error, 'Health Check')) {
        console.log('🎭 Health check mock fallback');
        return true;
      }
      console.error('❌ Health check failed:', error);
      return false;
    }
  }
}

// Export singleton
export const IcpAgent = new ICPAgentManager();

// Helper functions
export const connectWallet = async (method: 'nfid' | 'internet-identity'): Promise<boolean> => {
  try {
    console.log(`🔗 Enhanced wallet connection with ${method}...`);

    if (method === 'nfid') {
      return await IcpAgent.authenticateWithNFID();
    } else {
      return await IcpAgent.authenticateWithII();
    }
  } catch (error) {
    console.error('❌ Enhanced wallet connection failed:', error);

    if (process.env.NODE_ENV === 'development' && method === 'nfid') {
      console.log('🎭 Falling back to mock NFID authentication');
      return true;
    }

    throw error;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  await IcpAgent.logout();
};

export const isWalletConnected = async (): Promise<boolean> => {
  return await IcpAgent.isAuthenticated();
};

export const getCurrentPrincipal = (): string | null => {
  const principal = IcpAgent.getPrincipal();
  return principal ? principal.toText() : null;
};

// Initialize on load
if (typeof window !== 'undefined') {
  console.log('🚀 Initializing Enhanced ICP agent...');
  IcpAgent.init().catch(console.error);
}