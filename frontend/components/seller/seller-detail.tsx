'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Package,
  Award,
  Truck,
  MessageCircle,
  Heart,
  Eye,
  ShoppingCart,
  Shield,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useProduct } from '@/contexts/product-context';

interface SellerDetailProps {
  sellerId: string;
}

interface Seller {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  rating: number;
  totalReviews: number;
  joinDate: string;
  location: string;
  description: string;
  specialties: string[];
  stats: {
    totalSales: number;
    totalProducts: number;
    responseTime: string;
    shippingTime: string;
    returnRate: number;
  };
  badges: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured: boolean;
  category: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  buyer: {
    name: string;
    avatar: string;
  };
  product: {
    name: string;
    image: string;
  };
}

export default function SellerDetailPage({ sellerId }: SellerDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart, addToWishlist, isInWishlist } = useProduct();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock seller data
        const mockSeller: Seller = {
          id: sellerId,
          name: 'Premium Metals Co.',
          avatar: '/placeholder.svg?height=100&width=100',
          verified: true,
          rating: 4.8,
          totalReviews: 1247,
          joinDate: '2019-03-15',
          location: 'New York, NY, USA',
          description: 'Leading precious metals dealer with over 20 years of experience. We specialize in gold, silver, platinum, and palladium investments. All our products are certified and backed by authenticity guarantees.',
          specialties: ['Gold Bullion', 'Silver Bars', 'Platinum Coins', 'Investment Metals'],
          stats: {
            totalSales: 15420,
            totalProducts: 156,
            responseTime: '< 2 hours',
            shippingTime: '1-3 business days',
            returnRate: 2.1,
          },
          badges: ['Verified Seller', 'Top Rated', 'Fast Shipping', 'Quality Assured'],
        };

        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Gold Bullion - 1oz American Eagle',
            price: 1950.99,
            originalPrice: 2100.00,
            image: '/placeholder.svg?height=300&width=300',
            rating: 4.8,
            reviewCount: 127,
            inStock: true,
            isFeatured: true,
            category: 'Precious Metals',
          },
          {
            id: '2',
            name: 'Silver Bars - 10oz',
            price: 280.50,
            image: '/placeholder.svg?height=300&width=300',
            rating: 4.6,
            reviewCount: 89,
            inStock: true,
            isFeatured: false,
            category: 'Precious Metals',
          },
          {
            id: '3',
            name: 'Platinum Coins - 1oz',
            price: 1200.00,
            image: '/placeholder.svg?height=300&width=300',
            rating: 4.9,
            reviewCount: 45,
            inStock: false,
            isFeatured: true,
            category: 'Precious Metals',
          },
        ];

        const mockReviews: Review[] = [
          {
            id: '1',
            rating: 5,
            comment: 'Excellent quality and fast shipping. The gold coins arrived exactly as described.',
            date: '2024-01-20',
            buyer: {
              name: 'John D.',
              avatar: '/placeholder.svg?height=40&width=40',
            },
            product: {
              name: 'Gold Bullion - 1oz American Eagle',
              image: '/placeholder.svg?height=60&width=60',
            },
          },
          {
            id: '2',
            rating: 4,
            comment: 'Good service, but delivery took a bit longer than expected.',
            date: '2024-01-18',
            buyer: {
              name: 'Sarah M.',
              avatar: '/placeholder.svg?height=40&width=40',
            },
            product: {
              name: 'Silver Bars - 10oz',
              image: '/placeholder.svg?height=60&width=60',
            },
          },
        ];

        setSeller(mockSeller);
        setProducts(mockProducts);
        setReviews(mockReviews);
      } catch (error) {
        console.error('Failed to fetch seller data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load seller information.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId, toast]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product as any, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleAddToWishlist = async (product: Product) => {
    try {
      if (isInWishlist(product.id)) {
        toast({
          title: 'Already in Wishlist',
          description: 'This item is already in your wishlist.',
        });
        return;
      }
      await addToWishlist(product as any);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleContactSeller = () => {
    // In a real app, this would open a message dialog or navigate to messaging
    toast({
      title: 'Message Sent',
      description: 'Your message has been sent to the seller.',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Seller Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The seller you're looking for doesn't exist or has been removed.
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Seller Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Seller Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={seller.avatar} alt={seller.name} />
                    <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {seller.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <h2 className="text-2xl font-bold">{seller.name}</h2>
                    {seller.verified && (
                      <Shield className="h-5 w-5 text-green-600" />
                    )}
                  </div>

                  <div className="flex items-center gap-4 justify-center md:justify-start mb-4">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(seller.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{seller.rating}</span>
                      <span className="text-muted-foreground">
                        ({seller.totalReviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-center md:justify-start mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {seller.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(seller.joinDate).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{seller.description}</p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                    {seller.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 justify-center md:justify-start">
                    <Button onClick={handleContactSeller}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Follow
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <Link href={`/product/${product.id}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </Link>
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {product.isFeatured && (
                          <Badge className="bg-orange-500 text-white">Featured</Badge>
                        )}
                        {!product.inStock && (
                          <Badge variant="secondary">Out of Stock</Badge>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToWishlist(product);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                    </div>

                    <CardContent className="p-4">
                      <Link href={`/product/${product.id}`}>
                        <h3 className="font-medium line-clamp-2 hover:text-primary mb-2">
                          {product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/product/${product.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.buyer.avatar} alt={review.buyer.name} />
                          <AvatarFallback>{review.buyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.buyer.name}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex items-center gap-2">
                            <Image
                              src={review.product.image}
                              alt={review.product.name}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                            <span className="text-sm text-muted-foreground">
                              {review.product.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {seller.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Company Description</h4>
                    <p className="text-muted-foreground">{seller.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {seller.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Certifications & Badges</h4>
                    <div className="flex flex-wrap gap-2">
                      {seller.badges.map((badge) => (
                        <Badge key={badge} variant="secondary">
                          <Award className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Policies</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <span>Free shipping on orders over $500</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span>30-day return policy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>24/7 customer support</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Sales</span>
                <span className="font-medium">{seller.stats.totalSales.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Products Listed</span>
                <span className="font-medium">{seller.stats.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Response Time</span>
                <span className="font-medium">{seller.stats.responseTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Time</span>
                <span className="font-medium">{seller.stats.shippingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Return Rate</span>
                <span className="font-medium">{seller.stats.returnRate}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating}★</span>
                    <Progress
                      value={rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-8">
                      {rating === 5 ? '870' : rating === 4 ? '249' : rating === 3 ? '99' : '29'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleContactSeller}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Follow Seller
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View All Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}