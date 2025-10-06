import { Search, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TopBar = () => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trade data, countries, commodities..."
            className="pl-10 bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          <span>Jan 2024 - Dec 2024</span>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
