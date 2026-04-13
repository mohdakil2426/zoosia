import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  growth: string;
}

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>
          Best performing products by sales volume.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="min-w-[150px]">Product</TableHead>
                <TableHead className="min-w-[100px]">Category</TableHead>
                <TableHead className="text-right min-w-[80px]">Sales</TableHead>
                <TableHead className="text-right min-w-[100px]">Revenue</TableHead>
                <TableHead className="text-right min-w-[80px]">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-border hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{product.sales.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${(product.revenue / 1000).toFixed(1)}k</TableCell>
                  <TableCell className="text-right">
                    <span className={product.growth.startsWith("+") ? "text-emerald-500" : "text-rose-500"}>
                      {product.growth}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
