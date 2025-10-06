import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import AIChat from "./AIChat";
import { SidebarProvider } from "@/components/ui/sidebar";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar />
          
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              <Outlet />
            </div>
          </main>
        </div>

        <AIChat />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
