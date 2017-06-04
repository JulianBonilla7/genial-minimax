import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HexTile from './HexTile';

class TileList extends Component {
  constructor(props){
    super(props);

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = { isTileMoving: false };
  }

  static propTypes = {
    fichas: PropTypes.array.isRequired,
  };

  onDragStart(event, source) {
    this.setState({ isTileMoving: true })
    console.log('Moving');
  }

  onDragEnd(event, source, success) {
    if (!success) {
      return;
    }
    this.setState({ isTileMoving: false })
    console.log('finished');
  }

  render() {
    const { fichas } = this.props;
    return (
      <g>
        {
          fichas.map((ficha, i) => (
            <HexTile key={i} 
                     x={15} 
                     y={7*i} 
                     ficha={ficha}
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