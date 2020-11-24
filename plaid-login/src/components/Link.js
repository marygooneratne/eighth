import React, { Component } from "react";
import { PlaidLink } from "react-plaid-link";
import axios from "axios";
import { Typography } from "antd";
const { Title, Text } = Typography;

class Link extends Component {
  constructor(props) {
    super();
    this.handleOnSuccess = props.handleOnSuccess;
    this.state = {
      linkToken: "",
    };
  }

  componentDidMount() {
    axios.post("/create_link_token").then((res) => {
      console.log("our res", res.data.link_token);
      this.setState({ linkToken: res.data.link_token }, () => {
        console.log("state", this.state);
      });
    });
  }

  handleOnExit() {
    // handle the case when your user exits Link
    // For the sake of this tutorial, we're not going to be doing anything here.
  }

  render() {
    return (
      <div style={{ textAlign: "left" }}>
        <PlaidLink
          clientName="React Plaid Setup"
          env="sandbox"
          product={["auth", "transactions"]}
          token={this.state.linkToken}
          onExit={this.handleOnExit}
          onSuccess={this.handleOnSuccess}
          className="test"
          style={{
            backgroundColor: "transparent",
            borderColor: "transparent",
            padding: "0px",
          }}
        >
          <Title
            style={{
              color: "#1F4B45",
              fontWeight: "normal",
              fontSize: "80px",
              borderBottom: "3px solid #1F4B45",
            }}
          >
            Sign In
          </Title>
        </PlaidLink>
      </div>
    );
  }
}

export default Link;
