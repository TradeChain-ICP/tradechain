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
let walletIdl: any;
let marketplaceIdl: any;
let escrowIdl: any;
let aiInsightsIdl: any;

try {
  userManagementIdl = require('../declarations/user_management').idlFactory;
  walletIdl = require('../declarations/wallet').idlFactory;
  marketplaceIdl = require('../declarations/marketplace').idlFactory;
  escrowIdl = require('../declarations/escrow').idlFactory;
  aiInsightsIdl = require('../declarations/ai_insights').idlFactory;
  console.log('✅ Canister declarations loaded successfully');
} catch (error) {
  console.warn('⚠️ Could not import canister declarations, using mock mode');
}

// Configuration
const CONFIG = {
  HOST: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943',
  INTERNET_IDENTITY_URL: 'https://identity.ic0.app',
  NFID_URL: process.env.NEXT_PUBLIC_NFID_URL || 'https://nfid.one/authenticate',
  USER_MANAGEMENT_CANISTER_ID:
    process.env.NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID || 'uzt4z-lp777-77774-qaabq-cai',
  WALLET_CANISTER_ID: process.env.NEXT_PUBLIC_WALLET_CANISTER_ID || 'umunu-kh777-77774-qaaca-cai',
  MARKETPLACE_CANISTER_ID:
    process.env.NEXT_PUBLIC_MARKETPLACE_CANISTER_ID || 'ulvla-h7777-77774-qaacq-cai',
  ESCROW_CANISTER_ID: process.env.NEXT_PUBLIC_ESCROW_CANISTER_ID || 'ucwa4-rx777-77774-qaada-cai',
  AI_INSIGHTS_CANISTER_ID:
    process.env.NEXT_PUBLIC_AI_INSIGHTS_CANISTER_ID || 'ufxgi-4p777-77774-qaadq-cai',
  DISABLE_SIGNATURE_VALIDATION: process.env.NEXT_PUBLIC_DISABLE_SIGNATURE_VALIDATION === 'true',
};

console.log('🔧 Enhanced ICP Agent Configuration:', {
  ...CONFIG,
  DISABLE_SIGNATURE_VALIDATION: CONFIG.DISABLE_SIGNATURE_VALIDATION,
  DEV_MODE: process.env.NODE_ENV === 'development',
});

export interface ICPActor {
  userManagement: any;
  wallet: any;
  marketplace: any;
  escrow: any;
  aiInsights: any;
}

class ICPAgentManager {
  private authClient: AuthClient | null = null;
  private agent: HttpAgent | null = null;
  private actors: ICPActor | null = null;
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
        await this.createActors();
      } else {
        console.log('ℹ️ User not authenticated');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Enhanced ICP agent:', error);
      await this.createMockActors();
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
      verifyQuerySignatures: !CONFIG.DISABLE_SIGNATURE_VALIDATION,
    });

    // Fetch root key for local development
    if (process.env.NODE_ENV === 'development') {
      try {
        await this.agent.fetchRootKey();
        console.log('🔑 Root key fetched for local development');
      } catch (error) {
        console.warn('⚠️ Failed to fetch root key:', error);
      }
    }
  }

  private async createActors(): Promise<void> {
    if (!this.agent || !userManagementIdl) {
      console.log('⚠️ Missing agent or IDL, creating mock actors');
      await this.createMockActors();
      return;
    }

    try {
      console.log('🎭 Creating enhanced canister actors...');

      const createActorOptions = {
        agent: this.agent,
        queryVerificationDisabled: CONFIG.DISABLE_SIGNATURE_VALIDATION,
      };

      // Create actors with enhanced error handling
      this.actors = {
        userManagement: this.createActor(
          userManagementIdl,
          CONFIG.USER_MANAGEMENT_CANISTER_ID,
          createActorOptions,
          'UserManagement'
        ),
        wallet: this.createActor(
          walletIdl,
          CONFIG.WALLET_CANISTER_ID,
          createActorOptions,
          'Wallet'
        ),
        marketplace: this.createActor(
          marketplaceIdl,
          CONFIG.MARKETPLACE_CANISTER_ID,
          createActorOptions,
          'Marketplace'
        ),
        escrow: this.createActor(
          escrowIdl,
          CONFIG.ESCROW_CANISTER_ID,
          createActorOptions,
          'Escrow'
        ),
        aiInsights: this.createActor(
          aiInsightsIdl,
          CONFIG.AI_INSIGHTS_CANISTER_ID,
          createActorOptions,
          'AIInsights'
        ),
      };

      console.log('✅ All enhanced canister actors created successfully');
    } catch (error) {
      console.error('❌ Failed to create enhanced actors:', error);
      await this.createMockActors();
    }
  }

  private createActor(idl: any, canisterId: string, options: any, actorName: string) {
    const baseActor = Actor.createActor(idl, {
      ...options,
      canisterId,
    });

    // Wrap actor methods with enhanced error handling
    return new Proxy(baseActor, {
      get: (target, prop) => {
        const originalMethod = target[prop as keyof typeof target];

        if (typeof originalMethod === 'function') {
          return async (...args: any[]) => {
            try {
              return await originalMethod.apply(target, args);
            } catch (error: any) {
              if (handleDevelopmentError(error, `${actorName}.${String(prop)}`)) {
                // Return mock response based on method name
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
    switch (methodName) {
      case 'userExists':
        return false;
      case 'getCurrentUser':
      case 'registerUser':
      case 'setUserRole':
        return createMockSuccessResponse(methodName);
      case 'healthCheck':
        return {
          status: 'healthy',
          timestamp: BigInt(Date.now() * 1000000),
          userCount: BigInt(1),
        };
      case 'getWallet':
        return {
          ok: {
            owner: 'mock-principal',
            icpBalance: BigInt(100000000), // 1 ICP
            usdBalance: BigInt(10000), // 100 USD
            nairaBalance: BigInt(5000000), // 50,000 NGN
            euroBalance: BigInt(8500), // 85 EUR
            createdAt: BigInt(Date.now() * 1000000),
            lastTransactionAt: BigInt(Date.now() * 1000000),
            isLocked: false,
            totalTransactions: BigInt(5),
          },
        };
      case 'createWallet':
        return {
          ok: {
            owner: 'mock-principal',
            icpBalance: BigInt(0),
            usdBalance: BigInt(0),
            nairaBalance: BigInt(0),
            euroBalance: BigInt(0),
            createdAt: BigInt(Date.now() * 1000000),
            lastTransactionAt: BigInt(Date.now() * 1000000),
            isLocked: false,
            totalTransactions: BigInt(0),
          },
        };
      case 'getBalance':
        return { ok: BigInt(100000000) }; // 1 ICP
      case 'transfer':
        return { ok: `tx_${Date.now()}` };
      case 'addFunds':
        return { ok: null };
      case 'getTransactionHistory':
        return [];
      default:
        return { ok: 'mock_success' };
    }
  }

  private async createMockActors(): Promise<void> {
    console.log('🎭 Creating enhanced mock actors...');

    const createMockMethod =
      (methodName: string) =>
      async (...args: any[]) => {
        console.log(`🎭 Mock ${methodName} called with:`, args);

        // Add realistic delays
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

        return this.createMethodMockResponse(methodName);
      };

    this.actors = {
      userManagement: {
        userExists: createMockMethod('userExists'),
        getCurrentUser: createMockMethod('getCurrentUser'),
        registerUser: createMockMethod('registerUser'),
        setUserRole: createMockMethod('setUserRole'),
        updateKYCStatus: createMockMethod('updateKYCStatus'),
        updateProfile: createMockMethod('updateProfile'),
        healthCheck: createMockMethod('healthCheck'),
      },
      wallet: {
        getWallet: createMockMethod('getWallet'),
        createWallet: createMockMethod('createWallet'),
        getBalance: createMockMethod('getBalance'),
        transfer: createMockMethod('transfer'),
        addFunds: createMockMethod('addFunds'),
        getTransactionHistory: createMockMethod('getTransactionHistory'),
        healthCheck: createMockMethod('healthCheck'),
      },
      marketplace: {
        healthCheck: createMockMethod('healthCheck'),
        getProducts: createMockMethod('getProducts'),
        listProduct: createMockMethod('listProduct'),
      },
      escrow: {
        healthCheck: createMockMethod('healthCheck'),
        createEscrow: createMockMethod('createEscrow'),
      },
      aiInsights: {
        healthCheck: createMockMethod('healthCheck'),
        getInsights: createMockMethod('getInsights'),
      },
    };

    console.log('✅ Enhanced mock actors created');
  }

  // Authentication methods with enhanced error handling
  async authenticateWithII(): Promise<boolean> {
    console.log('🔐 Starting Internet Identity authentication...');

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
            await this.createAgent();
            await this.createActors();
            resolve(true);
          } catch (error) {
            if (handleDevelopmentError(error, 'II Post-Auth Setup')) {
              console.log('🎭 Using mock setup after II auth');
              await this.createMockActors();
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
            await this.createAgent();
            await this.createActors();
            resolve(true);
          } catch (error) {
            if (handleDevelopmentError(error, 'NFID Post-Auth Setup')) {
              console.log('🎭 Using mock setup after NFID auth');
              await this.createMockActors();
              resolve(true);
            } else {
              reject(error);
            }
          }
        },
        onError: (error) => {
          console.error('❌ NFID authentication failed:', error);
          reject(new Error('NFID authentication failed'));
        },
      });
    });
  }

  // Logout
  async logout(): Promise<void> {
    if (this.authClient) {
      console.log('👋 Logging out...');
      await this.authClient.logout();
      this.identity = null;
      this.agent = null;
      this.actors = null;
      console.log('✅ Logout successful');
    }
  }

  // Check authentication status
  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }
    return this.authClient?.isAuthenticated() || false;
  }

  // Getters
  getIdentity(): Identity | null {
    return this.identity;
  }

  getPrincipal(): Principal | null {
    return this.identity?.getPrincipal() || null;
  }

  getActors(): ICPActor | null {
    return this.actors;
  }

  getUserManagementActor() {
    return this.actors?.userManagement;
  }

  getWalletActor() {
    return this.actors?.wallet;
  }

  getMarketplaceActor() {
    return this.actors?.marketplace;
  }

  getEscrowActor() {
    return this.actors?.escrow;
  }

  getAIInsightsActor() {
    return this.actors?.aiInsights;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.actors?.userManagement) {
        return false;
      }
      const result = await this.actors.userManagement.healthCheck();
      return result?.status === 'healthy';
    } catch (error) {
      if (handleDevelopmentError(error, 'Health Check')) {
        return true; // Mock healthy response
      }
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton with correct naming (note: keeping both exports for compatibility)
export const icpAgent = new ICPAgentManager();
export const IcpAgent = icpAgent; // For backward compatibility

// Helper functions
export const connectWallet = async (method: 'nfid' | 'internet-identity'): Promise<boolean> => {
  try {
    console.log(`🔗 Enhanced wallet connection with ${method}...`);

    if (method === 'nfid') {
      return await icpAgent.authenticateWithNFID();
    } else {
      return await icpAgent.authenticateWithII();
    }
  } catch (error) {
    console.error('❌ Enhanced wallet connection failed:', error);

    // In development mode, allow fallback to mock
    if (process.env.NODE_ENV === 'development' && DEV_MODE_CONFIG.ENABLE_MOCK_FALLBACK) {
      console.log('🎭 Falling back to mock authentication');
      return true;
    }

    throw error;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  await icpAgent.logout();
};

export const isWalletConnected = async (): Promise<boolean> => {
  return await icpAgent.isAuthenticated();
};

export const getCurrentPrincipal = (): string | null => {
  const principal = icpAgent.getPrincipal();
  return principal ? principal.toText() : null;
};

// Initialize on load
if (typeof window !== 'undefined') {
  console.log('🚀 Initializing Enhanced ICP agent...');
  icpAgent.init().catch(console.error);
}
