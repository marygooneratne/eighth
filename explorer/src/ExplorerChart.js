import React from "react";
import "antd/dist/antd.css";
import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
} from "react-timeseries-charts";
import { useState } from "react";
import { format } from "d3-format";
function ExplorerChart(props) {
  const initState = {
    tracker: null,
    timerange: props.data.range(),
    x: null,
    y: null,
  };
  const [state, setState] = useState(initState);
  const handleTrackerChanged = (tracker) => {
    let copy = state;
    if (!tracker) {
      copy.x = null;
      copy.y = null;
      copy.tracker = tracker;
      setState(copy);
    } else {
      copy.tracker = tracker;
      setState(copy);
    }
  };
  const handleTimeRangeChange = (timerange) => {
    let copy = state;
    copy.timerange = timerange;
    setState(copy);
  };

  const handleMouseMove = (x, y) => {
    let copy = state;
    copy.x = x;
    copy.y = y;
    setState(copy);
  };
  const getMax = (data) => {
    let max = 0;
    for (let c = 0; c < data.columns().length; c++) {
      let col = data.columns()[c];
      let cur = data.max(col);
      if (cur > max) max = cur;
    }
    return max;
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

  const f = format("$,.2f");
  const range = state.timerange;
  let AAPL;
  if (state.tracker) {
    const index = props.data.bisect(state.tracker);
    const trackerEvent = props.data.at(index);
    AAPL = `${f(trackerEvent.get("AAPL"))}`;
  }

  return (
    <ChartContainer
      timeRange={range}
      hideWeekends={true}
      enablePanZoom={true}
      trackerPosition={state.tracker}
      onTrackerChanged={handleTrackerChanged}
      trackerInfoHeight={50}
      timeAxisStyle={{ axis: { fill: "none", stroke: "none" } }}
      onTrackerChanged={handleTrackerChanged}
      enablePanZoom={true}
      onTimeRangeChanged={handleTimeRangeChange}
      onMouseMove={(x, y) => handleMouseMove(x, y)}
    >
      <ChartRow height={560}>
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
