'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MessageSquare,
  Download,
  Eye,
  MapPin,
  Star,
  Copy,
  AlertTriangle,
  Phone,
  Mail,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useContentPadding } from '@/contexts/sidebar-context';

interface BuyerOrderDetailProps {
  orderId: string;
}

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  escrowStatus: 'pending' | 'held' | 'released' | 'disputed';
  seller: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    rating: number;
    verified: boolean;
  };
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  notes?: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function BuyerOrderDetailPage({ orderId }: BuyerOrderDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockOrder: Order = {
          id: orderId,
          orderNumber: `ORD-${orderId.toUpperCase()}`,
          status: 'shipped',
          items: [
            {
              id: '1',
              name: 'Gold Bullion - 1oz American Eagle',
              image: '/placeholder.svg?height=80&width=80',
              price: 1950.99,
              quantity: 2,
              sku: 'GOLD-1OZ-AE-2024',
            },
            {
              id: '2',
              name: 'Silver Bars - 10oz',
              image: '/placeholder.svg?height=80&width=80',
              price: 280.0,
              quantity: 1,
              sku: 'SILVER-10OZ-BAR',
            },
          ],
          subtotal: 4181.98,
          shipping: 25.99,
          tax: 335.36,
          total: 4543.33,
          escrowStatus: 'held',
          seller: {
            id: 'seller-1',
            name: 'Premium Metals Co.',
            email: 'contact@premiummetals.com',
            avatar: '/placeholder.svg?height=40&width=40',
            phone: '+1 (555) 123-4567',
            rating: 4.8,
            verified: true,
          },
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
          },
          paymentMethod: 'ICP Tokens',
          createdAt: '2024-07-25T10:30:00Z',
          updatedAt: '2024-07-26T14:15:00Z',
          estimatedDelivery: '2024-07-30T18:00:00Z',
          trackingNumber: 'TC789456123',
          notes: 'Please handle with care - high value items',
        };

        setOrder(mockOrder);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        toast({
          title: 'Error',
          description: 'Failed to load order details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, toast]);

  const handleContactSeller = () => {
    if (!order) return;

    // Navigate to messages with pre-filled conversation
    const messageContent = `Hi ${order.seller.name}, I have a question about my order ${order.orderNumber}`;
    const encodedMessage = encodeURIComponent(messageContent);
    router.push(`/dashboard/buyer/messages?seller=${order.seller.id}&message=${encodedMessage}`);
  };

  const handleCopyTracking = () => {
    if (!order?.trackingNumber) return;

    navigator.clipboard.writeText(order.trackingNumber);
    toast({
      title: 'Tracking Number Copied',
      description: 'Tracking number copied to clipboard.',
    });
  };

  const handleTrackPackage = () => {
    if (!order?.trackingNumber) return;

    // Open tracking in new window (would be actual carrier website in production)
    window.open(`https://tracking.example.com/${order.trackingNumber}`, '_blank');
  };

  const getStatusProgress = (status: string) => {
    const statusIndex = statusSteps.findIndex((step) => step.key === status);
    return ((statusIndex + 1) / statusSteps.length) * 100;
  };

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'held':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'released':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'disputed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Orders</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`border ${getEscrowStatusColor(order.escrowStatus)}`}>
            Escrow: {order.escrowStatus}
          </Badge>
          <Badge variant="secondary">
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          {order.escrowStatus === 'held' && (
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Payment Secured
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={getStatusProgress(order.status)} className="h-2" />
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted =
                      statusSteps.findIndex((s) => s.key === order.status) >= index;
                    const isCurrent = step.key === order.status;

                    return (
                      <div key={step.key} className="flex flex-col items-center space-y-2">
                        <div
                          className={`p-2 rounded-full ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-xs text-center ${
                            isCurrent ? 'font-medium text-blue-600' : 'text-gray-600'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Tracking Information */}
                {order.trackingNumber && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-blue-900">Package Tracking</h4>
                        <p className="text-sm text-blue-700">
                          Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTrackPackage}
                        className="bg-transparent"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                        <p className="text-blue-700 font-mono">{order.trackingNumber}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyTracking}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/product/${item.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Payment processed via {order.paymentMethod}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Payment Secured</p>
                    <p className="text-xs text-muted-foreground">Funds held in escrow</p>
                  </div>
                </div>
                {order.status === 'shipped' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                    <div>
                      <p className="text-sm font-medium">Package Shipped</p>
                      <p className="text-xs text-muted-foreground">
                        Tracking: {order.trackingNumber}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={order.seller.avatar || '/placeholder.svg'} />
                    <AvatarFallback>{order.seller.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{order.seller.name}</p>
                      {order.seller.verified && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{order.seller.rating}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.seller.email}</span>
                  </div>
                  {order.seller.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{order.seller.phone}</span>
                    </div>
                  )}
                </div>

                <Button onClick={handleContactSeller} className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Seller
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    Payment: {order.paymentMethod}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            {order.trackingNumber && (
              <Button variant="outline" className="w-full" onClick={handleTrackPackage}>
                <Truck className="mr-2 h-4 w-4" />
                Track Package
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={handleContactSeller}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Get Help
            </Button>
          </div>

          {/* Important Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}