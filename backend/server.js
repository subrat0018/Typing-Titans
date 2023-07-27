// server.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const corsConfig = {
  origin: "http://localhost:3000",
  credentials: true,
};
const words = require("./Constants/words");
const app = express();

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { Game, Lobby } = require("./db/racing");
const { getBasedOnDifficulty } = require("./Utilities/getQuotes");

const PORT = 5000;

mongoose.connect("mongodb://127.0.0.1:27017/typingTitan");
app.use(cors(corsConfig));
// Array to store connected clients
const clients = [];

// Object to store lobbies
const lobbies = {};

// Event to handle new connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  socket.on("joinLobby", async (player) => {
    mode = player.mode;
    difficulty = player.difficulty;
    userName = player.userName;
    if (mode === "Single") {
      let game = new Game();
      const data = await getBasedOnDifficulty(difficulty);
      game.words = data;
      let player = {
        socketId: socket.id,
        userName: userName,
      };
      game.startTime = Date.now();
      game.players.push(player);
      game.type = "Single";
      game = await game.save();
      lobbyId = game._id.toString();
      socket.join(lobbyId);
      io.to(lobbyId).emit("gameUpdates", game);
      console.log(lobbyId);
    } else {
      let player = {
        socketId: socket.id,
        userName: userName,
      };
      let lobby = await Lobby.findOne({
        expireTime: { $gt: Date.now() },
        playersCount: { $lt: 8 },
        difficulty: difficulty,
      });
      if (lobby) {
        lobby.game.players.push(player);
        lobby.playersCount += 1;
        socket.join(lobby.lobbyId);
        await Lobby.updateOne({ lobbyId: lobby.lobbyId }, lobby);
        io.to(lobby.lobbyId).emit("gameUpdates", lobby.game);
        return;
      }
      let game = new Game();
      const data = await getBasedOnDifficulty(difficulty);
      game.words = data;
      game.startTime = Date.now();
      game.expireTime = game.startTime + 15000;
      game.players.push(player);
      game.type = "Multi";
      game = await game.save();
      let lobbyId = game._id.toString();
      let expireTime = game.startTime + 15000;
      let newLobby = new Lobby({
        lobbyId: lobbyId,
        expireTime: expireTime,
        game: game,
        difficulty: difficulty,
        playersCount: 1,
      });
      newLobby.save();
      socket.join(lobbyId);
      io.to(lobbyId).emit("gameUpdates", game);
    }
  });

  // Event to handle leaving a lobby
  socket.on("leaveLobby", (lobbyId) => {
    socket.leave(lobbyId);
    console.log(`Client ${socket.id} left lobby ${lobbyId}`);
  });

  // Event to handle starting a game in a lobby
  socket.on("startGame", (lobbyId) => {
    // Your logic to start the game and send the typing challenge to all players in the lobby
    // For example:
    const typingChallenge = generateTypingChallenge();
    lobbies[lobbyId].challenge = typingChallenge;
    io.to(lobbyId).emit("gameStarted", typingChallenge);
  });

  // Event to handle typing progress updates from clients
  socket.on("typingProgress", async (playerData) => {
    let lobby = await Lobby.findOne({ lobbyId: playerData.id });
    if (!lobby) return;
    for (let i = 0; i < lobby.game.players.length; i++) {
      if (lobby.game.players[i].socketId === socket.id) {
        lobby.game.players[i].wpm = playerData.wpm;
        lobby.game.players[i].statsCharCount = playerData.statsCharCount;
        lobby.game.players[i].wpmKeyStrokes = playerData.wpmKeyStrokes;
      }
    }
    lobby.game.players.sort((a, b) => {
      return b.wpm - a.wpm;
    });
    await Lobby.updateOne({ lobbyId: playerData.id }, lobby);
    io.to(playerData.id).emit("updatePlayers", lobby.game.players);
  });

  // Event to handle game end in a lobby
  socket.on("gameEnd", (lobbyId) => {
    // Your logic to process game results and display them to all players in the lobby
    const results = calculateGameResults(lobbyId);
    io.to(lobbyId).emit("showResults", results);
    delete lobbies[lobbyId]; // Remove the lobby data after the game ends
  });

  // Event to handle disconnections
  socket.on("disconnect", async () => {
    console.log("Client disconnected:", socket.id);
    let lobbies = await Lobby.find();
    if (!lobbies) return;
    lobbies.forEach(async (lobby) => {
      for (let i = 0; i < lobby.game.players.length; i++) {
        if (lobby.game.players[i].socketId === socket.id) {
          lobby.game.players[i].wpm =
            (lobby.game.players[i].wpmKeyStrokes / 5 / 30) * 60.0;
          lobby.game.players[i].statsCharCount =
            lobby.game.players[i].statsCharCount;
          lobby.game.players.sort((a, b) => {
            return b.wpm - a.wpm;
          });
          await Lobby.updateOne({ lobbyId: lobby.lobbyId }, lobby);
          io.to(lobby.lobbyId).emit("updatePlayers", lobby.game.players);
          return;
        }
      }
    });
  });
});

function findLobbyId(socketId) {
  for (const lobbyId in lobbies) {
    if (lobbies[lobbyId].players.includes(socketId)) {
      return lobbyId;
    }
  }
  return null;
}

// Helper functions for game logic (e.g., generating challenges, calculating results)...

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
