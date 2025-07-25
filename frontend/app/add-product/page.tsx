"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Plus, Save, Eye } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<string[]>([])
  const [isDraft, setIsDraft] = useState(false)

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    unit: "",
    minOrder: "",
    maxOrder: "",
    stock: "",
    sku: "",
    weight: "",
    dimensions: "",
    origin: "",
    purity: "",
    certification: "",
    tags: [] as string[],
    shippingWeight: "",
    shippingDimensions: "",
    processingTime: "",
    shippingOptions: [] as string[],
    returnPolicy: "",
    warranty: "",
  })

  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([{ key: "", value: "" }])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      // In a real app, you would upload these files to a server
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 10)) // Max 10 images
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }])
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    setSpecifications((prev) => prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)))
  }

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = (tag: string) => {
    if (tag && !productData.tags.includes(tag)) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
  }

  const removeTag = (tag: string) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleSave = (asDraft = false) => {
    // Validation
    if (!productData.name || !productData.description || !productData.category || !productData.price) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one product image.",
        variant: "destructive",
      })
      return
    }

    setIsDraft(asDraft)

    toast({
      title: asDraft ? "Draft Saved" : "Product Listed",
      description: asDraft
        ? "Your product has been saved as a draft."
        : "Your product has been successfully listed on the marketplace.",
    })

    // In a real app, you would send this data to your backend
    setTimeout(() => {
      router.push("/inventory")
    }, 1500)
  }

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Opening product preview...",
    })
  }

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">Create a new listing for your commodity</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePreview} className="bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={() => handleSave(true)} className="bg-transparent">
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave(false)}>Publish Product</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Essential details about your product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Gold Bullion - 1oz American Eagle"
                        value={productData.name}
                        onChange={(e) => setProductData((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Detailed description of your product..."
                        rows={4}
                        value={productData.description}
                        onChange={(e) => setProductData((prev) => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={productData.category}
                          onValueChange={(value) => setProductData((prev) => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="precious-metals">Precious Metals</SelectItem>
                            <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                            <SelectItem value="agriculture">Agriculture</SelectItem>
                            <SelectItem value="timber">Timber</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select
                          value={productData.subcategory}
                          onValueChange={(value) => setProductData((prev) => ({ ...prev, subcategory: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {productData.category === "precious-metals" && (
                              <>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="silver">Silver</SelectItem>
                                <SelectItem value="platinum">Platinum</SelectItem>
                                <SelectItem value="palladium">Palladium</SelectItem>
                              </>
                            )}
                            {productData.category === "agriculture" && (
                              <>
                                <SelectItem value="grains">Grains</SelectItem>
                                <SelectItem value="coffee">Coffee</SelectItem>
                                <SelectItem value="sugar">Sugar</SelectItem>
                                <SelectItem value="livestock">Livestock</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="0.00"
                          value={productData.price}
                          onChange={(e) => setProductData((prev) => ({ ...prev, price: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit *</Label>
                        <Select
                          value={productData.unit}
                          onValueChange={(value) => setProductData((prev) => ({ ...prev, unit: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="oz">per oz</SelectItem>
                            <SelectItem value="gram">per gram</SelectItem>
                            <SelectItem value="kg">per kg</SelectItem>
                            <SelectItem value="ton">per ton</SelectItem>
                            <SelectItem value="barrel">per barrel</SelectItem>
                            <SelectItem value="bushel">per bushel</SelectItem>
                            <SelectItem value="board-ft">per board ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          placeholder="0"
                          value={productData.stock}
                          onChange={(e) => setProductData((prev) => ({ ...prev, stock: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minOrder">Minimum Order</Label>
                        <Input
                          id="minOrder"
                          type="number"
                          placeholder="1"
                          value={productData.minOrder}
                          onChange={(e) => setProductData((prev) => ({ ...prev, minOrder: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maxOrder">Maximum Order</Label>
                        <Input
                          id="maxOrder"
                          type="number"
                          placeholder="100"
                          value={productData.maxOrder}
                          onChange={(e) => setProductData((prev) => ({ ...prev, maxOrder: e.target.value }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Additional specifications and certifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          placeholder="e.g., GOLD-1OZ-AE-2024"
                          value={productData.sku}
                          onChange={(e) => setProductData((prev) => ({ ...prev, sku: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin/Source</Label>
                        <Input
                          id="origin"
                          placeholder="e.g., U.S. Mint, Canada"
                          value={productData.origin}
                          onChange={(e) => setProductData((prev) => ({ ...prev, origin: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="purity">Purity/Grade</Label>
                        <Input
                          id="purity"
                          placeholder="e.g., 99.9%, Grade A"
                          value={productData.purity}
                          onChange={(e) => setProductData((prev) => ({ ...prev, purity: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="certification">Certification</Label>
                        <Input
                          id="certification"
                          placeholder="e.g., LBMA, COMEX"
                          value={productData.certification}
                          onChange={(e) => setProductData((prev) => ({ ...prev, certification: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          placeholder="e.g., 1 troy oz, 10 kg"
                          value={productData.weight}
                          onChange={(e) => setProductData((prev) => ({ ...prev, weight: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dimensions">Dimensions</Label>
                        <Input
                          id="dimensions"
                          placeholder="e.g., 32.7mm x 2.87mm"
                          value={productData.dimensions}
                          onChange={(e) => setProductData((prev) => ({ ...prev, dimensions: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Custom Specifications */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Custom Specifications</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSpecification}
                          className="bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Specification
                        </Button>
                      </div>

                      {specifications.map((spec, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            placeholder="Property name"
                            value={spec.key}
                            onChange={(e) => updateSpecification(index, "key", e.target.value)}
                          />
                          <Input
                            placeholder="Value"
                            value={spec.value}
                            onChange={(e) => updateSpecification(index, "value", e.target.value)}
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecification(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {productData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add tags (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag(e.currentTarget.value)
                            e.currentTarget.value = ""
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>Upload high-quality images of your product (max 10 images)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Upload Product Images</h3>
                          <p className="text-sm text-muted-foreground">
                            Drag and drop your images here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">Supports: JPG, PNG, WebP (max 5MB each)</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* Image Preview Grid */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square relative overflow-hidden rounded-lg border">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`Product image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                                {index === 0 && <Badge className="absolute top-2 left-2">Main</Badge>}
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        <p>• First image will be used as the main product image</p>
                        <p>• Use high-resolution images for best results</p>
                        <p>• Show your product from multiple angles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>Configure shipping options and policies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingWeight">Shipping Weight</Label>
                        <Input
                          id="shippingWeight"
                          placeholder="e.g., 2.5 lbs"
                          value={productData.shippingWeight}
                          onChange={(e) => setProductData((prev) => ({ ...prev, shippingWeight: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="shippingDimensions">Package Dimensions</Label>
                        <Input
                          id="shippingDimensions"
                          placeholder="e.g., 10x8x2 inches"
                          value={productData.shippingDimensions}
                          onChange={(e) => setProductData((prev) => ({ ...prev, shippingDimensions: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="processingTime">Processing Time</Label>
                      <Select
                        value={productData.processingTime}
                        onValueChange={(value) => setProductData((prev) => ({ ...prev, processingTime: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select processing time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2-days">1-2 business days</SelectItem>
                          <SelectItem value="3-5-days">3-5 business days</SelectItem>
                          <SelectItem value="1-week">1 week</SelectItem>
                          <SelectItem value="2-weeks">2 weeks</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Shipping Options</Label>
                      <div className="space-y-2">
                        {["Standard Shipping", "Express Shipping", "Overnight Shipping", "International Shipping"].map(
                          (option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={option}
                                checked={productData.shippingOptions.includes(option)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setProductData((prev) => ({
                                      ...prev,
                                      shippingOptions: [...prev.shippingOptions, option],
                                    }))
                                  } else {
                                    setProductData((prev) => ({
                                      ...prev,
                                      shippingOptions: prev.shippingOptions.filter((o) => o !== option),
                                    }))
                                  }
                                }}
                              />
                              <Label htmlFor={option}>{option}</Label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="returnPolicy">Return Policy</Label>
                      <Textarea
                        id="returnPolicy"
                        placeholder="Describe your return policy..."
                        rows={3}
                        value={productData.returnPolicy}
                        onChange={(e) => setProductData((prev) => ({ ...prev, returnPolicy: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty Information</Label>
                      <Textarea
                        id="warranty"
                        placeholder="Describe warranty terms..."
                        rows={2}
                        value={productData.warranty}
                        onChange={(e) => setProductData((prev) => ({ ...prev, warranty: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Pricing Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle>AI Pricing Assistant</CardTitle>
                <CardDescription>Get intelligent pricing recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="font-medium text-blue-900">Market Analysis</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Similar gold products are priced between $1,920 - $1,980 per oz
                  </p>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="font-medium text-green-900">Recommended Price</h4>
                  <p className="text-sm text-green-700 mt-1">$1,950 per oz (optimal for sales volume)</p>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Apply Suggested Price
                </Button>
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="featured" />
                  <Label htmlFor="featured">Feature this product (+$10)</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="urgent" />
                  <Label htmlFor="urgent">Mark as urgent sale</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="bulk" />
                  <Label htmlFor="bulk">Enable bulk pricing</Label>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Product Preview</CardTitle>
                <CardDescription>How your product will appear to buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    {images.length > 0 ? (
                      <Image
                        src={images[0] || "/placeholder.svg"}
                        alt="Product preview"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium">{productData.name || "Product Name"}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {productData.description || "Product description will appear here..."}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold">
                        ${productData.price || "0.00"} {productData.unit && `${productData.unit}`}
                      </span>
                      {productData.category && <Badge variant="secondary">{productData.category}</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
