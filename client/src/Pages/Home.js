import React, { useEffect } from "react";
import { useState } from "react";
import socket from "../socketConfig";
import UserNameInput from "../Components/UserNameInput";
import DifficultyModal from "../Components/DifficultyModal";
import { useNavigate } from "react-router-dom";
const Home = ({ gameState, setGameState }) => {
  const [userName, setUserName] = useState("Guest");
  const [showUsername, setShowUsername] = useState(false);
  const [difficulty, setDifficulty] = useState("");
  const [mode, setMode] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let player = {
      userName: userName,
      mode: mode,
      difficulty: difficulty,
    };
    if (difficulty && mode) socket.emit("joinLobby", player);
    socket.on("gameUpdates", (game) => {
      setGameState({
        id: game._id.toString(),
        players: game.players,
        quote: game.words,
        type: game.type,
        username: userName,
        startTime: game.startTime,
      });
    });
    return () => {};
  }, [difficulty, mode]);
  useEffect(() => {
    if (gameState.id) {
      setDifficulty("");
      setMode("");
      navigate(`/playground/${gameState.id}`);
    }
  }, [gameState.id]);

  const UserNameTemp = () => {
    if (showUsername)
      return (
        <UserNameInput
          setUserName={setUserName}
          setShowUsername={setShowUsername}
        />
      );
    return;
  };
  const GetDifficulty = () => {
    if (!difficulty && mode)
      return <DifficultyModal setDifficulty={setDifficulty} />;
    return;
  };
  const Home = () => {
    return (
      <div>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Hello {userName}!
          </h2>
          {!showUsername && userName === "Guest" && (
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded shadow mb-4"
              onClick={() => {
                setShowUsername(true);
              }}
            >
              Set Username
            </button>
          )}
          <h1 className="text-4xl font-bold text-white mb-8">
            Increase Your Typing Speed with Typing Titans 🧚‍♀️
          </h1>
          <div className="space-y-4 space-x-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow"
              onClick={() => {
                setMode("Single");
              }}
            >
              Practice Yourself 🚀
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
              onClick={() => {
                setMode("Multi");
              }}
            >
              Enter A Typing Race 🏁
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      <Home />
      <GetDifficulty />
      <UserNameTemp />
    </div>
  );
};

export default Home;
