import React from "react";
import "./App.css";
import Link from "./components/Link";
import "./style/custom-antd.css";
import { Image, Typography } from "antd";
import logo from "./images/black-gray-logo.svg";
import coliseum from "./images/coliseum.svg";
const { Title, Text } = Typography;

function HomePage(props) {
  return (
    <div
      className="App"
      style={{
        backgroundColor: "#9ABCB6",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 20,
      }}
    >
      <Image src={logo} width={75} style={{ alignSelf: "flex-start" }} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          height: "100%",
        }}
      >
        <div
          class="text"
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: "flex-start",
            width: "35%",
            marginLeft: "80px",
            paddingTop: "140px",
          }}
        >
          <Title
            style={{
              color: "#FFFFFF",
              fontWeight: "normal",
              fontSize: "100px",
              textAlign: "left",
              marginBottom: "20px",
            }}
          >
            Worry less
          </Title>
          <Text
            style={{
              color: "#FFFFFF",
              fontFamily: "Work Sans",
              fontWeight: "normal",
              fontSize: "30px",
              paddingBottom: "30px",
              textAlign: "left",
            }}
          >
            Earn more and save more with Eighth Fund.
          </Text>

          <Title
            style={{
              color: "#1F4B45",
              fontWeight: "normal",
              fontSize: "80px",
              borderBottom: "3px solid #1F4B45",
              marginBottom: "10px",
              width: "251.441px",
            }}
          >
            Log In
          </Title>
          <Link handleOnSuccess={props.handleOnSuccess} />
        </div>
        <Image
          src={coliseum}
          width={800}
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            right: "-100px",
          }}
        />
      </div>
    </div>
  );
}

export default HomePage;
