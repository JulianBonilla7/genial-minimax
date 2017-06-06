import React, { Component } from 'react';
import { GridGenerator, Layout, Hexagon, Text, HexUtils } from 'react-hexgrid';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './GameLayout.css';
import Utils from './Utils';
import constantes from './constantes';

// Componente que representa el tablero de juego
class GameLayout extends Component {
  constructor(props) {
    super(props);
    // Dimensiones del tablero (radio del hexágono empezando en 0)
    const radius = 5;
    // Generar tablero
    const hexagons = GridGenerator.hexagon(radius);

    // Bloquear esquinas del tablero y pintarlas 
    const pintarCasillas = function (h) {
      let { q, r, s } = h;
      if (JSON.stringify([q, r, s])===JSON.stringify([-radius, 0, radius])){
        h.blocked = true;
        h.color = 'purple';
      }
      if (JSON.stringify([q, r, s])===JSON.stringify([-radius, radius, 0])){
        h.blocked = true;
        h.color = 'yellow';
      }
      if (JSON.stringify([q, r, s])===JSON.stringify([0, radius, -radius])){
        h.blocked = true;
        h.color = 'orange';
      }
      if (JSON.stringify([q, r, s])===JSON.stringify([radius, 0, -radius])){
        h.blocked = true;
        h.color = 'blue';
      }
      if (JSON.stringify([q, r, s])===JSON.stringify([radius, -radius, 0])){
        h.blocked = true;
        h.color = 'green';
      }
      if (JSON.stringify([q, r, s])===JSON.stringify([0, -radius, radius])){
        h.blocked = true;
        h.color = 'red';
      }
    }
    // Ejecutar la función pintarCasillas en cada casilla del tablero, pintando solo las esquinas
    hexagons.map(pintarCasillas);

    this.state = {
      hexagons,
      move: { color: null, points: null },    // Variable para almacenar el movimiento de un turno
      turno: true                             // Si es verdadera, indica el turno del jugador
    };
  }

  static propTypes = {
    turnoJugador: PropTypes.bool.isRequired,  // Indica el turno del jugador
    pcMove: PropTypes.func.isRequired,        // Función para ralizar el movimiento de IA y actualizar puntaje
    fichas: PropTypes.array                   // Fichas de IA
  };

  // Función ejecutada cuando el usuario coloca una pieza de ficha
  onDrop(event, source, targetProps) {
    const { move, hexagons } = this.state;
    const { turnoJugador } = this.props;

    let neighbours = []; // Casillas vecinas a la casilla objetivo
    let first = false; // bandera para validar si es la primera pieza de la ficha
    let moveResult = {}; // resultado del movimiento
    let hexas = hexagons.map(hex => {
      // Cuando se ponga una pieza de ficha sobre esta casilla, se copia su color y 
      // se verifica si es la primera pieza de la ficha (targetProps contiene info de la pieza soltada)
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.color = targetProps.data.color;
        first = targetProps.data.first;
        let color = hex.color;
        // Calcular vecinos de la casilla
        neighbours = hexagons.filter(h => HexUtils.distance(hex, h) < 2);
        // Guardar resultado del movimiento
        moveResult = {
          color: color,
          points: Utils.evaluarPuntaje(hexagons, hex)
        }
        // Enviar resultado del movimiento a App para que actualice los puntajes
        this.props.onDrop(event, source, moveResult);
      }
      return hex;
    });
    
    if (first) {        
      // Bloquear todas las casillas menos las siguientes a la primera pieza puesta
      const blocked = Utils.array_difference(hexas, neighbours);
      for(let b of blocked){
        b.blocked = true;
      }
    }
    else{               
      // Desbloquear tablero luego de terminar el movimiento de la ficha completa
      hexas = hexagons.map(hex => {
        hex.blocked = false;
        return hex;
      });
    }

    // Actualizar estado del tablero
    this.setState({ hexagons: hexas, move: moveResult, turno: turnoJugador });
  }

  // Evento ejecutado cuando la pieza arrastrada está sobre una casilla
  onDragOver(event, source) {
    // Guardar casillas bloqueadas
    const blockedHexas = this.state.hexagons.filter(h => h.blocked);
    // Validar si la casilla está entre las bloqueadas
    const blocked = blockedHexas.find(blockedHex => {
      return HexUtils.equals(source.state.hex, blockedHex);
    });
    // Saber si hay color en la casilla
    const { color } = source.props.data;
    // Si la casilla no está bloqueada y no tiene color aún, permitir soltar la pieza aquí
    if (!blocked && !color) {
      event.preventDefault();
    }
  }

  // Funcíón ejecutada cuando el tablero cambie
  componentDidUpdate() {
    // Traer estado
    const { move, hexagons, turno } = this.state; 
    // Traer fichas PC
    const { fichas } = this.props;
    // Si es el turno del jugador, finalizar esta función
    if (turno) {
      return;
    }
    // Turno del PC
    if (!turno) {
      // Movimiento basado en las casillas coloreadas del tablero (hexagons)
      const movimiento = Utils.mejorMovimiento1(hexagons, fichas);
      // Movimiento aleatorio, descomentar siguiente linea para probarlo
      // const movimiento = Utils.movimientoAleatorio(hexagons, fichas);

      // Variable para guardar el resultado del movimiento del PC
      let PCMove = {}
      // Poner piezas de la ficha en el tablero
      const hexas = hexagons.map(hex => {
        for (let pieza in movimiento) {
          if(HexUtils.equals(movimiento[pieza], hex)){
            hex.color = movimiento[pieza].color;
            // Actualizar variable con el color y los puntos generados en el movimiento
            PCMove = {
              color: hex.color,
              points: Utils.evaluarPuntaje(hexagons, hex)
            }
            // Actualizar movimiento en el tablero
            this.setState({ move: PCMove });
            // Enviar a App los resultados del movimiento para que actualice el puntaje
            this.props.pcMove(PCMove);
          }
        }
        return hex;
      });

      // Guardar estado del tablero y establecer turno del jugador
      this.setState({ 
        hexagons: hexas, 
        turno: true });
    }
  }

  render() {
    // Estado del tablero, es decir, todas las casillas con su información actual
    let { hexagons } = this.state;
    return (
      <Layout className="game" size={{ x: 3, y: 3 }} flat={false} spacing={1.01} origin={{ x: -30, y: 0 }}>
        {
          hexagons.map((hex, i) => (
            <Hexagon
              key={i}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              className={classNames({'blocked': hex.blocked}, hex.color)}
              data={hex}
              onDrop={(e, h, t) => this.onDrop(e, h, t) }
              onDragOver={(e, h) => this.onDragOver(e, h) }
            >
              {/* Imprimir coordenadas de la casilla en el tablero*/}
              <Text>{hex.text || HexUtils.getID(hex)}</Text>
            </Hexagon>
          ))
        }
      </Layout>
    );
  }
}

export default GameLayout;
