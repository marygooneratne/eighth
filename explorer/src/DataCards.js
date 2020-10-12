import React from "react";
import "./App.css";
import { Card } from "antd";
import "antd/dist/antd.css";
import { datasetOnLoad } from "./explorerUtil";

function DataCards(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        justifyItems: "space-between",
        alignContent: "space-between",
        alignItems: "space-between",
      }}
    >
      {Object.keys(props.data).map((key) => {
        return (
          <Card size="small" title={key}>
            {Object.keys(props.data[key]).map((val) => {
              return (
                <p>
                  {val}:{props.data[key][val]}
                </p>
              );
            })}
          </Card>
        );
      })}
    </div>
  );
}

export default DataCards;
