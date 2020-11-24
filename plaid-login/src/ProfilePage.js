import React, { useState } from "react";
import "./App.css";
import Link from "./components/Link";
import "./style/custom-antd.css";
import { Image, Typography, Table } from "antd";
import logo from "./images/black-gray-logo.svg";
import coliseum from "./images/coliseum.svg";
import axios from "axios";
const { Title, Text } = Typography;

function ProfilePage() {
  const [transactions, setTransactions] = useState([]);

  const handleClick = (res) => {
    axios.get("/transactions").then((res) => {
      setTransactions(res.data.transactions.transactions, () =>
        console.log("TRANSACTIONS", this.state.transactions)
      );
    });
  };
  let transactionsTable = transactions.map((transaction_) => (
    <li>
      date: {transaction_.date}
      name: {transaction_.name}
      amount: {transaction_.amount}
    </li>
  ));
  //   let transactionsTable;
  //   if (transactions.length > 0) {
  //     transactionsTable = <Table dataSource={transactions} />;
  //   } else {
  //     transactionsTable = <div></div>;
  //   }
  return (
    <div
      className="App"
      style={{
        backgroundColor: "#9ABCB6",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 20,
      }}
    >
      <Image src={logo} width={75} style={{ alignSelf: "flex-start" }} />
      <Title
        style={{
          color: "#1F4B45",
          fontWeight: "normal",
          fontSize: "80px",
          marginBottom: "10px",
          textAlign: "left",
          paddingLeft: "75px",
          paddingTop: "140px",
        }}
      >
        Successfully logged in.
      </Title>

      <div>
        <button onClick={handleClick}>Get Transactions</button>
      </div>
      {transactionsTable}
    </div>
  );
}

export default ProfilePage;
