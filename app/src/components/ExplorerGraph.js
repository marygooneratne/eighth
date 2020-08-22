import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";
import "frappe-charts/dist/frappe-charts.min.css";
import React, { useState } from "react";

//import "graphstyle.css";
import ReactFrappeChart from "react-frappe-charts";

const X_AXIS_OPTIONS = { daily: [], weekly: [], monthly: [], yearly: [] };
const YEAR_DAYS = 365;
const WEEK_DAYS = 7;
const MONTH_DAYS = 30;

var date_diff_indays = function (date1, date2) {
  dt1 = new Date(date1);
  dt2 = new Date(date2);
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24)
  );
};
var earliest_date = function (dates) {
  if (dates.length == 0) return null;
  var earliestDate = dates[0];
  for (var i = 1; i < dates.length; i++) {
    var currentDate = dates[i];
    if (currentDate < earliestDate) {
      earliestDate = currentDate;
    }
  }
  return earliestDate;
};

var latest_date = function (dates) {
  if (dates.length == 0) return null;
  var latest_date = dates[0];
  for (var i = 1; i < dates.length; i++) {
    var currentDate = dates[i];
    if (currentDate > latest_date) {
      latest_date = currentDate;
    }
  }
  return latest_date;
};
export default function ExplorerGraph(props) {
  /**   {
        {'name': 'ticker', 'value': 'APPL'},
        {'name': 'daily', 'value': [[
            {'name': 'date', 'value': 2020-08-20},
            {'name': 'open', 'value': 390.07},
            {'name': 'close', 'value': 392.07},
            {'name': 'high', 'value': 392.09},
            {'name': 'low', 'value': 388.17},
            {'name': 'volume', 'value': 3423420}
            ],
            [
            {'name': 'date', 'value': 2020-08-21},
            {'name': 'open', 'value': 390.07},
            {'name': 'close', 'value': 392.07},
            {'name': 'high', 'value': 392.09},
            {'name': 'low', 'value': 388.17},
            {'name': 'volume', 'value': 3423420}
            ]
        }
        ]
    }*/
  start_date = earliest_date(response.map((data) => data["start_date"]));
  end_date = latest_date(response.map((data) => data["end_date"]));

  blank_value = { date: null, values: { value: null } };
  for (ticker in response) {
    while (values[0][date] < start_date) {}
  }
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
