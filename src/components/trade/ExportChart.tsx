import React from "react";
import BaseChart from "./BaseChart";

export default function ExportChart() {
  return <BaseChart csvFile="/data/enriched_export_data.csv" mode="export" key="exports" />;
}
