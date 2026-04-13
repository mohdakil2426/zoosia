import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  userName: string;
  onUpdateProfile: (newName: string) => void;
}

export function SettingsView({ userName, onUpdateProfile }: SettingsViewProps) {
  const [name, setName] = useState(userName);
  const [username, setUsername] = useState("atif_admin");

  const handleSave = () => {
    onUpdateProfile(name);
    // In a real app, you'd also save the username and other fields to a backend
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your store configuration and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>User Profile</CardTitle>
            </div>
            <CardDescription>Manage your personal information and how it appears.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button 
          onClick={() => setName(userName)}
          className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors border border-transparent sm:border-none"
        >
          Cancel
        </button>
        <button 
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
}
