// app/dashboard/seller/products/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  MessageCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Package,
  Copy
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { useContentPadding } from "@/contexts/sidebar-context"

export async function generateStaticParams() {
  return [];
}

export default function SellerProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock product data
        const mockProduct = {
          id: params.id,
          name: 'Gold Bullion - 1oz American Eagle',
          description:
            '99.9% pure gold bullion coin from the U.S. Mint. Each coin contains one troy ounce of gold and is backed by the U.S. government for weight, content, and purity.',
          price: 1950.0,
          originalPrice: 2100.0,
          unit: 'per oz',
          category: 'Precious Metals',
          subcategory: 'Gold',
          status: 'Active',
          stock: 25,
          lowStockThreshold: 10,
          sku: 'GOLD-1OZ-AE-2024',
          images: [
            '/placeholder.svg?height=500&width=500',
            '/placeholder.svg?height=500&width=500',
            '/placeholder.svg?height=500&width=500',
            '/placeholder.svg?height=500&width=500',
          ],
          specifications: {
            Purity: '99.9% Gold',
            Weight: '1 Troy Ounce',
            Diameter: '32.7mm',
            Thickness: '2.87mm',
            Mint: 'U.S. Mint',
            Year: '2024',
            Condition: 'Brilliant Uncirculated',
            Certificate: 'Included',
          },
          performance: {
            views: 2847,
            favorites: 134,
            sales: 127,
            revenue: 247650,
            conversionRate: 4.5,
            averageRating: 4.8,
            totalReviews: 89,
          },
          createdAt: '2024-01-15',
          updatedAt: '2024-07-20',
        };

        setProduct(mockProduct);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleShare = () => {
    const url = `${window.location.origin}/products/${product.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied',
      description: 'Product link copied to clipboard.',
    });
  };

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newStatus = product.status === 'Active' ? 'Paused' : 'Active';
      setProduct({ ...product, status: newStatus });
      toast({
        title: 'Status Updated',
        description: `Product is now ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update product status.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShare} className="bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href={`/products/${product.id}`} target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">View Live</span>
            </Link>
          </Button>
          <Button variant="outline" asChild className="bg-transparent">
            <Link href={`/dashboard/seller/edit-product/${product.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Link>
          </Button>
          <Button
            variant={product.status === 'Active' ? 'destructive' : 'default'}
            onClick={handleToggleStatus}
            disabled={isLoading}
          >
            {product.status === 'Active' ? 'Pause' : 'Activate'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images and Basic Info */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border">
                <Image
                  src={product.images[selectedImage] || '/placeholder.svg'}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-md border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-muted'
                    }`}
                  >
                    <Image
                      src={image || '/placeholder.svg'}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.performance.averageRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.performance.averageRating} ({product.performance.totalReviews} reviews)
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">{product.unit}</span>
                </div>
                {product.originalPrice > product.price && (
                  <div className="text-sm text-green-600">
                    Save ${(product.originalPrice - product.price).toFixed(2)} (
                    {(
                      ((product.originalPrice - product.price) / product.originalPrice) *
                      100
                    ).toFixed(0)}
                    % off)
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {product.stock} units in stock
                  </span>
                  {product.stock <= product.lowStockThreshold && (
                    <Badge variant="destructive" className="text-xs">
                      Low Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">Total Views</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {product.performance.views.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">Total Sales</p>
                  <p className="text-2xl font-bold text-green-900">{product.performance.sales}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700">Revenue</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${product.performance.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700">Conversion</p>
                  <p className="text-2xl font-bold text-amber-900">
                    {product.performance.conversionRate}%
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Product Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed insights into your product's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sales" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="traffic">Traffic</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="mt-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="traffic" className="mt-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="views" fill="#8884d8" />
                        <Bar dataKey="clicks" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {product.performance.averageRating}
                        </div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{product.performance.totalReviews}</div>
                        <div className="text-sm text-muted-foreground">Total Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">89%</div>
                        <div className="text-sm text-muted-foreground">5-Star Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">4.2</div>
                        <div className="text-sm text-muted-foreground">Avg Response Time</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-8">{rating}★</span>
                          <Progress
                            value={rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}
                            className="flex-1"
                          />
                          <span className="text-sm text-muted-foreground w-8">
                            {rating === 5 ? '62' : rating === 4 ? '18' : rating === 3 ? '7' : '2'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{String(value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href={`/dashboard/seller/edit-product/${product.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Product
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href={`/products/${product.id}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  View Live Page
                </Link>
              </Button>
              <Button
                variant={product.status === 'Active' ? 'destructive' : 'default'}
                className="w-full"
                onClick={handleToggleStatus}
                disabled={isLoading}
              >
                {isLoading
                  ? 'Updating...'
                  : product.status === 'Active'
                  ? 'Pause Listing'
                  : 'Activate Listing'}
              </Button>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Views</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">2,847</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">+12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clicks</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">456</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Favorites</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">134</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">+15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sales</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">127</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600">+23%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Insights */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Performance</CardTitle>
              <CardDescription>Search engine optimization metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Search Visibility</span>
                  <span className="font-medium text-green-600">Good</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Keyword Ranking</span>
                  <span className="font-medium text-amber-600">Average</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Top Keywords</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>gold bullion</span>
                    <span className="text-muted-foreground">#3</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>american eagle coin</span>
                    <span className="text-muted-foreground">#7</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>1oz gold coin</span>
                    <span className="text-muted-foreground">#12</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Health */}
          <Card>
            <CardHeader>
              <CardTitle>Product Health</CardTitle>
              <CardDescription>Overall product status and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Images are high quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Description is complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-sm">Price is competitive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm">Stock is running low</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Restock soon to avoid missed sales</li>
                  <li>• Consider adding more product images</li>
                  <li>• Update keywords for better SEO</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Mock data
const salesData = [
  { date: 'Jan 1', sales: 12, revenue: 23400 },
  { date: 'Jan 8', sales: 15, revenue: 29250 },
  { date: 'Jan 15', sales: 18, revenue: 35100 },
  { date: 'Jan 22', sales: 22, revenue: 42900 },
  { date: 'Jan 29', sales: 25, revenue: 48750 },
  { date: 'Feb 5', sales: 20, revenue: 39000 },
  { date: 'Feb 12', sales: 28, revenue: 54600 },
];

const trafficData = [
  { date: 'Jan 1', views: 120, clicks: 15 },
  { date: 'Jan 8', views: 150, clicks: 18 },
  { date: 'Jan 15', views: 180, clicks: 22 },
  { date: 'Jan 22', views: 160, clicks: 20 },
  { date: 'Jan 29', views: 200, clicks: 25 },
  { date: 'Feb 5', views: 190, clicks: 24 },
  { date: 'Feb 12', views: 220, clicks: 28 },
];

const recentActivity = [
  { action: 'Product viewed by 23 customers', date: '2 hours ago' },
  { action: 'Added to 5 wishlists', date: '4 hours ago' },
  { action: '2 units sold', date: '6 hours ago' },
  { action: 'Price updated', date: '1 day ago' },
  { action: 'New review received (5 stars)', date: '2 days ago' },
];