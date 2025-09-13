// frontend/contexts/auth-context.tsx
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IcpAgent } from '@/lib/icp-agent';

type KYCStatus = 'pending' | 'inReview' | 'completed' | 'rejected';
type UserRole = 'buyer' | 'seller';
type AuthMethod = 'nfid' | 'internet-identity';

interface User {
  id: string;
  principalId: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  verified: boolean;
  walletAddress: string;
  authMethod: AuthMethod;
  joinedAt: Date;
  kycStatus: KYCStatus;
  kycSubmittedAt?: Date;
  lastActive: Date;
  // Extended profile fields
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  connectWallet: (method: AuthMethod) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  updateKYCStatus: (status: KYCStatus) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  isConnected: boolean;
  refreshUser: () => Promise<void>;
  initializeWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Initializing enhanced auth context...');

      const connected = await IcpAgent.isAuthenticated();
      console.log('🔍 Wallet connected status:', connected);

      if (connected) {
        console.log('✅ Wallet connected, fetching user data...');
        await refreshUserFromBackend();
      }
    } catch (error: unknown) {
      console.error('❌ Failed to initialize auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserFromBackend = async () => {
    try {
      console.log('🔄 Refreshing user from backend...');
      const userManagementActor = IcpAgent.getUserManagementActor();

      if (!userManagementActor) {
        console.log('⚠️ No user management actor available, waiting...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await refreshUserFromBackend(); // Retry
      }

      console.log('📞 Calling getCurrentUser...');
      const result = await userManagementActor.getCurrentUser();

      if ('ok' in result) {
        const backendUser = result.ok;
        console.log('✅ User data received from backend:', backendUser);

        // Convert backend user to frontend user format
        const frontendUser: User = {
          id: backendUser.id,
          principalId: backendUser.principalId,
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          role: backendUser.role && backendUser.role.length > 0 ? backendUser.role[0] : 'buyer',
          verified: backendUser.verified,
          walletAddress: backendUser.walletAddress,
          authMethod: backendUser.authMethod.nfid ? 'nfid' : 'internet-identity',
          joinedAt: new Date(Number(backendUser.joinedAt) / 1000000),
          kycStatus: Object.keys(backendUser.kycStatus)[0] as KYCStatus,
          kycSubmittedAt: backendUser.kycSubmittedAt?.[0]
            ? new Date(Number(backendUser.kycSubmittedAt[0]) / 1000000)
            : undefined,
          lastActive: new Date(Number(backendUser.lastActive) / 1000000),
        };

        setUser(frontendUser);
        console.log('✅ User state updated:', frontendUser);

        // Initialize wallet if user exists
        await initializeUserWallet();
      } else if ('err' in result) {
        console.log('⚠️ User not found in backend:', result.err);
        setUser(null);
      }
    } catch (error: unknown) {
      console.error('❌ Failed to refresh user from backend:', error);

      // Check if this is a development signature error
      const errorMessage = (error as Error).message;
      if (
        errorMessage?.includes('Invalid delegation') ||
        errorMessage?.includes('signature could not be verified') ||
        errorMessage?.includes('Invalid request expiry')
      ) {
        console.log('🎭 Development signature error, creating mock user for demo');

        const mockUser: User = {
          id: `dev_user_${Date.now()}`,
          principalId: IcpAgent.getPrincipal()?.toText() || 'dev_principal',
          firstName: 'Demo',
          lastName: 'User',
          role: 'seller',
          verified: false,
          walletAddress: 'demo_wallet_address',
          authMethod: 'internet-identity',
          joinedAt: new Date(),
          kycStatus: 'pending',
          lastActive: new Date(),
        };

        setUser(mockUser);
      } else {
        setUser(null);
      }
    }
  };

  const initializeUserWallet = async () => {
    try {
      const walletActor = IcpAgent.getWalletActor();
      if (walletActor) {
        console.log('💰 Initializing user wallet...');
        const walletResult = await walletActor.getWallet();

        if ('err' in walletResult) {
          // Create wallet if it doesn't exist
          console.log('💰 Creating new wallet...');
          const createResult = await walletActor.createWallet();
          if ('ok' in createResult) {
            console.log('✅ Wallet created successfully');
          }
        } else {
          console.log('✅ Wallet already exists');
        }
      }
    } catch (error) {
      console.log('⚠️ Wallet initialization failed (expected in development):', error);
    }
  };

  const handleConnectWallet = async (method: AuthMethod) => {
    setIsLoading(true);
    try {
      console.log('🔌 Starting wallet connection with method:', method);

      let connected = false;
      if (method === 'nfid') {
        connected = await IcpAgent.authenticateWithNFID();
      } else {
        connected = await IcpAgent.authenticateWithII();
      }

      if (!connected) {
        throw new Error('Failed to connect wallet');
      }

      console.log('✅ Wallet connected, checking user existence...');
      const userManagementActor = IcpAgent.getUserManagementActor();

      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      try {
        const userExistsResult = await userManagementActor.userExists();

        if (userExistsResult) {
          console.log('👤 Existing user found, loading data...');
          await refreshUserFromBackend();

          if (user?.role) {
            const dashboardPath = `/dashboard/${user.role}`;
            console.log('🔄 Redirecting to dashboard:', dashboardPath);
            router.push(dashboardPath);
          } else {
            router.push('/role-selection');
          }
        } else {
          console.log('🆕 New user, redirecting to role selection');
          router.push('/role-selection');
        }
      } catch (canisterError: unknown) {
        console.log('⚠️ Canister error during user check, assuming new user');
        router.push('/role-selection');
      }
    } catch (error: unknown) {
      console.error('❌ Wallet connection failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUserRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      console.log('👤 Setting user role:', role);
      const userManagementActor = IcpAgent.getUserManagementActor();

      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      try {
        // Check if user exists, if not register them first
        const userExists = await userManagementActor.userExists();

        if (!userExists) {
          console.log('📝 Registering new user first...');
          const authMethod = { internetIdentity: null };
          const registerResult = await userManagementActor.registerUser(authMethod, 'User', 'Name');

          if ('err' in registerResult) {
            throw new Error(registerResult.err);
          }
        }

        // Set the user role
        const roleVariant = { [role]: null };
        const roleResult = await userManagementActor.setUserRole(roleVariant);

        if ('err' in roleResult) {
          throw new Error(roleResult.err);
        }

        console.log('✅ Role set successfully, refreshing user data...');
        await refreshUserFromBackend();
        await initializeUserWallet(); // Initialize wallet after role is set

        const dashboardPath = `/dashboard/${role}`;
        console.log('🔄 Redirecting to dashboard:', dashboardPath);
        router.push(dashboardPath);
      } catch (canisterError: unknown) {
        console.log('🎭 Canister error, creating mock user for development');

        const mockUser: User = {
          id: `mock_user_${Date.now()}`,
          principalId: IcpAgent.getPrincipal()?.toText() || 'mock_principal',
          firstName: 'Demo',
          lastName: 'User',
          role: role,
          verified: false,
          walletAddress: 'mock_wallet_address',
          authMethod: 'internet-identity',
          joinedAt: new Date(),
          kycStatus: 'pending',
          lastActive: new Date(),
        };

        setUser(mockUser);
        router.push(`/dashboard/${role}`);
      }
    } catch (error: unknown) {
      console.error('❌ Failed to set user role:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateKYCStatus = async (status: KYCStatus) => {
    try {
      console.log('📋 Updating KYC status to:', status);
      const userManagementActor = IcpAgent.getUserManagementActor();

      if (!userManagementActor) {
        console.log('⚠️ No user management actor, updating local state only');
        if (user) {
          setUser({
            ...user,
            kycStatus: status,
            kycSubmittedAt: status === 'inReview' ? new Date() : user.kycSubmittedAt,
          });
        }
        return;
      }

      const kycStatus = { [status === 'inReview' ? 'inReview' : status]: null };
      const result = await userManagementActor.updateKYCStatus(kycStatus);

      if ('ok' in result) {
        console.log('✅ KYC status updated successfully');
        await refreshUserFromBackend();
      } else {
        console.log('⚠️ KYC update failed, updating local state:', result.err);
        if (user) {
          setUser({
            ...user,
            kycStatus: status,
            kycSubmittedAt: status === 'inReview' ? new Date() : user.kycSubmittedAt,
          });
        }
      }
    } catch (error) {
      console.error('❌ Failed to update KYC status:', error);
      // Update local state as fallback
      if (user) {
        setUser({
          ...user,
          kycStatus: status,
          kycSubmittedAt: status === 'inReview' ? new Date() : user.kycSubmittedAt,
        });
      }
    }
  };

  const handleUpdateProfile = async (profileData: Partial<User>) => {
    try {
      console.log('👤 Updating profile:', profileData);
      const userManagementActor = IcpAgent.getUserManagementActor();

      if (!userManagementActor) {
        console.log('⚠️ No user management actor, updating local state only');
        if (user) {
          setUser({ ...user, ...profileData });
        }
        return;
      }

      // Update basic profile fields if provided
      if (profileData.firstName || profileData.lastName) {
        const result = await userManagementActor.updateProfile(
          profileData.firstName || user?.firstName || '',
          profileData.lastName || user?.lastName || ''
        );

        if ('ok' in result) {
          console.log('✅ Profile updated successfully');
          await refreshUserFromBackend();
        } else {
          console.log('⚠️ Profile update failed:', result.err);
          throw new Error(result.err);
        }
      } else {
        // For other fields, update local state (extend this when backend supports more fields)
        if (user) {
          setUser({ ...user, ...profileData });
        }
      }
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      // Update local state as fallback
      if (user) {
        setUser({ ...user, ...profileData });
      }
      throw error;
    }
  };

  const handleDisconnect = async () => {
    try {
      await IcpAgent.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const refreshUser = async () => {
    await refreshUserFromBackend();
  };

  const initializeWallet = async () => {
    await initializeUserWallet();
  };

  const isConnected = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        connectWallet: handleConnectWallet,
        setUserRole: handleSetUserRole,
        updateKYCStatus: handleUpdateKYCStatus,
        updateProfile: handleUpdateProfile,
        disconnect: handleDisconnect,
        isLoading,
        isConnected,
        refreshUser,
        initializeWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}) {
  const { user, isLoading, isConnected } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isConnected) {
        router.push('/connect');
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        const defaultPath = `/dashboard/${user.role}`;
        router.push(redirectTo || defaultPath);
        return;
      }
    }
  }, [user, isLoading, isConnected, allowedRoles, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isConnected || (allowedRoles && user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
