import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorScore from './ColorScore';
import './Scoreboard.css';

class Scoreboard extends Component{
  constructor(props) {
    super(props);
  }

  static propTypes = {
    score: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
  };

  render() {
    const { score, style } = this.props;
    const colores = []
    for (let prop in score) {
      if(prop != 'player'){
        colores.push({ color: prop, score: score[prop] });
      }
    }
    return(
      <table className="puntajes" style={style}>
        <thead>
          <tr><td><span style={{"textTransform": "capitalize"}}>{score.player}</span></td></tr>
        </thead>
        <tbody>
        {
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
