"use client"
import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, Plus, Package } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ProductVariant {
  product_variant_id: number
  product_id: number
  size: string | null
  color: string | null
  __entity: string
}

interface Product {
  id: number
  sku: string
  name: string
  price: string
  variants: ProductVariant[]
  __entity: string
}

interface ProductBrowserProps {
  onAddProduct: (product: Product) => void
}

export function ProductBrowser({ onAddProduct }: ProductBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const { data: products } = useSWR<Product[]>("http://localhost:8081/products", fetcher)

  const filteredProducts = (products || []).filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/products/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-3 max-h-[500px] overflow-y-auto md:grid-cols-2">
        {filteredProducts && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                  <p className="text-sm font-medium text-primary">${product.price}</p>
                  {product.variants.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{product.variants.length} variant(s)</p>
                  )}
                  <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                </div>
                <Button size="sm" onClick={() => onAddProduct(product)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
