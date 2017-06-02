import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GridGenerator, Layout, Hexagon, Pattern, HexUtils } from 'react-hexgrid';

class HexTile extends Component{
	constructor(props) {
	  super(props);
	  // Initialize hexagons with some text and image
	  const hexagons = GridGenerator.orientedRectangle(2, 1).map((hexagon, index) => {
	    return Object.assign({}, hexagon, {
	      text: `Cat #${index}`,
	      image: `http://lorempixel.com/400/400/cats/${index%10}/`
	    });
	  });
	  this.state = { hexagons };
	}

	static propTypes = {
	  x: PropTypes.number,
	  y: PropTypes.number,
	};

	static defaultProps = {
	  x: 0,
	  y: 0,
	}

	render() {
	  const { hexagons } = this.state;
	  return (
	    <Layout className="tile" size={{ x: 3, y: 3 }} flat={false} spacing={1.01} origin={{ x: this.props.x, y: this.props.y }}>
	      {
	        hexagons.map((hex, i) => (
	          <Hexagon
	            key={i}
	            q={hex.q}
	            r={hex.r}
	            s={hex.s}
	            fill={(hex.image) ? HexUtils.getID(hex) : null}
	            data={hex}
	          >
	            { !!hex.image && <Pattern id={HexUtils.getID(hex)} link={hex.image} /> }
	          </Hexagon>
	        ))
	      }
	    </Layout>
	  );
	}
}

export default HexTile;