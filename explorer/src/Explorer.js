import React from "react";
import { useState } from "react";
import "./App.css";
import { Button, Card, Divider } from "antd";
import "antd/dist/antd.css";

import { format } from "d3-format";
import { styler } from "react-timeseries-charts";

import MoveForm from "./MoveForm.js";
import DataCards from "./DataCards.js";
import ExplorerChart from "./ExplorerChart.js";
import SearchForm from "./SearchForm.js";
import CreateForm from "./CreateForm.js";

import {
  initDataset,
  datasetOnLoad,
  buildTimeSeries,
  transformDataset,
  extractMoves,
  cardsDataOnLoad,
} from "./explorerUtil.js";
import { INIT_STYLE, COLORS, DATASET_MAP } from "./Constants.js";

const initStyleList = [INIT_STYLE];
const initStyle = styler(initStyleList);
const initDatasets = [datasetOnLoad()];
const initSeries = buildTimeSeries(initDatasets);
const initCardsData = cardsDataOnLoad(datasetOnLoad());

function Explorer() {
  let [styleList, setStyleList] = useState(initStyleList);
  let [style, setStyle] = useState(initStyle);
  let [datasets, setDatasets] = useState(initDatasets);
  let [series, setSeries] = useState(initSeries);
  let [trackerEventIn, setTrackerEventIn] = useState(0);
  let [cardsData, setCardsData] = useState(initCardsData);
  let [trackerX, setTrackerX] = useState(0);

  function handleCardsDataChange() {
    if (typeof trackerEventIn.get === "function") {
      // console.log("hump", Object.keys(cardsData));
      // console.log("me", JSON.parse(JSON.stringify(trackerEventIn)).data);
      // console.log("truly", trackerEventIn.get("AAPL-close"));
      var copy = cardsData;
      // console.log("why", Object.keys(copy));
      for (var root of Object.keys(copy)) {
        // console.log("fuck", root);
        for (var child of Object.keys(copy[root])) {
          copy[root][child] = trackerEventIn.get(root + "-" + child);
        }
      }
      setCardsData(copy);
    }
  }

  function addToCardsData(dName) {
    console.log("ADDING ", dName);
    var copy = cardsData;
    let root = String(dName.split("-")[0]);
    let child = String(dName.split("-").slice(1).join("-"));
    if (!Object.keys(copy).includes(root)) {
      copy[root] = {};
    }
    copy[root][child] = 0.0;
    setCardsData(copy);
    console.log("2", cardsData);
  }

  function updateSeries(name, columns, data) {
    addLineColor(name);
    var copy = datasets;
    copy.push(initDataset(name, columns, data));
    console.log("looking, ", JSON.stringify(copy));
    setDatasets(copy);
    console.log("hippy", JSON.stringify(datasets));
    setSeries(buildTimeSeries(datasets));
    addToCardsData(name);
  }

  function addLineColor(name) {
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var newList = styleList;
    newList.push({ key: name, color: color, width: 4 });
    setStyleList(newList);
    setStyle(styler(styleList));
  }

  const addDataset = (id, column) => {
    var name = DATASET_MAP.filter((d) => {
      return d.id == id;
    });
    name = name[0].name;
    // e.preventDefault();
    var url_name = name.replace(" ", "-").toLowerCase();
    fetch("/data/" + url_name + "/" + column)
      .then((res) => res.json())
      .then((data) => {
        const columns = ["date", column];
        const dName = name + "-" + column;
        console.log("GOt da fucking data", data);
        updateSeries(dName, columns, transformDataset(data));
      });
  };

  const createDataset = (handle) => {
    console.log("making", String(handle));
    fetch("/create/twitter/" + String(handle))
      .then((res) => res.json())
      .then((data) => {
        console.log("Successfully created dataset");
        console.log(data);
      });
  };

  const displayMoves = (name, percent, days) => {
    var ds = NaN;
    for (var i = 0; i < datasets.length; i++) {
      let cur = datasets[i];
      if (cur["name"] === name) {
        ds = cur["events"];
      }
    }
    var dName = name + "-move";

    let data = extractMoves(ds, percent, days);
    let columns = ["date", dName];
    updateSeries(dName, columns, data);
  };

  const onMoveFormFinish = (values) => {
    var percent = values["percent-change"] / 100.0;
    displayMoves(values["dataset"], percent, values["num-days"]);
  };
  const markerStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#AAA",
    marginLeft: "5px",
  };
  const formatter = format(".4s");

  const onTrackerChanged = (trackerEventIn, trackerX) => {
    setTrackerEventIn(trackerEventIn);
    handleCardsDataChange();
    console.log("SEX", JSON.parse(JSON.stringify(trackerEventIn)).data);
    setTrackerX(trackerX);
  };

  const example = { APPL: { move: 10, close: 11 } };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 50 }}>
        <h1> Explorer Tool</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyItems: "space-between",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
          <DataCards data={cardsData} />
        </div>

        <div style={{ width: "50%" }}>
          <ExplorerChart
            data={series}
            style={style}
            columns={series.columns()}
            onTrackerChanged={onTrackerChanged}
          />
        </div>

        <Card
          size="small"
          style={{
            marginBottom: "20",
            display: "flex",
            flexDirection: "column",
            width: "20%",
          }}
        >
          <SearchForm onSubmit={addDataset} />
          <Divider />
          <MoveForm
            onMoveFormFinish={onMoveFormFinish}
            formOptions={series.columns()}
          />
          <Divider />
          <CreateForm onSubmit={createDataset} />
        </Card>
      </div>
    </div>
  );
}

export default Explorer;
