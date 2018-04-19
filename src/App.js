import React, { Component } from 'react'
import battleshipLogo from './battleship.svg'
import { Button, Input } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: null,
      gameCode: null,
      playing: false,
      gridSize: 10,
    };

    this.joinGame = this.joinGame.bind(this);
    this.createGame = this.createGame.bind(this);
    this.updateGame = this.updateGame.bind(this);
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
    console.log('polling status');
    fetch('http://kepler.covenant.edu:8080/api/status', {
      body: JSON.stringify({
        session: this.state.session,
      }),
      method: 'POST',
    }).then(async response => {
      const json = await response.json();
      console.log(json);
      const board = json.response.board.grid;
      console.log(board);
      const ships = json.response.client.ships;
      console.log(ships);
      ships.forEach(ship => {
        console.log(ship);
        ship.squares.forEach(square => {
          board[square.y][square.x] = square.contents;
        })
      });
      this.setState({
        gridSize: json.response.board.width,
        board
      });
    });
  }

  static getClassNameByContents(contents) {
    switch(contents) {
      case 0:
        return 'water';
      case 1:
        return 'ship';
    }
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <img src={battleshipLogo} className="logo" alt="logo" />
          <h1 className="intro">Welcome to Multiplayer Battleship</h1>
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
                                  if(this.state.board[i][j] !== 1) {
                                    alert('TODO cell ' + (j - 1) + ', ' + i + ' clicked');
                                  }
                                }}
                                className={App.getClassNameByContents(this.state.board[i][j])} />
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
