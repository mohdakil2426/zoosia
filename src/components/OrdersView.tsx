import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface OrdersViewProps {
  initialOrders: Order[];
  onOrderCreated: (order: Order) => void;
}

export function OrdersView({ initialOrders, onOrderCreated }: OrdersViewProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customer: "",
    total: "",
    items: "1",
    status: "Processing"
  });

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  const handleCreateOrder = (e: FormEvent) => {
    e.preventDefault();
    const order: Order = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: newOrder.customer,
      date: new Date().toISOString().split('T')[0],
      total: parseFloat(newOrder.total),
      items: parseInt(newOrder.items),
      status: newOrder.status
    };
    onOrderCreated(order);
    setShowCreateModal(false);
    setNewOrder({ customer: "", total: "", items: "1", status: "Processing" });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "processing": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "refunded": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "cancelled": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and track your customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">Create New Order</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Name</label>
                  <input 
                    required
                    type="text" 
                    value={newOrder.customer}
                    onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                    placeholder="Enter customer name"
                    className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Amount ($)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={newOrder.total}
                      onChange={(e) => setNewOrder({...newOrder, total: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Items Count</label>
                    <input 
                      required
                      type="number" 
                      value={newOrder.items}
                      onChange={(e) => setNewOrder({...newOrder, items: e.target.value})}
                      className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select 
                    value={newOrder.status}
                    onChange={(e) => setNewOrder({...newOrder, status: e.target.value})}
                    className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors border border-border"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Create Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-md pl-10 pr-4 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors",
                  statusFilter !== "All" ? "bg-primary/10 border-primary text-primary" : "bg-muted/30 hover:bg-muted/50 border-border"
                )}
              >
                <Filter className="w-4 h-4" />
                {statusFilter === "All" ? "Filter" : statusFilter}
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 p-2"
                  >
                    <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1 mb-1">Filter by Status</p>
                    {["All", "Delivered", "Shipped", "Processing", "Refunded", "Cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowFilters(false);
                        }}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                          statusFilter === status ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        )}
                      >
                        {status}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="min-w-[100px]">Order ID</TableHead>
                  <TableHead className="min-w-[150px]">Customer</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[80px]">Items</TableHead>
                  <TableHead className="min-w-[100px]">Total</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-xs font-medium">{order.id}</TableCell>
                    <TableCell className="font-medium">{order.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="font-semibold">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium border shadow-none", getStatusColor(order.status))}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="text-xs font-medium text-primary hover:underline">View Details</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
