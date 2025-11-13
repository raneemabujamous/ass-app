"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Variant {
  id: string
  sku: string
  size: string
  color: string
}

export default function CreateProductPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([{ id: Date.now().toString(), sku: "", size: "", color: "" }])
  const { toast } = useToast()
  const router = useRouter()

  const addVariant = () => {
    setVariants([...variants, { id: Date.now().toString(), sku: "", size: "", color: "" }])
  }

  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter((v) => v.id !== id))
    }
  }

  const updateVariant = (id: string, field: keyof Variant, value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("http://localhost:8081/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          sku: formData.get("sku") as string,
          name: formData.get("name") as string,
          variants: variants.map((v) => ({
            sku: v.sku,
            size: v.size,
            color: v.color,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create product")
      }

      toast({
        title: "Product Created",
        description: "Product has been successfully added to the catalog.",
      })

      router.push("/orders/create")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Link href="/orders/create">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Create Order
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
          <CardDescription>Add a new product with variants to the catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sku">Product SKU</Label>
              <Input id="sku" name="sku" placeholder="PROD-001" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" placeholder="Product Name" required />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Product Variants</h3>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Variant
                </Button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      {variants.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(variant.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`variant-sku-${variant.id}`}>Variant SKU</Label>
                      <Input
                        id={`variant-sku-${variant.id}`}
                        placeholder="VAR-001"
                        value={variant.sku}
                        onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`size-${variant.id}`}>Size</Label>
                        <Input
                          id={`size-${variant.id}`}
                          placeholder="M, L, XL"
                          value={variant.size}
                          onChange={(e) => updateVariant(variant.id, "size", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`color-${variant.id}`}>Color</Label>
                        <Input
                          id={`color-${variant.id}`}
                          placeholder="Red, Blue, Green"
                          value={variant.color}
                          onChange={(e) => updateVariant(variant.id, "color", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/orders/create")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
