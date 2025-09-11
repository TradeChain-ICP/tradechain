// contexts/auth-context.tsx
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type KYCStatus = 'pending' | 'in-review' | 'completed' | 'rejected';

interface User {
  id: string;
  principalId: string;
  firstName: string;
  lastName: string;
  role: 'buyer' | 'seller';
  verified: boolean;
  walletAddress: string;
  authMethod: 'nfid' | 'internet-identity';
  joinedAt: Date;
  kycStatus: KYCStatus;
  kycSubmittedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  connectWallet: (method: 'nfid' | 'internet-identity') => Promise<void>;
  setUserRole: (role: 'buyer' | 'seller') => Promise<void>;
  updateKYCStatus: (status: KYCStatus) => void;
  disconnect: () => void;
  isLoading: boolean;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate mock user data for ICP authentication
const generateMockUser = (method: 'nfid' | 'internet-identity'): Omit<User, 'role'> => ({
  id: `user_${Date.now()}`,
  principalId: `${method === 'nfid' ? 'nfid' : 'ii'}_${Math.random().toString(36).substr(2, 16)}`,
  firstName: method === 'nfid' ? 'Alex' : 'Sam',
  lastName: method === 'nfid' ? 'Johnson' : 'Williams',
  verified: true,
  walletAddress: `${method}_wallet_${Math.random().toString(36).substr(2, 20)}`,
  authMethod: method,
  joinedAt: new Date(),
  kycStatus: 'pending',
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage?.getItem('tradechain_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure joinedAt is a Date object
        if (parsedUser.joinedAt) {
          parsedUser.joinedAt = new Date(parsedUser.joinedAt);
        }
        if (parsedUser.kycSubmittedAt) {
          parsedUser.kycSubmittedAt = new Date(parsedUser.kycSubmittedAt);
        }
        setUser(parsedUser);
      } catch (error) {
        localStorage?.removeItem('tradechain_user');
      }
    }
    setIsLoading(false);
  }, []);

  const connectWallet = async (method: 'nfid' | 'internet-identity') => {
    setIsLoading(true);

    try {
      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newUserData = generateMockUser(method);

      // Check if user has existing role in localStorage
      const existingUser = localStorage?.getItem('tradechain_user');
      if (existingUser) {
        try {
          const parsed = JSON.parse(existingUser);
          if (parsed.role) {
            // Existing user - go to dashboard
            const fullUser: User = { ...newUserData, role: parsed.role };
            setUser(fullUser);
            localStorage?.setItem('tradechain_user', JSON.stringify(fullUser));
            const dashboardPath =
              parsed.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller';
            router.push(dashboardPath);
            return;
          }
        } catch {
          // Ignore parsing errors
        }
      }

      // New user - go to role selection
      localStorage?.setItem('tradechain_user_temp', JSON.stringify(newUserData));
      router.push('/role-selection');
    } catch (error) {
      throw new Error(`Failed to connect with ${method}`);
    } finally {
      setIsLoading(false);
    }
  };

  const setUserRole = async (role: 'buyer' | 'seller') => {
    setIsLoading(true);

    try {
      // Get temporary user data
      const tempUser = localStorage?.getItem('tradechain_user_temp');
      if (!tempUser) throw new Error('No temporary user data found');

      const userData = JSON.parse(tempUser);
      const fullUser: User = { ...userData, role };

      // Simulate role assignment delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUser(fullUser);
      localStorage?.setItem('tradechain_user', JSON.stringify(fullUser));
      localStorage?.removeItem('tradechain_user_temp');

      // Redirect to appropriate dashboard
      const dashboardPath = role === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller';
      router.push(dashboardPath);
    } catch (error) {
      throw new Error('Failed to set user role');
    } finally {
      setIsLoading(false);
    }
  };

  const updateKYCStatus = (status: KYCStatus) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      kycStatus: status,
      kycSubmittedAt: status === 'in-review' ? new Date() : user.kycSubmittedAt,
    };
    setUser(updatedUser);
    localStorage?.setItem('tradechain_user', JSON.stringify(updatedUser));
  };

  const disconnect = () => {
    setUser(null);
    localStorage?.removeItem('tradechain_user');
    localStorage?.removeItem('tradechain_user_temp');
    router.push('/');
  };

  const isConnected = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        connectWallet,
        setUserRole,
        updateKYCStatus,
        disconnect,
        isLoading,
        isConnected,
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

// Protected route wrapper component
export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: {
  children: React.ReactNode;
  allowedRoles?: ('buyer' | 'seller')[];
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
        const defaultPath = user.role === 'buyer' ? '/dashboard/buyer' : '/dashboard/seller';
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