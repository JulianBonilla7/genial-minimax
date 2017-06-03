import React, { Component } from 'react';
import ColorScore from './ColorScore';

class Scoreboard extends Component{

  constructor(props) {
    super(props);
    const scores = [
      {color:'red', value: 0},
      {color:'yellow', value: 0},
      {color:'purple', value: 0},
      {color:'blue', value: 0},
      {color:'orange', value: 0},
      {color:'green', value: 0}
    ]
    this.state = { scores }
  }

  render() {
    const { scores } = this.state;
    return(
      <table className="stats">
        <tbody>
        {
          scores.map(c => (
            <ColorScore color={c.color} score={c.value}/>
          ))
        }
        </tbody>
      </table>
    );
  }

}

export default Scoreboard;
