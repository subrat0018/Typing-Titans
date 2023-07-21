const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  currentIndex: {
    type: Number,
    default: 0,
  },
  socketId: { type: String },
  wpm: { type: Number, default: 0 },
  countDownConstant: Number,
  statsCharCount: Number,
  rawKeyStrokes: Number,
  userName: { type: String },
});
const GameSchema = new mongoose.Schema({
  words: { type: String },
  isOpen: { type: Boolean, default: true },
  players: [PlayerSchema],
  startTime: Number,
  type: String,
});
const LobbySchema = new mongoose.Schema({
  lobbyId: String,
  expireTime: Number,
  game: GameSchema,
  difficulty: String,
  playersCount: Number,
});
const Game = mongoose.model("Game", GameSchema);
const Lobby = mongoose.model("Loby", LobbySchema);
module.exports = { Game, Lobby };
