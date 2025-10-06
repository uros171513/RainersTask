import Papa from 'papaparse';

export interface TradeDataRow {
  DATAFLOW: string;
  REF_AREA: string;
  FREQ: string;
  UNIT_MEASURE: string;
  SOURCE_DETAIL: string;
  MEASURE: string;
  TRADE_TYPE: string;
  HS_SECTION: string;
  HS_CHAPTER: string;
  COUNTRY: string;
  TIME_PERIOD: string;
  OBS_VALUE: string;
  OBS_STATUS: string;
  UNIT_MULT: string;
  OBS_COMMENT: string;
  DECIMALS: string;
}

export interface GDPDataRow {
  DATAFLOW: string;
  REF_AREA: string;
  FREQ: string;
  UNIT_MEASURE: string;
  SOURCE_DETAIL: string;
  MEASURE: string;
  GSA_TRANS?: string;
  GSA_TYPE?: string;
  ECON_VAR?: string;
  ISIC?: string;
  QUARTER?: string;
  QGDP_SYS?: string;
  QGDP_UNIT?: string;
  PRICES: string;
  EXPEND?: string;
  BOP_ITEM?: string;
  BOP_TYPE?: string;
  INC_ITEM?: string;
  PUB_ITEM?: string;
  TIME_PERIOD: string;
  OBS_VALUE: string;
  OBS_STATUS: string;
  UNIT_MULT: string;
  OBS_COMMENT: string;
  DECIMALS: string;
}

export interface ProcessedTradeData {
  country: string;
  value: number;
  period: string;
  sector?: string;
}

// Country code to name mapping
export const COUNTRY_NAMES: Record<string, string> = {
  '156': 'China',
  '356': 'India',
  '784': 'UAE',
  '682': 'Saudi Arabia',
  '364': 'Iran',
  '586': 'Pakistan',
  '512': 'Oman',
  '634': 'Qatar',
  '414': 'Kuwait',
  '048': 'Bahrain',
  '400': 'Jordan',
  '368': 'Iraq',
  '792': 'Turkey',
  '840': 'USA',
  '826': 'UK',
  '276': 'Germany',
  '250': 'France',
  '380': 'Italy',
  '724': 'Spain',
  '528': 'Netherlands',
  '056': 'Belgium',
  '616': 'Poland',
  '203': 'Czech Republic',
  '348': 'Hungary',
  '642': 'Romania',
  '804': 'Ukraine',
  '643': 'Russia',
  '392': 'Japan',
  '410': 'South Korea',
  '458': 'Malaysia',
  '702': 'Singapore',
  '704': 'Vietnam',
  '764': 'Thailand',
  '360': 'Indonesia',
  '608': 'Philippines',
  '036': 'Australia',
  '554': 'New Zealand',
  '710': 'South Africa',
  '818': 'Egypt',
  '012': 'Algeria',
  '504': 'Morocco',
  '788': 'Tunisia',
  '404': 'Kenya',
  '508': 'Mozambique',
  '566': 'Nigeria',
  '076': 'Brazil',
  '484': 'Mexico',
  '032': 'Argentina',
  '152': 'Chile',
  '170': 'Colombia',
  '604': 'Peru',
  '124': 'Canada',
  '068': 'Bolivia',
  '288': 'Ghana',
  '352': 'Iceland',
  '180': 'Congo',
  '196': 'Cyprus',
  '208': 'Denmark',
  '246': 'Finland',
  '300': 'Greece',
  '372': 'Ireland',
  '442': 'Luxembourg',
  '578': 'Norway',
  '620': 'Portugal',
  '752': 'Sweden',
  '756': 'Switzerland',
  '705': 'Slovenia',
  '740': 'Suriname',
  '798': 'Tuvalu',
  '854': 'Burkina Faso',
  '882': 'Samoa',
  '686': 'Senegal',
  '060': 'Bermuda',
  '132': 'Cape Verde',
  '466': 'Mali',
  '533': 'Aruba',
  '638': 'Réunion',
  '660': 'Anguilla',
};

// HS Section to commodity name mapping
export const HS_SECTION_NAMES: Record<string, string> = {
  '1': 'Live Animals & Products',
  '2': 'Vegetable Products',
  '3': 'Fats & Oils',
  '4': 'Prepared Foodstuffs',
  '5': 'Mineral Products',
  '6': 'Chemical Products',
  '7': 'Plastics & Rubber',
  '8': 'Raw Hides & Leather',
  '9': 'Wood & Articles',
  '10': 'Pulp & Paper',
  '11': 'Textiles',
  '12': 'Footwear & Headgear',
  '13': 'Stone & Glass',
  '14': 'Precious Stones & Metals',
  '15': 'Base Metals',
  '16': 'Machinery & Equipment',
  '17': 'Vehicles',
  '18': 'Precision Instruments',
  '19': 'Arms & Ammunition',
  '20': 'Miscellaneous',
  '21': 'Works of Art',
};

export async function loadCSV(filePath: string): Promise<TradeDataRow[]> {
  const response = await fetch(filePath);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<TradeDataRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export async function loadGDPCSV(filePath: string): Promise<GDPDataRow[]> {
  const response = await fetch(filePath);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse<GDPDataRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}

export function aggregateByCountry(data: TradeDataRow[], year?: number): Map<string, number> {
  const aggregated = new Map<string, number>();
  
  data.forEach((row) => {
    if (year && !row.TIME_PERIOD.startsWith(year.toString())) {
      return;
    }
    
    const country = row.COUNTRY;
    const value = parseFloat(row.OBS_VALUE) || 0;
    
    if (country && country !== '_Z' && country !== 'OTH') {
      aggregated.set(country, (aggregated.get(country) || 0) + value);
    }
  });
  
  return aggregated;
}

export function aggregateBySector(data: TradeDataRow[], year?: number): Map<string, number> {
  const aggregated = new Map<string, number>();
  
  data.forEach((row) => {
    if (year && !row.TIME_PERIOD.startsWith(year.toString())) {
      return;
    }
    
    const sector = row.HS_SECTION;
    const value = parseFloat(row.OBS_VALUE) || 0;
    
    if (sector && sector !== '_Z') {
      aggregated.set(sector, (aggregated.get(sector) || 0) + value);
    }
  });
  
  return aggregated;
}

export function aggregateByMonth(data: TradeDataRow[], startDate: string, endDate: string): Map<string, number> {
  const aggregated = new Map<string, number>();
  
  data.forEach((row) => {
    const period = row.TIME_PERIOD;
    
    if (period >= startDate && period <= endDate) {
      aggregated.set(period, (aggregated.get(period) || 0) + (parseFloat(row.OBS_VALUE) || 0));
    }
  });
  
  return aggregated;
}

export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  }
  
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getAnnualGDP(gdpData: GDPDataRow[], year: number): number {
  // Filter for total GDP (ISIC = _T) for the specified year (units: MILAED)
  const gdpRow = gdpData.find(row => 
    row.TIME_PERIOD === year.toString() && 
    row.ISIC === '_T' &&
    row.PRICES === 'CUR' // Current prices
  );
  
  return gdpRow ? parseFloat(gdpRow.OBS_VALUE) || 0 : 0;
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
