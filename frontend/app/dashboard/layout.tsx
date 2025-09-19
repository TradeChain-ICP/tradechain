// app/dashboard/layout.tsx - Enhanced Dashboard Layout with KYC Notifications
import type React from 'react';
import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/loading-spinner';
import { SidebarProvider } from '@/contexts/sidebar-context';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { ProtectedRoute } from '@/contexts/auth-context';
import { KYCNotificationSystem } from '@/components/kyc/kyc-notification-system';

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
                    {/* KYC Notification System - appears at top of content */}
                    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b">
                      <div className="px-4 py-2 md:px-6 lg:px-8">
                        <KYCNotificationSystem />
                      </div>
                    </div>

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
