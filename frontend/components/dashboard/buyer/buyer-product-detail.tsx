'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Plus,
  Minus,
  MapPin,
  Truck,
  Shield,
  Award,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Zap,
  TrendingUp,
  Users,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useContentPadding } from '@/contexts/sidebar-context';
import { useProduct } from '@/contexts/product-context';

interface BuyerProductDetailProps {
  productId: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stock: number;
  minimumOrder: number;
  unit: string;
  specifications: Record<string, string>;
  tags: string[];
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    location: string;
    responseTime: string;
    joinDate: string;
  };
  shipping: {
    cost: number;
    estimatedDays: string;
    freeShippingThreshold?: number;
  };
  returnPolicy: string;
  warranty: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  buyer: {
    name: string;
    avatar: string;
  };
  helpful: number;
}

export default function BuyerProductDetailPage({ productId }: BuyerProductDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const { addToCart, addToWishlist, isInWishlist } = useProduct();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock product data
        const mockProduct: Product = {
          id: productId,
          name: 'Gold Bullion - 1oz American Eagle',
          description: '99.9% pure gold bullion coin from the U.S. Mint. Each coin contains one troy ounce of gold and is backed by the U.S. government for weight, content, and purity. Perfect for investors seeking physical gold exposure with government authenticity guarantee.',
          price: 1950.99,
          originalPrice: 2100.00,
          images: [
            '/placeholder.svg?height=600&width=600',
            '/placeholder.svg?height=600&width=600',
            '/placeholder.svg?height=600&width=600',
            '/placeholder.svg?height=600&width=600',
          ],
          category: 'Precious Metals',
          subcategory: 'Gold',
          rating: 4.8,
          reviewCount: 127,
          inStock: true,
          stock: 25,
          minimumOrder: 1,
          unit: 'oz',
          specifications: {
            'Purity': '99.9% Gold',
            'Weight': '1 Troy Ounce',
            'Diameter': '32.7mm',
            'Thickness': '2.87mm',
            'Mint': 'U.S. Mint',
            'Year': '2024',
            'Condition': 'Brilliant Uncirculated',
            'Certificate': 'Included',
          },
          tags: ['gold', 'bullion', 'investment', 'certified', 'american-eagle'],
          seller: {
            id: 'seller-1',
            name: 'Premium Metals Co.',
            avatar: '/placeholder.svg?height=60&width=60',
            rating: 4.9,
            verified: true,
            location: 'New York, NY',
            responseTime: '< 2 hours',
            joinDate: '2019-03-15',
          },
          shipping: {
            cost: 25.99,
            estimatedDays: '2-4 business days',
            freeShippingThreshold: 500,
          },
          returnPolicy: '30-day return policy',
          warranty: '1-year authenticity guarantee',
        };

        const mockReviews: Review[] = [
          {
            id: '1',
            rating: 5,
            comment: 'Excellent quality coin, arrived quickly and well-packaged. Exactly as described.',
            date: '2024-01-20',
            verified: true,
            buyer: {
              name: 'John D.',
              avatar: '/placeholder.svg?height=40&width=40',
            },
            helpful: 12,
          },
          {
            id: '2',
            rating: 4,
            comment: 'Good quality, but shipping took longer than expected. Overall satisfied.',
            date: '2024-01-18',
            verified: true,
            buyer: {
              name: 'Sarah M.',
              avatar: '/placeholder.svg?height=40&width=40',
            },
            helpful: 8,
          },
        ];

        setProduct(mockProduct);
        setReviews(mockReviews);
      } catch (error) {
        console.error('Failed to fetch product data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product information.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId, toast]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product as any, quantity);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

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

  const handleShare = () => {
    const url = `${window.location.origin}/product/${product?.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link Copied',
      description: 'Product link copied to clipboard.',
    });
  };

  const handleContactSeller = () => {
    if (!product) return;

    // Navigate to messages with pre-filled conversation
    const messageContent = `Hi ${product.seller.name}, I'm interested in ${product.name}`;
    const encodedMessage = encodeURIComponent(messageContent);
    router.push(`/dashboard/buyer/messages?seller=${product.seller.id}&message=${encodedMessage}`);
  };

  const nextImage = () => {
    if (!product) return;
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const previousImage = () => {
    if (!product) return;
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const adjustQuantity = (delta: number) => {
    if (!product) return;
    const newQuantity = Math.max(product.minimumOrder, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const savingsPercent = product.originalPrice ? ((savings / product.originalPrice) * 100) : 0;

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.originalPrice && savings > 0 && (
                <Badge className="bg-red-500 text-white">
                  Save ${savings.toFixed(2)}
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary">Out of Stock</Badge>
              )}
            </div>
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImageIndex === index ? 'border-primary' : 'border-muted'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              <Badge variant="outline">{product.subcategory}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-muted-foreground">per {product.unit}</span>
            </div>
            {savings > 0 && (
              <div className="text-green-600 font-medium">
                Save ${savings.toFixed(2)} ({savingsPercent.toFixed(0)}% off)
              </div>
            )}
          </div>

          {/* Stock Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {product.inStock ? `${product.stock} units in stock` : 'Out of stock'}
              </span>
              {product.stock <= 5 && product.inStock && (
                <Badge variant="destructive" className="text-xs">
                  Only {product.stock} left!
                </Badge>
              )}
            </div>
            {product.minimumOrder > 1 && (
              <p className="text-sm text-muted-foreground">
                Minimum order: {product.minimumOrder} {product.unit}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-3">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustQuantity(-1)}
                  disabled={quantity <= product.minimumOrder}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = Math.max(product.minimumOrder, Math.min(product.stock, parseInt(e.target.value) || product.minimumOrder));
                    setQuantity(value);
                  }}
                  className="w-20 text-center border-0"
                  min={product.minimumOrder}
                  max={product.stock}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustQuantity(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Total: ${(product.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={handleContactSeller}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Seller
            </Button>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Shipping</span>
                  </div>
                  <div className="text-right">
                    {product.shipping.freeShippingThreshold && (product.price * quantity) >= product.shipping.freeShippingThreshold ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span>${product.shipping.cost.toFixed(2)}</span>
                    )}
                    <p className="text-xs text-muted-foreground">{product.shipping.estimatedDays}</p>
                  </div>
                </div>
                {product.shipping.freeShippingThreshold && (product.price * quantity) < product.shipping.freeShippingThreshold && (
                  <p className="text-xs text-blue-600">
                    Free shipping on orders over ${product.shipping.freeShippingThreshold}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Return Policy</span>
                  </div>
                  <span className="text-sm">{product.returnPolicy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Warranty</span>
                  </div>
                  <span className="text-sm">{product.warranty}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                  <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Link href={`/seller/${product.seller.id}`} className="font-medium hover:text-primary">
                      {product.seller.name}
                    </Link>
                    {product.seller.verified && (
                      <Shield className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {product.seller.rating}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {product.seller.location}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Responds within {product.seller.responseTime}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/seller/${product.seller.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Shop
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Features & Benefits</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Government-backed authenticity guarantee</li>
                    <li>• 99.9% pure gold content verified by U.S. Mint</li>
                    <li>• Excellent liquidity for investment portfolios</li>
                    <li>• Beautiful collector-quality finish</li>
                    <li>• Secure protective packaging included</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  {product.reviewCount} reviews with an average rating of {product.rating} stars
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.buyer.avatar} alt={review.buyer.name} />
                          <AvatarFallback>{review.buyer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.buyer.name}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
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
                            <Button variant="ghost" size="sm">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Helpful ({review.helpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}