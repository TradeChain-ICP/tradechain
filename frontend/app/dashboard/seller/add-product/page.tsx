// app/dashboard/seller/add-product/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, X, Plus, Save, Eye, ImageIcon, Zap, Tag, Package2, Truck } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { useContentPadding } from "@/contexts/sidebar-context"

export default function AddProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { contentPadding } = useContentPadding()
  const [currentStep, setCurrentStep] = useState(0)
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [completionPercentage, setCompletionPercentage] = useState(0)

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

  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([
    { key: "", value: "" }
  ])
  const [newTag, setNewTag] = useState("")

  const steps = [
    { id: 'basic', label: 'Basic Info', icon: Package2, description: 'Product details' },
    { id: 'details', label: 'Specifications', icon: Tag, description: 'Technical specs' },
    { id: 'images', label: 'Images', icon: ImageIcon, description: 'Product photos' },
    { id: 'shipping', label: 'Shipping', icon: Truck, description: 'Delivery options' },
  ]

  // Calculate completion percentage based on filled fields
  const updateCompletionPercentage = () => {
    const requiredFields = ['name', 'description', 'category', 'price', 'unit']
    const filledRequired = requiredFields.filter(field => productData[field as keyof typeof productData]).length
    const hasImages = images.length > 0
    const percentage = Math.round(((filledRequired / requiredFields.length) * 70) + (hasImages ? 30 : 0))
    setCompletionPercentage(percentage)
  }

  // Demo image upload simulation
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsLoading(true)
    
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create demo images with unique identifiers
      const newImages = Array.from(files).map((file, index) => 
        `/placeholder.svg?height=400&width=400&text=Product+Image+${images.length + index + 1}`
      )
      
      setImages(prev => [...prev, ...newImages].slice(0, 10)) // Max 10 images
      
      toast({
        title: "Images Uploaded",
        description: `${newImages.length} image(s) uploaded successfully`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const addSpecification = () => {
    setSpecifications(prev => [...prev, { key: "", value: "" }])
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    setSpecifications(prev => 
      prev.map((spec, i) => i === index ? { ...spec, [field]: value } : spec)
    )
  }

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(prev => prev.filter((_, i) => i !== index))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setProductData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSave = async (asDraft = false) => {
    // Validation
    if (!asDraft) {
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
    }

    setIsLoading(true)
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: asDraft ? "Draft Saved" : "Product Listed",
        description: asDraft
          ? "Your product has been saved as a draft."
          : "Your product has been successfully listed on the marketplace.",
      })

      // Navigate back to inventory
      setTimeout(() => {
        router.push("/dashboard/seller/inventory")
      }, 1500)
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreview = () => {
    toast({
      title: "Preview Mode",
      description: "Opening product preview...",
    })
  }

  // Update completion percentage when product data changes
  useState(() => {
    updateCompletionPercentage()
  })

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">Create a new listing for your commodity</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handlePreview} 
              className="bg-transparent order-2 sm:order-1"
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSave(true)} 
              className="bg-transparent order-3 sm:order-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSave(false)} 
              disabled={isLoading}
              className="order-1 sm:order-3"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Publishing...
                </>
              ) : (
                "Publish Product"
              )}
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Form */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
              {steps.map((step) => (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id} 
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <step.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{step.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package2 className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Essential details about your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Gold Bullion - 1oz American Eagle"
                      value={productData.name}
                      onChange={(e) => {
                        setProductData(prev => ({ ...prev, name: e.target.value }))
                        updateCompletionPercentage()
                      }}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of your product, including key features and benefits..."
                      rows={4}
                      value={productData.description}
                      onChange={(e) => {
                        setProductData(prev => ({ ...prev, description: e.target.value }))
                        updateCompletionPercentage()
                      }}
                      className="text-base resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={productData.category}
                        onValueChange={(value) => {
                          setProductData(prev => ({ ...prev, category: value, subcategory: "" }))
                          updateCompletionPercentage()
                        }}
                      >
                        <SelectTrigger className="text-base">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="precious-metals">Precious Metals</SelectItem>
                          <SelectItem value="oil-gas">Oil & Gas</SelectItem>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="timber">Timber</SelectItem>
                          <SelectItem value="industrial-metals">Industrial Metals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select
                        value={productData.subcategory}
                        onValueChange={(value) => setProductData(prev => ({ ...prev, subcategory: value }))}
                        disabled={!productData.category}
                      >
                        <SelectTrigger className="text-base">
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
                          {productData.category === "oil-gas" && (
                            <>
                              <SelectItem value="crude-oil">Crude Oil</SelectItem>
                              <SelectItem value="natural-gas">Natural Gas</SelectItem>
                              <SelectItem value="refined-products">Refined Products</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={productData.price}
                        onChange={(e) => {
                          setProductData(prev => ({ ...prev, price: e.target.value }))
                          updateCompletionPercentage()
                        }}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit *</Label>
                      <Select
                        value={productData.unit}
                        onValueChange={(value) => {
                          setProductData(prev => ({ ...prev, unit: value }))
                          updateCompletionPercentage()
                        }}
                      >
                        <SelectTrigger className="text-base">
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
                        onChange={(e) => setProductData(prev => ({ ...prev, stock: e.target.value }))}
                        className="text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minOrder">Minimum Order</Label>
                      <Input
                        id="minOrder"
                        type="number"
                        placeholder="1"
                        value={productData.minOrder}
                        onChange={(e) => setProductData(prev => ({ ...prev, minOrder: e.target.value }))}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxOrder">Maximum Order</Label>
                      <Input
                        id="maxOrder"
                        type="number"
                        placeholder="100"
                        value={productData.maxOrder}
                        onChange={(e) => setProductData(prev => ({ ...prev, maxOrder: e.target.value }))}
                        className="text-base"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Product Specifications
                  </CardTitle>
                  <CardDescription>Additional specifications and certifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        placeholder="e.g., GOLD-1OZ-AE-2024"
                        value={productData.sku}
                        onChange={(e) => setProductData(prev => ({ ...prev, sku: e.target.value }))}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="origin">Origin/Source</Label>
                      <Input
                        id="origin"
                        placeholder="e.g., U.S. Mint, Canada"
                        value={productData.origin}
                        onChange={(e) => setProductData(prev => ({ ...prev, origin: e.target.value }))}
                        className="text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="purity">Purity/Grade</Label>
                      <Input
                        id="purity"
                        placeholder="e.g., 99.9%, Grade A"
                        value={productData.purity}
                        onChange={(e) => setProductData(prev => ({ ...prev, purity: e.target.value }))}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="certification">Certification</Label>
                      <Input
                        id="certification"
                        placeholder="e.g., LBMA, COMEX"
                        value={productData.certification}
                        onChange={(e) => setProductData(prev => ({ ...prev, certification: e.target.value }))}
                        className="text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        placeholder="e.g., 1 troy oz, 10 kg"
                        value={productData.weight}
                        onChange={(e) => setProductData(prev => ({ ...prev, weight: e.target.value }))}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        placeholder="e.g., 32.7mm x 2.87mm"
                        value={productData.dimensions}
                        onChange={(e) => setProductData(prev => ({ ...prev, dimensions: e.target.value }))}
                        className="text-base"
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
                        Add Spec
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {specifications.map((spec, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <Input
                            placeholder="Property name"
                            value={spec.key}
                            onChange={(e) => updateSpecification(index, "key", e.target.value)}
                            className="text-base"
                          />
                          <Input
                            placeholder="Value"
                            value={spec.value}
                            onChange={(e) => updateSpecification(index, "value", e.target.value)}
                            className="text-base"
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeSpecification(index)}
                            className="self-center sm:self-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label>Product Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {productData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                        className="text-base"
                      />
                      <Button onClick={addTag} variant="outline" className="bg-transparent">
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Product Images
                  </CardTitle>
                  <CardDescription>Upload high-quality images of your product (max 10 images)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Upload Area */}
                    <div className="relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-colors">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Upload Product Images</h3>
                          <p className="text-sm text-muted-foreground">
                            Drag and drop your images here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports: JPG, PNG, WebP (max 5MB each)
                          </p>
                        </div>
                        <Button variant="outline" className="bg-transparent" disabled={isLoading}>
                          {isLoading ? "Uploading..." : "Choose Files"}
                        </Button>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Image Preview Grid */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square relative overflow-hidden rounded-lg border border-border hover:border-primary/50 transition-colors">
                              <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              {index === 0 && (
                                <Badge className="absolute top-2 left-2 text-xs">Main</Badge>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                                onClick={() => removeImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground space-y-1">
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
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>Configure shipping options and policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingWeight">Shipping Weight</Label>
                      <Input
                        id="shippingWeight"
                        placeholder="e.g., 2.5 lbs"
                        value={productData.shippingWeight}
                        onChange={(e) => setProductData(prev => ({ ...prev, shippingWeight: e.target.value }))}
                        className="text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shippingDimensions">Package Dimensions</Label>
                      <Input
                        id="shippingDimensions"
                        placeholder="e.g., 10x8x2 inches"
                        value={productData.shippingDimensions}
                        onChange={(e) => setProductData(prev => ({ ...prev, shippingDimensions: e.target.value }))}
                        className="text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingTime">Processing Time</Label>
                    <Select
                      value={productData.processingTime}
                      onValueChange={(value) => setProductData(prev => ({ ...prev, processingTime: value }))}
                    >
                      <SelectTrigger className="text-base">
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

                  <div className="space-y-3">
                    <Label>Shipping Options</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {["Standard Shipping", "Express Shipping", "Overnight Shipping", "International Shipping"].map(
                        (option) => (
                          <div key={option} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Checkbox
                              id={option}
                              checked={productData.shippingOptions.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setProductData(prev => ({
                                    ...prev,
                                    shippingOptions: [...prev.shippingOptions, option]
                                  }))
                                } else {
                                  setProductData(prev => ({
                                    ...prev,
                                    shippingOptions: prev.shippingOptions.filter((o) => o !== option)
                                  }))
                                }
                              }}
                            />
                            <Label htmlFor={option} className="cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        )
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
                      onChange={(e) => setProductData(prev => ({ ...prev, returnPolicy: e.target.value }))}
                      className="text-base resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty Information</Label>
                    <Textarea
                      id="warranty"
                      placeholder="Describe warranty terms..."
                      rows={2}
                      value={productData.warranty}
                      onChange={(e) => setProductData(prev => ({ ...prev, warranty: e.target.value }))}
                      className="text-base resize-none"
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
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Pricing Assistant
              </CardTitle>
              <CardDescription>Get intelligent pricing recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <h4 className="font-medium text-blue-900 text-sm">Market Analysis</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Similar gold products are priced between $1,920 - $1,980 per oz
                </p>
              </div>

              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <h4 className="font-medium text-green-900 text-sm">Recommended Price</h4>
                </div>
                <p className="text-sm text-green-700">$1,950 per oz (optimal for sales volume)</p>
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
              <CardDescription>Additional listing features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="featured" />
                <Label htmlFor="featured" className="text-sm">Feature this product (+$10)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="urgent" />
                <Label htmlFor="urgent" className="text-sm">Mark as urgent sale</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="bulk" />
                <Label htmlFor="bulk" className="text-sm">Enable bulk pricing</Label>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Featured listings get 3x more visibility and appear at the top of search results.
                </p>
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
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <Image
                      src={images[0]}
                      alt="Product preview"
                      width={200}
                      height={200}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground p-4">
                      <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No image uploaded</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium line-clamp-2">
                    {productData.name || "Product Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {productData.description || "Product description will appear here..."}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">
                        ${productData.price || "0.00"}
                      </span>
                      {productData.unit && (
                        <span className="text-sm text-muted-foreground ml-1">
                          {productData.unit}
                        </span>
                      )}
                    </div>
                    {productData.category && (
                      <Badge variant="secondary" className="text-xs">
                        {productData.category.replace('-', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Images</span>
                <span className="font-medium">{images.length}/10</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tags</span>
                <span className="font-medium">{productData.tags.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Specifications</span>
                <span className="font-medium">{specifications.filter(s => s.key && s.value).length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}