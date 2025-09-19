// components/dashboard/header.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  Command,
  Menu,
  X,
  UserCircle,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useSidebar } from '@/contexts/sidebar-context';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import Image from 'next/image';
import { useTheme } from 'next-themes';

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { user, disconnect } = useAuth();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert profile picture to URL for display
  useEffect(() => {
    if (user?.profilePicture) {
      try {
        const blob = new Blob([user.profilePicture], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setProfileImageUrl(url);

        // Cleanup function to revoke the URL when component unmounts or image changes
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error('Failed to create profile image URL:', error);
        setProfileImageUrl(null);
      }
    } else {
      setProfileImageUrl(null);
    }
  }, [user?.profilePicture]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.closest('.search-container')?.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle escape key to close search
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'User';

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    disconnect();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const currentTheme = mounted ? resolvedTheme : 'light';

  return (
    <>
      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6',
          className
        )}
      >
        {/* Mobile menu button and logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'relative h-10 w-10 rounded-xl transition-all duration-300 ease-in-out hover:bg-primary/10',
              isMobileOpen && 'bg-primary/10 text-primary'
            )}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <div className="flex items-center justify-center">
              <span
                className={cn(
                  'absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out',
                  isMobileOpen ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
                )}
              />
              <span
                className={cn(
                  'absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out',
                  isMobileOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                )}
              />
              <span
                className={cn(
                  'absolute h-0.5 w-5 bg-current transform transition-all duration-300 ease-in-out',
                  isMobileOpen ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
                )}
              />
            </div>
          </Button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-primary">Trade</span>
              <span className="text-foreground dark:text-foreground/80">Chain</span>
            </span>
          </div>
        </div>

        {/* Desktop Search */}
        <form onSubmit={handleSearch} className="relative hidden sm:block flex-1 max-w-md lg:ml-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, orders..."
              className="pl-9 pr-12 h-10 bg-muted/50 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all duration-200 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Badge variant="secondary" className="text-xs font-mono hidden md:flex">
                <Command className="h-3 w-3 mr-1" />K
              </Badge>
            </div>
          </div>
        </form>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          {/* Mobile Search Button */}
          <div className="search-container relative sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-200"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Shopping Cart - Only for buyers */}
          {user?.role === 'buyer' && (
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-200"
              asChild
            >
              <Link href="/dashboard/buyer/cart">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground border-2 border-background rounded-full flex items-center justify-center">
                  3
                </Badge>
              </Link>
            </Button>
          )}

          {/* Theme toggle */}
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl hover:bg-primary/10 transition-all duration-200">
            <ThemeSwitcher />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-destructive-foreground border-2 border-background rounded-full flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-xl p-0 hover:ring-2 hover:ring-primary/20 transition-all duration-200"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <Avatar className="h-9 w-9 ring-2 ring-background shadow-sm">
                {profileImageUrl ? (
                  <AvatarImage 
                    src={profileImageUrl} 
                    alt={`${fullName}'s profile`}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-popover border rounded-xl shadow-lg z-50 py-2 animate-in slide-in-from-top-2 duration-200">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {profileImageUrl ? (
                        <AvatarImage 
                          src={profileImageUrl} 
                          alt={`${fullName}'s profile`}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-foreground">{fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs px-2 py-0 capitalize">
                          {user?.role}
                        </Badge>
                        {user?.verified && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Verified
                          </Badge>
                        )}
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <span>View Profile</span>
                  </Link>

                  <Link
                    href="/dashboard/wallet"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Wallet</span>
                  </Link>

                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/help"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span>Help & Support</span>
                  </Link>

                  {/* Theme toggle for mobile */}
                  <div className="block sm:hidden px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4" />
                      <span className="text-sm flex-1">Theme</span>
                      <div className="h-8 w-8 flex items-center justify-center">
                        <ThemeSwitcher />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign Out */}
                <div className="border-t pt-2">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[100] flex items-start pt-16 px-4 animate-in fade-in duration-200"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="w-full max-w-md mx-auto animate-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-primary/10"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder="Search products, orders..."
                className="pl-12 pr-4 h-14 text-lg bg-muted/50 border-muted-foreground/20 focus:bg-background focus:border-primary/50 transition-all duration-200 rounded-xl shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>

            {/* Search suggestions or recent searches could go here */}
            <div className="mt-4 text-sm text-muted-foreground text-center">
              <p>Start typing to search products and orders</p>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-in-from-top-4 {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-in.slide-in-from-top-2 {
          animation: slide-in-from-top-2 0.2s ease-out;
          animation-fill-mode: forwards;
        }

        .animate-in.slide-in-from-top-4 {
          animation: slide-in-from-top-4 0.3s ease-out;
          animation-fill-mode: forwards;
        }

        .animate-in.fade-in {
          animation: fade-in 0.2s ease-out;
          animation-fill-mode: forwards;
        }

        .duration-200 {
          animation-duration: 0.2s;
        }

        .duration-300 {
          animation-duration: 0.3s;
        }
      `}</style>
    </>
  );
}