import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Globe, Package, DollarSign, Percent } from "lucide-react";
import { useTradeData } from "@/hooks/useTradeData";
import { formatPercentage } from "@/lib/tradeDataProcessor";

const chartConfig = {
  exports: { label: "Exports", color: "hsl(var(--primary))" },
  imports: { label: "Imports", color: "hsl(var(--accent))" },
  total: { label: "Total Trade", color: "hsl(var(--secondary))" },
};

const TradeOverview = () => {
  const { loading, monthlyData, totalStats, topCountries } = useTradeData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading trade data...</p>
      </div>
    );
  }

  const formattedMonthlyData = monthlyData.map(item => ({
    month: item.month,
    exports: Math.round(item.exports / 1000000000), // Convert to billions
    imports: Math.round(item.imports / 1000000000),
    total: Math.round(item.totalTrade / 1000000000),
  }));

  const totalExportsB = Math.round(totalStats.exports / 1000000000);
  const totalImportsB = Math.round(totalStats.imports / 1000000000);
  const totalTradeB = Math.round(totalStats.totalTrade / 1000000000);
  const totalPartners = topCountries.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trade Overview
          </h1>
          <p className="text-muted-foreground">UAE trade performance metrics and analysis</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-lg border bg-background">
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
          </select>
        </div>
      </div>

      {/* Hero KPI Panel with Growth Rates */}
      <Card className="p-6 shadow-card bg-gradient-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 border-r border-border/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <p className="text-sm text-muted-foreground">Total Trade Value</p>
            </div>
            <p className="text-3xl font-bold text-primary">AED {totalTradeB}B</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {totalStats.totalTradeGrowth >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-success" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-destructive" />
              )}
              <p className={`text-sm font-medium ${totalStats.totalTradeGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercentage(totalStats.totalTradeGrowth)} YoY
              </p>
            </div>
          </div>
          <div className="text-center p-4 border-r border-border/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ArrowUpRight className="w-5 h-5 text-accent" />
              <p className="text-sm text-muted-foreground">Exports</p>
            </div>
            <p className="text-3xl font-bold text-accent">AED {totalExportsB}B</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {totalStats.exportsGrowth >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <p className={`text-sm font-medium ${totalStats.exportsGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercentage(totalStats.exportsGrowth)} YoY
              </p>
            </div>
          </div>
          <div className="text-center p-4 border-r border-border/50">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Package className="w-5 h-5 text-secondary" />
              <p className="text-sm text-muted-foreground">Imports</p>
            </div>
            <p className="text-3xl font-bold text-secondary">AED {totalImportsB}B</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {totalStats.importsGrowth >= 0 ? (
                <TrendingUp className="w-4 h-4 text-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive" />
              )}
              <p className={`text-sm font-medium ${totalStats.importsGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatPercentage(totalStats.importsGrowth)} YoY
              </p>
            </div>
          </div>
          <div className="text-center p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Percent className="w-5 h-5 text-primary" />
              <p className="text-sm text-muted-foreground">Trade/GDP Ratio</p>
            </div>
            <p className="text-3xl font-bold text-primary">{totalStats.tradeToGDPRatio.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground mt-2">GDP: AED {Math.round(totalStats.gdp / 1000000000)}B</p>
          </div>
        </div>
      </Card>

      {/* Charts Section */}
      <Tabs defaultValue="trajectory" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trajectory">Trade Trajectory</TabsTrigger>
          <TabsTrigger value="balance">Trade Balance</TabsTrigger>
        </TabsList>

        <TabsContent value="trajectory" className="space-y-4">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Trade Flow Trends - 2024 (AED Billions)</h3>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="exports" stroke="hsl(var(--primary))" strokeWidth={2} name="Exports (AED B)" />
                  <Line type="monotone" dataKey="imports" stroke="hsl(var(--accent))" strokeWidth={2} name="Imports (AED B)" />
                  <Line type="monotone" dataKey="total" stroke="hsl(var(--secondary))" strokeWidth={3} name="Total Trade (AED B)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Trade Balance - 2024</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-success/10 border-2 border-success">
                <p className="text-sm text-muted-foreground mb-2">Total Exports</p>
                <p className="text-4xl font-bold text-success">AED {totalExportsB}B</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {totalStats.exportsGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <p className={`text-sm ${totalStats.exportsGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatPercentage(totalStats.exportsGrowth)} YoY
                  </p>
                </div>
              </div>
              <div className="text-center p-6 rounded-lg bg-accent/10 border-2 border-accent">
                <p className="text-sm text-muted-foreground mb-2">Total Imports</p>
                <p className="text-4xl font-bold text-accent">AED {totalImportsB}B</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {totalStats.importsGrowth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <p className={`text-sm ${totalStats.importsGrowth >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {formatPercentage(totalStats.importsGrowth)} YoY
                  </p>
                </div>
              </div>
              <div className={`text-center p-6 rounded-lg border-2 ${totalStats.tradeBalance >= 0 ? 'bg-primary/10 border-primary' : 'bg-destructive/10 border-destructive'}`}>
                <p className="text-sm text-muted-foreground mb-2">Trade Balance</p>
                <p className={`text-4xl font-bold ${totalStats.tradeBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  AED {Math.round(totalStats.tradeBalance / 1000000000)}B
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {totalStats.tradeBalance > 0 ? 'Surplus' : 'Deficit'}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeOverview;