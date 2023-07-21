import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import PlayGround from "./Pages/PlayGround";
import { useEffect } from "react";
import socket from "./socketConfig";

function App() {
  const [gameState, setGameState] = useState({
    id: "",
    players: [],
    quote: "",
    type: "",
    username: "",
    startTime: 0,
  });
  console.log(gameState);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home gameState={gameState} setGameState={setGameState} />}
        />
        <Route
          path="/playground/:gameId"
          element={
            <PlayGround
              quote={gameState.quote}
              id={gameState.id}
              players={gameState.players}
              type={gameState.type}
              username={gameState.username}
              startTime={gameState.startTime}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
