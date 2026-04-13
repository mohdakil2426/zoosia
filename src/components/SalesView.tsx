import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target, Zap } from "lucide-react";

const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'];

interface SalesViewProps {
  initialSales: any[];
}

export function SalesView({ initialSales }: SalesViewProps) {
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [salesData, setSalesData] = useState<any[]>(initialSales);
  const [loading, setLoading] = useState(false);

  const dailyData = [
    { name: "Mon", revenue: 420, orders: 12 },
    { name: "Tue", revenue: 380, orders: 10 },
    { name: "Wed", revenue: 510, orders: 15 },
    { name: "Thu", revenue: 460, orders: 13 },
    { name: "Fri", revenue: 620, orders: 18 },
    { name: "Sat", revenue: 850, orders: 25 },
    { name: "Sun", revenue: 740, orders: 22 },
  ];

  const weeklyData = [
    { name: "Week 1", revenue: 2800, orders: 85 },
    { name: "Week 2", revenue: 3200, orders: 98 },
    { name: "Week 3", revenue: 2900, orders: 90 },
    { name: "Week 4", revenue: 3500, orders: 110 },
  ];

  useEffect(() => {
    if (timeRange === "monthly") {
      setSalesData(initialSales);
    } else if (timeRange === "weekly") {
      setSalesData(weeklyData);
    } else {
      setSalesData(dailyData);
    }
  }, [timeRange, initialSales]);

  const categoryData = [
    { name: "Electronics", value: 45 },
    { name: "Apparel", value: 25 },
    { name: "Home", value: 20 },
    { name: "Other", value: 10 },
  ];

  const getStats = () => {
    switch (timeRange) {
      case "daily":
        return { goal: "$2,000", progress: 65, conversion: "2.8%", profit: "$1,240" };
      case "weekly":
        return { goal: "$12,000", progress: 78, conversion: "3.1%", profit: "$4,850" };
      default:
        return { goal: "$50,000", progress: 84, conversion: "3.24%", profit: "$12,840" };
    }
  };

  const stats = getStats();

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading sales analytics...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Deep dive into your store's revenue performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border self-start sm:self-auto">
          {(["daily", "weekly", "monthly"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                timeRange === range 
                  ? "bg-card text-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-card/50 hover:text-foreground"
              )}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.goal}</div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{stats.progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${stats.progress}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion}</div>
            <p className="text-xs text-emerald-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +0.4% from last {timeRange === "daily" ? "day" : timeRange === "weekly" ? "week" : "month"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Gross Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profit}</div>
            <p className="text-xs text-rose-500 flex items-center mt-1">
              <TrendingDown className="w-3 h-3 mr-1" />
              -2.1% from last {timeRange === "daily" ? "day" : timeRange === "weekly" ? "week" : "month"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Distribution of sales across main categories.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))"
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--color-chart-${i + 1})` }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Orders Volume</CardTitle>
            <CardDescription>Number of orders processed per {timeRange === "daily" ? "day" : timeRange === "weekly" ? "week" : "month"}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
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
                  <Bar dataKey="orders" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

import { cn } from "@/lib/utils";
