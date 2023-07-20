const axios = require("axios");
const { base } = require("../db/racing");

const baseUrl = "https://api.quotable.io/quotes/random";

getQuote = async () => {
  let res = await axios.get(baseUrl);
  console.log(res.data[0].content);
  return res.data[0].content;
};
getQuoteOfLength = async (a, b) => {
  let res = await axios.get(baseUrl + "/minLength=" + a + "&maxLength=" + b);
  return res.data.content;
};
module.exports = { getQuote, getQuoteOfLength };
