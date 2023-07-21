import React from "react";
import { BsFillKeyboardFill } from "react-icons/bs";

const Logo = ({ isFocusedMode, isMusicMode }) => {
  return (
    <div
      className="header"
      style={{ visibility: isFocusedMode ? "hidden" : "visible" }}
    >
      <h1 className="flex flex-row justify-center space-x-3">
        <div className="translate-y-1 text-red-500">Typing Titans</div>
        <BsFillKeyboardFill size={30} color="red" />
      </h1>
      <span className="sub-header">Type like a beast🦍</span>
    </div>
  );
};

export default Logo;
