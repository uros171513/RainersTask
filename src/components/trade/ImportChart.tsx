import React from "react";
import BaseChart from "./BaseChart";

export default function ImportChart() {
  return <BaseChart csvFile="/data/enriched_import_data.csv" mode="import" key="exports" />;
}
