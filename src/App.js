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

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.pcMove = this.pcMove.bind(this);

    const playerScore = new Score('player');
    const PCScore = new Score('PC');
    const bolsa = BolsaFichas.crearFichas();
    const turnoJugador = true;
    const numeroFichas = 6;
    const fichasJugador = App.asignarFichas(bolsa, numeroFichas);
    const fichasPC = App.asignarFichas(bolsa, numeroFichas);

    this.state = { 
      playerScore, 
      PCScore, 
      bolsa,
      turnoJugador,
      fichasJugador,
      fichasPC
    };

    this.onDrop = this.onDrop.bind(this);
  }

  onDragStart(event, source, playerMoving) {
    console.log(`Jugador empezó movimiento. Moviendo? ${playerMoving}`);
    this.setState({ turnoJugador: playerMoving })
    // this.setState({ isTileMoving: true })
  }

  onDragEnd(event, source, moving) {
    const { bolsa, fichasJugador } = this.state;
    console.log(`Jugador terminó movimiento. Moviendo? ${moving}`);
    this.setState({ turnoJugador: moving });
    if (!moving) {
      const fichaMovida = source.props.data.ficha;
      console.log(fichaMovida);
      const fichaNueva = BolsaFichas.agregarFicha(bolsa);
      console.log(fichaNueva);
      fichasJugador.splice(fichasJugador.findIndex(f => f.key == source.props.data.ficha), 1);
      fichasJugador.push(fichaNueva);
    }
    // this.setState({ isTileMoving: false })
  }

  // Actualizar puntos cuando el usuario pone una pieza
  onDrop(event, source, move){
    const { playerScore } = this.state;
    playerScore.update(move.color, move.points);

    this.setState( playerScore: playerScore);
  }

  pcMove(move){
    const { PCScore } = this.state;
    // console.log(PCScore, move);
    PCScore.update(move.color, move.points);

    this.setState( PCScore: PCScore);
  }

  static asignarFichas(bolsa, numero) {
    // const { bolsa } = this.state;
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
    const { playerScore, PCScore, bolsa, turnoJugador, fichasJugador, fichasPC } = this.state;
    
    return (
      <div className="app">
        <h2>Genial!</h2>
        <HexGrid width={1200} height={800} viewBox="-50 -50 100 100">
          <GameLayout onDrop={this.onDrop} 
                      turnoJugador={turnoJugador}
                      pcMove={this.pcMove}
                      fichas={fichasPC} />
          <TileList className={'tiles'} 
                    fichas={fichasJugador} 
                    onDragStart={this.onDragStart} 
                    onDragEnd={this.onDragEnd} 
          />
        </HexGrid>
        <Scoreboard score={playerScore} style={{"float": "left"}}/>
        <Scoreboard score={PCScore} style={{"float": "right"}}/>
      </div>
    );
  }
}

export default App;
