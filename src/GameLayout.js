import React, { Component } from 'react';
import { GridGenerator, Layout, Hexagon, Text, HexUtils } from 'react-hexgrid';
import classNames from 'classnames';
import './GameLayout.css';
import Utils from './Utils';

class GameLayout extends Component {
  constructor(props) {
    super(props);
    const radius = 3;
    const hexagons = GridGenerator.hexagon(radius);
    // Add custom prop to couple of hexagons to indicate them being blocked

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
      move: { color: null, points: null }
    };
  }

  // onDrop you can read information of the hexagon that initiated the drag
  onDrop(event, source, targetProps) {
    const { move, hexagons } = this.state;
    let neighbours = [];
    let first = false;
    let moveResult = {};
    let hexas = hexagons.map(hex => {
      // When hexagon is dropped on this hexagon, copy it's image and text
      if (HexUtils.equals(source.state.hex, hex)) {
        // console.log(targetProps);
        hex.color = targetProps.data.color;
        first = targetProps.data.first;
        let color = hex.color;

        // Calcular puntos buscando en las casillas vecinas y sobre los ejes
        const coloredHexas = hexagons.filter(h => {
          if (HexUtils.distance(hex, h) < 2 || 
              hex.q === h.q || 
              hex.r === h.r || 
              hex.s === h.s
          ){
            if (h.color === color) {
              return true;
            }
          }
        });

        moveResult = {
          color: color,
          points: coloredHexas.length - 1
        }
        console.log(moveResult);
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

    this.setState({ hexagons: hexas, move: moveResult });
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
