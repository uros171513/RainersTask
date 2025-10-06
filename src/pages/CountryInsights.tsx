import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, TrendingUp, TrendingDown, Globe2 } from "lucide-react";
import { useTradeData } from "@/hooks/useTradeData";
import { formatCurrency } from "@/lib/tradeDataProcessor";
import { useState } from "react";

const CountryInsights = () => {
  const { loading, topCountries } = useTradeData();
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading country data...</p>
      </div>
    );
  }

  const filteredCountries = topCountries.filter(country => 
    country.countryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgGrowth = topCountries.length > 0 
    ? (topCountries.reduce((sum, c) => sum + c.growth, 0) / topCountries.length).toFixed(1)
    : "0.0";

  const topCountryShare = topCountries.length > 0
    ? ((topCountries[0].totalValue / topCountries.reduce((sum, c) => sum + c.totalValue, 0)) * 100).toFixed(1)
    : "0.0";
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Country Insights
          </h1>
          <p className="text-muted-foreground">Bilateral trade analysis by country</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Top Partners Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Globe2 className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Partners</p>
          </div>
          <p className="text-3xl font-bold text-primary">{topCountries.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Top countries</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-success" />
            <p className="text-sm text-muted-foreground">Avg Growth</p>
          </div>
          <p className="text-3xl font-bold text-success">+{avgGrowth}%</p>
          <p className="text-xs text-muted-foreground mt-1">YoY across top 20</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-warning" />
            <p className="text-sm text-muted-foreground">Top Partner</p>
          </div>
          <p className="text-2xl font-bold text-warning">{topCountries[0]?.countryName}</p>
          <p className="text-xs text-muted-foreground mt-1">{topCountryShare}% share</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Globe2 className="w-5 h-5 text-accent" />
            <p className="text-sm text-muted-foreground">Total Value</p>
          </div>
          <p className="text-2xl font-bold text-accent">
            {Math.round(topCountries.reduce((sum, c) => sum + c.totalValue, 0) / 1000000000)}B
          </p>
          <p className="text-xs text-muted-foreground mt-1">AED (2024)</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="partners">Trading Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <Card className="p-6 shadow-card">
            <h3 className="text-lg font-semibold mb-4">Top Trading Partners (AED Billions)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Total Trade (AED B)</TableHead>
                  <TableHead className="text-right">YoY Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCountries.map((country, index) => (
                  <TableRow key={country.country} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{country.countryName}</span>
                    </TableCell>
                    <TableCell className="text-right text-primary font-bold">
                      {Math.round(country.totalValue / 1000000000)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 ${country.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                        {country.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-medium">{country.growth.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CountryInsights;
