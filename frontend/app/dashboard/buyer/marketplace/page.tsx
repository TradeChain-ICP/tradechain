// app/dashboard/buyer/marketplace/page.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  TrendingUp,
  Star,
  Filter,
  Heart,
  ShoppingCart,
  Eye,
  Zap,
  X,
  RefreshCw,
  Plus,
  Minus,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useContentPadding } from '@/contexts/sidebar-context';
import { CartDrawer } from '@/components/cart/cart-drawer';

// Enhanced CartItem interface to match the cart drawer
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  seller: string;
  category: string;
  stock: number;
}

// Cart context type for better type safety
interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

export default function MarketplacePage() {
  const { contentPadding } = useContentPadding();
  const { toast } = useToast();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState('all');
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Computed cart values
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // Cart management functions
  const addToCart = useCallback(
    (product: any, quantity: number = 1) => {
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stockQuantity) {
          toast({
            title: 'Stock Limit Reached',
            description: `Only ${product.stockQuantity} items available in stock.`,
            variant: 'destructive',
          });
          return;
        }

        setCartItems((prev) =>
          prev.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
        );
      } else {
        // Add new item to cart
        if (quantity > product.stockQuantity) {
          toast({
            title: 'Stock Limit Reached',
            description: `Only ${product.stockQuantity} items available in stock.`,
            variant: 'destructive',
          });
          return;
        }

        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          unit: product.unit || 'each',
          image: product.image,
          seller: product.seller,
          category: product.category,
          stock: product.stockQuantity,
        };

        setCartItems((prev) => [...prev, cartItem]);
      }

      // Show success toast and open cart drawer
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      });

      // Open cart drawer briefly to show the item was added
      setCartDrawerOpen(true);
    },
    [cartItems, toast]
  );

  const updateCartQuantity = useCallback(
    (id: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(id);
        return;
      }

      const item = cartItems.find((item) => item.id === id);
      if (item && newQuantity > item.stock) {
        toast({
          title: 'Stock Limit Reached',
          description: `Only ${item.stock} items available in stock.`,
          variant: 'destructive',
        });
        return;
      }

      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );
    },
    [cartItems, toast]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      const item = cartItems.find((item) => item.id === id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));

      if (item) {
        toast({
          title: 'Item Removed',
          description: `${item.name} has been removed from your cart.`,
        });
      }
    },
    [cartItems, toast]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({
      title: 'Cart Cleared',
      description: 'All items have been removed from your cart.',
    });
  }, [toast]);

  // Other handlers
  const handleAddToFavorites = useCallback(
    (productId: string, productName: string) => {
      setFavorites((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
      );

      toast({
        title: favorites.includes(productId) ? 'Removed from Favorites' : 'Added to Favorites',
        description: favorites.includes(productId)
          ? `${productName} removed from your favorites.`
          : `${productName} added to your favorites.`,
      });
    },
    [favorites, toast]
  );

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: 'Market Data Updated',
        description: 'Latest commodity prices and listings have been refreshed.',
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: 'Failed to update market data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Product filtering and sorting
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      const matchesPriceRange = (() => {
        switch (priceRange) {
          case 'under-100':
            return product.price < 100;
          case '100-1000':
            return product.price >= 100 && product.price <= 1000;
          case '1000-5000':
            return product.price > 1000 && product.price <= 5000;
          case 'over-5000':
            return product.price > 5000;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesPriceRange;
    });
  }, [searchQuery, selectedCategory, priceRange]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured).slice(0, 6),
    []
  );

  const trendingCategories = useMemo(() => categories.slice(0, 4), []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('featured');
  }, []);

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || priceRange !== 'all';

  // Quick add to cart with quantity selector
  const QuickAddButton = ({ product }: { product: any }) => {
    const [quantity, setQuantity] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);

    if (!isExpanded) {
      return (
        <Button
          size="sm"
          className="flex-1"
          onClick={() => {
            if (product.inStock) {
              addToCart(product, 1);
            } else {
              toast({
                title: 'Out of Stock',
                description: 'This item is currently out of stock.',
                variant: 'destructive',
              });
            }
          }}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      );
    }

    return (
      <div className="flex-1 flex items-center gap-1 border rounded-md p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="h-6 w-6 p-0"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-sm font-medium px-2 min-w-[2rem] text-center">{quantity}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
          className="h-6 w-6 p-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          onClick={() => {
            addToCart(product, quantity);
            setIsExpanded(false);
            setQuantity(1);
          }}
          disabled={!product.inStock}
          className="ml-1"
        >
          Add
        </Button>
      </div>
    );
  };

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">
              Discover and trade premium commodities from verified sellers worldwide
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            {/* Cart Button with Drawer */}
            <CartDrawer
              cartItems={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              isOpen={cartDrawerOpen}
              onOpenChange={setCartDrawerOpen}
            >
              <Button variant="outline" className="bg-transparent relative">
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </Badge>
                )}
              </Button>
            </CartDrawer>
          </div>
        </div>

        {/* AI Market Insights */}
        {showAIInsights && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">AI Market Insights</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Gold prices are up 2.3% today. Silver showing strong momentum. Consider
                      diversifying with agricultural commodities.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-700 border-blue-300"
                      >
                        📈 Gold trending up
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-700 border-blue-300"
                      >
                        🌾 Wheat demand rising
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAIInsights(false)}
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search commodities, categories, or sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-base"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under-100">Under $100</SelectItem>
                      <SelectItem value="100-1000">$100 - $1,000</SelectItem>
                      <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                      <SelectItem value="over-5000">Over $5,000</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-transparent">
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">More Filters</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>Additional Filters</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Seller Rating</DropdownMenuItem>
                      <DropdownMenuItem>Location</DropdownMenuItem>
                      <DropdownMenuItem>Availability</DropdownMenuItem>
                      <DropdownMenuItem>Certification</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="browse">Browse All</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Active Filters */}
          {hasActiveFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {selectedCategory !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory('all')}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        "{searchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {priceRange !== 'all' && (
                      <Badge variant="secondary" className="gap-1">
                        {priceRange.replace('-', ' - $')}
                        <button
                          onClick={() => setPriceRange('all')}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" onClick={clearAllFilters} className="bg-transparent">
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {sortedProducts.length} of {products.length} products
            </p>
            {sortedProducts.length > 0 && (
              <p className="text-sm text-muted-foreground">Sorted by {sortBy.replace('-', ' ')}</p>
            )}
          </div>

          {/* Products Display */}
          {sortedProducts.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image || '/placeholder.svg?height=300&width=300'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 bg-white/80 hover:bg-white"
                          onClick={() => handleAddToFavorites(product.id, product.name)}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </Button>
                      </div>
                      {product.featured && (
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                {product.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold">
                              ${product.price.toLocaleString()}
                            </div>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice.toLocaleString()}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">per {product.unit}</div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right">
                            <div>{product.seller}</div>
                            {product.inStock && (
                              <div className="text-green-600">Stock: {product.stockQuantity}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 flex gap-2">
                      <Link href={`product/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <QuickAddButton product={product} />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={product.image || '/placeholder.svg?height=96&width=96'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {product.featured && (
                            <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-yellow-900 text-xs">
                              <Star className="h-3 w-3" />
                            </Badge>
                          )}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="destructive" className="text-xs">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {product.category}
                                </Badge>
                                {product.rating && (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-muted-foreground">
                                      {product.rating}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {product.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => handleAddToFavorites(product.id, product.name)}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                                }`}
                              />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold">
                                ${product.price.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                per {product.unit} • by {product.seller}
                              </div>
                              {product.inStock && (
                                <div className="text-xs text-green-600">
                                  Stock: {product.stockQuantity}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Link href={`product/${product.id}`}>
                                <Button variant="outline" size="sm" className="bg-transparent">
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </Link>
                              <QuickAddButton product={product} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                No products found matching your criteria
              </div>
              <Button variant="outline" onClick={clearAllFilters} className="bg-transparent">
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
                  <Image
                    src={product.image || '/placeholder.svg?height=200&width=300'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
                    <Star className="mr-1 h-3 w-3" />
                    Featured
                  </Badge>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
                    onClick={() => handleAddToFavorites(product.id, product.name)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    Premium quality {product.category.toLowerCase()} from verified sellers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">${product.price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">per {product.unit}</div>
                      </div>
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`product/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        className="flex-1"
                        onClick={() => addToCart(product, 1)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trendingCategories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => {
                  setSelectedCategory(category.name);
                  // Switch to browse tab to show filtered results
                  const tabsTrigger = document.querySelector('[value="browse"]') as HTMLElement;
                  if (tabsTrigger) {
                    tabsTrigger.click();
                  }
                }}
              >
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/20">
                  <Image
                    src={category.image || '/placeholder.svg?height=200&width=200'}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Avg. Price Change</span>
                      <span className="text-green-600 font-medium">+12.5%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Active Listings</span>
                      <span className="font-medium">
                        {products.filter((p) => p.category === category.name).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Avg. Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.7</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Explore {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cart Summary Footer for Mobile */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t p-4 z-40">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-muted-foreground">${subtotal.toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCartDrawerOpen(true)}
                className="bg-transparent"
              >
                View Cart
              </Button>
              <Link href="/checkout">
                <Button>Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
