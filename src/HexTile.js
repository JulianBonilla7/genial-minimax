import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { GridGenerator, Layout, Hexagon, HexUtils } from 'react-hexgrid';
import Utils from './Utils';

// Componente que va a representar cada ficha
class HexTile extends Component{
  constructor(props) {
    super(props);
    let { color1, color2, key } = props.ficha;
    let ficha = [color1, color2];

    // Inicializar casillas con los colores y el key de la ficha
    const hexagons = GridGenerator.orientedRectangle(2, 1).map((hexagon, index) => {
      return Object.assign({}, hexagon, {
        color: ficha[index],
        ficha: key
      });
    });

    this.state = { 
      hexagons, 
      moving: false,
      first: false
    };
  }

  // Propiedades que se esperan recibir, con su tipo
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    ficha: PropTypes.object.isRequired,
    blocked: PropTypes.bool
  };

  // Asignar propiedades por defecto
  static defaultProps = {
    x: 0,
    y: 0,
    ficha: {},
    blocked: false
  }

  // Evento que indica el inicio de arrastre de alguna pieza
  onDragStart(event, source) {
    // No permitir arrastre si la casilla está bloqueada
    const { blocked } = this.props;
    if (blocked) {
      event.preventDefault();
      return;
    }
    // Traer estado
    const { hexagons, first } = this.state;
    // isFirst indica si es la primera pieza de la ficha que se está moviendo.
    // se inicializa en falso
    let isFirst = false;
    // Obtener la casilla que no se arrastra
    const neighbours = HexUtils.neighbours(source.state.hex);
    const secondHex = hexagons.filter(h => {
      for(let n of neighbours){
        if(HexUtils.equals(n, h)){
          return true;
        }
      }
    })[0];
    // Verificar en ambas casillas qué casilla se movió, y asignarle la propiedad first 
    // si la otra casilla tiene color
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex) && secondHex.color){
        isFirst = hex.first = true;
        source.setState({ hex: hex });
      }
      return hex;
    })
    this.setState({ hexagons: hexas, moving: true, first: isFirst });
    // Ejecutar el evento de TileList indicándole el valor de isFirst
    this.props.onDragStart(event, source, true, isFirst);
  }

  // Evento que indica el fin del arrastre de una pieza
  onDragEnd(event, source, success) {
    // No hacer nada si el arrastre no fue exitoso
    if (!success) {
      return;
    }
    // Traer estado
    const { hexagons, first } = this.state;
    // Eliminar color de la casilla movida
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.color = null;
      }
      return hex;
    });
    // Variable para saber si se está moviendo una ficha.
    // En caso de terminar de mover la primera casilla es true
    // Si se termina de mover la segunda, significa que ya se movió la ficha completa
    let moving = first;
    // Actualizar estado
    this.setState({ hexagons: hexas, moving: moving });
    // Ejecutar el evento de TileList indicándole el valor de moving
    this.props.onDragEnd(event, source, success, moving);
  }

  render() {
    const { hexagons } = this.state;
    const { blocked } = this.props;
    return (
      <Layout className="tile" size={{ x: 3, y: 3 }} flat={false} spacing={1.01} 
              origin={{ x: this.props.x, y: this.props.y }}>
        {
          hexagons.map((hex, i) => (
            <Hexagon
              key={i}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              className={classNames({'blocked': blocked}, hex.color)}
              data={hex}
              onDragStart={(e, h) => this.onDragStart(e, h)}
              onDragEnd={(e, h, s) => this.onDragEnd(e, h, s)}
            >
            </Hexagon>
          ))
        }
      </Layout>
    );
  }
}

export default HexTile;