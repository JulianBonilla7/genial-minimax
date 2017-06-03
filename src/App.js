import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameLayout from './GameLayout';
import HexTile from './HexTile';
import BolsaFichas from './BolsaFichas';
import Scoreboard from './Scoreboard';
import Score from './Score';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    const playerScore = new Score('player', 0, 0, 0, 0, 0, 0);
    this.state = { playerScore };
  }

  updateScore(color, points) {
    const { score } = this.state;
    score[color] = points;
    this.setState({ score: score });
  }

  render() {
    const numberOfTiles = 6;
    // Generar fichas
    let bolsa = BolsaFichas.crearFichas();
    // const playerScoreboard = new Scoreboard();
    // console.log(playerScoreboard);
    // playerScoreboard.red++;
    // console.log(playerScoreboard);
    
    console.log(bolsa.length);
    let fichasJugador = [];
    let fichasIA = [];
    for (let i = 0; i < numberOfTiles; i++) {
      // Repartir fichas aleatoriamente quitándolas de la bolsa
      let random = Math.floor(Math.random()*bolsa.length);
      fichasJugador.push(bolsa[random]);
      bolsa.splice(random, 1);
    }
    for (let j = 0; j < numberOfTiles; j++) {
      // Repartir fichas aleatoriamente quitándolas de la bolsa
      let random = Math.floor(Math.random()*bolsa.length);
      fichasIA.push(bolsa[random]);
      bolsa.splice(random, 1);
    }
    // console.log('Fichas repartidas');
    // console.log('Fichas en bolsa: ' + bolsa.length);
    // console.log('Jugador:');
    // console.log(fichasJugador);
    // console.log(fichasIA);

    return (
      <div className="app">
        <h2>Genial!</h2>
        <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
          <GameLayout onDrag />
          {/*<TilesLayout />*/}
          {
            fichasJugador.map((tile, i) => (
              <HexTile 
                key={i} 
                x={15} 
                y={7*i}
                ficha={tile}/>
            ))
          }
        </HexGrid>
        <Scoreboard/>
      </div>
    );
  }
}

export default App;
