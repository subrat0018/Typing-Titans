import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import PlayGround from "./Pages/PlayGround";
import { useEffect } from "react";
import socket from "./socketConfig";

function App() {
  const [gameState, setGameState] = useState({ id: "", players: [] });
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home gameState={gameState} setGameState={setGameState} />}
        />
        <Route
          path="/playground/:gameId"
          element={<PlayGround gameState={gameState} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
