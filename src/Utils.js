import { HexUtils } from 'react-hexgrid';

class Utils{
  static array_intersect(array1, array2) {
    return array1.filter(n => array2.indexOf(n) !== -1);
  } 

  static array_difference(array1, array2) {
    return array1.filter(n => array2.indexOf(n) === -1);
  } 

  static found(array1, array2) {
    return array1.some(r=> array2.includes(r))
  }

  static myArrayMax(arr) {
      return Math.max.apply(null, arr);
  }

  static myArrayMin(arr) {
      return Math.min.apply(null, arr);
  }

  static random(limit){
    return Math.floor(Math.random()*limit);
  }

  static enLinea(a, b){
    return a.q === b.q || a.r === b.r || a.s === b.s;
  }

  static evaluarPuntaje(tablero, casilla) {
    // Seleccionar las casillas que dan puntos
    const posibles = tablero.filter(h => {
      if(casilla.color == h.color && HexUtils.distance(casilla, h) == 1 )
      {
        if (Utils.enLinea(casilla, h)) {
          return true;
        } else {
          Utils.evaluarPuntaje(tablero, h);
        }
      }
    });

    return posibles.length;
  }

  static mejorMovimiento1(tablero, color){
    const colored = tablero.filter(hex => hex.color == color);

    const mejores = colored.map(hex => {
      return tablero.find(h => (HexUtils.distance(hex, h) == 1 && !h.color))
    });

    return mejores[Utils.random(mejores.length)];
  }

  static movimientoAleatorio(tablero, fichas){
    console.log('Fichas PC:');
    console.log(fichas);
    const fichaElegida = fichas[Utils.random(fichas.length)];
    console.log('Ficha elegida:');
    console.log(fichaElegida);
    // Seleccionar posibles movimientos
    const libres = tablero.filter(hex => !hex.color);
    // Generar movimiento de primera pieza aleatorio
    const casillaElegida = libres[Utils.random(libres.length)];
    let pieza1 = tablero.find(hex => {
      return HexUtils.equals(casillaElegida, hex);
    });
    pieza1 = Object.assign({}, pieza1, {
      color: fichaElegida.color1,
      ficha: fichaElegida.key
    });
    // Encontrar posibles casillas para segunda pieza de ficha
    const siguientes = Utils.array_intersect(
      tablero, 
      // Casillas vecinas excluyendo las que ya tengan color
      tablero.filter(h => HexUtils.distance(pieza1, h) == 1 && !h.color)
    );
    let pieza2 = siguientes[Utils.random(siguientes.length)];
    pieza2 = Object.assign({}, pieza2, {
      color: fichaElegida.color2,
      ficha: fichaElegida.key
    });

    return { pieza1, pieza2 };
  }
}

export default Utils;