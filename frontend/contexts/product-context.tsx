'use client';

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  seller: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
  };
  images: string[];
  stock: number;
  minimumOrder: number;
  tags: string[];
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  seller: string;
  category: string;
  stock: number;
  addedAt: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  addedAt: string;
}

interface ProductState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  recentlyViewed: Product[];
  isLoading: boolean;
  error: string | null;
}

type ProductAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: WishlistItem }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_TO_RECENTLY_VIEWED'; payload: Product }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] }
  | { type: 'SYNC_CART_WITH_STOCK'; payload: { productId: string; newStock: number } };

interface ProductContextType extends ProductState {
  // Cart methods
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // Wishlist methods
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;

  // Recently viewed methods
  addToRecentlyViewed: (product: Product) => void;

  // Utility methods
  isInCart: (productId: string) => boolean;
  getCartItemByProductId: (productId: string) => CartItem | undefined;
  syncCartWithBackend: () => Promise<void>;
}

const initialState: ProductState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  isLoading: false,
  error: null,
};

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'ADD_TO_CART': {
      // Check if item already exists
      const existingItemIndex = state.cart.findIndex(
        item => item.productId === action.payload.productId
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + action.payload.quantity,
        };
        return { ...state, cart: updatedCart };
      } else {
        // Add new item
        return { ...state, cart: [...state.cart, action.payload] };
      }
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };

    case 'UPDATE_CART_QUANTITY': {
      const updatedCart = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity

      return { ...state, cart: updatedCart };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'ADD_TO_WISHLIST': {
      // Check if already in wishlist
      const exists = state.wishlist.some(item => item.productId === action.payload.productId);
      if (exists) return state;

      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.productId !== action.payload),
      };

    case 'ADD_TO_RECENTLY_VIEWED': {
      const updatedRecentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter(item => item.id !== action.payload.id),
      ].slice(0, 10); // Keep only last 10 items

      return { ...state, recentlyViewed: updatedRecentlyViewed };
    }

    case 'LOAD_CART':
      return { ...state, cart: action.payload };

    case 'LOAD_WISHLIST':
      return { ...state, wishlist: action.payload };

    case 'SYNC_CART_WITH_STOCK': {
      const updatedCart = state.cart.map(item => {
        if (item.productId === action.payload.productId) {
          return {
            ...item,
            stock: action.payload.newStock,
            quantity: Math.min(item.quantity, action.payload.newStock), // Adjust quantity if needed
          };
        }
        return item;
      }).filter(item => item.stock > 0); // Remove out of stock items

      return { ...state, cart: updatedCart };
    }

    default:
      return state;
  }
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const { toast } = useToast();

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('tradechain_cart');
      const savedWishlist = localStorage.getItem('tradechain_wishlist');

      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      }

      if (savedWishlist) {
        const wishlistItems = JSON.parse(savedWishlist);
        dispatch({ type: 'LOAD_WISHLIST', payload: wishlistItems });
      }
    } catch (error) {
      console.error('Failed to load cart/wishlist from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tradechain_cart', JSON.stringify(state.cart));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.cart]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('tradechain_wishlist', JSON.stringify(state.wishlist));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage:', error);
    }
  }, [state.wishlist]);

  // Cart methods
  const addToCart = async (product: Product, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // Check stock availability
      if (quantity > product.stock) {
        throw new Error(`Only ${product.stock} items available in stock`);
      }

      const cartItem: CartItem = {
        id: `cart_${product.id}_${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        unit: product.unit,
        image: product.images[0] || '/placeholder.svg',
        seller: product.seller.name,
        category: product.category,
        stock: product.stock,
        addedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_TO_CART', payload: cartItem });

      toast({
        title: 'Added to Cart',
        description: `${quantity} ${product.unit}${quantity > 1 ? 's' : ''} of ${product.name} added to your cart.`,
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        title: 'Failed to Add to Cart',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId });
      toast({
        title: 'Removed from Cart',
        description: 'Item has been removed from your cart.',
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        title: 'Failed to Remove Item',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateCartQuantity = async (cartItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(cartItemId);
        return;
      }

      // Find the cart item to check stock
      const cartItem = state.cart.find(item => item.id === cartItemId);
      if (cartItem && quantity > cartItem.stock) {
        throw new Error(`Only ${cartItem.stock} items available in stock`);
      }

      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: cartItemId, quantity } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        title: 'Failed to Update Quantity',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'CLEAR_CART' });
      toast({
        title: 'Cart Cleared',
        description: 'All items have been removed from your cart.',
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        title: 'Failed to Clear Cart',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  // Wishlist methods
  const addToWishlist = async (product: Product) => {
    try {
      const wishlistItem: WishlistItem = {
        id: `wishlist_${product.id}_${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder.svg',
        seller: product.seller.name,
        addedAt: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });

      toast({
        title: 'Added to Wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        title: 'Failed to Add to Wishlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      toast({
        title: 'Removed from Wishlist',
        description: 'Item has been removed from your wishlist.',
      });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      toast({
        title: 'Failed to Remove from Wishlist',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addToRecentlyViewed = (product: Product) => {
    dispatch({ type: 'ADD_TO_RECENTLY_VIEWED', payload: product });
  };

  // Sync cart with backend (placeholder for future backend integration)
  const syncCartWithBackend = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // TODO: Implement backend sync
      console.log('Syncing cart with backend...');
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Computed values
  const getCartTotal = useMemo(() => {
    return () => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.cart]);

  const getCartItemsCount = useMemo(() => {
    return () => state.cart.reduce((total, item) => total + item.quantity, 0);
  }, [state.cart]);

  const isInCart = useMemo(() => {
    return (productId: string) => state.cart.some(item => item.productId === productId);
  }, [state.cart]);

  const getCartItemByProductId = useMemo(() => {
    return (productId: string) => state.cart.find(item => item.productId === productId);
  }, [state.cart]);

  const isInWishlist = useMemo(() => {
    return (productId: string) => state.wishlist.some(item => item.productId === productId);
  }, [state.wishlist]);

  const value: ProductContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addToRecentlyViewed,
    isInCart,
    getCartItemByProductId,
    syncCartWithBackend,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

export default ProductContext;