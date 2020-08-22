import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";
import "frappe-charts/dist/frappe-charts.min.css";
import React, { useState } from "react";

//import "graphstyle.css";
import ReactFrappeChart from "react-frappe-charts";

export default function ExplorerGraph(props) {
  const data = {
    labels: ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug"],

    datasets: [
      {
        name: "APPL",
        chartType: "line",
        values: [320, 320, 342, 280, 58, 12, -17, 37],
      },

      {
        name: "MSFT",
        chartType: "line",
        values: [134, 120, 133, 156, 180, 200, 217, 237],
      },
    ],

    yMarkers: [{ label: "High", value: 60, options: { labelPos: "left" } }],
  };
  return (
    <ReactFrappeChart
      data={data}
      title="APPL vs. MACD(MSFT)"
      type="axis-mixed"
      height="600"
      colors={["#25282A", "#492083", "light-blue"]}
      axisOptions={{
        xAxisMode: "tick",
        xIsSeries: true,
      }}
      barOptions={{
        stacked: false,
        spaceRatio: 0.2,
      }}
      tooltipOptions={{
        formatTooltipX: (d) => (d + "").toUpperCase(),
        formatTooltipY: (d) => d + " pts",
      }}
    />
  );
}
