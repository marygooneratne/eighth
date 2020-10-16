import React from "react";
import "./App.css";
import { Card, Space } from "antd";
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
      <Space direction="vertical">
        {Object.keys(props.data).map((key) => {
          return (
            <Card
              size="small"
              title={key}
              style={{
                marginBottom: "20",
              }}
            >
              {Object.keys(props.data[key]).map((val) => {
                return (
                  <p>
                    {val.charAt(0).toUpperCase() + val.slice(1)}:{" "}
                    {props.data[key][val]}
                  </p>
                );
              })}
            </Card>
          );
        })}
      </Space>
    </div>
  );
}

export default DataCards;
