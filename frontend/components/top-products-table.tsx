import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface TopProductsTableProps {
  data: {
    rows: Array<{
      id: string
      name: string
      value: number
      count: number
    }>
  }
}

export function TopProductsTable({ data }: TopProductsTableProps) {
  console.log("dataTopProductsTable:",data)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Best performing products by revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rank</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead className="text-right">Orders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">{item.id}</TableCell>
                {/* <TableCell className="text-right font-medium">
                  ${item.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell> */}Top Products

                <TableCell className="text-right">{item.value?.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.count.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
