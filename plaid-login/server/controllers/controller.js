var plaid = require("plaid");
var moment = require("moment");

var PLAID_CLIENT_ID = "5f9782da2a9d6000110cb16d";
var PLAID_SECRET = "7ace7b3f3b8f4f41214a15666d6db7";
var PLAID_ENV = "sandbox";

var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;
var LINK_TOKEN = null;

// Initialize the Plaid client
var client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments[PLAID_ENV],
});
const createLinkToken = (req, res) => {
  client.createLinkToken(
    {
      user: {
        client_user_id: PLAID_CLIENT_ID,
      },
      client_name: "test",
      products: ["auth", "transactions"],
      country_codes: ["US"],
      language: "en",
    },
    function (error, linkTokenResponse) {
      if (error) {
        console.log("err", error);
      }
      LINK_TOKEN = linkTokenResponse.link_token;
      res.json({
        link_token: LINK_TOKEN,
      });
      console.log("link token below");
      console.log(LINK_TOKEN);
    }
  );
};

const receivePublicToken = (req, res) => {
  // First, receive the public token and set it to a variable
  let PUBLIC_TOKEN = req.body.public_token;
  // Second, exchange the public token for an access token
  client.exchangePublicToken(PUBLIC_TOKEN, function (error, tokenResponse) {
    ACCESS_TOKEN = tokenResponse.access_token;
    ITEM_ID = tokenResponse.item_id;
    res.json({
      access_token: ACCESS_TOKEN,
      item_id: ITEM_ID,
    });
    console.log("access token below");
    console.log(ACCESS_TOKEN);
  });
};

const getTransactions = (req, res) => {
  // Pull transactions for the last 30 days
  let startDate = moment().subtract(30, "days").format("YYYY-MM-DD");
  let endDate = moment().format("YYYY-MM-DD");
  console.log("made it past variables");
  client.getTransactions(
    ACCESS_TOKEN,
    startDate,
    endDate,
    {
      count: 250,
      offset: 0,
    },
    function (error, transactionsResponse) {
      res.json({ transactions: transactionsResponse });
      // TRANSACTIONS LOGGED BELOW!
      // They will show up in the terminal that you are running nodemon in.
      console.log(transactionsResponse);
    }
  );
};

module.exports = {
  receivePublicToken,
  getTransactions,
  createLinkToken,
};
