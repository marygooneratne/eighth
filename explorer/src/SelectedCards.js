import React from "react";
import "./App.css";
import { Card } from "antd";
import "antd/dist/antd.css";

function SelectedCards(props) {
  var selected = {};
  let cards = props.cards;
  for (var i = 0; i < cards.length; i++) {
    var line = cards[i];
    var key = line.key;
    if (key.includes("move")) {
      let splits = key.split("-");
      let root = splits[0];
      //   let label = splits[2] + " change over " + splits[3] + " days";
      let label = "Significant Moves";
      selected[root].push(label);
    } else {
      selected[key] = ["Closing Price"];
    }
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
          <Card size="small" title={key} style={{ width: 300 }}>
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
