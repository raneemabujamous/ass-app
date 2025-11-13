"use client"
import { useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Search, Check, UserPlus } from "lucide-react"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  totalOrders?: number
}

interface CustomerSelectorProps {
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer) => void
}

export function CustomerSelector({ selectedCustomer, onSelectCustomer }: CustomerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)

  const { data: customers } = useSWR<Customer[]>("http://localhost:8081/customer/all", fetcher)

  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      {selectedCustomer ? (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                <p className="font-medium">{selectedCustomer.name}</p>
              </div>
              <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
              {selectedCustomer.phone && <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>}
              <p className="text-xs text-muted-foreground">ID: {selectedCustomer.id}</p>
            </div>
            <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Select Customer</DialogTitle>
                  <DialogDescription>Search for an existing customer</DialogDescription>
                </DialogHeader>
                <CustomerSearchContent
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filteredCustomers={filteredCustomers}
                  onSelectCustomer={(customer) => {
                    onSelectCustomer(customer)
                    setIsSearchDialogOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </Card>
      ) : (
        <div className="flex gap-2">
          <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Search className="mr-2 h-4 w-4" />
                Search Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Select Customer</DialogTitle>
                <DialogDescription>Search for an existing customer</DialogDescription>
              </DialogHeader>
              <CustomerSearchContent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filteredCustomers={filteredCustomers}
                onSelectCustomer={(customer) => {
                  onSelectCustomer(customer)
                  setIsSearchDialogOpen(false)
                }}
              />
            </DialogContent>
          </Dialog>

     
        </div>
      )}
    </div>
  )
}

function CustomerSearchContent({
  searchQuery,
  setSearchQuery,
  filteredCustomers,
  onSelectCustomer,
}: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  filteredCustomers?: Customer[]
  onSelectCustomer: (customer: Customer) => void
}) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredCustomers && filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="p-4 cursor-pointer hover:bg-accent transition-colors"
              onClick={() => onSelectCustomer(customer)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: {customer.id} • {customer.totalOrders || 0} orders
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No customers found</p>
            <Link href="/customers/create">
              <Button variant="link">Create a new customer instead</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
