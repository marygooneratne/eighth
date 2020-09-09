import React, { Image } from "react";
import logo from "./logo.svg";
import { ExplorerForm } from "./components/ExplorerForm";
import { ExplorerGraph } from "./components/ExplorerGraph";
import greenblack from "./resources/greenblack.svg";
import "./App.css";
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
              height: "10vh",
              margin: "1vw",
            }}
          >
            <img src={greenblack} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#25282A",
              margin: "1vw",

              padding: "30px",
              height: "90vh",
            }}
          >
            <h3
              style={{
                color: "white",
                fontFamily: "Work Sans, sans-serif",
                fontSize: "50px",
              }}
            >
              EXPLORER
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
              }}
            >
              <div style={{ width: "65vw" }}>
                <ExplorerGraph />
              </div>
              <div style={{ width: "25vw" }}>
                <ExplorerForm />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
