import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GridGenerator, Layout, Hexagon, HexUtils } from 'react-hexgrid';
import Utils from './Utils';

class HexTile extends Component{
	constructor(props) {
	  super(props);
	  let { color1, color2 } = props.ficha;
	  let ficha = [color1, color2];

	  // Initialize hexagons with some color
	  const hexagons = GridGenerator.orientedRectangle(2, 1).map((hexagon, index) => {
	    return Object.assign({}, hexagon, {
	      color: ficha[index]
	    });
	  });

	  this.state = { hexagons };
	}

	static propTypes = {
	  x: PropTypes.number,
	  y: PropTypes.number,
	  ficha: PropTypes.object.isRequired,
	};

	static defaultProps = {
	  x: 0,
	  y: 0,
	  ficha: {}
	}

	onDragStart(event, source) {
    // Could do something on onDragStart as well, if you wish
    this.props.onDragStart(event, source);
    const { hexagons } = this.state;
    // Get the other hex
    const neighbours = HexUtils.neighbours(source.state.hex);
    const secondHex = hexagons.filter(h => {
    	for(let n of neighbours){
    		if(HexUtils.equals(n, h)){
    			return true;
    		}
    	}
    })[0];
    const hexas = hexagons.map(hex => {
    	if (HexUtils.equals(source.state.hex, hex) && secondHex.color){
    		console.log('There is another tile');
    		hex.first = true;
    		source.setState({ hex: hex });
    	}
    	return hex;
    })

    this.setState({ hexagons: hexas });
		// console.log(source);
  }

  // onDragEnd you can do some logic, e.g. to clean up hexagon if drop was success
  onDragEnd(event, source, success) {
    this.props.onDragEnd(event, source, success);
    if (!success) {
      return;
    }
    const { hexagons } = this.state;
    // TODO Drop the whole hex from array, currently somethings wrong with the patterns
    // const hexas = hexagons.filter(hex => !HexUtils.equals(targetHex, hex));
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.color = null;
        // hex.text = null;
      }
      return hex;
    });
    this.setState({ hexagons: hexas });
  }

	render() {
	  const { hexagons } = this.state;
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
	            className={hex.color}
	            //fill={(hex.image) ? HexUtils.getID(hex) : null}
	            data={hex}
	            onDragStart={(e, h) => this.onDragStart(e, h)}
              onDragEnd={(e, h, s) => this.onDragEnd(e, h, s)}
	          >
	         {/* <Text>{hex.text}</Text>*/}
	          </Hexagon>
	        ))
	      }
	    </Layout>
	  );
	}
}

export default HexTile;