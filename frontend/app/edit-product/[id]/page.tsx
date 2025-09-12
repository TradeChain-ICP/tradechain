// app/edit-product/[id]/page.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Plus, Trash2, Eye, Save, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { RoleGuard } from "@/components/auth/role-guard"
import { categories } from "@/data/products"

interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

interface ProductSpecification {
  id: string
  name: string
  value: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory: string
  images: ProductImage[]
  specifications: ProductSpecification[]
  tags: string[]
  stock: number
  sku: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  isActive: boolean
  isFeatured: boolean
  seoTitle: string
  seoDescription: string
  createdAt: string
  updatedAt: string
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newSpec, setNewSpec] = useState({ name: "", value: "" })
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [loadingAI, setLoadingAI] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockProduct: Product = {
          id: params.id as string,
          name: "Premium Wireless Headphones",
          description:
            "Experience premium sound quality with our latest wireless headphones featuring active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals who demand the best audio experience.",
          price: 299.99,
          originalPrice: 399.99,
          category: "Electronics",
          subcategory: "Audio",
          images: [
            {
              id: "1",
              url: "/placeholder.svg?height=400&width=400",
              alt: "Wireless headphones front view",
              isPrimary: true,
            },
            {
              id: "2",
              url: "/placeholder.svg?height=400&width=400",
              alt: "Wireless headphones side view",
              isPrimary: false,
            },
            {
              id: "3",
              url: "/placeholder.svg?height=400&width=400",
              alt: "Wireless headphones with case",
              isPrimary: false,
            },
          ],
          specifications: [
            { id: "1", name: "Battery Life", value: "30 hours" },
            { id: "2", name: "Connectivity", value: "Bluetooth 5.0" },
            { id: "3", name: "Weight", value: "250g" },
            { id: "4", name: "Charging", value: "USB-C Fast Charging" },
          ],
          tags: ["wireless", "bluetooth", "noise-cancelling", "premium"],
          stock: 45,
          sku: "WH-001",
          weight: 0.25,
          dimensions: {
            length: 20,
            width: 18,
            height: 8,
          },
          isActive: true,
          isFeatured: false,
          seoTitle: "Premium Wireless Headphones - Best Audio Quality",
          seoDescription:
            "Shop premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Free shipping available.",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-20T14:30:00Z",
        }

        setProduct(mockProduct)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleSave = async () => {
    if (!product) return

    setSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update product
      setProduct((prev) => (prev ? { ...prev, updatedAt: new Date().toISOString() } : null))

      // Show success message or redirect
      router.push("/inventory")
    } catch (error) {
      console.error("Failed to save product:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = () => {
    if (!newTag.trim() || !product) return

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            tags: [...prev.tags, newTag.trim()],
          }
        : null,
    )
    setNewTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
          }
        : null,
    )
  }

  const handleAddSpecification = () => {
    if (!newSpec.name.trim() || !newSpec.value.trim() || !product) return

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            specifications: [
              ...prev.specifications,
              {
                id: Date.now().toString(),
                name: newSpec.name.trim(),
                value: newSpec.value.trim(),
              },
            ],
          }
        : null,
    )
    setNewSpec({ name: "", value: "" })
  }

  const handleRemoveSpecification = (specId: string) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            specifications: prev.specifications.filter((spec) => spec.id !== specId),
          }
        : null,
    )
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !product) return

    // Simulate image upload
    Array.from(files).forEach((file, index) => {
      const newImage: ProductImage = {
        id: Date.now().toString() + index,
        url: URL.createObjectURL(file),
        alt: file.name,
        isPrimary: product.images.length === 0 && index === 0,
      }

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              images: [...prev.images, newImage],
            }
          : null,
      )
    })
  }

  const handleRemoveImage = (imageId: string) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((img) => img.id !== imageId),
          }
        : null,
    )
  }

  const handleSetPrimaryImage = (imageId: string) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.map((img) => ({
              ...img,
              isPrimary: img.id === imageId,
            })),
          }
        : null,
    )
  }

  const getAISuggestions = async () => {
    setLoadingAI(true)
    try {
      // Simulate AI API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setAiSuggestions({
        pricing: {
          suggested: 279.99,
          reason: "Based on competitor analysis and market trends",
          confidence: 85,
        },
        seo: {
          title: "Premium Wireless Headphones with Active Noise Cancellation - 30H Battery",
          description:
            "Experience superior sound quality with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and Bluetooth 5.0. Free shipping & warranty included.",
          keywords: ["wireless headphones", "noise cancelling", "bluetooth headphones", "premium audio"],
        },
        tags: ["audiophile", "travel", "work-from-home", "gaming"],
        improvements: [
          "Add more detailed frequency response specifications",
          "Include compatibility information for different devices",
          "Mention warranty and return policy in description",
        ],
      })
    } catch (error) {
      console.error("Failed to get AI suggestions:", error)
    } finally {
      setLoadingAI(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-gray-600">SKU: {product.sku}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <a href={`/product/${product.id}`} target="_blank" rel="noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
            <Button onClick={getAISuggestions} disabled={loadingAI}>
              <Zap className="mr-2 h-4 w-4" />
              {loadingAI ? "Getting AI Suggestions..." : "AI Optimize"}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {/* AI Suggestions Alert */}
        {aiSuggestions && (
          <Alert className="mb-6">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              AI suggests pricing at ${aiSuggestions.pricing.suggested} ({aiSuggestions.pricing.confidence}% confidence)
              and recommends adding tags: {aiSuggestions.tags.join(", ")}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="seo">SEO & Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={product.name}
                          onChange={(e) => setProduct((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          value={product.sku}
                          onChange={(e) => setProduct((prev) => (prev ? { ...prev, sku: e.target.value } : null))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={product.description}
                        onChange={(e) => setProduct((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={product.category}
                          onValueChange={(value) => setProduct((prev) => (prev ? { ...prev, category: value } : null))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select
                          value={product.subcategory}
                          onValueChange={(value) =>
                            setProduct((prev) => (prev ? { ...prev, subcategory: value } : null))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories
                              .find((cat) => cat.name === product.category)
                              ?.subcategories.map((sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={product.price}
                          onChange={(e) =>
                            setProduct((prev) => (prev ? { ...prev, price: Number.parseFloat(e.target.value) } : null))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalPrice">Original Price ($)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          step="0.01"
                          value={product.originalPrice || ""}
                          onChange={(e) =>
                            setProduct((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    originalPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={product.stock}
                          onChange={(e) =>
                            setProduct((prev) => (prev ? { ...prev, stock: Number.parseInt(e.target.value) } : null))
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={product.weight}
                          onChange={(e) =>
                            setProduct((prev) => (prev ? { ...prev, weight: Number.parseFloat(e.target.value) } : null))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="length">Length (cm)</Label>
                        <Input
                          id="length"
                          type="number"
                          value={product.dimensions.length}
                          onChange={(e) =>
                            setProduct((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    dimensions: { ...prev.dimensions, length: Number.parseFloat(e.target.value) },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="width">Width (cm)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={product.dimensions.width}
                          onChange={(e) =>
                            setProduct((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    dimensions: { ...prev.dimensions, width: Number.parseFloat(e.target.value) },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={product.dimensions.height}
                          onChange={(e) =>
                            setProduct((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    dimensions: { ...prev.dimensions, height: Number.parseFloat(e.target.value) },
                                  }
                                : null,
                            )
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">Upload images</span>
                            <span className="mt-1 block text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</span>
                          </label>
                          <input
                            id="image-upload"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      </div>

                      {product.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {product.images.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.alt}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              {image.isPrimary && <Badge className="absolute top-2 left-2">Primary</Badge>}
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                {!image.isPrimary && (
                                  <Button size="sm" variant="secondary" onClick={() => handleSetPrimaryImage(image.id)}>
                                    Set Primary
                                  </Button>
                                )}
                                <Button size="sm" variant="destructive" onClick={() => handleRemoveImage(image.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specs">
                <Card>
                  <CardHeader>
                    <CardTitle>Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Specification name"
                          value={newSpec.name}
                          onChange={(e) => setNewSpec((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        <Input
                          placeholder="Value"
                          value={newSpec.value}
                          onChange={(e) => setNewSpec((prev) => ({ ...prev, value: e.target.value }))}
                        />
                        <Button onClick={handleAddSpecification}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {product.specifications.map((spec) => (
                          <div key={spec.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <span className="font-medium">{spec.name}:</span>
                              <span className="ml-2">{spec.value}</span>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveSpecification(spec.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo">
                <Card>
                  <CardHeader>
                    <CardTitle>SEO & Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={product.seoTitle}
                        onChange={(e) => setProduct((prev) => (prev ? { ...prev, seoTitle: e.target.value } : null))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="seoDescription">SEO Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={product.seoDescription}
                        onChange={(e) =>
                          setProduct((prev) => (prev ? { ...prev, seoDescription: e.target.value } : null))
                        }
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        />
                        <Button onClick={handleAddTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {product.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer">
                            {tag}
                            <X className="ml-1 h-3 w-3" onClick={() => handleRemoveTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={product.isActive}
                    onCheckedChange={(checked) => setProduct((prev) => (prev ? { ...prev, isActive: checked } : null))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Switch
                    id="isFeatured"
                    checked={product.isFeatured}
                    onCheckedChange={(checked) =>
                      setProduct((prev) => (prev ? { ...prev, isFeatured: checked } : null))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Product Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm">{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm">{new Date(product.updatedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={product.isActive ? "default" : "secondary"}>
                    {product.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            {aiSuggestions && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm">Pricing</h4>
                    <p className="text-sm text-gray-600">Suggested: ${aiSuggestions.pricing.suggested}</p>
                    <p className="text-xs text-gray-500">{aiSuggestions.pricing.reason}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Recommended Tags</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {aiSuggestions.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">Improvements</h4>
                    <ul className="text-xs text-gray-600 space-y-1 mt-1">
                      {aiSuggestions.improvements.map((improvement: string, index: number) => (
                        <li key={index}>• {improvement}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
