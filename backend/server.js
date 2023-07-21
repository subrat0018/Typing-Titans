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
        io.to(lobby.lobbyId).emit("gameUpdates", lobby.game);
        return;
      }
      let game = new Game();
      const data = await getBasedOnDifficulty(difficulty);
      game.words = data;
      game.startTime = Date.now();
      game.expireTime = game.startTime + 15000;
      game.players.push(player);
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
  socket.on("typingProgress", (data) => {
    // Your logic to update the typing progress and broadcast it to all players in the lobby
    const { lobbyId, progress } = data;
    lobbies[lobbyId].progress[socket.id] = progress;
    io.to(lobbyId).emit("updateProgress", lobbies[lobbyId].progress);
  });

  // Event to handle game end in a lobby
  socket.on("gameEnd", (lobbyId) => {
    // Your logic to process game results and display them to all players in the lobby
    const results = calculateGameResults(lobbyId);
    io.to(lobbyId).emit("showResults", results);
    delete lobbies[lobbyId]; // Remove the lobby data after the game ends
  });

  // Event to handle disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    // Your logic to handle player disconnections and remove them from the lobby if necessary
    const lobbyId = findLobbyId(socket.id);
    if (lobbyId) {
      delete lobbies[lobbyId].progress[socket.id];
      io.to(lobbyId).emit("updateProgress", lobbies[lobbyId].progress);
    }
    clients.splice(clients.indexOf(socket.id), 1);
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
