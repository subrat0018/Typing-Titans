const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  currentIndex: {
    type: Number,
    default: 0,
  },
  socketId: { type: String },
  WPM: { type: Number, default: -1 },
  userName: { type: String },
});
const GameSchema = new mongoose.Schema({
  words: { type: String },
  isOpen: { type: Boolean, default: true },
  players: [PlayerSchema],
  startTime: Number,
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
