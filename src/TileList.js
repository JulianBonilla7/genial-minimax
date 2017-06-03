import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HexTile from './HexTile';

class TileList extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children } = this.props;
    return (
      <g>
        {children}
      </g>
    );
  }

}

export default TileList;