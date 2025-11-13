"use client"

import { useState } from "react"
import useSWR from "swr"
import { KpiCards } from "@/components/kpi-cards"
import { RevenueChart } from "@/components/revenue-chart"
import { TopProductsTable } from "@/components/top-products-table"
import { TopCustomersChart } from "@/components/top-customers-chart"
import { DateRangePicker } from "@/components/date-range-picker"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function DashboardContent() {
  const [dateRange, setDateRange] = useState({
    startDate: "2025-11-01",
    endDate: "2025-11-11",
  })

  const { data, error, isLoading } = useSWR(
    `http://localhost:8081/dashboard/summary`,
    fetcher,
    { refreshInterval: 30000 },
  )
  console.log("data::",data)

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          <CardDescription>Failed to fetch dashboard data. Please try again.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Track your business performance and key metrics</p>
        </div>
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
      </div>

      <KpiCards kpis={data.kpis} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart data={data.revenue_over_time} />
        <TopCustomersChart data={data.orders_by_customer} />
      </div>

      <TopProductsTable data={data.top_products} />
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-16 rounded-lg bg-muted/50 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-96 rounded-lg bg-muted/50 animate-pulse" />
        <div className="h-96 rounded-lg bg-muted/50 animate-pulse" />
      </div>
      <div className="h-96 rounded-lg bg-muted/50 animate-pulse" />
    </div>
  )
}
