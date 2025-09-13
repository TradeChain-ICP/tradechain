// frontend/lib/mock-auth.ts
// Temporary mock authentication for testing without Internet Identity issues

export interface MockUser {
  id: string;
  principalId: string;
  firstName: string;
  lastName: string;
  role?: 'buyer' | 'seller';
  authMethod: 'nfid' | 'internet-identity';
}

class MockAuthClient {
  private isAuth = false;
  private mockUser: MockUser | null = null;

  async login(method: 'nfid' | 'internet-identity'): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate authentication delay
      setTimeout(() => {
        this.isAuth = true;
        this.mockUser = {
          id: 'mock_user_123',
          principalId: 'mock_principal_' + Math.random().toString(36).substr(2, 9),
          firstName: 'Test',
          lastName: 'User',
          authMethod: method,
        };
        resolve(true);
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    this.isAuth = false;
    this.mockUser = null;
  }

  isAuthenticated(): boolean {
    return this.isAuth;
  }

  getUser(): MockUser | null {
    return this.mockUser;
  }

  getPrincipal(): string | null {
    return this.mockUser?.principalId || null;
  }
}

export const mockAuthClient = new MockAuthClient();

// Mock canister actor for testing
export const createMockUserManagementActor = () => ({
  async userExists(): Promise<boolean> {
    return false; // Always return false for new user flow
  },

  async registerUser(
    authMethod: any,
    firstName: string,
    lastName: string
  ): Promise<{ ok?: any; err?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
    return {
      ok: {
        id: 'registered_user_123',
        principalId: mockAuthClient.getPrincipal(),
        firstName,
        lastName,
        role: [],
        authMethod,
        kycStatus: { pending: null },
        verified: false,
        walletAddress: 'mock_wallet_' + Math.random().toString(36).substr(2, 9),
        joinedAt: BigInt(Date.now() * 1000000),
        lastActive: BigInt(Date.now() * 1000000),
        kycSubmittedAt: [],
      },
    };
  },

  async setUserRole(role: any): Promise<{ ok?: any; err?: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      ok: {
        id: 'registered_user_123',
        principalId: mockAuthClient.getPrincipal(),
        firstName: 'Test',
        lastName: 'User',
        role: [Object.keys(role)[0]],
        authMethod: { internetIdentity: null },
        kycStatus: { pending: null },
        verified: false,
        walletAddress: 'mock_wallet_address',
        joinedAt: BigInt(Date.now() * 1000000),
        lastActive: BigInt(Date.now() * 1000000),
        kycSubmittedAt: [],
      },
    };
  },

  async getCurrentUser(): Promise<{ ok?: any; err?: string }> {
    if (!mockAuthClient.isAuthenticated()) {
      return { err: 'Not authenticated' };
    }

    return {
      ok: {
        id: 'registered_user_123',
        principalId: mockAuthClient.getPrincipal(),
        firstName: 'Test',
        lastName: 'User',
        role: ['buyer'], // Default to buyer for testing
        authMethod: { internetIdentity: null },
        kycStatus: { pending: null },
        verified: false,
        walletAddress: 'mock_wallet_address',
        joinedAt: BigInt(Date.now() * 1000000),
        lastActive: BigInt(Date.now() * 1000000),
        kycSubmittedAt: [],
      },
    };
  },

  async healthCheck(): Promise<{ status: string; timestamp: bigint; userCount: bigint }> {
    return {
      status: 'healthy',
      timestamp: BigInt(Date.now() * 1000000),
      userCount: BigInt(1),
    };
  },
});

// Environment flag to enable mock mode
export const ENABLE_MOCK_AUTH = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === 'true';
