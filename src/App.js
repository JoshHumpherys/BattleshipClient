import React, { Component } from 'react'
import battleshipLogo from './battleship.svg'
import { Button, Input } from 'semantic-ui-react'
import LoadingMeter from './LoadingMeter'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      gameCode: null,
      playing: false,
      gridSize: 10,
      players: [],
    };

    this.joinGame = this.joinGame.bind(this);
    this.createGame = this.createGame.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.fire = this.fire.bind(this);
  }

  joinGame() {
    fetch('http://kepler.covenant.edu:8080/api/start', {
      body: JSON.stringify({
        session: null,
        gameCode: this.state.gameCode,
        playerName: this.state.playerName,
        numPlayers: 2,
      }),
      method: 'POST',
    }).then(async response => {
      const json = await response.json();
      this.setState({ session: json.response.session });
      this.updateGame();
      this.setState({ playing: true });
      setInterval(this.updateGame, 1000);
    });
  }

  createGame() {
    fetch('http://kepler.covenant.edu:8080/api/start', {
      body: JSON.stringify({
        session: null,
        gameCode: this.state.gameCode,
        playerName: this.state.playerName,
        numPlayers: this.state.numPlayers,
      }),
      method: 'POST',
    }).then(async response => {
      const json = await response.json();
      this.setState({ session: json.response.session });
      this.updateGame();
      this.setState({ playing: true });
      setInterval(this.updateGame, 1000);
    });
  }

  updateGame() {
    fetch('http://kepler.covenant.edu:8080/api/status', {
      body: JSON.stringify({
        session: this.state.session,
      }),
      method: 'POST',
    }).then(async response => {
      const json = await response.json();
      console.log(json);
      let board = this.state.board;
      if(board === undefined) {
        board = json.response.board.grid.map(row => row.map(_ => 0));
        this.setState({ gridSize: board.length, board });
      }
      const ships = json.response.client.ships;
      ships.forEach(ship => {
        ship.squares.forEach(square => {
          board[square.y][square.x] = square.contents;
        })
      });
      this.setState({ board, players: json.response.players });
    });
  }

  fire(x, y) {
    fetch('http://kepler.covenant.edu:8080/api/fire', {
      body: JSON.stringify({
        session: this.state.session,
        x,
        y
      }),
      method: 'POST',
    }).then(async response => {
      let json, result;
      try {
        json = await response.json();
        const statusCode = json.status.code;
        if(statusCode === 5 || statusCode === 2) { // 5 too soon, 2 already shot
          return;
        }
        result = json.response.result;
      } catch(e) {
        result = true; // TODO when the server throws a 500 it's a hit
      }
      let board = this.state.board;
      board[y][x] = result ? 4 : 3;
      this.setState({ board, lastFireTime: Date.now() });
    });
  }

  static getClassNameByContents(contents) {
    switch(contents) {
      case 0:
        return 'water';
      case 1:
        return 'ship';
      case 2:
        return 'destroyed';
      case 3:
        return 'miss';
      case 4:
        return 'hit';
    }
  }

  render() {
    return (
      <div className={'app' + (this.state.playing && this.state.board ? ' playing' : '')}>
        <header className="header">
          {
            this.state.playing && this.state.board ? (
              <div>
                <h2>Leaderboard</h2>
                <table className="leaderboard">
                  <thead>
                  <tr>
                    <th>Player name</th>
                    <th>Score</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.players.map((player, i) =>
                      <tr key={i}>
                        <td>{player.name}</td>
                        <td>{player.score}</td>
                      </tr>
                    )
                  }
                  </tbody>
                </table>
                <LoadingMeter lastFireTime={this.state.lastFireTime} />
              </div>
            ) : (
              [
                <img key="img" src={battleshipLogo} className="logo" alt="logo" />,
                <h1 key="h1" className="intro">Welcome to Multiplayer Battleship</h1>,
              ]
            )
          }
        </header>
        {
          this.state.playing && this.state.board ? (
            <div className="body">
              <table className="board">
                <thead>
                  <tr>
                    {
                      new Array(this.state.gridSize + 1).fill().map((_, i) =>
                        <th key={i}>
                          {i === 0 ? '' : String.fromCharCode('A'.charCodeAt(0) + i - 1)}
                        </th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    new Array(this.state.gridSize).fill('').map((_, i) =>
                      <tr key={i}>
                        {
                          new Array(this.state.gridSize + 1).fill('').map((_, j) =>
                            j === 0 ? (
                              <td key={j}>{i + 1}</td>
                            ) : (
                              <td key={j}
                                onClick={() => {
                                  if(this.state.board[i][j - 1] === 0) {
                                    this.fire(j - 1, i);
                                  }
                                }}
                                className={App.getClassNameByContents(this.state.board[i][j - 1])} />
                            )
                          )
                        }
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <div className="body">
              <Input placeholder='Game name' onChange={(e, data) => this.setState({ gameCode: data.value })} />
              <Input placeholder='Player name' onChange={(e, data) => this.setState({ playerName: data.value })} />
              <Button onClick={this.joinGame}>Join game</Button>
              <br />
              <br />
              <Input placeholder='Game name' onChange={(e, data) => this.setState({ gameCode: data.value })} />
              <Input placeholder='Player name' onChange={(e, data) => this.setState({ playerName: data.value })} />
              <Input placeholder='Number of players' type='number' onChange={(e, data) => this.setState({ numPlayers: data.value })} />
              <Button onClick={this.createGame}>Create game</Button>
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
