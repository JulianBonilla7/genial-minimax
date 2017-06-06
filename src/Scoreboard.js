import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorScore from './ColorScore';
import './Scoreboard.css';

// Componente para mostrar los puntajes (no tiene estado)
class Scoreboard extends Component{
  constructor(props) {
    super(props);
  }

  static propTypes = {
    score: PropTypes.object.isRequired,       // Objeto de puntaje requerido
    style: PropTypes.object,                  // Objeto de estilos CSS
  };

  render() {
    const { score, style } = this.props;
    // Guardar colores y sus puntajes en un arreglo
    const colores = []
    for (let prop in score) {
      if(prop != 'player'){
        colores.push({ color: prop, score: score[prop] });
      }
    }
    return(
      <table className="puntajes" style={style}>
        <thead>
          {/* Nombre jugador */}
          <tr><td><span style={{"textTransform": "capitalize"}}>{score.player}</span></td></tr>
        </thead>
        <tbody>
        {
          /* Por cada color crear una fila de tabla */
          colores.map((c, i) => (
            <ColorScore key={i} color={c.color} score={c.score}/>
          ))
        }
        </tbody>
      </table>
    );
  }
}

export default Scoreboard;
