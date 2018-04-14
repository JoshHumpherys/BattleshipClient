import React, { Component } from 'react'
import battleshipLogo from './battleship.svg'
import { Button, Input } from 'semantic-ui-react'

class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="header">
          <img src={battleshipLogo} className="logo" alt="logo" />
          <h1 className="intro">Welcome to Multiplayer Battleship</h1>
        </header>
        <div className="body">
          <Input placeholder='Game name' />
          <Button>Join game</Button>
          <Button>Create game</Button>
        </div>
      </div>
    );
  }
}

export default App;
