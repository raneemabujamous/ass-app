import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react"

interface KpiCardsProps {
  kpis: {
    total_revenue: number
    total_orders: number
    average_order_value: number
  }
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: `$${kpis.total_revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-chart-1",
    },
    {
      title: "Total Orders",
      value: kpis.total_orders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-chart-2",
    },
    {
      title: "Avg Order Value",
      value: `$${kpis.average_order_value?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "text-chart-3",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
          <div className={`absolute bottom-0 left-0 h-1 w-full ${card.color.replace("text-", "bg-")}`} />
        </Card>
      ))}
    </div>
  )
}
