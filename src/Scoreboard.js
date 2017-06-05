import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorScore from './ColorScore';

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
      <table className="stats" style={style}>
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
