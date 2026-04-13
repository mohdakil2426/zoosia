import { useEffect, useState } from "react";
import { Sidebar, ViewType } from "./Sidebar";
import { StatsGrid } from "./StatsGrid";
import { SalesChart } from "./SalesChart";
import { TopProducts } from "./TopProducts";
import { OrdersView } from "./OrdersView";
import { SalesView } from "./SalesView";
import { InventoryView } from "./InventoryView";
import { AnalyticsView } from "./AnalyticsView";
import { SettingsView } from "./SettingsView";
import { motion, AnimatePresence } from "motion/react";
import { Bell, User, LayoutDashboard, Moon, Sun, ShoppingCart, Package, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { storage } from "../lib/storage";

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Persistent States
  const [stats, setStats] = useState<any>(() => storage.get("stats", null));
  const [sales, setSales] = useState<any[]>(() => storage.get("sales", []));
  const [products, setProducts] = useState<any[]>(() => storage.get("products", []));
  const [orders, setOrders] = useState<any[]>(() => storage.get("orders", []));
  const [inventory, setInventory] = useState<any[]>(() => storage.get("inventory", []));
  
  const [loading, setLoading] = useState(!stats);
  const [userName, setUserName] = useState(() => storage.get("user_name", "Atif Fazal Ansari"));

  useEffect(() => {
    storage.set("user_name", userName);
  }, [userName]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchData = async () => {
      // Only fetch if we don't have data in storage
      if (stats && sales.length > 0 && products.length > 0 && orders.length > 0 && inventory.length > 0) {
        setLoading(false);
        return;
      }

      try {
        const [statsRes, salesRes, productsRes, ordersRes, inventoryRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/sales"),
          fetch("/api/products"),
          fetch("/api/orders"),
          fetch("/api/inventory"),
        ]);

        const statsData = await statsRes.json();
        const salesData = await salesRes.json();
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        const inventoryData = await inventoryRes.json();

        setStats(statsData);
        setSales(salesData);
        setProducts(productsData);
        setOrders(ordersData);
        setInventory(inventoryData);

        // Persist initial data
        storage.set("stats", statsData);
        storage.set("sales", salesData);
        storage.set("products", productsData);
        storage.set("orders", ordersData);
        storage.set("inventory", inventoryData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update storage whenever state changes
  useEffect(() => { if (stats) storage.set("stats", stats); }, [stats]);
  useEffect(() => { storage.set("sales", sales); }, [sales]);
  useEffect(() => { storage.set("products", products); }, [products]);
  useEffect(() => { storage.set("orders", orders); }, [orders]);
  useEffect(() => { storage.set("inventory", inventory); }, [inventory]);

  const handleAddProduct = (product: any) => {
    const newInventory = [product, ...inventory];
    setInventory(newInventory);
    // Update stats if needed
  };

  const handleCreateOrder = (order: any) => {
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    
    // Update stats
    if (stats) {
      setStats({
        ...stats,
        totalOrders: stats.totalOrders + 1,
        totalRevenue: stats.totalRevenue + order.total
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium animate-pulse">Initializing Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }} 
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 overflow-y-auto w-full">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 md:px-8 bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-muted rounded-md lg:hidden"
            >
              <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-muted rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <span className="font-semibold text-sm">Notifications</span>
                      <button className="text-xs text-primary hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        { title: "New Order", desc: "Order #ORD-7421 received", time: "2m ago", icon: ShoppingCart },
                        { title: "Stock Alert", desc: "Smart Fitness Watch is out of stock", time: "1h ago", icon: Package },
                        { title: "Customer Review", desc: "New 5-star review on Headphones", time: "3h ago", icon: Star },
                      ].map((n, i) => (
                        <div key={i} className="p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0 cursor-pointer">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <n.icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-muted-foreground">{n.desc}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-muted/30 text-center border-t border-border">
                      <button className="text-xs font-medium text-muted-foreground hover:text-foreground">View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-border mx-1 md:mx-2" />
            <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground mt-1">Store Admin</p>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <User className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {currentView === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold tracking-tight">Zoosia Dashboard</h1>
                  <p className="text-muted-foreground">Welcome back, {userName}! Here's what's happening with your store today.</p>
                </div>

                {stats && (
                  <StatsGrid 
                    stats={stats} 
                    onItemClick={(view) => setCurrentView(view)} 
                  />
                )}

                <div className="grid gap-6 grid-cols-1">
                  <SalesChart data={sales} />
                </div>

                <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                  <div className="lg:col-span-3">
                    <TopProducts products={products} />
                  </div>
                  <Card className="lg:col-span-4 border-none shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest transactions and system events.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          { user: "Sarah Chen", action: "purchased", item: "Premium Wireless Headphones", time: "2 minutes ago", amount: "+$149.00" },
                          { user: "James Wilson", action: "refunded", item: "Organic Cotton T-Shirt", time: "15 minutes ago", amount: "-$30.00" },
                          { user: "Emma Rodriguez", action: "purchased", item: "Smart Fitness Watch", time: "1 hour ago", amount: "+$199.00" },
                          { user: "Michael Bay", action: "purchased", item: "Ergonomic Desk Chair", time: "3 hours ago", amount: "+$299.00" },
                        ].map((activity, i) => (
                          <div key={i} className="flex items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 sm:gap-4">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full bg-muted flex items-center justify-center font-medium text-xs sm:text-sm">
                                {activity.user.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-sm font-medium leading-tight">
                                  <span className="font-semibold">{activity.user}</span> {activity.action} <span className="hidden sm:inline">{activity.item}</span>
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                              </div>
                            </div>
                            <span className={cn("text-sm font-semibold shrink-0", activity.amount.startsWith("+") ? "text-emerald-500" : "text-rose-500")}>
                              {activity.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {currentView === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <OrdersView initialOrders={orders} onOrderCreated={handleCreateOrder} />
              </motion.div>
            )}

            {currentView === "sales" && (
              <motion.div
                key="sales"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <SalesView initialSales={sales} />
              </motion.div>
            )}

            {currentView === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <InventoryView initialItems={inventory} onProductAdded={handleAddProduct} />
              </motion.div>
            )}

            {currentView === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <AnalyticsView />
              </motion.div>
            )}

            {currentView === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <SettingsView 
                  userName={userName} 
                  onUpdateProfile={(newName) => setUserName(newName)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
