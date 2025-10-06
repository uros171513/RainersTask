import { useState, useEffect } from 'react';
import { 
  loadCSV, 
  loadGDPCSV,
  TradeDataRow,
  GDPDataRow,
  aggregateByCountry, 
  aggregateBySector,
  aggregateByMonth,
  COUNTRY_NAMES,
  HS_SECTION_NAMES,
  calculateGrowth,
  getAnnualGDP
} from '@/lib/tradeDataProcessor';

export interface CountryTrade {
  country: string;
  countryName: string;
  totalValue: number;
  growth: number;
}

export interface SectorTrade {
  sector: string;
  sectorName: string;
  totalValue: number;
  growth: number;
}

export interface MonthlyTrade {
  month: string;
  exports: number;
  imports: number;
  totalTrade: number;
}

export function useTradeData() {
  const [loading, setLoading] = useState(true);
  const [topCountries, setTopCountries] = useState<CountryTrade[]>([]);
  const [topSectors, setTopSectors] = useState<SectorTrade[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyTrade[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalTrade: 0,
    exports: 0,
    imports: 0,
    tradeBalance: 0,
    gdp: 0,
    tradeToGDPRatio: 0,
    totalTradeGrowth: 0,
    exportsGrowth: 0,
    importsGrowth: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Load all necessary CSV files
      const [
        exportsData,
        importsData,
        totalExportsMonthly,
        totalImportsMonthly,
        sectorMonthData,
        countryYearData,
        totalMonthData,
        gdpData,
      ] = await Promise.all([
        loadCSV('/data/trade_total_exports_country_month.csv'),
        loadCSV('/data/trade_imports_country_month.csv'),
        loadCSV('/data/trade_total_exports_sector_year.csv'),
        loadCSV('/data/trade_imports_sector_year.csv'),
        loadCSV('/data/trade_sector_month.csv'),
        loadCSV('/data/trade_country_year.csv'),
        loadCSV('/data/trade_total_month.csv'),
        loadGDPCSV('/data/gdp_isic_current.csv'),
      ]);

      // Calculate current year (2024) and previous year (2023) data
      const currentYear = 2024;
      const previousYear = 2023;

      // Aggregate by country
      const currentExportsByCountry = aggregateByCountry(exportsData, currentYear);
      const previousExportsByCountry = aggregateByCountry(exportsData, previousYear);
      const currentImportsByCountry = aggregateByCountry(importsData, currentYear);
      const previousImportsByCountry = aggregateByCountry(importsData, previousYear);

      // Calculate top countries
      const countryTotals = new Map<string, { current: number; previous: number }>();
      
      currentExportsByCountry.forEach((value, country) => {
        const existing = countryTotals.get(country) || { current: 0, previous: 0 };
        existing.current += value;
        countryTotals.set(country, existing);
      });
      
      currentImportsByCountry.forEach((value, country) => {
        const existing = countryTotals.get(country) || { current: 0, previous: 0 };
        existing.current += value;
        countryTotals.set(country, existing);
      });
      
      previousExportsByCountry.forEach((value, country) => {
        const existing = countryTotals.get(country) || { current: 0, previous: 0 };
        existing.previous += value;
        countryTotals.set(country, existing);
      });
      
      previousImportsByCountry.forEach((value, country) => {
        const existing = countryTotals.get(country) || { current: 0, previous: 0 };
        existing.previous += value;
        countryTotals.set(country, existing);
      });

      const countries: CountryTrade[] = Array.from(countryTotals.entries())
        .map(([country, data]) => ({
          country,
          countryName: COUNTRY_NAMES[country] || `Country ${country}`,
          totalValue: data.current,
          growth: calculateGrowth(data.current, data.previous),
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 20);

      setTopCountries(countries);

      // Aggregate by sector
      const currentExportsBySector = aggregateBySector(totalExportsMonthly, currentYear);
      const previousExportsBySector = aggregateBySector(totalExportsMonthly, previousYear);
      const currentImportsBySector = aggregateBySector(totalImportsMonthly, currentYear);
      const previousImportsBySector = aggregateBySector(totalImportsMonthly, previousYear);

      const sectorTotals = new Map<string, { current: number; previous: number }>();
      
      currentExportsBySector.forEach((value, sector) => {
        const existing = sectorTotals.get(sector) || { current: 0, previous: 0 };
        existing.current += value;
        sectorTotals.set(sector, existing);
      });
      
      currentImportsBySector.forEach((value, sector) => {
        const existing = sectorTotals.get(sector) || { current: 0, previous: 0 };
        existing.current += value;
        sectorTotals.set(sector, existing);
      });
      
      previousExportsBySector.forEach((value, sector) => {
        const existing = sectorTotals.get(sector) || { current: 0, previous: 0 };
        existing.previous += value;
        sectorTotals.set(sector, existing);
      });
      
      previousImportsBySector.forEach((value, sector) => {
        const existing = sectorTotals.get(sector) || { current: 0, previous: 0 };
        existing.previous += value;
        sectorTotals.set(sector, existing);
      });

      const sectors: SectorTrade[] = Array.from(sectorTotals.entries())
        .map(([sector, data]) => ({
          sector,
          sectorName: HS_SECTION_NAMES[sector] || `Sector ${sector}`,
          totalValue: data.current,
          growth: calculateGrowth(data.current, data.previous),
        }))
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 15);

      setTopSectors(sectors);

      // Calculate monthly data for 2024
      const monthlyExports = aggregateByMonth(exportsData, '2024-01', '2024-12');
      const monthlyImports = aggregateByMonth(importsData, '2024-01', '2024-12');

      const months = ['2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06', 
                      '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'];
      
      const monthly: MonthlyTrade[] = months.map(month => {
        const exports = monthlyExports.get(month) || 0;
        const imports = monthlyImports.get(month) || 0;
        return {
          month: month.substring(5), // Get MM part
          exports,
          imports,
          totalTrade: exports + imports,
        };
      });

      setMonthlyData(monthly);

      // Calculate total stats
      const totalExports = Array.from(currentExportsByCountry.values()).reduce((a, b) => a + b, 0);
      const totalImports = Array.from(currentImportsByCountry.values()).reduce((a, b) => a + b, 0);
      const prevTotalExports = Array.from(previousExportsByCountry.values()).reduce((a, b) => a + b, 0);
      const prevTotalImports = Array.from(previousImportsByCountry.values()).reduce((a, b) => a + b, 0);

      // Get GDP data (dataset in MILAED)
      const currentGDPMillions = getAnnualGDP(gdpData, currentYear); // MILAED
      const gdpAED = currentGDPMillions * 1_000_000; // convert to AED for unit consistency
      const totalTradeValue = totalExports + totalImports;
      const prevTotalTrade = prevTotalExports + prevTotalImports;

      setTotalStats({
        totalTrade: totalTradeValue,
        exports: totalExports,
        imports: totalImports,
        tradeBalance: totalExports - totalImports,
        gdp: gdpAED,
        tradeToGDPRatio: gdpAED > 0 ? (totalTradeValue / gdpAED) * 100 : 0,
        totalTradeGrowth: calculateGrowth(totalTradeValue, prevTotalTrade),
        exportsGrowth: calculateGrowth(totalExports, prevTotalExports),
        importsGrowth: calculateGrowth(totalImports, prevTotalImports),
      });

    } catch (error) {
      console.error('Error loading trade data:', error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    topCountries,
    topSectors,
    monthlyData,
    totalStats,
  };
}
