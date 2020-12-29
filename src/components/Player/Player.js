import React from "react";
import playerModel from "./../../Models/playerModel.png";

function Player() {
  return (
    <img
      width="80px"
      height="80px"
      unselectable="on"
      src={playerModel}
      alt="player"
    />
  );
}

export default Player;
