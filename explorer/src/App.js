import React from "react";
import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button } from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import { styler } from "react-timeseries-charts";

import aapl from "./aapl_historical.json";

import {
  Charts,
  ChartContainer,
  ChartRow,
  YAxis,
  LineChart,
} from "react-timeseries-charts";
import {
  Collection,
  TimeSeries,
  TimeEvent,
  IndexedEvent,
  TimeRange,
} from "pondjs";

function useForceUpdate() {
  let [value, setState] = useState(true);
  return () => setState(!value);
}

function App() {
  const dset = datasetOnLoad();
  const srs = updatedSeries([dset]);

  let forceUpdate = useForceUpdate();
  let [styleList, setStyleList] = useState([
    { key: "AAPL", color: "#F68B24", width: 2 },
  ]);
  let [style, setStyle] = useState(styler(styleList));
  let [series, setSeries] = useState(srs);
  let [datasets, setDatasets] = useState([dset]);

  function datasetOnLoad() {
    const columns = ["time", "close"];
    const name = "AAPL";
    let raw = {};
    aapl.map((item) => {
      const timestamp = moment(new Date(item.date));
      raw[timestamp] = +item.close;
    });
    // console.log(raw);
    return initDataset(name, columns, raw);
  }

  function initDataset(name, columns, raw) {
    const dataset = {};
    dataset.name = name;
    dataset.columns = columns;
    dataset.events = raw;
    return dataset;
  }

  function buildPoints(data) {
    let points = [];
    // console.log("buildPoints.data = ", data);
    for (let p = 0; p < Object.keys(data[0].events).length; p++) {
      let arr = [];
      // console.log(
      //   "buildPoints.Object.keys(data[0].events) = ",
      //   Object.keys(data[0].events)
      // );
      let time = Object.keys(data[0].events)[p];
      // console.log("buildPoints.time = ", time);
      arr.push(time);
      for (let d = 0; d < data.length; d++) {
        let evts = data[d].events;
        // console.log("time ", time);
        // console.log(
        //   "buildPoints.evts (",
        //   data[d].name,
        //   ") = ",
        //   JSON.stringify(evts)
        // );
        // console.log("buildPoints.Object.keys(evts) = ", Object.keys(evts));
        if (time in evts) {
          arr.push(evts[time]);
        } else {
          arr.push(NaN);
        }
      }
      points.push(arr);
    }
    // console.log("buildPoints.points = ", points);
    return points;
  }

  function buildCols(data) {
    let cols = [];
    for (let d = 0; d < data.length; d++) {
      cols.push(data[d].name);
    }
    return cols;
  }

  function updatedSeries(data) {
    // console.log("updatedSeries.data = ", data);
    let events = buildPoints(data);
    let cols = buildCols(data);
    // console.log("updatedSeries.cols = ", cols);
    let modEvents = events.map((item) => {
      // console.log("updatedSeries.item = ", item);
      const timestamp = moment(Date.parse(item[0]));
      let vals = {};
      for (var i = 1; i < item.length; i++) {
        vals[cols[i - 1]] = item[i];
      }
      // console.log("updatedSeries.vals = ", vals);
      return new TimeEvent(timestamp, vals);
    });
    // console.log("updateSeries.events = ", JSON.stringify(modEvents));
    const collection = new Collection(modEvents);
    // console.log("updateSeries.collection = ", JSON.stringify(collection));
    const sortedCollection = collection.sortByTime();
    // console.log(
    //   "updateSeries.sortedCollection = ",
    //   JSON.stringify(sortedCollection)
    // );
    const updated = new TimeSeries({
      name: "data",
      columns: cols,
      collection: sortedCollection,
    });

    // console.log("updateSeries.update = ", updated);
    return updated;
  }

  function addDataset(e, name, columns = ["date", "close"]) {
    e.preventDefault();
    fetch("/data/" + name + "/close")
      .then((res) => res.json())
      .then((data) => {
        var dict = JSON.parse(data.value);
        let raw = {};
        for (var key in dict) {
          if (dict.hasOwnProperty(key)) {
            const timestamp = moment(new Date(parseInt(key)));
            raw[timestamp] = +dict[key];
          }
        }
        // console.log("addData.raw = ", JSON.stringify(raw));
        datasets.push(initDataset(name, columns, raw));
        // console.log("addData.data = ", JSON.stringify(datasets));
        setDatasets(datasets);
        setSeries(updatedSeries(datasets));
        // console.log("addDataset.datasets = ", JSON.stringify(datasets));
        forceUpdate();
      });
  }

  const addMoves = () => {
    let percent = 0.1;
    let days = 10;
    let ds = datasets[0].events;
    var sliced = {};
    var i = 0;
    var vals = Object.values(ds);
    var keys = Object.keys(ds);
    console.log("addMoves.keys=", keys);
    for (var i = 0; i < keys.length - days; i++) {
      let diff = Math.abs(vals[i + days] - vals[i]);
      let target = percent * Math.abs(vals[i]);
      if (diff >= target) {
        console.log("addMoves.moveDate=", keys[i]);
        for (var j = i; j < i + days; j++) {
          sliced[keys[j]] = vals[j];
        }
        i = i + days;
      }
    }

    console.log("addMoves.sliced=", sliced);
    datasets.push(initDataset("move", ["date", "move"], sliced));
    setDatasets(datasets);
    setSeries(updatedSeries(datasets));
    setStyleList(styleList.push({ key: "move", color: "steelblue", width: 2 }));
    setStyle(styler(styleList));
    forceUpdate();
  };

  const getMax = () => {
    let max = 0;
    // console.log("getMax.series.columns = ", series.columns());
    // console.log("getMax.series.columns().length = ", series.columns().length);
    for (let c = 0; c < series.columns().length; c++) {
      let col = series.columns()[c];
      let cur = series.max(col);
      // console.log("getMax.cur =", cur);
      if (cur > max) max = cur;
    }
    // console.log("getMax.max = ", max);
    return max;
  };

  const getMin = () => {
    let min = Number.MAX_SAFE_INTEGER;
    for (let c = 0; c < series.columns().length; c++) {
      let col = series.columns()[c];
      let cur = series.min(col);
      if (cur < min) min = cur;
    }
    return min;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "start",
        alignItems: "center",
      }}
    >
      <div>
        <h1> Explorer Tool</h1>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
          <Button
            id="SPX"
            onClick={(e) => addDataset(e, "SPX")}
            style={{ margin: 5 }}
          >
            SPX
          </Button>
          <Button
            id="TSLA"
            onClick={(e) => addDataset(e, "TSLA")}
            style={{ margin: 5 }}
          >
            TSLA
          </Button>
          <Button
            id="ZM"
            onClick={(e) => addDataset(e, "ZM")}
            style={{ margin: 5 }}
          >
            ZM
          </Button>
          <Button
            id="UBER"
            onClick={(e) => addDataset(e, "UBER")}
            style={{ margin: 5 }}
          >
            UBER
          </Button>
          <Button
            id="WORK"
            onClick={(e) => addDataset(e, "WORK")}
            style={{ margin: 5 }}
          >
            WORK
          </Button>
          <Button
            id="trump-approvals"
            onClick={(e) => addDataset(e, "trump-approvals")}
            style={{ margin: 5 }}
          >
            Trump Approval Ratings
          </Button>
          <Button id="moves" onClick={(e) => addMoves()} style={{ margin: 5 }}>
            Moves
          </Button>
        </div>
        <div style={{}}>
          <ChartContainer
            timeRange={series.range()}
            hideWeekends={true}
            enablePanZoom={true}
            timeAxisStyle={{ axis: { fill: "none", stroke: "none" } }}
          >
            <ChartRow height={300}>
              <Charts>
                <LineChart
                  axis="y"
                  style={style}
                  columns={series.columns()}
                  series={series}
                  interpolation="curveBasis"
                />
              </Charts>
              <YAxis
                id="y"
                label="Price ($)"
                min={getMin()}
                max={getMax()}
                format=",.0f"
                width="60"
              />
            </ChartRow>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
