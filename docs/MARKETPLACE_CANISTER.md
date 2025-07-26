# TradeChain Marketplace Canister - Deployment Guide

## 🎯 Overview

The Marketplace canister handles all product and order operations including:
- ✅ **Product Management** - Create, update, delete, and browse products
- ✅ **Order Processing** - Complete checkout and order management
- ✅ **Search & Filtering** - Advanced product discovery (matches frontend)
- ✅ **Reviews & Ratings** - Customer feedback system
- ✅ **Category Management** - Organized product categories
- ✅ **AI Recommendations** - Pricing optimization and insights
- ✅ **Demo Data** - Realistic marketplace content for demo

## 📁 File Structure

Ensure you have these files in your project:

```
tradechain-backend/
├── dfx.json                          # Updated with marketplace canister
├── vessel.dhall                      # Package dependencies
├── src/
│   ├── shared/
│   │   └── types.mo                  # Updated with marketplace types
│   ├── user_management/
│   │   ├── main.mo
│   │   ├── types.mo
│   │   └── utils.mo
│   ├── wallet/
│   │   ├── main.mo
│   │   ├── types.mo
│   │   └── utils.mo
│   └── marketplace/                  # NEW MARKETPLACE FILES
│       ├── main.mo                   # Main marketplace canister
│       ├── types.mo                  # Marketplace type definitions
│       └── utils.mo                  # Marketplace utility functions
```

## 🚀 Deployment Steps

### 1. Deploy Marketplace Canister
```bash
# Make sure you're in the project directory
cd tradechain-backend

# Deploy marketplace canister
dfx deploy marketplace

# Get marketplace canister ID
dfx canister id marketplace
```

### 2. Test Marketplace Functions
```bash
# Check marketplace health
dfx canister call marketplace healthCheck

# Get marketplace stats
dfx canister call marketplace getMarketplaceStats

# Get demo products
dfx canister call marketplace getProducts '(null, null, null, null)'
```

### 3. Test Product Management
```bash
# Get categories
dfx canister call marketplace getCategories

# Get featured products
dfx canister call marketplace getFeaturedProducts '(opt 5)'

# Search products
dfx canister call marketplace searchProducts '("gold", opt 10)'
```

## 🧪 Complete Testing Suite

### Test Product Browsing (Marketplace Page)
```bash
# Get all products with filters
dfx canister call marketplace getProducts '(
  opt record {
    query = opt "gold";
    category = opt variant { PreciousMetals };
    subcategory = null;
    minPrice = null;
    maxPrice = null;
    condition = null;
    location = null;
    inStock = true;
    featured = null;
    sellerId = null;
  },
  opt variant { Featured },
  opt 20,
  opt 0
)'

# Get specific product details
dfx canister call marketplace getProduct '("prod_[product_id]")'
```

### Test Product Creation (Add Product Page)
```bash
# Create a new product (as authenticated seller)
dfx canister call marketplace createProduct '(record {
  name = "Test Gold Coin";
  description = "High quality gold coin for testing";
  category = variant { PreciousMetals };
  subcategory = opt "Gold";
  price = 2000.0;
  originalPrice = null;
  unit = "per coin";
  minOrder = 1;
  maxOrder = opt 10;
  stock = 5;
  images = vec { "/test-image.jpg" };
  specifications = vec { ("Purity", "99.9%"); ("Weight", "1 oz") };
  tags = vec { "gold"; "coin"; "investment" };
  condition = variant { New };
  weight = opt "1 oz";
  dimensions = opt "32mm diameter";
  certification = opt "Test Certificate";
  purity = opt "99.9%";
  origin = opt "Test Mint";
  sku = opt "TEST-GOLD-001";
  shippingWeight = opt "0.5 lbs";
  shippingDimensions = opt "4x4x1 inches";
  processingTime = opt "1-2 business days";
  shippingOptions = vec { "Standard"; "Express" };
  returnPolicy = opt "30-day return policy";
  warranty = opt "Authenticity guaranteed";
})'
```

### Test Order Placement (Checkout Page)
```bash
# Place an order (as authenticated buyer)
dfx canister call marketplace placeOrder '(record {
  items = vec {
    record {
      productId = "prod_[product_id]";
      quantity = 2;
      price = 1950.0;
      totalPrice = 3900.0;
    }
  };
  shippingAddress = record {
    firstName = "John";
    lastName = "Doe";
    address = "123 Main St";
    city = "New York";
    state = "NY";
    zipCode = "10001";
    country = "US";
    phone = opt "+1234567890";
  };
  paymentMethod = "ICP";
  notes = opt "Test order";
})'
```

### Test Reviews System
```bash
# Add a product review
dfx canister call marketplace addReview '(record {
  productId = "prod_[product_id]";
  orderId = "ord_[order_id]";
  rating = 5;
  title = opt "Excellent product";
  comment = "Great quality and fast shipping!";
  images = vec {};
})'

# Get product reviews
dfx canister call marketplace getProductReviews '("prod_[product_id]")'
```

## 🔗 Frontend Integration

### Update Environment Variables
Add the marketplace canister ID to your frontend `.env.local`:

```bash
# Add this line to your existing .env.local
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=your_marketplace_canister_id

# Your complete .env.local should now have:
NEXT_PUBLIC_USER_MANAGEMENT_CANISTER_ID=uxrrr-q7777-77774-qaaaq-cai
NEXT_PUBLIC_WALLET_CANISTER_ID=your_wallet_canister_id
NEXT_PUBLIC_MARKETPLACE_CANISTER_ID=your_marketplace_canister_id
NEXT_PUBLIC_DFX_NETWORK=local
NEXT_PUBLIC_IC_HOST=http://127.0.0.1:8000
```

### Frontend Integration Code
Create/update your `lib/marketplace-agent.ts`:

```typescript
import { Actor, HttpAgent } from '@dfinity/agent';

// Marketplace IDL (simplified for demo)
const marketplaceIdl = ({ IDL }) => {
  const ProductCategory = IDL.Variant({
    'PreciousMetals': IDL.Null,
    'OilGas': IDL.Null,
    'Agriculture': IDL.Null,
    'Timber': IDL.Null,
  });

  const ProductCondition = IDL.Variant({
    'New': IDL.Null,
    'Used': IDL.Null,
    'Refurbished': IDL.Null,
  });

  const ListingStatus = IDL.Variant({
    'Active': IDL.Null,
    'Inactive': IDL.Null,
    'Sold': IDL.Null,
    'Expired': IDL.Null,
    'Removed': IDL.Null,
  });

  const Product = IDL.Record({
    'id': IDL.Text,
    'sellerId': IDL.Text,
    'name': IDL.Text,
    'description': IDL.Text,
    'category': ProductCategory,
    'subcategory': IDL.Opt(IDL.Text),
    'price': IDL.Float64,
    'originalPrice': IDL.Opt(IDL.Float64),
    'unit': IDL.Text,
    'minOrder': IDL.Nat,
    'maxOrder': IDL.Opt(IDL.Nat),
    'stock': IDL.Nat,
    'images': IDL.Vec(IDL.Text),
    'specifications': IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'tags': IDL.Vec(IDL.Text),
    'condition': ProductCondition,
    'status': ListingStatus,
    'featured': IDL.Bool,
    'rating': IDL.Float64,
    'reviewCount': IDL.Nat,
    'totalSales': IDL.Nat,
    'createdAt': IDL.Int,
    'updatedAt': IDL.Int,
  });

  const SearchFilters = IDL.Record({
    'query': IDL.Opt(IDL.Text),
    'category': IDL.Opt(ProductCategory),
    'subcategory': IDL.Opt(IDL.Text),
    'minPrice': IDL.Opt(IDL.Float64),
    'maxPrice': IDL.Opt(IDL.Float64),
    'condition': IDL.Opt(ProductCondition),
    'location': IDL.Opt(IDL.Text),
    'inStock': IDL.Bool,
    'featured': IDL.Opt(IDL.Bool),
    'sellerId': IDL.Opt(IDL.Text),
  });

  const SortOption = IDL.Variant({
    'Featured': IDL.Null,
    'PriceLowToHigh': IDL.Null,
    'PriceHighToLow': IDL.Null,
    'Newest': IDL.Null,
    'Rating': IDL.Null,
    'Popular': IDL.Null,
  });

  const ProductsResult = IDL.Record({
    'products': IDL.Vec(Product),
    'total': IDL.Nat,
    'hasMore': IDL.Bool,
  });

  return IDL.Service({
    'getProducts': IDL.Func([
      IDL.Opt(SearchFilters),
      IDL.Opt(SortOption),
      IDL.Opt(IDL.Nat),
      IDL.Opt(IDL.Nat)
    ], [ProductsResult], ['query']),
    'getProduct': IDL.Func([IDL.Text], [IDL.Variant({'ok': Product, 'err': IDL.Text})], ['query']),
    'getFeaturedProducts': IDL.Func([IDL.Opt(IDL.Nat)], [IDL.Vec(Product)], ['query']),
    'searchProducts': IDL.Func([IDL.Text, IDL.Opt(IDL.Nat)], [IDL.Vec(Product)], ['query']),
    'getCategories': IDL.Func([], [IDL.Vec(IDL.Record({
      'id': IDL.Text,
      'name': IDL.Text,
      'description': IDL.Text,
      'subcategories': IDL.Vec(IDL.Text),
      'productCount': IDL.Nat,
    }))], ['query']),
    'healthCheck': IDL.Func([], [IDL.Text], ['query']),
  });
};

// Create agent
const agent = new HttpAgent({
  host: process.env.NEXT_PUBLIC_IC_HOST,
});

// Create marketplace actor
export const marketplaceActor = Actor.createActor(marketplaceIdl, {
  agent,
  canisterId: process.env.NEXT_PUBLIC_MARKETPLACE_CANISTER_ID!,
});
```

### Frontend Usage Example
```typescript
// In your marketplace page component
import { marketplaceActor } from '@/lib/marketplace-agent';

// Get products with filters
const getProducts = async (filters: any = null) => {
  try {
    const result = await marketplaceActor.getProducts(
      filters ? [filters] : [null],
      [null], // sort
      [20],   // limit
      [0]     // offset
    );
    setProducts(result.products);
  } catch (error) {
    console.error('Failed to get products:', error);
  }
};

// Search products
const searchProducts = async (query: string) => {
  try {
    const result = await marketplaceActor.searchProducts(query, [20]);
    setProducts(result);
  } catch (error) {
    console.error('Failed to search products:', error);
  }
};

// Get product details
const getProductDetails = async (productId: string) => {
  try {
    const result = await marketplaceActor.getProduct(productId);
    if ('ok' in result) {
      setProduct(result.ok);
    }
  } catch (error) {
    console.error('Failed to get product:', error);
  }
};
```

## 🎯 Expected Test Results

### Successful Deployment
```bash
$ dfx deploy marketplace
Deploying: marketplace
marketplace canister created with canister id: xyz789-def456...
Building canister 'marketplace'.
Installed code for canister marketplace

$ dfx canister call marketplace healthCheck
("Marketplace canister is running. Total products: 3")
```

### Demo Products Test
```bash
$ dfx canister call marketplace getProducts '(null, null, null, null)'
(
  record {
    total = 3 : nat;
    hasMore = false;
    products = vec {
      record {
        id = "prod_[timestamp]";
        name = "Gold Bullion - 1oz American Eagle";
        description = "99.9% pure gold bullion coin...";
        category = variant { PreciousMetals };
        price = 1950.0 : float64;
        stock = 25 : nat;
        featured = true;
        rating = 4.8 : float64;
        reviewCount = 127 : nat;
        // ... more fields
      };
      // ... more products
    };
  }
)
```

### Categories Test
```bash
$ dfx canister call marketplace getCategories
(
  vec {
    record {
      id = "precious-metals";
      name = "Precious Metals";
      description = "Gold, silver, platinum, and other precious metals";
      subcategories = vec { "Gold"; "Silver"; "Platinum"; "Palladium" };
      productCount = 156 : nat;
    };
    // ... more categories
  }
)
```

## 🔧 Troubleshooting

### Common Issues

1. **Deployment Fails**
```bash
# Clean and rebuild
dfx stop
dfx start --background --clean
dfx deploy marketplace
```

2. **Type Errors**
```bash
# Ensure all types are properly imported
# Check that ProductCategory variants match exactly
```

3. **Demo Data Issues**
```bash
# Check canister logs
dfx canister logs marketplace
```

## ✅ Success Checklist

After successful deployment, you should be able to:

- [ ] Deploy marketplace canister without errors
- [ ] Call `healthCheck()` successfully
- [ ] Get demo products with `getProducts()`
- [ ] Retrieve categories with `getCategories()`
- [ ] See marketplace stats showing 3 demo products
- [ ] Search products by keyword
- [ ] Frontend can connect to marketplace canister
- [ ] All marketplace page features display correctly

## 🚀 Next Steps

Once the Marketplace canister is working:

1. **Test Frontend Integration**: Connect your frontend marketplace pages
2. **Verify All Features**: Ensure product browsing, search, and filtering work
3. **Check Demo Data**: Confirm realistic product listings
4. **Integration Testing**: Test user management + wallet + marketplace together
5. **End-to-End Flow**: Complete buyer journey from browsing to purchasing

## 📊 Demo Data Verification

Your marketplace system includes realistic demo data:
- **3 Demo Products** - Gold bullion, silver bars, premium wheat
- **4 Product Categories** - Precious metals, oil & gas, agriculture, timber
- **Complete Product Details** - Images, specifications, shipping info
- **Realistic Pricing** - Market-competitive prices with discounts
- **Review System** - Rating and feedback functionality

## 🎯 Key Features Implemented

### Frontend Alignment:
✅ **Marketplace Page** - Complete product browsing with filters and search
✅ **Product Detail Page** - Full product information with reviews
✅ **Add Product Page** - Complete seller product creation flow
✅ **Cart/Checkout** - Order placement and processing
✅ **AI Insights** - Pricing recommendations for sellers
✅ **Categories** - Organized product discovery

### Technical Features:
✅ **Advanced Search** - Text search across name, description, and tags
✅ **Smart Filtering** - Category, price, condition, and availability filters
✅ **Flexible Sorting** - Featured, price, rating, and popularity options
✅ **Review System** - Customer feedback with ratings
✅ **Order Management** - Complete order lifecycle
✅ **Inventory Tracking** - Real-time stock management
✅ **Demo System** - Realistic marketplace content for demos

The Marketplace canister provides the complete trading foundation for your platform and matches all your frontend marketplace functionality!