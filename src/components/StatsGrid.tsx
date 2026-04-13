import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, CreditCard } from "lucide-react";
import { ViewType } from "./Sidebar";

interface StatsGridProps {
  stats: {
    totalRevenue: number;
    revenueGrowth: string;
    totalOrders: number;
    ordersGrowth: string;
    avgOrderValue: number;
    avgOrderGrowth: string;
    activeCustomers: number;
    customersGrowth: string;
  };
  onItemClick?: (view: ViewType) => void;
}

export function StatsGrid({ stats, onItemClick }: StatsGridProps) {
  const items = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      growth: stats.revenueGrowth,
      icon: DollarSign,
      positive: true,
      view: "sales" as ViewType,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      growth: stats.ordersGrowth,
      icon: ShoppingCart,
      positive: true,
      view: "orders" as ViewType,
    },
    {
      title: "Avg. Order Value",
      value: `$${stats.avgOrderValue.toFixed(2)}`,
      growth: stats.avgOrderGrowth,
      icon: CreditCard,
      positive: true,
      view: "analytics" as ViewType,
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers.toLocaleString(),
      growth: stats.customersGrowth,
      icon: Users,
      positive: true,
      view: "analytics" as ViewType,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onItemClick?.(item.view)}
          className="cursor-pointer group"
        >
          <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-card group-hover:shadow-md group-hover:-translate-y-1 border border-transparent group-hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs flex items-center mt-1">
                {item.positive ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-rose-500 mr-1" />
                )}
                <span className={item.positive ? "text-emerald-500" : "text-rose-500"}>
                  {item.growth}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
