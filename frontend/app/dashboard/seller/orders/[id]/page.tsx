// app/dashboard/seller/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Phone,
  Mail,
  Star,
  Edit,
  Copy,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useContentPadding } from '@/contexts/sidebar-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
  buyer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    rating: number;
    totalOrders: number;
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

export async function generateStaticParams() {
  return [];
}

export default function SellerOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockOrder: Order = {
          id: params.id as string,
          orderNumber: `ORD-${(params.id as string).toUpperCase()}`,
          status: 'processing',
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
          buyer: {
            id: 'buyer-1',
            name: 'Alex Johnson',
            email: 'alex.johnson@email.com',
            avatar: '/placeholder.svg?height=40&width=40',
            phone: '+1 (555) 123-4567',
            rating: 4.8,
            totalOrders: 23,
          },
          shippingAddress: {
            name: 'Alex Johnson',
            street: '123 Investment Avenue, Suite 500',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
          },
          paymentMethod: 'ICP Tokens',
          createdAt: '2024-07-25T10:30:00Z',
          updatedAt: '2024-07-25T14:15:00Z',
          estimatedDelivery: '2024-07-30T18:00:00Z',
          trackingNumber: 'TC789456123',
          notes: 'High-value order - please handle with care and use secure packaging',
        };

        setOrder(mockOrder);
        setNewStatus(mockOrder.status);
        setTrackingNumber(mockOrder.trackingNumber || '');
        setNotes(mockOrder.notes || '');
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
  }, [params.id, toast]);

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return;

    setUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrder((prev) =>
        prev ? { ...prev, status: newStatus as any, updatedAt: new Date().toISOString() } : null
      );

      toast({
        title: 'Status Updated',
        description: `Order status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update order status.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTracking = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a tracking number.',
        variant: 'destructive',
      });
      return;
    }

    setUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrder((prev) =>
        prev ? { ...prev, trackingNumber, updatedAt: new Date().toISOString() } : null
      );

      toast({
        title: 'Tracking Updated',
        description: 'Tracking information has been updated and customer has been notified.',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update tracking information.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    setUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setOrder((prev) => (prev ? { ...prev, notes, updatedAt: new Date().toISOString() } : null));

      toast({
        title: 'Notes Saved',
        description: 'Order notes have been saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save notes.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleContactBuyer = () => {
    if (!order) return;

    // Navigate to messages with pre-filled conversation
    const messageContent = `Hi ${order.buyer.name}, regarding your order ${order.orderNumber}`;
    const encodedMessage = encodeURIComponent(messageContent);
    router.push(`/dashboard/seller/messages?user=${order.buyer.id}&message=${encodedMessage}`);
  };

  const handleCopyAddress = () => {
    if (!order) return;

    const address = `${order.shippingAddress.name}\n${order.shippingAddress.street}\n${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}\n${order.shippingAddress.country}`;
    navigator.clipboard.writeText(address);

    toast({
      title: 'Address Copied',
      description: 'Shipping address copied to clipboard.',
    });
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
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                        <p className="text-blue-700 font-mono">{order.trackingNumber}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(order.trackingNumber || '');
                          toast({
                            title: 'Copied',
                            description: 'Tracking number copied to clipboard.',
                          });
                        }}
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Management */}
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="status" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="status">Update Status</TabsTrigger>
                  <TabsTrigger value="tracking">Tracking</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="status" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="status">Order Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger id="status" className="text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleStatusUpdate}
                      disabled={updating || newStatus === order.status}
                      className="w-full"
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="tracking" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <Input
                        id="tracking"
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="text-base"
                      />
                    </div>
                    <Button onClick={handleUpdateTracking} disabled={updating} className="w-full">
                      {updating ? 'Updating...' : 'Update Tracking'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Order Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this order..."
                        rows={4}
                        className="text-base resize-none"
                      />
                    </div>
                    <Button onClick={handleSaveNotes} disabled={updating} className="w-full">
                      {updating ? 'Saving...' : 'Save Notes'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Buyer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Buyer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={order.buyer.avatar || '/placeholder.svg'} />
                    <AvatarFallback>{order.buyer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{order.buyer.name}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">{order.buyer.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({order.buyer.totalOrders} orders)
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{order.buyer.email}</span>
                  </div>
                  {order.buyer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{order.buyer.phone}</span>
                    </div>
                  )}
                </div>

                <Button onClick={handleContactBuyer} className="w-full">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Buyer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Shipping Address</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
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
                  Payment: {order.paymentMethod}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Eye className="mr-2 h-4 w-4" />
              Print Shipping Label
            </Button>
          </div>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
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
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-muted-foreground">Order being prepared</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
