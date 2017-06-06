import React, { Component } from 'react';
import { HexGrid } from 'react-hexgrid';
import GameLayout from './GameLayout';
import HexTile from './HexTile';
import BolsaFichas from './BolsaFichas';
import Scoreboard from './Scoreboard';
import TileList from './TileList';
import Score from './Score';
import './App.css';

/* Componente principal, este componente es el llamado en index.js 
 * el cual conecta la aplicación con la página
 */
class App extends Component {
  constructor(props){
    super(props);

    // Esto es necesario para escuchar los eventos en los componentes hijos
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.pcMove = this.pcMove.bind(this);
    this.onDrop = this.onDrop.bind(this);

    // Objetos puntaje para cada jugador
    const playerScore = new Score('player');
    const PCScore = new Score('PC');
    // Crear fichas, repartirlas a cada jugador y iniciar el turno del jugador humano
    const bolsa = BolsaFichas.crearFichas();
    const numeroFichas = 6;
    const fichasJugador = App.asignarFichas(bolsa, numeroFichas);
    const fichasPC = App.asignarFichas(bolsa, numeroFichas);
    const turnoJugador = true;

    // Guardar puntajes, bolsa, listas de fichas y turno en el estado
    this.state = { 
      playerScore, 
      PCScore, 
      bolsa,
      turnoJugador,
      fichasJugador,
      fichasPC
    };
  }

  // Evento que indica el inicio de arrastre de una pieza de la lista de fichas
  onDragStart(event, source, playerMoving) {
    // console.log(`Jugador empezó movimiento. Moviendo? ${playerMoving}`);
    this.setState({ turnoJugador: playerMoving })
  }

  // Evento que indica el fin del arrastre de una pieza de la lista de fichas
  onDragEnd(event, source, moving) {
    const { bolsa, fichasJugador } = this.state;
    // console.log(`Jugador terminó movimiento. Moviendo? ${moving}`);
    this.setState({ turnoJugador: moving });
    // Si el jugador termina su turno al mover la última pieza de la ficha, se le asigna una nueva ficha
    if (!moving) {
      const fichaMovida = source.props.data.ficha;
      const fichaNueva = BolsaFichas.agregarFicha(bolsa);
      const fichas = fichasJugador.map(f => {
        if(f.key == fichaMovida){
          f = fichaNueva;
        }
        return f;
      })
      // fichasJugador.splice(fichasJugador.findIndex(f => f.key == source.props.data.ficha), 1);
      // fichasJugador.push(fichaNueva);
      this.setState({ fichasJugador: fichas })
      // console.log(this.state.fichasJugador);
    }
  }

  // Actualizar puntos cuando el usuario pone una pieza en el tablero
  onDrop(event, source, move){
    const { playerScore } = this.state;
    playerScore.update(move.color, move.points);

    this.setState( playerScore: playerScore);
  }

  // Actualizar puntos cuando el PC genera un movimiento
  pcMove(move){
    const { PCScore } = this.state;
    PCScore.update(move.color, move.points);

    this.setState( PCScore: PCScore);
  }

  // Saca el número indicado fichas iniciales de la bolsa
  static asignarFichas(bolsa, numero) {
    const fichas = [];
    for (let i = 0; i < numero; i++) {
      // Repartir fichas aleatoriamente
      let random = Math.floor(Math.random()*bolsa.length);
      // Añadir ficha elegida en la lista de fichas
      fichas.push(bolsa[random]);
      // Quitar ficha elegida de la bolsa
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
        <HexGrid width={1200} height={800} viewBox="-50 -30 50 100">
          {/* Tablero */}
          <GameLayout onDrop={this.onDrop} 
                      turnoJugador={turnoJugador}
                      pcMove={this.pcMove}
                      fichas={fichasPC} />
          {/* Lista de fichas */}
          <TileList className={'tiles'} 
                    fichas={fichasJugador} 
                    onDragStart={this.onDragStart} 
                    onDragEnd={this.onDragEnd} 
          />
        </HexGrid>
        {/* Puntajes */}
        <Scoreboard score={playerScore} style={{"float": "left"}}/>
        <Scoreboard score={PCScore} style={{"float": "right"}}/>
      </div>
    );
  }
}

export default App;
