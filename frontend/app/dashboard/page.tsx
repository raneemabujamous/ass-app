"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardContent } from "@/components/dashboard-content"
import { CreateOrderForm } from "@/components/create-order-form"
import { DashboardHeader } from "@/components/dashboard-header"
import { CustomerCreateForm } from "@/components/customer-create-form"
import { ProductCreateForm } from "@/components/product-create-form"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="create-order">Create Order</TabsTrigger>
            <TabsTrigger value="create-customer">Create Customer</TabsTrigger>
            <TabsTrigger value="create-product">Create Product</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardContent />
          </TabsContent>

          <TabsContent value="create-order">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-balance">Create New Order</h2>
              <CreateOrderForm />
            </div>
          </TabsContent>

          <TabsContent value="create-customer">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-balance">Create New Customer</h2>
              <CustomerCreateForm />
            </div>
          </TabsContent>

          <TabsContent value="create-product">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-balance">Create New Product</h2>
              <ProductCreateForm />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
