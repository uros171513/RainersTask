import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Label
} from "recharts";
import pluralize from "pluralize";
import millify from "millify";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type TradeRecord = {
    country_name: string;
    TIME_PERIOD: string;
    OBS_VALUE: number;
    HS_SECTION: string;
    description: string;
};

type BaseChartProps = {
    csvFile?: string;
    mode?: string;
};

// Helper functions
const formatNumber = (value: number) => {
    const billion = 1_000_000_000;
    const million = 1_000_000;
    const thousand = 1_000;

    if (value >= billion) {
        return (value / billion).toFixed(1) + "B";
    } else if (value >= million) {
        return (value / million).toFixed(1) + "M";
    } else if (value >= thousand) {
        return (value / thousand).toFixed(1) + "K";
    } else {
        return value.toString();
    }
}

const capitalizeFirstLetter = (mode) => {
    const formatted = mode.charAt(0).toUpperCase() + mode.slice(1);
    return formatted;
}

export default function BaseChart({ csvFile, mode }: BaseChartProps) {
    const [data, setData] = useState<TradeRecord[]>([]);
    const [filteredCountry, setFilteredCountry] = useState<string>("All");
    const [countries, setCountries] = useState<string[]>([]);
    const [aggregated, setAggregated] = useState<any[]>([]);
    const [topSections, setTopSections] = useState<any[]>([]);

    // Load CSV
    useEffect(() => {
        Papa.parse(csvFile, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                const parsed = results.data as TradeRecord[];
                setData(parsed);
                const uniqueCountries = Array.from(new Set(parsed.map(d => d.country_name))).sort();
                setCountries(uniqueCountries);
            },
        });
    }, [csvFile]);

    // Data grouping
    useEffect(() => {
        if (data.length === 0) return;

        // Filter data by country
        let filtered = data;
        if (filteredCountry !== "All") {
            filtered = data.filter(d => d.country_name === filteredCountry);
        }

        // Vertical chart - aggregate over time
        const yearlyTotals = Object.values(
            filtered
                .filter(d => d.TIME_PERIOD && !isNaN(Number(d.TIME_PERIOD)))
                .reduce((acc: any, d) => {
                    const year = Number(d.TIME_PERIOD);
                    acc[year] = acc[year] || { year, total: 0 };
                    acc[year].total += d.OBS_VALUE;
                    return acc;
                }, {})
        ).sort((a: any, b: any) => a.year - b.year);

        const withChange = yearlyTotals.map((d: any, i: number) => {
            if (i === 0) return { ...d, change: 0 };
            const prev = yearlyTotals[i - 1].total;
            const change = ((d.total - prev) / prev) * 100;
            return { ...d, change: Number(change.toFixed(1)) };
        });

        setAggregated(withChange);

        // Horizontal chart - ranked by value by sections
        const bySection = Object.values(
            filtered.reduce((acc: any, d) => {
                const key = d.HS_SECTION;
                acc[key] = acc[key] || { section: key, total: 0, description: d.description };
                acc[key].total += d.OBS_VALUE;
                return acc;
            }, {})
        );

        const sorted = bySection.sort((a, b) => b.total - a.total).slice(0, 10);
        setTopSections(sorted);

    }, [data, filteredCountry]);

    return (
        <Card className="p-4 space-y-6">
            <CardHeader>
                <CardTitle>{capitalizeFirstLetter(pluralize(mode))} Overview</CardTitle>
            </CardHeader>

            <CardContent>
                <Select value={filteredCountry} onValueChange={setFilteredCountry}>
                    <SelectTrigger className="w-[240px] mb-4">
                        <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        {countries.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Vertical chart */}
                <div className="mt-10">
                    <CardTitle>{filteredCountry === "All" ? "Aggregate Import Value per Year (in AED)" : "Aggregate Import Value per Year (in AED) in " + filteredCountry}</CardTitle>
                    <BarChart width={800} height={300} data={aggregated} margin={{ top: 20, right: 80, left: 80, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis tickFormatter={(value) => millify(value, { precision: 2 })}>
                            <Label
                                value="Import Value"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: "middle", fontSize: 18, fontWeight: 600, fill: "#444" }}
                                offset={-30}
                            />
                        </YAxis>
                        <Tooltip formatter={(value) => millify(Number(value), { precision: 2 })} />
                        <Bar dataKey="total" fill="#3b82f6">
                            <LabelList dataKey="change" position="top" formatter={(v: any) => `${v}%`} />
                        </Bar>
                    </BarChart>
                </div>

                {/* Horizontal chart */}
                <div className="mt-10">
                    <CardTitle>{filteredCountry === "All" ? "Top 10 Section by " + capitalizeFirstLetter(mode) + " Value" : "Top 10 Sections in " + filteredCountry}</CardTitle>
                    <BarChart
                        layout="vertical"
                        width={800}
                        height={400}
                        data={topSections}
                        margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => millify(value, { precision: 2 })}/>
                        <YAxis dataKey="section" type="category" width={80} >
                              <Label
                                value="HS Section"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: "middle", fontSize: 18, fontWeight: 600, fill: "#444" }}
                                offset={-10}
                            />
                        </YAxis>
                        <Tooltip
                            formatter={(value: any) => millify(Number(value), { precision: 2 })}
                            labelFormatter={(label) => {
                                const found = topSections.find(p => p.section === label);
                                return found ? `${found.section}: ${found.description}` : label;
                            }}
                            contentStyle={{ maxWidth: 300, whiteSpace: 'normal' }}
                        />
                        <Bar dataKey="total" fill="#2563eb" />
                    </BarChart>
                </div>
            </CardContent>
        </Card>
    );
}
