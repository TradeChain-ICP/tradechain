'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Filter,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  ArrowLeft,
  MapPin,
  Truck,
  Shield,
  TrendingUp,
  Eye,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useProduct } from '@/contexts/product-context';

interface CategorySlugProps {
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    location: string;
  };
  tags: string[];
  inStock: boolean;
  isFeatured: boolean;
  category: string;
  subcategory: string;
}

const formatCategoryName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function CategorySlugPage({ slug }: CategorySlugProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { addToCart, addToWishlist, isInWishlist } = useProduct();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const categoryName = formatCategoryName(slug);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock product data based on category
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Gold Bullion - 1oz American Eagle',
            description: '99.9% pure gold bullion coin from the U.S. Mint.',
            price: 1950.99,
            originalPrice: 2100.00,
            rating: 4.8,
            reviewCount: 127,
            image: '/placeholder.svg?height=300&width=300',
            seller: {
              name: 'Premium Metals Co.',
              rating: 4.9,
              verified: true,
              location: 'New York, NY',
            },
            tags: ['gold', 'bullion', 'investment', 'certified'],
            inStock: true,
            isFeatured: true,
            category: categoryName,
            subcategory: 'Gold',
          },
          {
            id: '2',
            name: 'Silver Bars - 10oz',
            description: 'High-quality silver bars for investment purposes.',
            price: 280.50,
            rating: 4.6,
            reviewCount: 89,
            image: '/placeholder.svg?height=300&width=300',
            seller: {
              name: 'Silver Traders Inc.',
              rating: 4.7,
              verified: true,
              location: 'Los Angeles, CA',
            },
            tags: ['silver', 'bars', 'investment'],
            inStock: true,
            isFeatured: false,
            category: categoryName,
            subcategory: 'Silver',
          },
          {
            id: '3',
            name: 'Platinum Coins - 1oz',
            description: 'Rare platinum coins for collectors and investors.',
            price: 1200.00,
            rating: 4.9,
            reviewCount: 45,
            image: '/placeholder.svg?height=300&width=300',
            seller: {
              name: 'Rare Metals Exchange',
              rating: 4.8,
              verified: true,
              location: 'Chicago, IL',
            },
            tags: ['platinum', 'coins', 'rare'],
            inStock: false,
            isFeatured: true,
            category: categoryName,
            subcategory: 'Platinum',
          },
        ];

        setProducts(mockProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug, categoryName, toast]);

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesSubcategory = selectedSubcategories.length === 0 ||
                              selectedSubcategories.includes(product.subcategory);
    const matchesStock = !showInStockOnly || product.inStock;
    const matchesVerified = !showVerifiedOnly || product.seller.verified;

    return matchesSearch && matchesPrice && matchesSubcategory && matchesStock && matchesVerified;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      default:
        return b.isFeatured ? 1 : -1;
    }
  });

  const subcategories = Array.from(new Set(products.map(p => p.subcategory)));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <p className="text-muted-foreground">
              {sortedProducts.length} products available
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search Products</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Separator />

              {/* Price Range */}
              <div>
                <Label>Price Range</Label>
                <div className="mt-4 px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Subcategories */}
              {subcategories.length > 0 && (
                <>
                  <div>
                    <Label>Subcategories</Label>
                    <div className="mt-3 space-y-2">
                      {subcategories.map((subcategory) => (
                        <div key={subcategory} className="flex items-center space-x-2">
                          <Checkbox
                            id={subcategory}
                            checked={selectedSubcategories.includes(subcategory)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSubcategories([...selectedSubcategories, subcategory]);
                              } else {
                                setSelectedSubcategories(
                                  selectedSubcategories.filter(s => s !== subcategory)
                                );
                              }
                            }}
                          />
                          <Label htmlFor={subcategory} className="text-sm">
                            {subcategory}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Stock Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={showInStockOnly}
                  onCheckedChange={setShowInStockOnly}
                />
                <Label htmlFor="inStock">In stock only</Label>
              </div>

              {/* Verified Sellers */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={showVerifiedOnly}
                  onCheckedChange={setShowVerifiedOnly}
                />
                <Label htmlFor="verified">Verified sellers only</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid/List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sort and Results */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-muted-foreground">
              Showing {sortedProducts.length} of {products.length} products
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products */}
          {sortedProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No products found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSubcategories([]);
                    setPriceRange([0, 5000]);
                    setShowInStockOnly(false);
                    setShowVerifiedOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`group cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    viewMode === 'list' ? 'flex-row' : ''
                  }`}
                >
                  <div className={viewMode === 'list' ? 'flex' : ''}>
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'
                    }`}>
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

                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-medium line-clamp-2 hover:text-primary">
                            {product.name}
                          </h3>
                        </Link>
                      </div>

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

                      <div className="flex items-center gap-2 mb-3">
                        <Link href={`/seller/${product.seller.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
                            <span>{product.seller.name}</span>
                            {product.seller.verified && (
                              <Shield className="h-3 w-3 text-green-600" />
                            )}
                          </div>
                        </Link>
                        <span className="text-xs text-muted-foreground">•</span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {product.seller.location}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
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
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}