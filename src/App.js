import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameLayout from './GameLayout';
import TilesLayout from './TilesLayout';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h2>Genial!</h2>
        <HexGrid width={1600} height={1000} viewBox="-50 -50 100 100">
          <GameLayout />
          <TilesLayout />
        </HexGrid>
      </div>
    );
  }
}

export default App;
