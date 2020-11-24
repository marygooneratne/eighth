const express = require("express");
const app = express();
const PORT = 4090;
const {
  receivePublicToken,
  getTransactions,
  createLinkToken,
} = require("./controllers/controller");

app.use(express.json());

// Get the public token and exchange it for an access token
app.post("/auth/public_token", receivePublicToken);

// Get Transactions
app.get("/transactions", getTransactions);
// Get Link Token
app.post("/create_link_token", createLinkToken);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
