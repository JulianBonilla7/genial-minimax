import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameLayout from './GameLayout';
import TilesLayout from './TilesLayout';
import HexTile from './HexTile';
import Ficha from './Ficha';
import BolsaFichas from './BolsaFichas';
import Scoreboard from './Scoreboard';
import './App.css';

class App extends Component {
  render() {
    const numberOfTiles = 6;
    const bolsa = BolsaFichas.crearFichas();
    const playerScoreboard = new Scoreboard();
    console.log(playerScoreboard);
    playerScoreboard.red++;
    console.log(playerScoreboard);
    
    console.log(bolsa.length);
    let tiles = [];
    for (var i = 0; i < numberOfTiles; i++) {
      tiles.push(new Ficha());
    }
    return (
      <div className="app">
        <h2>Genial!</h2>
        <HexGrid width={1600} height={1000} viewBox="-50 -50 100 100">
          <GameLayout />
          <TilesLayout />
          {
            tiles.map((tile, i) => (
              <HexTile 
                key={i} 
                x={15} 
                y={8*i}/>
            ))
          }
        </HexGrid>
      </div>
    );
  }
}

export default App;
