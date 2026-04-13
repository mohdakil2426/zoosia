import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingCart, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalyticsView() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sales")
      .then(res => res.json())
      .then(data => {
        setSalesData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading deep analytics...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Comprehensive performance tracking and forecasting.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Retention Rate", value: "68%", icon: Users, color: "text-blue-500" },
          { title: "Conversion", value: "3.2%", icon: Activity, color: "text-emerald-500" },
          { title: "Churn Rate", value: "2.4%", icon: TrendingUp, color: "text-rose-500" },
          { title: "AOV", value: "$42.50", icon: ShoppingCart, color: "text-amber-500" },
        ].map((item, i) => (
          <Card key={i} className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {item.title}
              </CardTitle>
              <item.icon className={cn("h-4 w-4", item.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New vs returning customers over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))"
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorNew)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Revenue Forecasting</CardTitle>
            <CardDescription>Predicted revenue based on historical trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))"
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-chart-2)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-chart-2)" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
