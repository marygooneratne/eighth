import React, { Image } from "react";
import logo from "./logo.svg";
import { ExplorerForm } from "./components/ExplorerForm";
import ExplorerGraph from "./components/ExplorerGraph";
import greenblack from "./resources/greenblack.png";

function App() {
  return (
    <div
      className="App"
      style={{
        backgroundColor: "black",
        overflow: "auto",
        padding: "30px",
      }}
    >
      <header className="App-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <img src={greenblack} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
            }}
          >
            <div style={{ width: "50%" }}>
              <ExplorerGraph />
            </div>
            <div style={{ width: "50%" }}>
              <ExplorerForm />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
