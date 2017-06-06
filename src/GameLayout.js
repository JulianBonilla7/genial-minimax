import React, { Component } from 'react';
import { GridGenerator, Layout, Hexagon, Text, HexUtils } from 'react-hexgrid';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './GameLayout.css';
import Utils from './Utils';
import constantes from './constantes';

class GameLayout extends Component {
  constructor(props) {
    super(props);
    // Dimensiones del tablero (radio del hexágono empezando en 0)
    const radius = 5;
    // Generar tablero
    const hexagons = GridGenerator.hexagon(radius);

    // Bloquear esquinas del tablero y pintarlas 
    const printCoordinates = function (h) {
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
    hexagons.map(printCoordinates);

    this.state = {
      hexagons,
      move: { color: null, points: null },
      turno: true
    };
  }

  static propTypes = {
    turnoJugador: PropTypes.bool.isRequired,
    pcMove: PropTypes.func.isRequired,
    fichas: PropTypes.array
  };

  // onDrop you can read information of the hexagon that initiated the drag
  // Función ejecutada cuando el usuario coloca una pieza de ficha
  onDrop(event, source, targetProps) {
    const { move, hexagons } = this.state;
    const { turnoJugador } = this.props;

    let neighbours = []; // Casillas vecinas a la casilla objetivo
    let first = false; // bandera para validar si es la primera pieza de la ficha
    let moveResult = {}; // resultado del movimiento
    let hexas = hexagons.map(hex => {
      // When hexagon is dropped on this hexagon, copy it's image and text
      if (HexUtils.equals(source.state.hex, hex)) {
        // console.log(targetProps);
        // Copiar color de la pieza colocada
        hex.color = targetProps.data.color;
        first = targetProps.data.first;
        let color = hex.color;
        neighbours = hexagons.filter(h => HexUtils.distance(hex, h) < 2);
        /* 
        Guardar resultado del movimiento
        Los puntos son la cantidad de las casillas evaluadas con el mismo color menos la propia casilla
        */
        moveResult = {
          color: color,
          points: Utils.evaluarPuntaje(hexagons, hex)
        }

        // console.log(moveResult);
        // console.log(Utils.evaluarPuntaje(hexagons, hex));
        // console.log(`Puntaje con segunda función: ${Utils.evaluarPuntaje(hexagons, hex)}`);
        this.props.onDrop(event, source, moveResult);
      }
      return hex;
    });
    // console.log(neighbours);
    
    if (first) {        
      // Bloquear todas las casillas menos las siguientes a la primera ficha puesta
      const blocked = Utils.array_difference(hexas, neighbours);
      for(let b of blocked){
        b.blocked = true;
      }
    }
    else{               
      // Desbloquear tablero luego de terminar el movimiento
      hexas = hexagons.map(hex => {
        hex.blocked = false;
        return hex;
      });
    }

    // Actualizar estado del tablero
    this.setState({ hexagons: hexas, move: moveResult, turno: turnoJugador });

    // Turno del PC

  }

  onDragStart(event, source) {
    // Deshabilitar arrastre si la casilla no tiene contenido
    if (!source.props.data.text) {
      event.preventDefault();
    }
  }

  // Decide here if you want to allow drop to this node
  onDragOver(event, source) {
    // Find blocked hexagons by their 'blocked' attribute
    const blockedHexas = this.state.hexagons.filter(h => h.blocked);
    // Find if this hexagon is listed in blocked ones
    const blocked = blockedHexas.find(blockedHex => {
      return HexUtils.equals(source.state.hex, blockedHex);
    });

    const { text, color } = source.props.data;
    // Allow drop, if not blocked and there's no content already
    if (!blocked && !text && !color) {
      // Call preventDefault if you want to allow drop
      event.preventDefault();
    }
  }

  // onDragEnd you can do some logic, e.g. to clean up hexagon if drop was success
  onDragEnd(event, source, success) {
    if (!success) {
      return;
    }
    // TODO Drop the whole hex from array, currently somethings wrong with the patterns

    const { hexagons } = this.state;
    // When hexagon is successfully dropped, empty it's text and image
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.color = null;
      }
      return hex;
    });
    this.setState({ hexagons: hexas });
  }

  // Funcíón ejecutada al poner una ficha completa
  componentDidUpdate() {
    // const { turnoJugador } = this.props;

    // console.log('You made a move!');
    const { move, hexagons, turno } = this.state;
    const { fichas } = this.props;
    if (turno) {
      return;
    }
    // Turno del PC
    if (!turno) {
      // console.log(Utils.mejorMovimiento1(hexagons, 'red'));

      // Generar movimiento de primera pieza aleatorio
      // const casillaElegida = libres[Utils.random(libres.length)];
      // const casillaElegida = Utils.movimientoAleatorio(hexagons);
      // // Generar movimiento de primera pieza en base a casillas de un color

      // // Encontrar casilla elegida en el tablero
      // const blocked = hexagons.find(hex => {
      //   return HexUtils.equals(casillaElegida, hex);
      // });

      // // Encontrar posibles casillas para segunda pieza de ficha
      // const neighbours = Utils.array_intersect(
      //   hexagons, 
      //   // Casillas vecinas excluyendo las que ya tengan color
      //   hexagons.filter(h => HexUtils.distance(blocked, h) == 1 && !h.color)
      // );
      // // Asignar segunda ficha aleatoria
      // const secondBlocked = neighbours[Utils.random(neighbours.length)];
      // console.log(blocked);
      // console.log(secondBlocked);

      const movimiento = Utils.mejorMovimiento1(hexagons, fichas);
      // const movimiento = Utils.movimientoAleatorio(hexagons, fichas);
      // Poner fichas en el tablero
      let PCMove = {}
      const hexas = hexagons.map(hex => {
        for (let pieza in movimiento) {
          if(HexUtils.equals(movimiento[pieza], hex)){
            // console.log(movimiento[pieza]);
            hex.color = movimiento[pieza].color;
            PCMove = {
              color: hex.color,
              points: Utils.evaluarPuntaje(hexagons, hex)
            }
            this.setState({ move: PCMove });
            this.props.pcMove(PCMove);
          }
        }

        return hex;
      });

      this.setState({ 
        hexagons: hexas, 
        turno: true });
    }
  }

  render() {
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
              //className={hex.blocked ? ( hex.color ? hex.color : 'blocked' ) : null}
              className={classNames({'blocked': hex.blocked}, hex.color)}
              fill={(hex.image) ? HexUtils.getID(hex) : null}
              data={hex}
              onDragStart={(e, h) => this.onDragStart(e, h)}
              onDragEnd={(e, h, s) => this.onDragEnd(e, h, s)}
              onDrop={(e, h, t) => this.onDrop(e, h, t) }
              onDragOver={(e, h) => this.onDragOver(e, h) }
            >
              <Text>{hex.text || HexUtils.getID(hex)}</Text>
            </Hexagon>
          ))
        }
      </Layout>
    );
  }
}

export default GameLayout;
