import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTradeData } from "@/hooks/useTradeData";
import { formatCurrency, formatPercentage } from "@/lib/tradeDataProcessor";
import { Handshake, TrendingUp, TrendingDown, Globe2 } from "lucide-react";

// CEPA partner countries for UAE
const CEPA_COUNTRIES = [
  { code: "IND", name: "India", agreementYear: 2022, status: "Active" },
  { code: "ISR", name: "Israel", agreementYear: 2022, status: "Active" },
  { code: "IDN", name: "Indonesia", agreementYear: 2023, status: "Active" },
  { code: "TUR", name: "Turkey", agreementYear: 2024, status: "Active" },
  { code: "GEO", name: "Georgia", agreementYear: 2024, status: "Active" },
];

const CEPAAnalysis = () => {
  const { loading, topCountries, totalStats } = useTradeData();
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading CEPA data...</p>
        </div>
      </div>
    );
  }

  // Filter top countries to only show CEPA countries
  const cepaCountries = topCountries.filter(country => 
    CEPA_COUNTRIES.some(cepa => cepa.name === country.country)
  );

  // Further filter by selected country if not "ALL"
  const displayedCountries = selectedCountry === "ALL" 
    ? cepaCountries 
    : cepaCountries.filter(c => c.country === selectedCountry);

  // Calculate total CEPA trade
  const totalCEPATrade = cepaCountries.reduce((sum, country) => sum + country.totalValue, 0);
  const cepaShareOfTotal = totalStats.totalTrade > 0 
    ? (totalCEPATrade / totalStats.totalTrade) * 100 
    : 0;

  // Calculate weighted average growth
  const weightedGrowth = cepaCountries.length > 0
    ? cepaCountries.reduce((sum, c) => sum + (c.growth * c.totalValue), 0) / totalCEPATrade
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Handshake className="w-8 h-8 text-primary" />
            CEPA Countries Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive Economic Partnership Agreement trade analytics
          </p>
        </div>

        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All CEPA Countries</SelectItem>
            {CEPA_COUNTRIES.map(country => (
              <SelectItem key={country.code} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>CEPA Partners</CardDescription>
            <CardTitle className="text-3xl">{CEPA_COUNTRIES.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Active agreements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total CEPA Trade</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalCEPATrade, true)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {formatPercentage(cepaShareOfTotal, 1)} of total trade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average Growth</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {formatPercentage(weightedGrowth, 1)}
              {weightedGrowth > 0 ? (
                <TrendingUp className="w-5 h-5 text-success" />
              ) : (
                <TrendingDown className="w-5 h-5 text-destructive" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">YoY weighted average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Newest Partner</CardDescription>
            <CardTitle className="text-2xl">
              {CEPA_COUNTRIES.sort((a, b) => b.agreementYear - a.agreementYear)[0].name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Since {CEPA_COUNTRIES.sort((a, b) => b.agreementYear - a.agreementYear)[0].agreementYear}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Statistics</TabsTrigger>
          <TabsTrigger value="agreements">Agreement Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade Performance by Country</CardTitle>
              <CardDescription>
                {selectedCountry === "ALL" 
                  ? "All CEPA partner countries" 
                  : `Trade data for ${selectedCountry}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Total Trade</TableHead>
                    <TableHead className="text-right">YoY Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedCountries.map((country, index) => (
                    <TableRow key={country.country}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{country.country}</TableCell>
                      <TableCell className="text-right">{formatCurrency(country.totalValue)}</TableCell>
                      <TableCell className="text-right">
                        <span className={country.growth > 0 ? "text-success" : "text-destructive"}>
                          {formatPercentage(country.growth)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trade Volume Details</CardTitle>
              <CardDescription>Detailed trade statistics for CEPA countries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Total Trade Value</TableHead>
                    <TableHead className="text-right">Share of CEPA Trade</TableHead>
                    <TableHead className="text-right">Share of Total Trade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedCountries.map((country) => {
                    const cepaShare = totalCEPATrade > 0 
                      ? (country.totalValue / totalCEPATrade) * 100 
                      : 0;
                    const totalShare = totalStats.totalTrade > 0
                      ? (country.totalValue / totalStats.totalTrade) * 100
                      : 0;

                    return (
                      <TableRow key={country.country}>
                        <TableCell className="font-medium">{country.country}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(country.totalValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(cepaShare, 1)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(totalShare, 1)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CEPA_COUNTRIES.map(country => {
              const tradeData = cepaCountries.find(c => c.country === country.name);
              
              return (
                <Card key={country.code}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Globe2 className="w-8 h-8 text-primary" />
                        <div>
                          <CardTitle>{country.name}</CardTitle>
                          <CardDescription>CEPA Agreement</CardDescription>
                        </div>
                      </div>
                      <Badge>{country.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Agreement Year</span>
                      <span className="font-medium">{country.agreementYear}</span>
                    </div>
                    {tradeData && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total Trade</span>
                          <span className="font-medium">{formatCurrency(tradeData.totalValue, true)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">YoY Growth</span>
                          <span className={`font-medium ${tradeData.growth > 0 ? "text-success" : "text-destructive"}`}>
                            {formatPercentage(tradeData.growth)}
                          </span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CEPAAnalysis;
