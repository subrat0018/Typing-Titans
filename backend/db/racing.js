const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  currentIndex: {
    type: Number,
    default: 0,
  },
  sockId: { type: String },
  WPM: { type: Number, default: -1 },
  userName: { type: String },
});
const GameSchema = new mongoose.Schema({
  words: { type: String },
  isOpen: { type: Boolean, default: true },
  players: [PlayerSchema],
  startTime: Number,
});

module.exports = mongoose.model("Game", GameSchema);
