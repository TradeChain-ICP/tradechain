// app/dashboard/notifications/page.tsx
'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  X,
  Eye,
  EyeOff,
  Search,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Package,
  DollarSign,
  ShoppingCart,
  Settings,
} from 'lucide-react';
import Link from "next/link"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useContentPadding } from '@/contexts/sidebar-context';
import { useAuth } from '@/contexts/auth-context';

export default function NotificationsPage() {
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter notifications based on user role
  const roleBasedNotifications =
    user?.role === 'seller'
      ? mockNotifications.filter((n) => ['order', 'earnings', 'system', 'alert'].includes(n.type))
      : mockNotifications.filter((n) => ['order', 'price', 'system', 'alert'].includes(n.type));

  const filteredNotifications = roleBasedNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const unreadCount = roleBasedNotifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: 'Notification Updated',
        description: 'The notification has been marked as read.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      toast({
        title: 'No Unread Notifications',
        description: 'All notifications are already marked as read.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'All Notifications Updated',
        description: `${unreadCount} notifications have been marked as read.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notifications.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: 'Notification Deleted',
        description: 'The notification has been deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete notification.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedNotifications.length === 0) {
      toast({
        title: 'No Notifications Selected',
        description: 'Please select notifications to perform bulk actions.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Bulk Action Completed',
        description: `${action} applied to ${selectedNotifications.length} notifications.`,
      });
      setSelectedNotifications([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationSelect = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'price':
        return <Zap className="h-5 w-5 text-yellow-600" />;
      case 'earnings':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'system':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getNotificationCounts = () => {
    return {
      all: roleBasedNotifications.length,
      unread: roleBasedNotifications.filter((n) => !n.read).length,
      order: roleBasedNotifications.filter((n) => n.type === 'order').length,
      price: roleBasedNotifications.filter((n) => n.type === 'price').length,
      earnings: roleBasedNotifications.filter((n) => n.type === 'earnings').length,
      system: roleBasedNotifications.filter((n) => n.type === 'system').length,
      alert: roleBasedNotifications.filter((n) => n.type === 'alert').length,
    };
  };

  const counts = getNotificationCounts();

  // Dynamic tab configuration based on user role
  const getTabConfig = () => {
    if (user?.role === 'seller') {
      return [
        { value: 'all', label: `All (${counts.all})` },
        { value: 'order', label: `Orders (${counts.order})` },
        { value: 'earnings', label: `Earnings (${counts.earnings})` },
        { value: 'system', label: `System (${counts.system})` },
        { value: 'alert', label: `Alerts (${counts.alert})` },
      ];
    } else {
      return [
        { value: 'all', label: `All (${counts.all})` },
        { value: 'order', label: `Orders (${counts.order})` },
        { value: 'price', label: `Price Alerts (${counts.price})` },
        { value: 'system', label: `System (${counts.system})` },
        { value: 'alert', label: `Alerts (${counts.alert})` },
      ];
    }
  };

  const tabConfig = getTabConfig();

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            {user?.role === 'seller'
              ? 'Stay updated with orders, earnings, and business alerts'
              : 'Stay updated with orders, price alerts, and system updates'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            className="bg-transparent"
            disabled={isLoading || unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Mark All Read</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notifications..."
                  className="pl-8 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="order">Orders</SelectItem>
                  {user?.role === 'seller' ? (
                    <SelectItem value="earnings">Earnings</SelectItem>
                  ) : (
                    <SelectItem value="price">Price Alerts</SelectItem>
                  )}
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedNotifications.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-medium">
                {selectedNotifications.length} notifications selected
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('Mark as Read')}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('Delete')}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tabs */}
      <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6">
          {tabConfig.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filterType}>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    {filteredNotifications.length} of {roleBasedNotifications.length} notifications
                  </CardDescription>
                </div>
                <Checkbox
                  checked={
                    selectedNotifications.length === filteredNotifications.length &&
                    filteredNotifications.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  disabled={filteredNotifications.length === 0}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      !notification.read
                        ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedNotifications.includes(notification.id)}
                        onCheckedChange={() => handleNotificationSelect(notification.id)}
                        className="mt-1"
                      />

                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="font-medium">{notification.title}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 break-words">
                              {notification.message}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                              <span>{notification.timestamp}</span>
                              {notification.sender && (
                                <div className="flex items-center gap-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage
                                      src={notification.sender.avatar || '/placeholder.svg'}
                                    />
                                    <AvatarFallback className="text-xs">
                                      {notification.sender.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>{notification.sender.name}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" disabled={isLoading}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {!notification.read ? (
                                <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Mark as Read
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <EyeOff className="h-4 w-4 mr-2" />
                                  Mark as Unread
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="text-red-600"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {notification.actionUrl && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              {notification.actionText || 'View Details'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No notifications found</h2>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterType !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : "You're all caught up! No new notifications at the moment."}
                  </p>
                  {(searchQuery || filterType !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                      }}
                      className="bg-transparent"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mock data with role-specific notifications
const mockNotifications = [
  // Buyer notifications
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #ORD-7292 for Gold Bullion - 1oz has been shipped and is on its way.',
    timestamp: '2 hours ago',
    read: false,
    actionUrl: '/dashboard/buyer/orders/ORD-7292',
    actionText: 'Track Order',
    sender: {
      name: 'Premium Metals Co.',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  },
  {
    id: '2',
    type: 'price',
    title: 'Price Alert: Gold Bullion',
    message: 'Gold Bullion - 1oz has reached your target price of $1,950. Current price: $1,948.',
    timestamp: '4 hours ago',
    read: false,
    actionUrl: '/dashboard/buyer/marketplace/product/gold-1oz',
    actionText: 'View Product',
    sender: null,
  },
  {
    id: '3',
    type: 'system',
    title: 'Account Verification Complete',
    message: 'Your KYC verification has been approved. You can now make purchases up to $50,000.',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/dashboard/profile',
    actionText: 'View Profile',
    sender: null,
  },
  {
    id: '4',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #ORD-7289 for Silver Bars - 10oz has been delivered successfully.',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/dashboard/buyer/orders/ORD-7289',
    actionText: 'Leave Review',
    sender: {
      name: 'Silver Solutions Ltd.',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  },
  {
    id: '5',
    type: 'alert',
    title: 'Market Alert: High Volatility',
    message:
      'Precious metals market is experiencing high volatility. Consider reviewing your positions.',
    timestamp: '3 days ago',
    read: false,
    actionUrl: '/dashboard/buyer/marketplace',
    actionText: 'View Market',
    sender: null,
  },
  {
    id: '6',
    type: 'price',
    title: 'Price Drop: Silver Bars',
    message: 'Silver Bars - 10oz price dropped by 5% to $275. Great buying opportunity!',
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/dashboard/buyer/marketplace/product/silver-10oz',
    actionText: 'Buy Now',
    sender: null,
  },
  // Seller notifications
  {
    id: '7',
    type: 'order',
    title: 'New Order Received',
    message: 'You have received a new order #ORD-7293 for Gold Bullion - 1oz from Alex Johnson.',
    timestamp: '1 hour ago',
    read: false,
    actionUrl: '/dashboard/seller/orders/ORD-7293',
    actionText: 'Process Order',
    sender: null,
  },
  {
    id: '8',
    type: 'earnings',
    title: 'Payment Released',
    message: 'Payment of $3,900 for order #ORD-7291 has been released to your account.',
    timestamp: '3 hours ago',
    read: false,
    actionUrl: '/dashboard/seller/earnings',
    actionText: 'View Earnings',
    sender: null,
  },
  {
    id: '9',
    type: 'earnings',
    title: 'Weekly Earnings Summary',
    message: 'Your earnings this week: $12,450 from 18 orders. Great performance!',
    timestamp: '1 day ago',
    read: true,
    actionUrl: '/dashboard/seller/analytics',
    actionText: 'View Analytics',
    sender: null,
  },
  {
    id: '10',
    type: 'system',
    title: 'Inventory Low Stock Alert',
    message: 'Gold Bullion - 1oz is running low (8 units remaining). Consider restocking.',
    timestamp: '2 days ago',
    read: true,
    actionUrl: '/dashboard/seller/inventory',
    actionText: 'Manage Inventory',
    sender: null,
  },
  {
    id: '11',
    type: 'alert',
    title: 'Product Review Received',
    message: "Your product 'Silver Bars - 10oz' received a 5-star review from Sarah M.",
    timestamp: '3 days ago',
    read: true,
    actionUrl: '/dashboard/seller/products/silver-10oz',
    actionText: 'View Review',
    sender: {
      name: 'Sarah Mitchell',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  },
];
