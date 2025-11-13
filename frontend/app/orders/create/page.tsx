import { CreateOrderForm } from "@/components/create-order-form"
import { DashboardHeader } from "@/components/dashboard-header"

export const metadata = {
  title: "Create Order",
  description: "Create a new order",
}

export default function CreateOrderPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-balance">Create New Order</h1>
          <CreateOrderForm />
        </div>
      </main>
    </div>
  )
}
