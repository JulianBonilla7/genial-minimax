import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameLayout from './GameLayout';
import HexTile from './HexTile';
import BolsaFichas from './BolsaFichas';
import Scoreboard from './Scoreboard';
import TileList from './TileList';
import Score from './Score';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    const playerScore = new Score('player', 0, 0, 0, 0, 0, 0);
    const bolsa = BolsaFichas.crearFichas();
    this.state = { playerScore, bolsa };

  }

  updateScore(color, points) {
    const { score } = this.state;
    score[color] = points;
    this.setState({ score: score });
  }

  asignarFichas(numero) {
    const { bolsa } = this.state;
    const fichas = [];
    for (let i = 0; i < numero; i++) {
      // Repartir fichas aleatoriamente quitándolas de la bolsa
      let random = Math.floor(Math.random()*bolsa.length);
      fichas.push(bolsa[random]);
      bolsa.splice(random, 1);
    }
    // this.setState({ bolsa: bolsa });
    return fichas;
  }

  render() {
    const { bolsa } = this.state;
    const numeroFichas = 6;
    const fichasJugador = this.asignarFichas(numeroFichas);
    return (
      <div className="app">
        <h2>Genial!</h2>
        <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
          <GameLayout onDrag />
          {/*<TilesLayout />*/}
          <TileList fichas={fichasJugador}/>
        </HexGrid>
        <Scoreboard/>
      </div>
    );
  }
}

export default App;
