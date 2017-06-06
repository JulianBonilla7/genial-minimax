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

  static puntajeMinimo(puntaje){
    let min = -1;
    for(let x in puntaje) {
        if( puntaje[x] < min) min = puntaje[x];
    }
    return min;
  }

  static obtenerMayorValor(array, prop){
    return Math.max.apply(Math,array.map(obj => obj[prop]));
  }

  static objetoMayorValor(array, prop){
    return array.find(obj => { 
      return obj[prop] == Utils.obtenerMayorValor(array, prop); 
    });
  }

  static esFinal(tablero){
    const hayEspacio = tablero.find(hex => 
      (!hex.color && 
          tablero.find(h => (
            HexUtils.distance(hex, h) == 1 && !h.color
          ))
      )
    );

    return !hayEspacio;
  }

  static sumarEje(tablero, casilla, direccion){
    // console.log('Siguiente casilla');
    // console.log(HexUtils.neighbour(casilla, direccion));
    let siguiente = tablero.find(h => {
      return HexUtils.equals(HexUtils.neighbour(casilla, direccion), h)
    });
    if (siguiente && siguiente.color === casilla.color){
      // console.log('Lo encontré');
      return 1 + Utils.sumarEje(tablero, siguiente, direccion)
    }
    else return 0;
  }

  static evaluarPuntaje2(tablero, casilla){
    let puntaje = 0;
    for (let i = 0; i < HexUtils.DIRECTIONS.length; i += 1) {
      puntaje += Utils.sumarEje(tablero, casilla, i);
    }
    return puntaje;
  }

  static evaluarPuntaje(tablero, casilla) {


    // Seleccionar las casillas que dan puntos
    const posibles = tablero.filter(h => {
      // console.log(h);
      if (casilla.color == h.color && (
          HexUtils.distance(casilla, h) == 1 || Utils.enLinea(casilla, h)) && 
          !HexUtils.equals(casilla, h)
      ) {
          return true;
      }
    });
    
    // console.log('Posibles fichas para puntaje');
    // console.log(posibles);

    return posibles.length;
  }

  static mejorMovimiento1(tablero, fichas){
    let totalPuntos = 0;
    const fichaElegida = fichas[Utils.random(fichas.length)];
    // Guardar casillas con los colores de la ficha elegida
    const colored = tablero.filter(hex => (
      fichaElegida.color1 == hex.color || fichaElegida.color2 == hex.color
    ));
    // Guardar las casillas en las que es posible hacer un movimiento que sume puntos
    const posibles = colored.map(hex => {
      return tablero.find(h => (HexUtils.distance(hex, h) == 1 && !h.color))
    });

    const movimientos1 = posibles.map(hex => {
      for (let color in fichaElegida){
        if (color != 'key'){
          hex = Object.assign({}, hex, {
            color: fichaElegida[color],
            ficha: fichaElegida.key
          });
          return { 
            puntos1: Utils.evaluarPuntaje2(tablero, hex),
            pieza1: hex,
            color1: color
          };
        }
      }
    })
    // console.log('Movimiento 1');
    // console.log(movimientos1);
    // console.log(Utils.objetoMayorValor(movimientos1, 'puntos'));
    const { puntos1, pieza1, color1 } = Utils.objetoMayorValor(movimientos1, 'puntos1');
    

    // Encontrar posibles casillas para segunda pieza de ficha
    const siguientes = Utils.array_intersect(
      tablero, 
      // Casillas vecinas excluyendo las que ya tengan color
      tablero.filter(h => HexUtils.distance(pieza1, h) == 1 && !h.color)
    );
    // console.log('Segunda ficha...');
    // console.log(siguientes);

    const movimientos2 = siguientes.map(hex => {
      for (let color in fichaElegida){
        if (color != 'key' && color != color1){
          hex = Object.assign({}, hex, {
            color: fichaElegida[color],
            ficha: fichaElegida.key
          });
          return { 
            puntos2: Utils.evaluarPuntaje2(tablero, hex),
            pieza2: hex
          };
        }
      }
    })
    // console.log('Movimiento 2');
    // console.log(movimientos2);
    // console.log(Utils.objetoMayorValor(movimientos2, 'puntos'));

    const { puntos2, pieza2 } = Utils.objetoMayorValor(movimientos2, 'puntos2');
    totalPuntos = puntos1 + puntos2;
    console.log('Total puntos: ' + totalPuntos);

    return { pieza1, pieza2 };
    // const totalPuntos = puntos + Utils.objetoMayorValor(movimientos2, 'puntos').puntos;


    // return mejores[Utils.random(mejores.length)];
  }

  static movimientoAleatorio(tablero, fichas){
    // console.log('Fichas PC:');
    // console.log(fichas);
    const fichaElegida = fichas[Utils.random(fichas.length)];
    // console.log('Ficha elegida:');
    // console.log(fichaElegida);
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
