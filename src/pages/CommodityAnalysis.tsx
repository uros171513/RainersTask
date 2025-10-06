import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Package, TrendingUp, TrendingDown, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTradeData } from "@/hooks/useTradeData";

const CommodityAnalysis = () => {
  const { loading, topSectors } = useTradeData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading commodity data...</p>
      </div>
    );
  }

  const sectorColors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--secondary))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
  ];

  const sectorData = topSectors.slice(0, 6).map((sector, index) => ({
    sector: sector.sectorName,
    value: Math.round(sector.totalValue / 1000000000),
    share: 0, // We'll calculate this
    growth: sector.growth,
    color: sectorColors[index % sectorColors.length],
  }));

  const totalValue = sectorData.reduce((sum, s) => sum + s.value, 0);
  sectorData.forEach(s => {
    s.share = Math.round((s.value / totalValue) * 100);
  });

  const topPerformer = topSectors.length > 0 
    ? topSectors.reduce((max, s) => s.growth > max.growth ? s : max, topSectors[0])
    : null;

  const largestSector = topSectors.length > 0 ? topSectors[0] : null;
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Commodity Analysis
          </h1>
          <p className="text-muted-foreground">Sector and HS category deep dive</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Sectors</p>
          </div>
          <p className="text-3xl font-bold text-primary">{topSectors.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Top sectors</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-accent" />
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
          <p className="text-3xl font-bold text-accent">{totalValue}B</p>
          <p className="text-xs text-muted-foreground mt-1">AED (2024)</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <p className="text-sm text-muted-foreground">Top Performer</p>
          </div>
          <p className="text-xl font-bold text-success">{topPerformer?.sectorName.split(' ')[0] || 'N/A'}</p>
          <p className="text-xs text-muted-foreground mt-1">+{topPerformer?.growth.toFixed(1)}% growth</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-secondary" />
            <p className="text-sm text-muted-foreground">Largest Sector</p>
          </div>
          <p className="text-xl font-bold text-secondary">{largestSector?.sectorName.split(' ')[0] || 'N/A'}</p>
          <p className="text-xs text-muted-foreground mt-1">{sectorData[0]?.share}% of total</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sectors" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="sectors">Sector Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="sectors" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Sector Distribution by Value</h3>
              <ChartContainer config={{}} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ sector, share }) => `${sector.split(' ')[0]}: ${share}%`}
                      outerRadius={100}
                      fill="hsl(var(--primary))"
                      dataKey="value"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>

            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Top Sectors by Value (AED Billions)</h3>
              <ChartContainer config={{}} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="sector" type="category" stroke="hsl(var(--muted-foreground))" width={150} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topSectors.map((sector, index) => (
              <Card key={sector.sector} className="p-4 border-l-4" style={{ borderLeftColor: sectorColors[index % sectorColors.length] }}>
                <h4 className="font-semibold mb-3">{sector.sectorName}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Value:</span>
                    <span className="font-bold">AED {Math.round(sector.totalValue / 1000000000)}B</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">YoY Growth:</span>
                    <div className={`flex items-center gap-1 ${sector.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                      {sector.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="font-semibold">{sector.growth.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommodityAnalysis;
