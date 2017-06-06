import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { GridGenerator, Layout, Hexagon, HexUtils } from 'react-hexgrid';
import Utils from './Utils';

class HexTile extends Component{
  constructor(props) {
    super(props);
    let { color1, color2, key } = props.ficha;
    let ficha = [color1, color2];

    // Initialize hexagons with some color
    const hexagons = GridGenerator.orientedRectangle(2, 1).map((hexagon, index) => {
      return Object.assign({}, hexagon, {
        color: ficha[index],
        ficha: key
      });
    });

    this.state = { 
      hexagons, 
      moving: false,
      first: false
    };
  }

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    ficha: PropTypes.object.isRequired,
    blocked: PropTypes.bool
  };

  static defaultProps = {
    x: 0,
    y: 0,
    ficha: {},
    blocked: false
  }

  onDragStart(event, source) {
    // Could do something on onDragStart as well, if you wish
    const { blocked } = this.props;
    if (blocked) {
      event.preventDefault();
      return;
    }
    // if (blocked) {console.log('You shouldnt move this')};
    const { hexagons, first } = this.state;
    let isFirst = false;
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
        // console.log('There is another tile');
        isFirst = hex.first = true;
        source.setState({ hex: hex });
      }
      return hex;
    })
    // console.log(`Primera pieza?: ${isFirst}`);
    this.setState({ hexagons: hexas, moving: true, first: isFirst });
    this.props.onDragStart(event, source, true, isFirst);
    // console.log(source);
  }

  // onDragEnd you can do some logic, e.g. to clean up hexagon if drop was success
  onDragEnd(event, source, success) {
    if (!success) {
      return;
    }
    const { hexagons, first } = this.state;
    // TODO Drop the whole hex from array, currently somethings wrong with the patterns
    // const hexas = hexagons.filter(hex => !HexUtils.equals(targetHex, hex));
    const hexas = hexagons.map(hex => {
      if (HexUtils.equals(source.state.hex, hex)) {
        hex.color = null;
        // hex.text = null;
      }
      return hex;
    });
    let moving = first;
    this.setState({ hexagons: hexas, moving: moving });
    this.props.onDragEnd(event, source, success, moving);
  }

  render() {
    const { hexagons } = this.state;
    const { blocked } = this.props;
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
              className={classNames({'blocked': blocked}, hex.color)}
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