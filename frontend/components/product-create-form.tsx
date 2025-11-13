"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Variant {
  sku: string
  size: string
  color: string
}

interface ProductVariant {
  product_variant_id: number
  sku: string
  size: string | null
  color: string | null
}

interface Product {
  product_id: number
  sku: string
  name: string
  price: string
  variants: ProductVariant[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ProductCreateForm() {
  const [productSku, setProductSku] = useState("")
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [variants, setVariants] = useState<Variant[]>([{ sku: "", size: "", color: "" }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const { data: products, mutate } = useSWR<Product[]>("http://localhost:8081/products", fetcher)

  const addVariant = () => {
    setVariants([...variants, { sku: "", size: "", color: "" }])
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...variants]
    newVariants[index][field] = value
    setVariants(newVariants)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:8081/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sku: productSku,
          name: productName,
          price: productPrice,
          variants: variants,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create product")
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      })

      setProductSku("")
      setProductName("")
      setProductPrice("")
      setVariants([{ sku: "", size: "", color: "" }])
      mutate()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Enter product details and variants</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productSku">Product SKU</Label>
              <Input
                id="productSku"
                value={productSku}
                onChange={(e) => setProductSku(e.target.value)}
                placeholder="Enter product SKU"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productPrice">Product Price</Label>
              <Input
                id="productPrice"
                type="number"
                step="0.01"
                value={productPrice}
                onChange={(e) => setProductPrice(Number(e.target.value))}
                placeholder="Enter product price"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Variants</Label>
                <Button type="button" onClick={addVariant} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variant
                </Button>
              </div>

              {variants.map((variant, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
              

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`variant-size-${index}`}>Size</Label>
                              <Input
                                id={`variant-size-${index}`}
                                value={variant.size}
                                onChange={(e) => updateVariant(index, "size", e.target.value)}
                                placeholder="e.g., M, L, XL"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`variant-color-${index}`}>Color</Label>
                              <Input
                                id={`variant-color-${index}`}
                                value={variant.color}
                                onChange={(e) => updateVariant(index, "color", e.target.value)}
                                placeholder="e.g., Red, Blue"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {variants.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariant(index)}
                            className="mt-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Products</CardTitle>
          <CardDescription>List of all products and their variants</CardDescription>
        </CardHeader>
        <CardContent>
          {!products ? (
            <div className="text-center py-8 text-muted-foreground">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No products found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) =>
                    product.variants.length > 0 ? (
                      product.variants.map((variant, index) => (
                        <TableRow key={`${product.product_id}-${variant.product_variant_id}`}>
                          {index === 0 && (
                            <>
                              <TableCell className="font-medium" rowSpan={product.variants.length}>
                                {product.product_id}
                              </TableCell>
                              <TableCell rowSpan={product.variants.length}>{product.sku}</TableCell>
                              <TableCell rowSpan={product.variants.length}>{product.name}</TableCell>
                              <TableCell rowSpan={product.variants.length}>${product.price}</TableCell>
                            </>
                          )}
                          <TableCell>{variant.size || "-"}</TableCell>
                          <TableCell>{variant.color || "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key={product.product_id}>
                        <TableCell className="font-medium">{product.product_id}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No variants
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
