import React from "react";
import Player from "./../Player/Player";
import Pipe from "./../Pipes/Pipe";
import "./Game.css";

var pipeWidth = 80; // width of pie
var windowHeight = 700;

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      score: 0, // Game score
      speed: 0, // Game speed
      posY: 0, // player pos Y(px)
      posX: 0, // player pos X (px)
      velY: 0, // Velocity Y (falling or jumping)
      topPipes: [], // pipes at top
      bottomPipes: [], // pipes at bottom
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  // initialize all game values
  initGame() {
    let topPipeHeight = Math.floor(Math.random() * 300 + 100); // random top pipe height min 100px max 400px
    let bottomPipeHeight = 500 - topPipeHeight; // random bottom pipe height min 100 max 400

    let initialTopPipes = [
      {
        width: pipeWidth,
        heigth: topPipeHeight,
        posX: 400, //px
        posY: 0, //px
      },
      {
        width: pipeWidth,
        heigth: topPipeHeight,
        posX: 600, //px
        posY: 0, //px
      },
    ];
    let initialBottomPipes = [
      {
        width: pipeWidth,
        heigth: bottomPipeHeight,
        posX: 400, //px
        posY: 1, //px
      },
      {
        width: pipeWidth,
        heigth: bottomPipeHeight,
        posX: 600, //px
        posY: 1, //px
      },
    ];
    this.setState((prevState) => {
      return {
        score: 0,
        speed: 4,
        posX: 30,
        posY: 200,
        topPipes: initialTopPipes,
        bottomPipes: initialBottomPipes,
      };
    });
  }

  handleKeyDown(event) {
    if (event.keyCode === 87) {
      this.setState((prevState) => {
        return { velY: -5 };
      });
    }
  }

  handleShiftPipes() {
    let score = this.state.score; // get game score
    let speed = this.state.speed; // get game speed
    let topPipes = [...this.state.topPipes];
    let bottomPipes = [...this.state.bottomPipes];
    let topPipeHeight = Math.floor(Math.random() * 300 + 100); // random top pipe height min 100px max 400px
    let bottomPipeHeight = 500 - topPipeHeight; // random bottom pipe height min 100 max 400

    // if player passed a pipe increase score delete the pipes and add a new ones
    for (let i = 0; i < topPipes.length; i++) {
      if (topPipes[i].posX < -pipeWidth) {
        topPipes.shift();
        bottomPipes.shift();
        topPipes.push({
          width: pipeWidth,
          heigth: topPipeHeight,
          posX: 400, // page width
          posY: 0,
        });
        bottomPipes.push({
          width: pipeWidth,
          heigth: bottomPipeHeight,
          posX: 400, // pade width
          posY: 1,
        });
        score++; // increase score if player passed a pipe
        speed += 0.01; // increase game speed if player passed a pipe
      } else {
        topPipes[i].posX -= this.state.speed; // move pipe to left
        bottomPipes[i].posX -= this.state.speed; // move pipe to left
      }
    }
    this.setState({
      topPipes: topPipes,
      bottomPipes: bottomPipes,
      score: score,
      speed: speed,
    });
  }

  handlePlayer() {
    this.setState((prevState) => {
      // if player falling increase velY until it react maximum value
      if (prevState.velY < 6)
        return {
          posY: prevState.posY + prevState.velY,
          velY: prevState.velY + 0.2,
        };
      // if velY is max dont increase it and just keep falling :)
      else return { posY: prevState.posY + prevState.velY };
    });
  }

  handleCollisions() {
    let topPipes = this.state.topPipes;
    let bottomPipes = this.state.bottomPipes;
    // is player inside borders ?
    if (this.state.posY >= windowHeight - 60 || this.state.posY <= -25) {
      alert(("Score: " + this.state.score).toString());
      this.initGame(); // restart game if not
    }
    // did player hit top pipes ?
    for (let i = 0; i < topPipes.length; i++) {
      if (
        this.state.posX + 68 >= topPipes[i].posX &&
        this.state.posX + 30 <= topPipes[i].posX + pipeWidth &&
        this.state.posY + 120 < topPipes[i].heigth
      ) {
        alert(("Score: " + this.state.score).toString());
        this.initGame(); // restart game if yes
      }
    }
    // did player hit bottom pipes ?
    for (let i = 0; i < bottomPipes.length; i++) {
      if (
        this.state.posX + 68 >= topPipes[i].posX &&
        this.state.posX + 25 <= topPipes[i].posX + pipeWidth &&
        this.state.posY + 65 >= windowHeight - bottomPipes[i].heigth
      ) {
        alert(("Score: " + this.state.score).toString());
        this.initGame(); // restart game if yes
      }
    }
  }
  run() {
    this.initGame();
    setInterval(() => {
      this.handleShiftPipes();
      this.handlePlayer();
      this.handleCollisions();
    }, 1000 / 60);
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);
    this.run(); // Run game 60 fps
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", true);
  }
  // render all components
  render() {
    return (
      <div
        className="game-window"
        onClick={() => {
          this.setState((prevState) => {
            return { velY: -6 };
          });
        }}
      >
        <div
          id="Player"
          style={{
            position: "absolute",
            top: this.state.posY + "px",
            left: this.state.posX + "px",
          }}
        >
          <Player />
        </div>
        {[...this.state.topPipes, ...this.state.bottomPipes].map((pipe) => (
          <Pipe
            width={pipe.width}
            heigth={pipe.heigth}
            posX={pipe.posX}
            posY={pipe.posY}
          />
        ))}
        <div className="score">{this.state.score}</div>
      </div>
    );
  }
}
export default Game;
