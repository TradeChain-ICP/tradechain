// data/products.tsx
export interface Product {
  id: string
  name: string
  category: string
  price: number
  previousPrice?: number
  originalPrice?: number // Added for marketplace compatibility
  image: string
  rating: number
  reviewCount: number
  seller: string
  sellerRating: number
  origin: string
  inStock: boolean
  stockQuantity: number
  unit: string
  description: string
  specifications: Record<string, string>
  tags: string[]
  discount?: number
  featured?: boolean // Added for featured products
  createdAt?: string // Added for sorting by newest
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  productCount: number
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Precious Metals",
    description: "Gold, silver, platinum and other precious metals",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 45,
  },
  {
    id: "2",
    name: "Energy",
    description: "Crude oil, natural gas, and renewable energy commodities",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 32,
  },
  {
    id: "3",
    name: "Agriculture",
    description: "Grains, livestock, and agricultural products",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 67,
  },
  {
    id: "4",
    name: "Industrial Metals",
    description: "Copper, aluminum, steel and other industrial metals",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 28,
  },
  {
    id: "5",
    name: "Soft Commodities",
    description: "Coffee, cocoa, sugar, and other soft commodities",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 41,
  },
  {
    id: "6",
    name: "Livestock",
    description: "Cattle, pork, and other livestock commodities",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 19,
  },
]

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Gold Bullion - 1oz",
    category: "Precious Metals",
    price: 1950.0,
    previousPrice: 2100.0,
    originalPrice: 2100.0, // Added for marketplace compatibility
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    reviewCount: 124,
    seller: "Golden Gate Metals",
    sellerRating: 4.9,
    origin: "Switzerland",
    inStock: true,
    stockQuantity: 50,
    unit: "oz",
    description:
      "99.99% pure gold bullion bars, certified and authenticated. Perfect for investment portfolios and long-term wealth preservation.",
    specifications: {
      Purity: "99.99%",
      Weight: "1 Troy Ounce",
      Dimensions: "50mm x 29mm x 2.5mm",
      Certification: "LBMA Certified",
      Mint: "Swiss Mint",
    },
    tags: ["investment", "precious metals", "gold", "bullion"],
    discount: 7,
    featured: true, // Added featured flag
    createdAt: "2024-01-15T10:00:00Z", // Added creation date
  },
  {
    id: "2",
    name: "Silver Bars - 10oz",
    category: "Precious Metals",
    price: 280.0,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    reviewCount: 89,
    seller: "Silver Stream Co.",
    sellerRating: 4.7,
    origin: "Canada",
    inStock: true,
    stockQuantity: 75,
    unit: "oz",
    description: "High-quality .999 fine silver bars. Ideal for both investment and industrial applications.",
    specifications: {
      Purity: "99.9%",
      Weight: "10 Troy Ounces",
      Dimensions: "100mm x 50mm x 10mm",
      Certification: "RCM Certified",
      Mint: "Royal Canadian Mint",
    },
    tags: ["investment", "precious metals", "silver", "bars"],
    featured: true, // Added featured flag
    createdAt: "2024-01-20T14:30:00Z", // Added creation date
  },
  {
    id: "3",
    name: "Crude Oil Futures - WTI",
    category: "Energy",
    price: 75.5,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.4,
    reviewCount: 156,
    seller: "Energy Traders LLC",
    sellerRating: 4.8,
    origin: "Texas, USA",
    inStock: true,
    stockQuantity: 100,
    unit: "barrel",
    description: "West Texas Intermediate crude oil futures contracts. High-grade light sweet crude oil.",
    specifications: {
      Grade: "Light Sweet Crude",
      "API Gravity": "39.6°",
      "Sulfur Content": "0.24%",
      "Contract Size": "1,000 barrels",
      Delivery: "Cushing, Oklahoma",
    },
    tags: ["energy", "oil", "futures", "WTI"],
    featured: true, // Added featured flag
    createdAt: "2024-01-25T09:15:00Z", // Added creation date
  },
  {
    id: "4",
    name: "Premium Coffee Beans - Arabica",
    category: "Soft Commodities",
    price: 4.25,
    previousPrice: 4.8,
    originalPrice: 4.8, // Added for marketplace compatibility
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    reviewCount: 203,
    seller: "Global Coffee Traders",
    sellerRating: 4.6,
    origin: "Colombia",
    inStock: true,
    stockQuantity: 500,
    unit: "lb",
    description: "Premium Arabica coffee beans from Colombian highlands. Perfect for specialty coffee roasters.",
    specifications: {
      Variety: "Arabica",
      Processing: "Washed",
      Altitude: "1,200-1,800m",
      Moisture: "10-12%",
      "Screen Size": "17-18",
    },
    tags: ["coffee", "arabica", "premium", "colombia"],
    discount: 11,
    createdAt: "2024-02-01T11:45:00Z", // Added creation date
  },
  {
    id: "5",
    name: "Copper Cathodes - Grade A",
    category: "Industrial Metals",
    price: 8.45,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    reviewCount: 67,
    seller: "Industrial Metals Corp",
    sellerRating: 4.8,
    origin: "Chile",
    inStock: true,
    stockQuantity: 200,
    unit: "kg",
    description: "High-grade copper cathodes for industrial applications. 99.99% purity guaranteed.",
    specifications: {
      Purity: "99.99%",
      Grade: "Grade A",
      Weight: "125kg per cathode",
      Dimensions: "914mm x 914mm x 12mm",
      Standard: "LME Grade A",
    },
    tags: ["copper", "industrial", "cathodes", "grade-a"],
    createdAt: "2024-02-05T16:20:00Z", // Added creation date
  },
  {
    id: "6",
    name: "Wheat Futures - Hard Red Winter",
    category: "Agriculture",
    price: 6.75,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.3,
    reviewCount: 91,
    seller: "Grain Exchange Pro",
    sellerRating: 4.5,
    origin: "Kansas, USA",
    inStock: false,
    stockQuantity: 0,
    unit: "bushel",
    description: "Hard Red Winter wheat futures. High protein content, ideal for bread production.",
    specifications: {
      Class: "Hard Red Winter",
      Protein: "11.5% minimum",
      "Test Weight": "60 lbs/bushel minimum",
      Moisture: "13.5% maximum",
      "Contract Size": "5,000 bushels",
    },
    tags: ["wheat", "agriculture", "futures", "grain"],
    createdAt: "2024-02-10T08:00:00Z", // Added creation date
  },
]