// app/app-providers.tsx
'use client';

import type React from 'react';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-context';
import { ProductProvider } from '@/contexts/product-context';
import { Toaster } from '@/components/ui/toaster';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <ProductProvider>
          {children}
          <Toaster />
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
