// components/dashboard/sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/contexts/sidebar-context';
import {
  Activity,
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Plus,
  Eye,
  Target,
  Zap,
  MessageSquare,
  Wallet,
  Heart,
  History,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge: string | null;
  disabled?: boolean;
}

const buyerNavigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/buyer',
    icon: LayoutDashboard,
    badge: null,
    disabled: false,
  },
  {
    name: 'Marketplace',
    href: '/dashboard/buyer/marketplace',
    icon: ShoppingCart,
    badge: null,
    disabled: false,
  },
  {
    name: 'Portfolio',
    href: '/dashboard/buyer/portfolio',
    icon: TrendingUp,
    badge: null,
    disabled: false,
  },
  {
    name: 'Orders',
    href: '/dashboard/buyer/orders',
    icon: Package,
    badge: null,
    disabled: false,
  },
  {
    name: 'Favorites',
    href: '/dashboard/buyer/favorites',
    icon: Heart,
    badge: null,
    disabled: false,
  },
  {
    name: 'History',
    href: '/dashboard/buyer/history',
    icon: History,
    badge: null,
    disabled: false,
  },
  {
    name: 'Wallet',
    href: '/dashboard/buyer/wallet',
    icon: Wallet,
    badge: null,
    disabled: false,
  },
  {
    name: 'AI Insights',
    href: '/dashboard/buyer/ai-insights',
    icon: Zap,
    badge: 'Soon',
    disabled: true,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: 'Soon',
    disabled: true,
  },
];

const sellerNavigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/seller',
    icon: LayoutDashboard,
    badge: null,
    disabled: false,
  },
  {
    name: 'Add Product',
    href: '/dashboard/seller/add-product',
    icon: Plus,
    badge: null,
    disabled: false,
  },
  {
    name: 'Inventory',
    href: '/dashboard/seller/inventory',
    icon: Package,
    badge: null,
    disabled: false,
  },
  {
    name: 'Orders',
    href: '/dashboard/seller/orders',
    icon: ShoppingCart,
    badge: null,
    disabled: false,
  },
  {
    name: 'Analytics',
    href: '/dashboard/seller/analytics',
    icon: BarChart3,
    badge: null,
    disabled: false,
  },
  {
    name: 'Wallet',
    href: '/dashboard/seller/wallet',
    icon: Wallet,
    badge: null,
    disabled: false,
  },
  {
    name: 'Earnings',
    href: '/dashboard/seller/earnings',
    icon: DollarSign,
    badge: null,
    disabled: false,
  },
  {
    name: 'Price Optimizer',
    href: '/dashboard/seller/price-optimizer',
    icon: Target,
    badge: 'Beta',
    disabled: false,
  },
  {
    name: 'Performance',
    href: '/dashboard/seller/performance',
    icon: Eye,
    badge: 'Soon',
    disabled: true,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    badge: 'Soon',
    disabled: true,
  },
];

const bottomNavigation: NavigationItem[] = [
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
  {
    name: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle,
    badge: null,
  },
];

interface DashboardSidebarProps {
  className?: string;
}

// Branded TC Logo Component for collapsed state
const CollapsedLogo = ({ className }: { className?: string }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <div
      className={cn(
        'w-12 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 hover:scale-105',
        isDark ? 'bg-gray-300' : 'bg-gray-800',
        className
      )}
    >
      <div className="flex space-x-0.5 font-extrabold tracking-tight">
        <span className="text-primary">T</span>
        <span style={{ color: isDark ? '#1A3557' : '#FFFFFF' }}>C</span>
      </div>
    </div>
  );
};

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { user, disconnect } = useAuth();
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleSignOut = async () => {
    disconnect();
  };

  // Get navigation items based on user role
  const navigation = user?.role === 'seller' ? sellerNavigation : buyerNavigation;

  const currentTheme = mounted ? resolvedTheme : 'light';
  const logoSrc = '/images/tradechain-logo.png';

  return (
    <>
      {/* Mobile backdrop - positioned behind content */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'flex flex-col h-full bg-sidebar border-r border-sidebar-border shadow-sm transition-all duration-300 ease-in-out relative',
          // Desktop styles - only show on large screens
          'hidden lg:flex',
          isCollapsed ? 'w-22' : 'w-60',
          className
        )}
      >
        {/* Desktop Header with Logo */}
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border min-h-[80px] relative">
          <div
            className={cn(
              'flex flex-col items-center gap-1 transition-opacity duration-300',
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-full'
            )}
          >
            {mounted && (
              <div className="flex flex-col items-center space-y-1">
                <div className="text-center">
                  <div className="text-xl font-bold tracking-tight">
                    <span className="text-primary">Trade</span>
                    <span className="text-foreground dark:text-foreground/80">Chain</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground text-center capitalize">
                  {user?.role || 'Trader'} Dashboard
                </span>
              </div>
            )}
          </div>

          {/* Show TC logo when collapsed */}
          {isCollapsed && mounted && (
            <div className="flex items-center justify-center w-full">
              <div className="relative">
                <Image
                  src={logoSrc}
                  alt="TradeChain Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <CollapsedLogo className="hidden" />
              </div>
            </div>
          )}
        </div>

        {/* Desktop Toggle Button */}
        <div
          className={cn(
            'absolute transition-all duration-300 z-50',
            'top-24',
            isCollapsed ? 'right-[-12px]' : 'right-[-14px]'
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 rounded-full shadow-lg border',
              'bg-background text-foreground hover:bg-primary hover:text-primary-foreground',
              'border-border hover:border-primary hover:shadow-primary/25'
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard/buyer' && item.href !== '/dashboard/seller' && pathname.startsWith(item.href));

              return (
                <div key={item.name} className="relative group">
                  {item.disabled ? (
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                        'text-muted-foreground cursor-not-allowed opacity-60',
                        isCollapsed && 'justify-center px-2'
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-xs bg-muted text-muted-foreground border-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative group',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        'hover:scale-105 active:scale-95',
                        isCollapsed && 'justify-center px-2'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                          isActive && 'scale-110'
                        )}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                'ml-auto text-xs border-0',
                                isActive
                                  ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sidebar-primary/20 to-transparent pointer-events-none" />
                      )}
                    </Link>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.name}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Navigation */}
          <div className="mt-8 pt-6 border-t border-sidebar-border">
            <nav className="space-y-2">
              {bottomNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href);

                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 relative group',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/25'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        'hover:scale-105 active:scale-95',
                        isCollapsed && 'justify-center px-2'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                          isActive && 'scale-110'
                        )}
                      />

                      {!isCollapsed && (
                        <>
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                'ml-auto text-xs border-0',
                                isActive
                                  ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                        {item.badge && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </ScrollArea>

        {/* Desktop Footer */}
        <div className="p-4 border-t border-sidebar-border bg-sidebar">
          <div className="relative group">
            <Button
              variant="ghost"
              className={cn(
                'w-full text-sidebar-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200',
                isCollapsed ? 'justify-center px-2 h-10' : 'justify-start h-12'
              )}
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 font-medium">Sign Out</span>}
            </Button>

            {/* Tooltip for sign out button in collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 bottom-0">
                Sign Out
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Clean and Simple */}
      {isMobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border shadow-xl lg:hidden flex flex-col">
          {/* Mobile Header - Simple without logo */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-muted"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>

          {/* Mobile Navigation - Takes up available space */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-4 py-6">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard/buyer' && item.href !== '/dashboard/seller' && pathname.startsWith(item.href));

                  return (
                    <div key={item.name}>
                      {item.disabled ? (
                        <div className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground cursor-not-allowed opacity-60">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-auto text-xs bg-muted text-muted-foreground border-0"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-muted'
                          )}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                'ml-auto text-xs border-0',
                                isActive
                                  ? 'bg-primary-foreground/20 text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Bottom Navigation - Mobile */}
              <div className="mt-8 pt-6 border-t border-border">
                <nav className="space-y-1">
                  {bottomNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href);

                    return (
                      <div key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-muted'
                          )}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={cn(
                                'ml-auto text-xs border-0',
                                isActive
                                  ? 'bg-primary-foreground/20 text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </ScrollArea>
          </div>

          {/* Mobile Footer - Pinned to bottom */}
          <div className="p-4 border-t border-border bg-background">
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => {
                setIsMobileOpen(false);
                handleSignOut();
              }}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        </aside>
      )}
    </>
  );
}