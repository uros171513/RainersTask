# 📊 Country Insights — Layout Redesign and Data Visualization

## 🧭 Task Overview

The goal of this task was to redesign the **“Country Insights”** tab layout to make it more interactive, data-driven, and visually informative. 
Additionaly, sorting over total trade and YoY growth was added. 

### Objectives

- ✅ Allow sorting by total trade value and year-over-year (YoY) growth.  
- ✅ Add two new sections next to *Trading Partners*: **Imports** and **Exports**.  
- ✅ Display an initial visualization for imports, showing aggregate imports over time.  
- ✅ Show percentage change above each bar compared to the previous year.  
- ✅ Include a horizontal bar chart for top sections per country (*HS Sections*) by total observed value.  
- ✅ Enable filtering by country so both charts dynamically adjust based on selection.

### Data Sources

- `enriched_import_data.csv`  
- `enriched_export_data.csv`

Implementation was done, and the component is designed to support both data files.

---

## 🧩 Implementation Details

### 1. Data Parsing and Preparation

CSV data is parsed using **Papa Parse**, transforming each record into a typed object:

```ts
type TradeRecord = {
  country_name: string;
  TIME_PERIOD: string;
  OBS_VALUE: number;
  HS_SECTION: string;
  description: string;
};
```

After loading:

- Unique country names are extracted to populate the dropdown filter.  
- Data is aggregated in two ways:
  - **By year** — total observed import value per year.  
  - **By HS section** — total import value per product section.  

Both aggregations are stored in component state for **reactive rendering**.

---

### 2. 📈 Yearly Trend Chart (Vertical Bar Chart)

Displays total import values per year (`OBS_VALUE`) and a label above each bar indicating **percentage change** from the previous year.

**Formula:**

```text
Change = ((Current Year Total - Previous Year Total) / Previous Year Total) * 100
```

A positive value indicates **growth**, while a negative value shows **decline** compared to the previous year.

**Example Implementation:**

```tsx
<BarChart data={aggregated}>
  <XAxis dataKey="year" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="total" fill="#3b82f6">
    <LabelList dataKey="change" position="top" formatter={(v) => `${v}%`} />
  </Bar>
</BarChart>
```

The chart dynamically updates when a country is selected.

---

### 3. 📊 Top Sections Chart (Horizontal Bar Chart)

This visualization highlights the **Top 10 sections per country** ranked by total import value.

Each bar represents an **HS section**, and tooltips display both the numeric value and section description.

```tsx
<BarChart layout="vertical" data={topSections}>
  <XAxis type="number" />
  <YAxis dataKey="section" type="category" />
  <Tooltip
    formatter={(value) => value.toLocaleString()}
    labelFormatter={(label) => sectionDescriptions[label]}
  />
  <Bar dataKey="total" fill="#2563eb" />
</BarChart>
```

When a specific country is chosen, the chart updates to reflect that country’s import structure.

---

### 4. 🎛️ Filtering and Interactivity

Filtering is implemented using **ShadCN UI Select**:

```tsx
<Select value={filteredCountry} onValueChange={setFilteredCountry}>
  <SelectTrigger>
    <SelectValue placeholder="Select Country" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="All">All</SelectItem>
    {countries.map(c => (
      <SelectItem key={c} value={c}>{c}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

Selecting a country triggers **re-aggregation** of both datasets (yearly totals and section totals).  
The UI updates automatically without page reloads.

---

### 5. 🗺️ Integration in “Country Insights”

Within the Country Insights layout, a **tab navigation** structure was implemented with:

- 🟢 **Trading Partners** (already existing, added sorting)
- 🔵 **Imports**
- 🟣 **Exports**

Each tab displays dynamic content:

| Tab | Description |
|-----|--------------|
| **Trading Partners** | Sortable table by total trade and YoY growth |
| **Imports** | ImportChart component (filters + visualizations) |
| **Exports** | ExportChart component (same logic, different data file) |

This separation improves **clarity**, **modularity**, and **user experience**.

---

## 🧠 Technical Summary

| Feature | Description |
|----------|--------------|
| **Framework** | React + TypeScript |
| **UI Library** | ShadCN + TailwindCSS |
| **Charts** | Recharts |
| **Data Parsing** | Papa Parse |
| **Filtering** | Reactive country filter |
| **Sorting** | Total trade & YoY growth |
| **Visualizations** | Vertical + horizontal bar charts |
| **Reusability** | Shared logic between import/export charts |

---

## ✅ Outcome

The redesigned **Country Insights** tab now offers:

- 📌 Intuitive exploration by country and category  
- 📈 Clear visualization of yearly trade activity  
- 🔍 Instant insight into YoY growth and decline  
- 💠 Consistent and responsive UI/UX layout  
- 🧩 Modular structure for future export data integration  

---

**Author:** Uroš Jovanović  
**Tech Stack:** React • TypeScript • Recharts • TailwindCSS • ShadCN/UI • Papa Parse  
**Repository:** [GitHub – RainersTask](https://github.com/uros171513/RainersTask)
