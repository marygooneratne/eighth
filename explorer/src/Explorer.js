import React from "react";
import { useState } from "react";
import "./App.css";
import { Button } from "antd";
import "antd/dist/antd.css";
import { styler } from "react-timeseries-charts";

import MoveForm from "./MoveForm.js";
import SelectedCards from "./SelectedCards.js";
import {
  initDataset,
  datasetOnLoad,
  buildTimeSeries,
  transformDataset,
  extractMoves,
} from "./explorerUtil.js";
import { INIT_STYLE, COLORS, DATASETS } from "./Constants.js";
import ExplorerChart from "./ExplorerChart";

const initStyleList = [INIT_STYLE];
const initStyle = styler(initStyleList);
const initDatasets = [datasetOnLoad()];
const initSeries = buildTimeSeries(initDatasets);

function Explorer() {
  let [styleList, setStyleList] = useState(initStyleList);
  let [style, setStyle] = useState(initStyle);
  let [datasets, setDatasets] = useState(initDatasets);
  let [series, setSeries] = useState(initSeries);

  function updateSeries(name, columns, data) {
    addLineColor(name);
    var copy = datasets;
    copy.push(initDataset(name, columns, data));
    setDatasets(copy);
    setSeries(buildTimeSeries(datasets));
  }

  function addLineColor(name) {
    let color = COLORS[Math.floor(Math.random() * COLORS.length)];
    var newList = styleList;
    newList.push({ key: name, color: color, width: 2 });
    setStyleList(newList);
    setStyle(styler(styleList));
  }

  function addDataset(e, name, columns = ["date", "close"]) {
    e.preventDefault();
    var url_name = name.replace(" ", "-").toLowerCase();
    fetch("/data/" + url_name + "/close")
      .then((res) => res.json())
      .then((data) => {
        updateSeries(name, columns, transformDataset(data));
      });
  }

  const displayMoves = (name, percent, days) => {
    var ds = NaN;
    for (var i = 0; i < datasets.length; i++) {
      let cur = datasets[i];
      if (cur["name"] === name) {
        ds = cur["events"];
      }
    }
    let str_p = percent.toString();
    let str_days = String(days);
    var dName = name + "-move";

    let data = extractMoves(ds, percent, days);
    let columns = ["date", dName];
    updateSeries(dName, columns, data);
  };

  const onMoveFormFinish = (values) => {
    var percent = values["percent-change"] / 100.0;
    displayMoves(values["dataset"], percent, values["num-days"]);
  };

  const renderButtons = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
        {DATASETS.map((name) => {
          return (
            <Button
              id={name}
              onClick={(e) => addDataset(e, name)}
              style={{ margin: 5 }}
            >
              {name}
            </Button>
          );
        })}
      </div>
    );
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
          {renderButtons()}
          <MoveForm
            onMoveFormFinish={onMoveFormFinish}
            formOptions={series.columns()}
          />
        </div>
        <div style={{}}>
          <ExplorerChart
            data={series}
            style={style}
            columns={series.columns()}
          />
        </div>
        <SelectedCards cards={styleList} />
      </div>
    </div>
  );
}

export default Explorer;
