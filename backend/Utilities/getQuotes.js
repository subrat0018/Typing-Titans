const axios = require("axios");
const { base } = require("../db/racing");

const baseUrl = "https://api.quotable.io/quotes/random";
function getRandomPunctuation() {
  const punctuationMarks = [
    "!",
    ".",
    ",",
    ";",
    ":",
    "?",
    "'",
    '"',
    "-",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "…",
  ];
  const randomIndex = Math.floor(Math.random() * punctuationMarks.length);
  return punctuationMarks[randomIndex];
}
getEasy = async () => {
  let res = await axios.get(baseUrl + "?minLength=300" + "&maxLength=1000");
  let data = res.data[0].content;
  newData = "";
  for (let i = 0; i < data.length; i++) {
    if (data.charCodeAt(i) >= 65 && data.charCodeAt(i) <= 90) {
      newData += data.charAt(i).toLowerCase();
    } else if (data.charCodeAt(i) >= 97 && data.charCodeAt(i) <= 122) {
      newData += data.charAt(i);
    } else if (data.charAt(i) == " ") {
      newData += data.charAt(i);
    }
  }
  return newData;
};
getMedium = async () => {
  let res = await axios.get(baseUrl + "?minLength=300" + "&maxLength=1000");
  return res.data[0].content;
};
getHard = async () => {
  let data = await getMedium();
  newData = "";
  for (let i = 0; i < data.length; i++) {
    if (data.charCodeAt(i) >= 97 && data.charCodeAt(i) <= 122) {
      let x = Math.random();
      if (x <= 0.5) {
        newData += data.charAt(i);
      } else {
        newData += data.charAt(i).toUpperCase();
      }
    } else if (data.charAt(i) === " ") {
      newData += getRandomPunctuation();
      newData += " ";
    }
  }
  return newData;
};
getBasedOnDifficulty = async (difficulty) => {
  if (difficulty === "Easy") {
    let data = await getEasy();
    return data;
  } else if (difficulty == "Medium") {
    let data = await getMedium();
    return data;
  } else {
    let data = await getHard();
    return data;
  }
};
module.exports = { getBasedOnDifficulty };
