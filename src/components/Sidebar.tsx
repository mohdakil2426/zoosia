import { 
  LayoutDashboard, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  LogOut,
  TrendingUp,
  Package,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export type ViewType = "dashboard" | "orders" | "analytics" | "inventory" | "sales" | "settings";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems: { icon: any; label: string; view: ViewType }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: ShoppingBag, label: "Orders", view: "orders" },
  { icon: BarChart3, label: "Analytics", view: "analytics" },
  { icon: Package, label: "Inventory", view: "inventory" },
  { icon: TrendingUp, label: "Sales", view: "sales" },
  { icon: Settings, label: "Settings", view: "settings" },
];

export function Sidebar({ currentView, onViewChange, onLogout, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:sticky lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="text-primary-foreground w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">Zoosia</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md lg:hidden"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                currentView === item.view 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

