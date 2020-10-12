import React from "react";
import "./App.css";
import { Card } from "antd";
import "antd/dist/antd.css";

function SelectedCards(props) {
  var selected = {};
  let cards = props.data;
  for (var i = 0; i < cards.length; i++) {
    var line = cards[i];
    var key = line.key;
    console.log("key", key);
    var root = key.split("-")[0];
    var child = String(key.split("-").slice(1));
    if (!Object.keys(selected).includes(root)) {
      selected[root] = [];
    }
    selected[root].push(child);
  }
  let selected_keys = Object.keys(selected);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingBottom: "20",
      }}
    >
      {selected_keys.map((key) => {
        return (
          <Card size="small" title={key}>
            {selected[key].map((val) => {
              return <p>{val}</p>;
            })}
          </Card>
        );
      })}
    </div>
  );
}

export default SelectedCards;
