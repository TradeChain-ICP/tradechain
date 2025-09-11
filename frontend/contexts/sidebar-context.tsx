// contexts/sidebar-context.tsx - Context for sidebar state management
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Optional: Persist collapsed state to localStorage (desktop only)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        setIsCollapsed(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  // Close mobile sidebar on route change and handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Hook for getting responsive content padding based on sidebar state
export function useContentPadding() {
  const { isCollapsed } = useSidebar();

  return {
    // Responsive padding classes that adjust based on sidebar state
    contentPadding: isCollapsed
      ? 'px-4 sm:px-6 lg:px-8 xl:px-12' // More padding when collapsed (more space available)
      : 'px-4 sm:px-6 lg:px-6 xl:px-8', // Less padding when expanded (less space available)

    // Container max-width that adjusts based on sidebar state
    containerWidth: isCollapsed
      ? 'max-w-full' // Full width when collapsed
      : 'max-w-[calc(100vw-288px)] lg:max-w-full', // Constrained when expanded on mobile

    // Grid columns that adjust based on available space
    gridCols: isCollapsed
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };
}
