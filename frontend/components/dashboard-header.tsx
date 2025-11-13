"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Analytics Hub</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/orders/create"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/orders/create" ? "text-foreground" : "text-muted-foreground",
                )}
              >
                Orders
              </Link>
            </nav>
          </div>
          <Button asChild size="sm">
            <Link href="/orders/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Order
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
