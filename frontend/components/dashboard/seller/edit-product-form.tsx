'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Plus, Trash2, Eye, Save, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useContentPadding } from '@/contexts/sidebar-context';

interface EditProductFormProps {
  productId: string;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductSpecification {
  id: string;
  name: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  tags: string[];
  stock: number;
  sku: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newSpec, setNewSpec] = useState({ name: '', value: '' });
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockProduct: Product = {
          id: productId,
          name: 'Gold Bullion - 1oz American Eagle',
          description:
            '99.9% pure gold bullion coin from the U.S. Mint. Each coin contains one troy ounce of gold and is backed by the U.S. government for weight, content, and purity. Perfect for investors seeking physical gold exposure.',
          price: 1950.99,
          originalPrice: 2100.0,
          category: 'Precious Metals',
          subcategory: 'Gold',
          images: [
            {
              id: '1',
              url: '/placeholder.svg?height=400&width=400',
              alt: 'Gold bullion front view',
              isPrimary: true,
            },
            {
              id: '2',
              url: '/placeholder.svg?height=400&width=400',
              alt: 'Gold bullion back view',
              isPrimary: false,
            },
            {
              id: '3',
              url: '/placeholder.svg?height=400&width=400',
              alt: 'Gold bullion with certificate',
              isPrimary: false,
            },
          ],
          specifications: [
            { id: '1', name: 'Purity', value: '99.9% Gold' },
            { id: '2', name: 'Weight', value: '1 Troy Ounce' },
            { id: '3', name: 'Diameter', value: '32.7mm' },
            { id: '4', name: 'Mint', value: 'U.S. Mint' },
          ],
          tags: ['gold', 'bullion', 'investment', 'precious-metals'],
          stock: 25,
          sku: 'GOLD-1OZ-AE-2024',
          weight: 0.031,
          dimensions: {
            length: 3.27,
            width: 3.27,
            height: 0.287,
          },
          isActive: true,
          isFeatured: false,
          seoTitle: 'Gold Bullion - 1oz American Eagle | Premium Investment Gold',
          seoDescription:
            'Buy authentic 1oz American Eagle gold bullion coins. 99.9% pure gold backed by the U.S. government. Perfect for gold investment portfolios.',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z',
        };

        setProduct(mockProduct);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        toast({
          title: 'Error',
          description: 'Failed to load product details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  const handleSave = async () => {
    if (!product) return;

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setProduct((prev) => (prev ? { ...prev, updatedAt: new Date().toISOString() } : null));

      toast({
        title: 'Product Updated',
        description: 'Your product has been successfully updated.',
      });

      router.push('/dashboard/seller/inventory');
    } catch (error) {
      console.error('Failed to save product:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to update product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim() || !product) return;

    setProduct((prev) =>
      prev
        ? {
            ...prev,
            tags: [...prev.tags, newTag.trim()],
          }
        : null
    );
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
          }
        : null
    );
  };

  const handleAddSpecification = () => {
    if (!newSpec.name.trim() || !newSpec.value.trim() || !product) return;

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
        : null
    );
    setNewSpec({ name: '', value: '' });
  };

  const handleRemoveSpecification = (specId: string) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            specifications: prev.specifications.filter((spec) => spec.id !== specId),
          }
        : null
    );
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !product) return;

    // Simulate image upload
    const uploadPromises = Array.from(files).map(async (file, index) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        id: Date.now().toString() + index,
        url: '/placeholder.svg?height=400&width=400',
        alt: file.name,
        isPrimary: product.images.length === 0 && index === 0,
      };
    });

    try {
      const newImages = await Promise.all(uploadPromises);
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              images: [...prev.images, ...newImages],
            }
          : null
      );

      toast({
        title: 'Images Uploaded',
        description: `${newImages.length} image(s) uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload images.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setProduct((prev) =>
      prev
        ? {
            ...prev,
            images: prev.images.filter((img) => img.id !== imageId),
          }
        : null
    );
  };

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
        : null
    );
  };

  const getAISuggestions = async () => {
    setLoadingAI(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setAiSuggestions({
        pricing: {
          suggested: 1925.99,
          reason: 'Based on competitor analysis and market trends',
          confidence: 87,
        },
        seo: {
          title: '1oz American Eagle Gold Bullion Coin - Certified Investment Grade Gold',
          description:
            'Invest in authentic American Eagle gold bullion coins. 99.9% pure gold certified by U.S. Mint. Secure packaging, fast shipping, and government authenticity guarantee.',
          keywords: [
            'american eagle gold',
            '1oz gold bullion',
            'investment gold',
            'precious metals',
          ],
        },
        tags: ['certified-gold', 'investment-grade', 'government-backed', 'collectible'],
        improvements: [
          'Add more detailed weight specifications',
          'Include certificate authenticity information',
          'Mention storage and insurance recommendations',
        ],
      });

      toast({
        title: 'AI Suggestions Ready',
        description: 'AI has analyzed your product and generated optimization suggestions.',
      });
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      toast({
        title: 'AI Analysis Failed',
        description: 'Could not generate AI suggestions at this time.',
        variant: 'destructive',
      });
    } finally {
      setLoadingAI(false);
    }
  };

  if (loading) {
    return (
      <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
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
    );
  }

  if (!product) {
    return (
      <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
        <div className="text-center py-12">
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
    );
  }

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Back to Inventory</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="bg-transparent">
            <a href={`/products/${product.id}`} target="_blank" rel="noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </a>
          </Button>
          <Button
            onClick={getAISuggestions}
            disabled={loadingAI}
            variant="outline"
            className="bg-transparent"
          >
            <Zap className="mr-2 h-4 w-4" />
            {loadingAI ? 'Analyzing...' : 'AI Optimize'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* AI Suggestions Alert */}
      {aiSuggestions && (
        <Alert className="mb-6">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            AI suggests pricing at ${aiSuggestions.pricing.suggested} (
            {aiSuggestions.pricing.confidence}% confidence) and recommends adding tags:{' '}
            {aiSuggestions.tags.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="specs" className="hidden lg:flex">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="seo" className="hidden lg:flex">
                SEO & Tags
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={product.name}
                        onChange={(e) =>
                          setProduct((prev) => (prev ? { ...prev, name: e.target.value } : null))
                        }
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={product.sku}
                        onChange={(e) =>
                          setProduct((prev) => (prev ? { ...prev, sku: e.target.value } : null))
                        }
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={product.stock}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev ? { ...prev, stock: Number.parseInt(e.target.value) } : null
                          )
                        }
                        className="text-base"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={product.description}
                      onChange={(e) =>
                        setProduct((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                      rows={4}
                      className="text-base resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={product.category}
                        onValueChange={(value) =>
                          setProduct((prev) => (prev ? { ...prev, category: value } : null))
                        }
                      >
                        <SelectTrigger className="text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Precious Metals">Precious Metals</SelectItem>
                          <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                          <SelectItem value="Agriculture">Agriculture</SelectItem>
                          <SelectItem value="Timber">Timber</SelectItem>
                          <SelectItem value="Industrial Metals">Industrial Metals</SelectItem>
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
                        <SelectTrigger className="text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gold">Gold</SelectItem>
                          <SelectItem value="Silver">Silver</SelectItem>
                          <SelectItem value="Platinum">Platinum</SelectItem>
                          <SelectItem value="Palladium">Palladium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Current Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev ? { ...prev, price: Number.parseFloat(e.target.value) } : null
                          )
                        }
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price ($)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        value={product.originalPrice || ''}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  originalPrice: e.target.value
                                    ? Number.parseFloat(e.target.value)
                                    : undefined,
                                }
                              : null
                          )
                        }
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.001"
                        value={product.weight}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev ? { ...prev, weight: Number.parseFloat(e.target.value) } : null
                          )
                        }
                        className="text-base"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        value={product.dimensions.length}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  dimensions: {
                                    ...prev.dimensions,
                                    length: Number.parseFloat(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        value={product.dimensions.width}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  dimensions: {
                                    ...prev.dimensions,
                                    width: Number.parseFloat(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={product.dimensions.height}
                        onChange={(e) =>
                          setProduct((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  dimensions: {
                                    ...prev.dimensions,
                                    height: Number.parseFloat(e.target.value),
                                  },
                                }
                              : null
                          )
                        }
                        className="text-base"
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
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload images
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            PNG, JPG, WebP up to 10MB each
                          </span>
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
                            <div className="aspect-square relative overflow-hidden rounded-lg border border-border">
                              <Image
                                src={image.url || '/placeholder.svg'}
                                alt={image.alt}
                                fill
                                className="object-cover"
                              />
                              {image.isPrimary && (
                                <Badge className="absolute top-2 left-2">Primary</Badge>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                {!image.isPrimary && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleSetPrimaryImage(image.id)}
                                  >
                                    Set Primary
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRemoveImage(image.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
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

            <TabsContent value="specs">
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="Specification name"
                        value={newSpec.name}
                        onChange={(e) => setNewSpec((prev) => ({ ...prev, name: e.target.value }))}
                        className="text-base"
                      />
                      <Input
                        placeholder="Value"
                        value={newSpec.value}
                        onChange={(e) => setNewSpec((prev) => ({ ...prev, value: e.target.value }))}
                        className="text-base"
                      />
                      <Button onClick={handleAddSpecification}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {product.specifications.map((spec) => (
                        <div
                          key={spec.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <span className="font-medium">{spec.name}:</span>
                            <span className="ml-2">{spec.value}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSpecification(spec.id)}
                          >
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
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={product.seoTitle}
                      onChange={(e) =>
                        setProduct((prev) => (prev ? { ...prev, seoTitle: e.target.value } : null))
                      }
                      className="text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={product.seoDescription}
                      onChange={(e) =>
                        setProduct((prev) =>
                          prev ? { ...prev, seoDescription: e.target.value } : null
                        )
                      }
                      rows={3}
                      className="text-base resize-none"
                    />
                  </div>

                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        className="text-base"
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
                  onCheckedChange={(checked) =>
                    setProduct((prev) => (prev ? { ...prev, isActive: checked } : null))
                  }
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
              <div className="text-xs text-muted-foreground">
                Featured products appear at the top of search results and get 3x more visibility.
              </div>
            </CardContent>
          </Card>

          {/* Product Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Product Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Created</span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{new Date(product.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                  {product.isActive ? 'Active' : 'Inactive'}
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
                  <p className="text-sm text-muted-foreground">
                    Suggested: ${aiSuggestions.pricing.suggested}
                  </p>
                  <p className="text-xs text-muted-foreground">{aiSuggestions.pricing.reason}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() =>
                      setProduct((prev) =>
                        prev ? { ...prev, price: aiSuggestions.pricing.suggested } : null
                      )
                    }
                  >
                    Apply Suggested Price
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Recommended Tags</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiSuggestions.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => {
                          if (!product.tags.includes(tag)) {
                            setProduct((prev) =>
                              prev ? { ...prev, tags: [...prev.tags, tag] } : null
                            );
                          }
                        }}
                      >
                        + {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm">Improvements</h4>
                  <ul className="text-xs text-muted-foreground space-y-1 mt-1">
                    {aiSuggestions.improvements.map((improvement: string, index: number) => (
                      <li key={index}>• {improvement}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Product Preview</CardTitle>
              <CardDescription>How your product will appear to buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {product.images.length > 0 ? (
                    <Image
                      src={
                        product.images.find((img) => img.isPrimary)?.url ||
                        product.images[0].url ||
                        '/placeholder.svg'
                      }
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
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}