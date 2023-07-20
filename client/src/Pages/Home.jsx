import React from "react";
import { useState } from "react";
import socket from "../socketConfig";
const Home = () => {
  //   const [userName, setUserName] = useState("");
  //   let name = window.prompt("What's your name?");
  //   if (name) setUserName(name);
  return (
    <div>
      <div>Increase Your Typing Speed with TypingTitan 🧚‍♀️</div>
      <div>
        <button
          onClick={() => {
            let Details = { type: "Single", difficulty: "Easy" };
            socket.emit("joinLobby", Details);
          }}
        >
          Single Player
        </button>
        <button>Multi Player</button>
      </div>
    </div>
  );
};

export default Home;
