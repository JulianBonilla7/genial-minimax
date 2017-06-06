import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HexTile from './HexTile';
import './TileList.css';

// Componente que va a almacenar la lista de fichas. 
class TileList extends Component {
  constructor(props){
    super(props);
    // Esto es necesario
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    
    const { fichas } = props;
    this.state = { 
      isTileMoving: false,        // Variable que indica si alguna ficha se está moviendo
      fichas: fichas              // Guardar la lista de fichas en el estado
    };
  }

  // Propiedades
  static propTypes = {
    fichas: PropTypes.array.isRequired,       // las fichas son asignadas externamente
  };

  // Evento que indica el inicio de agarre de alguna pieza
  // tileMoving indica si se está moviendo alguna ficha
  // isFirst indica si es la primera pieza de una ficha
  onDragStart(event, source, tileMoving, isFirst) {
    // Traer estado
    const { fichas } = this.state;
    // Obtener key de ficha movida (source es el objeto que genera el evento)
    const fichaMovida = source.props.data.ficha;
    // Bloquear las demás fichas en la lista
    const misFichas = fichas.map(ficha => {
      if (isFirst && (fichaMovida !== ficha.key)) {
        ficha.blocked = true;
      }

      return ficha;
    });
    // Actualizar estado
    this.setState({ 
      isTileMoving: isFirst, 
      fichas: misFichas 
    });
    /* Llamar función de evento padre indicándole 
     * si se está moviendo la primera pieza de una ficha
     */
    this.props.onDragStart(event, source, isFirst);
  }

  // Evento que indica el fin del agarre de una pieza
  onDragEnd(event, source, success) {
    // No hacer nada si el arrastre no fue exitoso
    if (!success) {
      return;
    }
    // Traer estado
    const { isTileMoving, fichas } = this.state;
    // Desbloquear todas las fichas
    const misFichas = fichas.map(ficha => {
      if (!isTileMoving) { ficha.blocked = false; }
      
      return ficha;
    });
    // Actualizar estado
    this.setState({ fichas: misFichas, isTileMoving: false });
    /* Llamar función de evento padre indicándole 
     * si se está moviendo la primera pieza de una ficha
     */
    this.props.onDragEnd(event, source, isTileMoving);
  }

  render() {
    const { fichas } = this.state;
    const { className } = this.props;
    return (
      <g className={className} transform={`translate(10, -20)`}>
        {
          /* Generar una ficha por cada elemento en la lista */
          fichas.map((ficha, i) => (
            <HexTile key={i} 
                     x={15} 
                     y={7*i} 
                     ficha={ficha}
                     blocked={ficha.blocked}
                     onDragStart={this.onDragStart}
                     onDragEnd={this.onDragEnd}
            />
          ))
        }
      </g>
    );
  }

}

export default TileList;