import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HexTile from './HexTile';
import './TileList.css';

class TileList extends Component {
  constructor(props){
    super(props);

    const { fichas } = props;

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = { isTileMoving: false, fichas: fichas };
  }

  static propTypes = {
    fichas: PropTypes.array.isRequired,
  };

  onDragStart(event, source, tileMoving, isFirst) {
    const { fichas } = this.state;
    // console.log(fichas)
    // let misFichas = fichas;
    const fichaMovida = source.props.data.ficha;
    const misFichas = fichas.map(ficha => {
      // console.log(ficha);
      // console.log(`Ficha movida: ${fichaMovida} | Ficha actual: ${ficha.key}`);
      if (isFirst && (fichaMovida != ficha.key)) {
        // console.info('Esta no es la ficha');
        ficha.blocked = true;
      }

      return ficha;
    });
    this.setState({ 
      isTileMoving: isFirst, 
      fichas: misFichas 
    });
    this.props.onDragStart(event, source, isFirst);
    
    // console.log(misFichas);
  }

  onDragEnd(event, source, success) {
    if (!success) {
      return;
    }
    const { isTileMoving, fichas } = this.state;
    // console.log(isTileMoving);
    const misFichas = fichas.map(ficha => {
      if (!isTileMoving) { ficha.blocked = false; }
      
      return ficha;
    });
    this.setState({ fichas: misFichas, isTileMoving: false });
    this.props.onDragEnd(event, source, isTileMoving);

  }

  render() {
    const { fichas } = this.state;
    const { className } = this.props;
    return (
      <g className={className} transform={`translate(10, -20)`}>
        {
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