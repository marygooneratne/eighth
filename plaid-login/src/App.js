import React, { useState } from "react";
import "./App.css";
import Link from "./components/Link";
import "./style/custom-antd.css";
import axios from "axios";
import HomePage from "./HomePage.js";
import ProfilePage from "./ProfilePage.js";

function App() {
  const [tokenSet, setTokenSet] = useState(false);
  const handleOnSuccess = (public_token, metadata) => {
    axios.post("/auth/public_token", {
      public_token: public_token,
    });
    console.log("done");
    setTokenSet(true);
  };
  let currentPage;
  if (tokenSet) {
    currentPage = <ProfilePage />;
  } else {
    currentPage = <HomePage handleOnSuccess={handleOnSuccess} />;
  }
  return <div>{currentPage}</div>;
}

export default App;
