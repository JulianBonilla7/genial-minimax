import { HexUtils } from 'react-hexgrid';

// Clase con funciones de utilidad, aquí van los algoritmos de movimiento de la IA
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

  // Generar numero aleatorio en base a un límite
  static random(limit){
    return Math.floor(Math.random()*limit);
  }

  // Verificar si dos casillas comparten algún eje
  static enLinea(a, b){
    return a.q === b.q || a.r === b.r || a.s === b.s;
  }

  // Obtener el puntaje mínimo entre todos los colores de un jugador
  static puntajeMinimo(puntaje){
    let min = -1;
    for(let x in puntaje) {
        if( x !== 'player' && puntaje[x] < min) min = puntaje[x];
    }
    return min;
  }

  // Obtener el mayor valor de una propiedad de objeto dentro de un arreglo
  static obtenerMayorValor(array, prop){
    return Math.max.apply(Math,array.map(obj => obj[prop]));
  }

  // Obtener el objeto con el mayor valor en una propiedad dentro de un arreglo
  static objetoMayorValor(array, prop){
    return array.find(obj => { 
      return obj[prop] == Utils.obtenerMayorValor(array, prop); 
    });
  }

  // Comprobar si hay espacios para jugar en el tablero
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

  // Sumar puntos por cada casilla seguida del mismo color en un eje
  static sumarEje(tablero, casilla, direccion){
    // Obtener casilla siguiente en la dirección dada (seis direcciones)
    let siguiente = tablero.find(h => {
      return HexUtils.equals(HexUtils.neighbour(casilla, direccion), h)
    });
    // Sumar un punto y ejecutar en otra casilla avanzando en la misma dirección
    if (siguiente && siguiente.color === casilla.color){
      return 1 + Utils.sumarEje(tablero, siguiente, direccion)
    }
    // Parar si no existe otra casilla en esa dirección o no comparten el mismo color
    else return 0;
  }

  // Calcular puntos obtenidos en el tablero, recorriendo cada eje y sumando los puntos encontrados
  static evaluarPuntaje(tablero, casilla){
    let puntaje = 0;
    // HexUtils.DIRECTIONS contiene cada dirección posible aumentando en 1 cualquier coordenada 
    // (-1,0,1 , 1,0,1 , etc...)
    for (let i = 0; i < HexUtils.DIRECTIONS.length; i += 1) {
      // Sumar puntos por cada eje
      puntaje += Utils.sumarEje(tablero, casilla, i);
    }
    return puntaje;
  }

  // Algoritmo que genera un movimiento del PC basado en la cantidad de puntos que puede sumar
  static mejorMovimiento1(tablero, fichas){
    let totalPuntos = 0;

    // Elegir ficha aleatoria
    const fichaElegida = fichas[Utils.random(fichas.length)];

    // Seleccionar casillas del tablero con los colores de la ficha elegida
    const colored = tablero.filter(hex => (
      fichaElegida.color1 == hex.color || fichaElegida.color2 == hex.color
    ));

    // Guardar las casillas en las que es posible hacer un movimiento que sume puntos
    const posibles = colored.map(hex => {
      return tablero.find(h => (HexUtils.distance(hex, h) == 1 && !h.color))
    });

    // Guardar posibles movimientos para la primera casilla de la ficha elegida
    // Cada movimiento guarda su su puntaje
    const movimientos1 = posibles.map(hex => {
      for (let color in fichaElegida){
        if (color != 'key'){
          hex = Object.assign({}, hex, {
            color: fichaElegida[color],
            ficha: fichaElegida.key
          });
          return { 
            puntos1: Utils.evaluarPuntaje(tablero, hex),
            pieza1: hex,
            color1: color
          };
        }
      }
    })
    // Obtener movimiento con mayor puntaje 
    const { puntos1, pieza1, color1 } = Utils.objetoMayorValor(movimientos1, 'puntos1');

    // Encontrar posibles casillas para segunda pieza de ficha
    const siguientes = Utils.array_intersect(
      tablero, 
      // Casillas vecinas excluyendo las que ya tengan color
      tablero.filter(h => HexUtils.distance(pieza1, h) == 1 && !h.color)
    );

    // Guardar posibles movimientos para la segunda casilla de la ficha elegida
    // Cada movimiento guarda su su puntaje
    const movimientos2 = siguientes.map(hex => {
      for (let color in fichaElegida){
        if (color != 'key' && color != color1){
          hex = Object.assign({}, hex, {
            color: fichaElegida[color],
            ficha: fichaElegida.key
          });
          return { 
            puntos2: Utils.evaluarPuntaje(tablero, hex),
            pieza2: hex
          };
        }
      }
    })

    // Obtener movimiento con mayor puntaje
    const { puntos2, pieza2 } = Utils.objetoMayorValor(movimientos2, 'puntos2');
    // Sumar puntos totales en el movimiento de ambas casillas de la ficha
    totalPuntos = puntos1 + puntos2;

    return { pieza1, pieza2 };
  }

  // Algoritmo que genera un movimiento aleatorio
  static movimientoAleatorio(tablero, fichas){
    // Escoger cualquier ficha
    const fichaElegida = fichas[Utils.random(fichas.length)];
    // Seleccionar casillas libres del tablero
    const libres = tablero.filter(hex => !hex.color);
    // Escoger cualquier casilla aleatoriamente entre las casillas libres
    const casillaElegida = libres[Utils.random(libres.length)];
    // Encontrar casilla elegida en el tablero y asignarle color y ficha correspondiente
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
    // Encontrar segunda casilla y asignarle color y ficha correspondiente
    let pieza2 = siguientes[Utils.random(siguientes.length)];
    pieza2 = Object.assign({}, pieza2, {
      color: fichaElegida.color2,
      ficha: fichaElegida.key
    });
    // Retornar cada casilla elegida para el movimiento
    return { pieza1, pieza2 };
  }
}

export default Utils;
