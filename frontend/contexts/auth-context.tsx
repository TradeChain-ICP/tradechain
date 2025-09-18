// frontend/contexts/auth-context.tsx
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  email: string;
  phone?: string;
  profilePicture?: ArrayBuffer;
  role?: UserRole;
  verified: boolean;
  walletAddress: string;
  authMethod: AuthMethod;
  joinedAt: Date;
  kycStatus: KYCStatus;
  kycSubmittedAt?: Date;
  lastActive: Date;
  bio?: string;
  location?: string;
  company?: string;
  website?: string;
}

interface Wallet {
  owner: string;
  icpBalance: number;
  usdBalance: number;
  nairaBalance: number;
  euroBalance: number;
  createdAt: Date;
  lastTransactionAt: Date;
  isLocked: boolean;
  totalTransactions: number;
}

interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  connectWallet: (method: AuthMethod) => Promise<void>;
  registerUser: (data: {
    authMethod: AuthMethod;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePicture?: File;
  }) => Promise<void>;
  setUserRole: (data: {
    role: UserRole;
    bio?: string;
    location?: string;
    company?: string;
    website?: string;
  }) => Promise<void>;
  updateKYCStatus: (status: KYCStatus) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
  uploadKYCDocument: (data: { docType: string; fileName: string; file: File }) => Promise<string>;
  submitKYCForReview: () => Promise<void>;
  getUserDocuments: () => Promise<any[]>;
  getWallet: () => Promise<void>;
  addFunds: (amount: number, tokenType: 'ICP' | 'USD' | 'Naira' | 'Euro') => Promise<void>;
  transfer: (data: {
    to: string;
    amount: number;
    tokenType: 'ICP' | 'USD' | 'Naira' | 'Euro';
    memo?: string;
  }) => Promise<string>;
  getTransactionHistory: () => Promise<any[]>;
  disconnect: () => void;
  isLoading: boolean;
  isConnected: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const navigationInProgress = useRef(false);

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

  // Helper function to extract role from Motoko variant
  const extractRoleFromBackend = (backendRole: any): UserRole | undefined => {
    if (!backendRole || backendRole.length === 0) {
      return undefined;
    }

    const roleVariant = backendRole[0];
    console.log('🔍 Backend role variant:', roleVariant);

    if (typeof roleVariant === 'string') {
      return roleVariant as UserRole;
    }

    if (typeof roleVariant === 'object' && roleVariant !== null) {
      if ('buyer' in roleVariant) return 'buyer';
      if ('seller' in roleVariant) return 'seller';

      const keys = Object.keys(roleVariant);
      if (keys.length > 0) {
        const key = keys[0];
        if (key === 'buyer' || key === 'seller') {
          return key as UserRole;
        }
      }
    }

    return undefined;
  };

  const refreshUserFromBackend = async () => {
    try {
      console.log('🔄 Refreshing user from backend...');
      const userManagementActor = IcpAgent.getUserManagementActor();

      if (!userManagementActor) {
        console.log('⚠️ No user management actor available, waiting...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await refreshUserFromBackend();
      }

      console.log('📞 Calling getCurrentUser...');
      const result = await userManagementActor.getCurrentUser();

      if ('ok' in result) {
        const backendUser = result.ok;
        console.log('✅ User data received from backend:', backendUser);

        const userRole = extractRoleFromBackend(backendUser.role);
        console.log('✅ Extracted role:', userRole);

        const frontendUser: User = {
          id: backendUser.id,
          principalId: backendUser.principalId,
          firstName: backendUser.firstName,
          lastName: backendUser.lastName,
          email: backendUser.email,
          phone: backendUser.phone?.[0],
          profilePicture: backendUser.profilePicture?.[0],
          role: userRole,
          verified: backendUser.verified,
          walletAddress: backendUser.walletAddress,
          authMethod: backendUser.authMethod.nfid ? 'nfid' : 'internet-identity',
          joinedAt: new Date(Number(backendUser.joinedAt) / 1000000),
          kycStatus: Object.keys(backendUser.kycStatus)[0] as KYCStatus,
          kycSubmittedAt: backendUser.kycSubmittedAt?.[0]
            ? new Date(Number(backendUser.kycSubmittedAt[0]) / 1000000)
            : undefined,
          lastActive: new Date(Number(backendUser.lastActive) / 1000000),
          bio: backendUser.bio?.[0],
          location: backendUser.location?.[0],
          company: backendUser.company?.[0],
          website: backendUser.website?.[0],
        };

        setUser(frontendUser);
        console.log('✅ User state updated:', frontendUser);

        // Get wallet data
        await refreshWalletFromBackend();
      } else if ('err' in result) {
        console.log('⚠️ User not found in backend:', result.err);
        setUser(null);
      }
    } catch (error: unknown) {
      console.error('❌ Failed to refresh user from backend:', error);
      setUser(null);
    }
  };

  const refreshWalletFromBackend = async () => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) return;

      const walletResult = await userManagementActor.getWallet();

      if ('ok' in walletResult) {
        const backendWallet = walletResult.ok;
        const frontendWallet: Wallet = {
          owner: backendWallet.owner.toText(),
          icpBalance: Number(backendWallet.icpBalance),
          usdBalance: Number(backendWallet.usdBalance),
          nairaBalance: Number(backendWallet.nairaBalance),
          euroBalance: Number(backendWallet.euroBalance),
          createdAt: new Date(Number(backendWallet.createdAt) / 1000000),
          lastTransactionAt: new Date(Number(backendWallet.lastTransactionAt) / 1000000),
          isLocked: backendWallet.isLocked,
          totalTransactions: Number(backendWallet.totalTransactions),
        };
        setWallet(frontendWallet);
      }
    } catch (error) {
      console.error('❌ Failed to refresh wallet:', error);
    }
  };

  const navigateToUserDashboard = (role: UserRole) => {
    if (navigationInProgress.current) {
      console.log('🚫 Navigation already in progress, skipping duplicate navigation');
      return;
    }

    if (typeof role !== 'string' || (role !== 'buyer' && role !== 'seller')) {
      console.error('❌ Invalid role for navigation:', role);
      router.push('/role-selection');
      return;
    }

    navigationInProgress.current = true;
    const dashboardPath = `/dashboard/${role}`;
    console.log('🔄 Navigating to dashboard:', dashboardPath);

    router.push(dashboardPath);

    setTimeout(() => {
      navigationInProgress.current = false;
    }, 2000);
  };

  const handleConnectWallet = async (method: AuthMethod) => {
    if (navigationInProgress.current) {
      console.log('🚫 Navigation in progress, ignoring wallet connection');
      return;
    }

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

          const currentUser = await userManagementActor.getCurrentUser();
          if ('ok' in currentUser && currentUser.ok.role && currentUser.ok.role.length > 0) {
            const userRole = extractRoleFromBackend(currentUser.ok.role);
            if (userRole) {
              navigateToUserDashboard(userRole);
            } else {
              router.push('/role-selection');
            }
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

  const handleRegisterUser = async (data: {
    authMethod: AuthMethod;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profilePicture?: File;
  }) => {
    setIsLoading(true);
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      let profilePictureBlob: ArrayBuffer | null = null;
      if (data.profilePicture) {
        profilePictureBlob = await data.profilePicture.arrayBuffer();
      }

      const authMethod = { [data.authMethod]: null };
      const result = await userManagementActor.registerUser(
        authMethod,
        data.firstName,
        data.lastName,
        data.email,
        data.phone ? [data.phone] : [],
        profilePictureBlob ? [new Uint8Array(profilePictureBlob)] : []
      );

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshUserFromBackend();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetUserRole = async (data: {
    role: UserRole;
    bio?: string;
    location?: string;
    company?: string;
    website?: string;
  }) => {
    if (navigationInProgress.current) {
      console.log('🚫 Navigation in progress, ignoring role setting');
      return;
    }

    setIsLoading(true);
    try {
      console.log('👤 Setting user role:', data.role);
      const userManagementActor = IcpAgent.getUserManagementActor();

      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const roleVariant = { [data.role]: null };
      const result = await userManagementActor.setUserRole(
        roleVariant,
        data.bio ? [data.bio] : [],
        data.location ? [data.location] : [],
        data.company ? [data.company] : [],
        data.website ? [data.website] : []
      );

      if ('err' in result) {
        throw new Error(result.err);
      }

      console.log('✅ Role set successfully, refreshing user data...');
      await refreshUserFromBackend();

      navigateToUserDashboard(data.role);
    } catch (error: unknown) {
      console.error('❌ Failed to set user role:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateKYCStatus = async (status: KYCStatus) => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        if (user) {
          setUser({ ...user, kycStatus: status });
        }
        return;
      }

      const kycStatus = { [status]: null };
      const result = await userManagementActor.updateKYCStatus(kycStatus);

      if ('ok' in result) {
        await refreshUserFromBackend();
      } else {
        if (user) {
          setUser({ ...user, kycStatus: status });
        }
      }
    } catch (error) {
      console.error('❌ Failed to update KYC status:', error);
      if (user) {
        setUser({ ...user, kycStatus: status });
      }
    }
  };

  const handleUpdateProfile = async (profileData: Partial<User>) => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        if (user) {
          setUser({ ...user, ...profileData });
        }
        return;
      }

      const result = await userManagementActor.updateProfile(
        profileData.firstName || user?.firstName || '',
        profileData.lastName || user?.lastName || '',
        profileData.email || user?.email || '',
        profileData.phone ? [profileData.phone] : [],
        profileData.bio ? [profileData.bio] : [],
        profileData.location ? [profileData.location] : [],
        profileData.company ? [profileData.company] : [],
        profileData.website ? [profileData.website] : []
      );

      if ('ok' in result) {
        await refreshUserFromBackend();
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      if (user) {
        setUser({ ...user, ...profileData });
      }
      throw error;
    }
  };

  const handleUpdateProfilePicture = async (file: File) => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await userManagementActor.updateProfilePicture(new Uint8Array(arrayBuffer));

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshUserFromBackend();
    } catch (error) {
      console.error('❌ Failed to update profile picture:', error);
      throw error;
    }
  };

  const handleUploadKYCDocument = async (data: {
    docType: string;
    fileName: string;
    file: File;
  }) => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const arrayBuffer = await data.file.arrayBuffer();
      const result = await userManagementActor.uploadKYCDocument(
        data.docType,
        data.fileName,
        new Uint8Array(arrayBuffer),
        data.file.type
      );

      if ('err' in result) {
        throw new Error(result.err);
      }

      return result.ok;
    } catch (error) {
      console.error('❌ Failed to upload KYC document:', error);
      throw error;
    }
  };

  const handleSubmitKYCForReview = async () => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const result = await userManagementActor.submitKYCForReview();

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshUserFromBackend();
    } catch (error) {
      console.error('❌ Failed to submit KYC for review:', error);
      throw error;
    }
  };

  const handleGetUserDocuments = async () => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        return [];
      }

      return await userManagementActor.getUserDocuments();
    } catch (error) {
      console.error('❌ Failed to get user documents:', error);
      return [];
    }
  };

  const handleGetWallet = async () => {
    await refreshWalletFromBackend();
  };

  const handleAddFunds = async (amount: number, tokenType: 'ICP' | 'USD' | 'Naira' | 'Euro') => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const tokenVariant = { [tokenType]: null };
      const result = await userManagementActor.addFunds(amount, tokenVariant);

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshWalletFromBackend();
    } catch (error) {
      console.error('❌ Failed to add funds:', error);
      throw error;
    }
  };

  const handleTransfer = async (data: {
    to: string;
    amount: number;
    tokenType: 'ICP' | 'USD' | 'Naira' | 'Euro';
    memo?: string;
  }) => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        throw new Error('User management actor not available');
      }

      const tokenVariant = { [data.tokenType]: null };
      const result = await userManagementActor.transfer(
        data.to,
        data.amount,
        tokenVariant,
        data.memo ? [data.memo] : []
      );

      if ('err' in result) {
        throw new Error(result.err);
      }

      await refreshWalletFromBackend();
      return result.ok;
    } catch (error) {
      console.error('❌ Failed to transfer:', error);
      throw error;
    }
  };

  const handleGetTransactionHistory = async () => {
    try {
      const userManagementActor = IcpAgent.getUserManagementActor();
      if (!userManagementActor) {
        return [];
      }

      return await userManagementActor.getTransactionHistory();
    } catch (error) {
      console.error('❌ Failed to get transaction history:', error);
      return [];
    }
  };

  const handleDisconnect = async () => {
    try {
      navigationInProgress.current = false;
      await IcpAgent.logout();
      setUser(null);
      setWallet(null);
      router.push('/');
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const refreshUser = async () => {
    await refreshUserFromBackend();
  };

  const isConnected = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        connectWallet: handleConnectWallet,
        registerUser: handleRegisterUser,
        setUserRole: handleSetUserRole,
        updateKYCStatus: handleUpdateKYCStatus,
        updateProfile: handleUpdateProfile,
        updateProfilePicture: handleUpdateProfilePicture,
        uploadKYCDocument: handleUploadKYCDocument,
        submitKYCForReview: handleSubmitKYCForReview,
        getUserDocuments: handleGetUserDocuments,
        getWallet: handleGetWallet,
        addFunds: handleAddFunds,
        transfer: handleTransfer,
        getTransactionHistory: handleGetTransactionHistory,
        disconnect: handleDisconnect,
        isLoading,
        isConnected,
        refreshUser,
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

      if (allowedRoles && user && user.role && !allowedRoles.includes(user.role)) {
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

  if (!isConnected || (allowedRoles && user && user.role && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
