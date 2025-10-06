import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import TradeOverview from "./pages/TradeOverview";
import CountryInsights from "./pages/CountryInsights";
import CommodityAnalysis from "./pages/CommodityAnalysis";
import CEPAAnalysis from "./pages/CEPAAnalysis";
import Reports from "./pages/Reports";
import Agents from "./pages/Agents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="trade-overview" element={<TradeOverview />} />
            <Route path="country" element={<CountryInsights />} />
            <Route path="commodity" element={<CommodityAnalysis />} />
            <Route path="cepa" element={<CEPAAnalysis />} />
            <Route path="reports" element={<Reports />} />
            <Route path="agents" element={<Agents />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
