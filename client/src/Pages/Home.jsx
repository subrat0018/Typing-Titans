import React, { useEffect } from "react";
import { useState } from "react";
import socket from "../socketConfig";
import UserNameInput from "../Components/UserNameInput";
import DifficultyModal from "../Components/DifficultyModal";
const Home = () => {
  const [userName, setUserName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [mode, setMode] = useState("");
  useEffect(() => {
    let player = {
      userName: userName,
      mode: mode,
      difficulty: difficulty,
    };
    if (difficulty && mode) socket.emit("joinLobby", player);
    return () => {};
  }, [difficulty, mode, userName]);

  const UserNameTemp = () => {
    if (!userName) return <UserNameInput setUserName={setUserName} />;
    return;
  };
  const GetDifficulty = () => {
    if (!difficulty && mode)
      return <DifficultyModal setDifficulty={setDifficulty} />;
    return;
  };
  return (
    <div>
      <div>Increase Your Typing Speed with TypingTitan 🧚‍♀️</div>
      <div>
        <button
          onClick={() => {
            setMode("Single");
          }}
        >
          Single Player
        </button>
        <button className=" bg-red-200">Multi Player</button>
      </div>
      <GetDifficulty />
      <UserNameTemp />
    </div>
  );
};

export default Home;
