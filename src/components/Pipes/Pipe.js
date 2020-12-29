import React from "react";
import "./Pipe.css";

function Pipe(props) {
  var bottom = "0%";

  if (props.posY === 0) bottom = 800 - props.heigth;
  return (
    <div
      className="pipe"
      style={{
        width: props.width + "px",
        height: props.heigth + "px",
        left: props.posX + "px",
        bottom: bottom,
      }}
    ></div>
  );
}

export default Pipe;
