import React from "react";
import "antd/dist/antd.css";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
  Resizable,
} from "react-timeseries-charts";
import { useState } from "react";
import { format } from "d3-format";
import moment from "moment";
import { TimeRange } from "pondjs";

function ExplorerChart(props) {
  console.log("data", JSON.stringify(props.data));
  const [tracker, setTracker] = useState(0);
  const [trackerX, setTrackerX] = useState(0);
  const [trackerEventIn, setTrackerEventIn] = useState(0);
  const [timeRange, setTimeRange] = useState(0);
  const getMax = (data) => {
    let max = 0;
    for (let c = 0; c < data.columns().length; c++) {
      let col = data.columns()[c];
      let cur = data.max(col);
      if (cur > max) max = cur;
    }
    return max;
  };

  var fmt = "YYYY-MM-DD HH:mm";
  var beginTime = moment("2020-08-01, 00:00", fmt);
  var endTime = moment("2020-10-10, 00:00", fmt);
  var range = new TimeRange(beginTime, endTime);

  const getTrackerValues = (time) => {
    if (props.data.collection().eventList() != null) {
      console.log(JSON.stringify(props.data.collection().eventList()));
      var data = JSON.parse(
        JSON.stringify(props.data.collection().eventList())
      ).filter(function (d) {
        console.log("d.time=", d["time"], "time=", time);
        if (d["time"] === time) {
          console.log("TRUE");
          return d["time"];
        }
      });
    }
  };

  const getMin = (data) => {
    let min = Number.MAX_SAFE_INTEGER;
    for (let c = 0; c < data.columns().length; c++) {
      let col = data.columns()[c];
      let cur = data.min(col);
      if (cur < min) min = cur;
    }
    return min;
  };

  const handleTrackerChanged = (t, scale) => {
    if (t != null) {
      setTracker(t);
      setTrackerEventIn(t && props.data.at(props.data.bisect(t)));
      setTrackerX(t && scale(t));
      props.onTrackerChanged(trackerEventIn, trackerX);
    }
  };

  const dateStyle = {
    fontSize: 12,
    color: "#AAA",
    borderWidth: 1,
    borderColor: "#F4F4F4",
  };

  const markerStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#AAA",
    marginLeft: "5px",
  };

  const formatter = format(".4s");
  const trackerStyle = {
    line: {
      stroke: "#a62011",
      cursor: "crosshair",
      pointerEvents: "none",
    },
  };

  return (
    <ChartContainer
      hideWeekends={true}
      timeRange={props.data.range()}
      // timeRange={range} // change
      trackerPosition={tracker}
      trackerStyle={trackerStyle}
      trackerInfoHeight={50}
      onTrackerChanged={handleTrackerChanged}
      timeAxisStyle={{ axis: { fill: "none", stroke: "none" } }}
      enablePanZoom={true}
    >
      <ChartRow height={600}>
        <Charts>
          <LineChart
            axis="y"
            style={props.style}
            columns={props.columns}
            series={props.data}
            interpolation="curveBasis"
          />
        </Charts>
        <YAxis
          id="y"
          label="Price ($)"
          min={getMin(props.data)}
          max={getMax(props.data)}
          format=",.0f"
          width="60"
        />
      </ChartRow>
    </ChartContainer>
  );
}
export default ExplorerChart;
