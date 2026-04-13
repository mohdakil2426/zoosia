import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock Data
  const salesData = [
    { name: "Jan", revenue: 4500, orders: 120 },
    { name: "Feb", revenue: 5200, orders: 145 },
    { name: "Mar", revenue: 4800, orders: 132 },
    { name: "Apr", revenue: 6100, orders: 168 },
    { name: "May", revenue: 5900, orders: 155 },
    { name: "Jun", revenue: 7200, orders: 198 },
    { name: "Jul", revenue: 8500, orders: 240 },
  ];

  const topProducts = [
    { id: 1, name: "Premium Wireless Headphones", category: "Electronics", sales: 1240, revenue: 186000, growth: "+12%" },
    { id: 2, name: "Minimalist Leather Wallet", category: "Accessories", sales: 850, revenue: 42500, growth: "+8%" },
    { id: 3, name: "Smart Fitness Watch", category: "Electronics", sales: 720, revenue: 108000, growth: "+15%" },
    { id: 4, name: "Organic Cotton T-Shirt", category: "Apparel", sales: 640, revenue: 19200, growth: "-3%" },
    { id: 5, name: "Ergonomic Desk Chair", category: "Furniture", sales: 420, revenue: 126000, growth: "+22%" },
  ];

  const stats = {
    totalRevenue: 42200,
    revenueGrowth: "+14.2%",
    totalOrders: 1158,
    ordersGrowth: "+8.1%",
    avgOrderValue: 36.44,
    avgOrderGrowth: "+2.4%",
    activeCustomers: 892,
    customersGrowth: "+12.5%",
  };

  const orders = [
    { id: "#ORD-7421", customer: "Sarah Chen", date: "2024-04-12", total: 149.00, status: "Delivered", items: 2 },
    { id: "#ORD-7420", customer: "James Wilson", date: "2024-04-12", total: 30.00, status: "Refunded", items: 1 },
    { id: "#ORD-7419", customer: "Emma Rodriguez", date: "2024-04-11", total: 199.00, status: "Shipped", items: 3 },
    { id: "#ORD-7418", customer: "Michael Bay", date: "2024-04-11", total: 299.00, status: "Processing", items: 1 },
    { id: "#ORD-7417", customer: "David Kim", date: "2024-04-10", total: 85.50, status: "Delivered", items: 2 },
    { id: "#ORD-7416", customer: "Lisa Wang", date: "2024-04-10", total: 120.00, status: "Delivered", items: 1 },
    { id: "#ORD-7415", customer: "Robert Ross", date: "2024-04-09", total: 450.00, status: "Cancelled", items: 4 },
  ];

  const customers = [
    { id: 1, name: "Sarah Chen", email: "sarah.c@example.com", orders: 12, spent: 2450.00, status: "Active", lastOrder: "2024-04-12" },
    { id: 2, name: "James Wilson", email: "j.wilson@example.com", orders: 5, spent: 840.50, status: "Active", lastOrder: "2024-04-12" },
    { id: 3, name: "Emma Rodriguez", email: "emma.r@example.com", orders: 8, spent: 1200.00, status: "Inactive", lastOrder: "2024-03-15" },
    { id: 4, name: "Michael Bay", email: "m.bay@example.com", orders: 1, spent: 299.00, status: "Active", lastOrder: "2024-04-11" },
    { id: 5, name: "David Kim", email: "d.kim@example.com", orders: 15, spent: 3100.20, status: "Active", lastOrder: "2024-04-10" },
  ];

  const inventory = [
    { id: "SKU-001", name: "Premium Wireless Headphones", stock: 45, price: 149.00, category: "Electronics", status: "In Stock" },
    { id: "SKU-002", name: "Minimalist Leather Wallet", stock: 12, price: 50.00, category: "Accessories", status: "Low Stock" },
    { id: "SKU-003", name: "Smart Fitness Watch", stock: 0, price: 199.00, category: "Electronics", status: "Out of Stock" },
    { id: "SKU-004", name: "Organic Cotton T-Shirt", stock: 120, price: 30.00, category: "Apparel", status: "In Stock" },
    { id: "SKU-005", name: "Ergonomic Desk Chair", stock: 8, price: 299.00, category: "Furniture", status: "Low Stock" },
  ];

  // API Routes
  app.get("/api/stats", (req, res) => {
    res.json(stats);
  });

  app.get("/api/sales", (req, res) => {
    res.json(salesData);
  });

  app.get("/api/products", (req, res) => {
    res.json(topProducts);
  });

  app.get("/api/orders", (req, res) => {
    res.json(orders);
  });

  app.get("/api/customers", (req, res) => {
    res.json(customers);
  });

  app.get("/api/inventory", (req, res) => {
    res.json(inventory);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
