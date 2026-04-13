import { useEffect, useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: string;
  status: string;
}

interface InventoryViewProps {
  initialItems: InventoryItem[];
  onProductAdded: (product: InventoryItem) => void;
}

export function InventoryView({ initialItems, onProductAdded }: InventoryViewProps) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", category: "Electronics", stock: 0, price: 0 });

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    const product: InventoryItem = {
      id: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newItem,
      status: newItem.stock > 10 ? "In Stock" : newItem.stock > 0 ? "Low Stock" : "Out of Stock"
    };
    onProductAdded(product);
    setShowAddModal(false);
    setNewItem({ name: "", category: "Electronics", stock: 0, price: 0 });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "low stock": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "out of stock": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading inventory...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor and manage your product stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold">Add New Product</h2>
                <p className="text-sm text-muted-foreground mt-1">Enter the details of the new product to add to inventory.</p>
              </div>
              <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <input 
                    required
                    type="text" 
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. Wireless Mouse"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select 
                      value={newItem.category}
                      onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    >
                      {["Electronics", "Accessories", "Apparel", "Furniture"].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      value={newItem.price}
                      onChange={e => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
                      className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Initial Stock</label>
                  <input 
                    required
                    type="number" 
                    value={newItem.stock}
                    onChange={e => setNewItem({ ...newItem, stock: parseInt(e.target.value) })}
                    className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Add Product
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
                placeholder="Search products..." 
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
                  categoryFilter !== "All" ? "bg-primary/10 border-primary text-primary" : "bg-muted/30 hover:bg-muted/50 border-border"
                )}
              >
                <Filter className="w-4 h-4" />
                {categoryFilter === "All" ? "Filter" : categoryFilter}
              </button>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl z-50 p-2"
                  >
                    <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 py-1 mb-1">Filter by Category</p>
                    {["All", "Electronics", "Accessories", "Apparel", "Furniture"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setCategoryFilter(cat);
                          setShowFilters(false);
                        }}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
                          categoryFilter === cat ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        )}
                      >
                        {cat}
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
                  <TableHead className="min-w-[150px]">Product</TableHead>
                  <TableHead className="min-w-[100px]">SKU</TableHead>
                  <TableHead className="min-w-[120px]">Category</TableHead>
                  <TableHead className="min-w-[80px]">Stock</TableHead>
                  <TableHead className="min-w-[100px]">Price</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.stock}</TableCell>
                    <TableCell className="font-semibold">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={cn("font-medium border shadow-none", getStatusColor(item.status))}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <button className="text-xs font-medium text-primary hover:underline">Update Stock</button>
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
