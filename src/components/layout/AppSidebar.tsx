import { Home, Globe, TrendingUp, FileText, Settings, Bot, Handshake } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigation = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Country Insights", url: "/country", icon: Globe },
  { title: "Commodity Analysis", url: "/commodity", icon: TrendingUp },
  { title: "CEPA Countries", url: "/cepa", icon: Handshake },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "AI Agents", url: "/agents", icon: Bot },
  { title: "Settings", url: "/settings", icon: Settings },
];

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">Trade Intelligence</h2>
            <p className="text-xs text-sidebar-foreground/70">Analytics Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
