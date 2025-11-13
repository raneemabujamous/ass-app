"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Package, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { CustomerSelector } from "@/components/customer-selector"
import { ProductBrowser } from "@/components/product-browser"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductVariant {
  product_variant_id: number
  product_id: number
  size: string | null
  color: string | null
  [k: string]: any
}

interface OrderItem {
  id: string
  productId: number
  variantId: number
  productName: string
  quantity: number
  price: number
  discount: string
  taxRate: string
  color?: string
  size?: string
  variants?: ProductVariant[]
}

export function CreateOrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const updateOrderItem = (id: string, field: keyof OrderItem, value: any) => {
    setOrderItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price
      const discount = Number.parseFloat(item.discount) || 0
      const taxRate = Number.parseFloat(item.taxRate) || 0
      return sum + (itemTotal - discount) * (1 + taxRate)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedCustomer) {
      toast({
        title: "Customer Required",
        description: "Please select or create a customer first.",
        variant: "destructive",
      })
      return
    }

    if (orderItems.length === 0) {
      toast({
        title: "Items Required",
        description: "Please add at least one product to the order.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const orderData = {
      customerId: selectedCustomer.id,
      items: orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        discount: item.discount,
        taxRate: item.taxRate,
        variantId: item.variantId,
        color: item.color,
        size: item.size,
      })),
      currency: "USD",
    }

    try {
      const response = await fetch("http://localhost:8081/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create order")
      }

      toast({
        title: "Order Created",
        description: `Order for ${selectedCustomer.name} has been successfully created.`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // helper: extract unique non-null colors from variants
  const getColors = (item: OrderItem) =>
    Array.from(new Set((item.variants || []).map((v) => v.color).filter(Boolean)))

  // helper: extract unique non-null sizes from variants
  const getSizes = (item: OrderItem) =>
    Array.from(new Set((item.variants || []).map((v) => v.size).filter(Boolean)))

  // helper: sizes available for selected color (if color selected)
  const getSizesForColor = (item: OrderItem, color?: string) =>
    color
      ? Array.from(
          new Set(
            (item.variants || [])
              .filter((v) => v.color === color)
              .map((v) => v.size)
              .filter(Boolean)
          )
        )
      : getSizes(item)

  // helper: colors available for selected size (if size selected)
  const getColorsForSize = (item: OrderItem, size?: string) =>
    size
      ? Array.from(
          new Set(
            (item.variants || [])
              .filter((v) => v.size === size)
              .map((v) => v.color)
              .filter(Boolean)
          )
        )
      : getColors(item)

  // find variant id by size + color (either may be undefined/null)
  const findVariantId = (item: OrderItem, color?: string, size?: string) => {
    const match = (item.variants || []).find((v) => {
      // treat undefined/empty as wildcard (i.e., only match non-null values when provided)
      const colorMatches = color ? v.color === color : true
      const sizeMatches = size ? v.size === size : true
      return colorMatches && sizeMatches
    })
    return match ? match.product_variant_id : 0
  }

  const handleAddProduct = (product: any) => {
    // Map incoming variants to our ProductVariant shape (product_variant_id etc.)
    const variants: ProductVariant[] = (product.variants || []).map((v: any) => ({
      product_variant_id: v.product_variant_id ?? v.id ?? 0,
      product_id: v.product_id ?? product.id,
      size: v.size ?? null,
      color: v.color ?? null,
      ...v,
    }))

    // default selection: if exactly one variant, preselect it
    const defaultVariant = variants.length === 1 ? variants[0] : undefined

    setOrderItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        productId: product.id,
        variantId: defaultVariant ? defaultVariant.product_variant_id : (variants[0]?.product_variant_id || 0),
        productName: product.name,
        quantity: 1,
        price: Number(product.price) || 0,
        discount: "0",
        taxRate: "0.1",
        color: defaultVariant ? defaultVariant.color || "" : "",
        size: defaultVariant ? defaultVariant.size || "" : "",
        variants,
      },
    ])

    toast({
      title: "Product Added",
      description: `${product.name} has been added to the order.`,
    })
  }

  // when user picks color for item
  const onColorChange = (item: OrderItem, color: string) => {
    // compute size options for this color, clear size if it's not valid
    const sizesForColor = getSizesForColor(item, color)
    const newSize = sizesForColor.length === 1 ? sizesForColor[0] : item.size // keep existing if still valid
    const variantId = findVariantId(item, color, newSize)
    updateOrderItem(item.id, "color", color)
    updateOrderItem(item.id, "size", newSize || "")
    updateOrderItem(item.id, "variantId", variantId)
  }

  // when user picks size for item
  const onSizeChange = (item: OrderItem, size: string) => {
    const colorsForSize = getColorsForSize(item, size)
    const newColor = colorsForSize.length === 1 ? colorsForSize[0] : item.color
    const variantId = findVariantId(item, newColor, size)
    updateOrderItem(item.id, "size", size)
    updateOrderItem(item.id, "color", newColor || "")
    updateOrderItem(item.id, "variantId", variantId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Customer Section */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Select an existing customer or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerSelector selectedCustomer={selectedCustomer} onSelectCustomer={setSelectedCustomer} />
          </CardContent>
        </Card>

        {/* Product Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4 w-full">
              <div>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>Browse products and add them to the order</CardDescription>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Package className="mr-2 h-4 w-4" />
                      Browse Products
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Browse Products</DialogTitle>
                      <DialogDescription>Select products to add to the order</DialogDescription>
                    </DialogHeader>
                    <ProductBrowser onAddProduct={handleAddProduct} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {orderItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items added yet. Browse products or add manually.</p>
              </div>
            ) : (
              <>
                {orderItems.map((item) => {
                  const colors = getColors(item)
                  const sizes = getSizes(item)
                  const sizesForSelectedColor = getSizesForColor(item, item.color)
                  const colorsForSelectedSize = getColorsForSize(item, item.size)

                  return (
                    <div key={item.id} className="grid gap-4 p-4 border rounded-lg md:grid-cols-12 items-end">
                      {/* Product Name */}
                      <div className="space-y-2 md:col-span-3">
                        <Label>Product</Label>
                        <p className="p-2 border rounded-lg bg-muted">{item.productName}</p>
                      </div>

                      {/* Color Dropdown */}
                      <div className="space-y-2 md:col-span-3">
                        <Label>Color</Label>
                        {colors.length > 0 ? (
                          <select
                            className="w-full p-2 border rounded-lg"
                            value={item.color || ""}
                            onChange={(e) => onColorChange(item, e.target.value)}
                          >
                            <option value="">Select color</option>
                            {colors.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        ) : (
                          // there are no color values in variants
                          <p className="text-xs text-muted-foreground">No color variants</p>
                        )}
                      </div>

                      {/* Size Dropdown */}
                      <div className="space-y-2 md:col-span-3">
                        <Label>Size</Label>
                        {sizes.length > 0 ? (
                          <select
                            className="w-full p-2 border rounded-lg"
                            value={item.size || ""}
                            onChange={(e) => onSizeChange(item, e.target.value)}
                          >
                            <option value="">Select size</option>
                            {/* If a color is selected, show sizes for that color; otherwise show all sizes */}
                            {(item.color ? sizesForSelectedColor : sizes).map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-xs text-muted-foreground">No size variants</p>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="space-y-2 md:col-span-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateOrderItem(item.id, "quantity", Number(e.target.value) || 1)
                          }
                        />
                      </div>

                      {/* Remove Item */}
                      <div className="md:col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOrderItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                <div className="flex justify-end pt-4 border-t">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Amount (with tax)</p>
                    <p className="text-2xl font-bold">${calculateTotal().toFixed(2)}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
            <CardDescription>Optional notes for this order</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea name="notes" placeholder="Enter any special instructions..." rows={4} />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Order
          </Button>
        </div>
      </div>
    </form>
  )
}
