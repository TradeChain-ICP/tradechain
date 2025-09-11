// app/dashboard/layout.tsx - Enhanced Modern Dashboard Layout with Dynamic Content Width
import type React from 'react';
import { redirect } from 'next/navigation';
import { PageLoader } from '@/components/ui/loading-spinner';
import { Suspense } from 'react';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { ProtectedRoute } from '@/contexts/auth-context';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['buyer', 'seller']}>
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          {/* Background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-primary/[0.02] pointer-events-none" />

          <div className="relative flex h-screen overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main content area - ensures full width usage */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              {/* Header */}
              <DashboardHeader />

              {/* Main content with scroll and dynamic padding */}
              <main className="flex-1 overflow-auto">
                <Suspense fallback={<PageLoader />}>
                  <div className="animate-fade-in-up w-full">
                    {/* Content wrapper with responsive padding that adjusts based on sidebar state */}
                    <div className="w-full max-w-none">{children}</div>
                  </div>
                </Suspense>
              </main>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
