import React, { Component } from 'react'
import battleshipLogo from './battleship.svg'
import { Button, Input } from 'semantic-ui-react'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: null,
      playing: false,
      starting: false,
      gridSize: 10,
    };

    this.joinGame = this.joinGame.bind(this);
    this.createGame = this.createGame.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  joinGame() {
    this.setState({ playing: true });
  }

  createGame() {
    this.setState({ starting: true });
  }

  startGame() {
    this.setState({ starting: false, playing: true });
  }

  render() {
    return (
      <div className="app">
        <header className="header">
          <img src={battleshipLogo} className="logo" alt="logo" />
          <h1 className="intro">Welcome to Multiplayer Battleship</h1>
        </header>
        {
          this.state.playing ? (
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
                              <td key={j} onClick={() => alert('TODO cell ' + (j - 1) + ', ' + i + ' clicked')} />
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
            this.state.starting ? (
              <div className="body">
                <Button onClick={this.startGame}>Start game</Button>
              </div>
            ) : (
              <div className="body">
                <Input placeholder='Game name' onChange={(e, data) => this.setState({ code: data.value })} />
                <Button onClick={this.joinGame}>Join game</Button>
                <Button onClick={this.createGame}>Create game</Button>
              </div>
            )
          )
        }
      </div>
    );
  }
}

export default App;
