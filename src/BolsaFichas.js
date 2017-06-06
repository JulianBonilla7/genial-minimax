import Ficha from './Ficha';
import constantes from './constantes';

// Clase que representa la bolsa de fichas
// Tiene métodos estaticos para crear las fichas y repartirlas
class BolsaFichas {

  static crearFichas() {
    let bolsa = []
    let contador = 0;
  	const fichasMismoColor = 5,
  		    fichasDiferenteColor = 6;
    // Crear fichas con ambas casillas del mismo color (5 por cada color)
  	for (let color of constantes.COLORES) {
  	  let n = fichasMismoColor;
  	  while (n > 0) {
        contador++;
        bolsa.push(new Ficha(color, color, contador));
  	  	n--;
  	  }
  	}
    // Crear resto de fichas
  	for (let i = 0; i < constantes.COLORES.length; i++) {
  		for (let j = i+1; j < constantes.COLORES.length; j++) {
	  		let n = fichasDiferenteColor;
	  		while (n > 0) {
          contador++;
  				bolsa.push(new Ficha(constantes.COLORES[i], constantes.COLORES[j], contador));
  			n--;
  			}
  		}
  	}

    return bolsa;
  }

  // Sacar una ficha aleatoria de la bolsa
  static agregarFicha(bolsa) {
    const random = Math.floor(Math.random()*bolsa.length);
    const ficha = bolsa[random];
    bolsa.splice(random, 1);

    return ficha;
  }

  static asignarFichas(numero, bolsa) {
    const fichas = [];
    for (let i = 0; i < numero; i++) {
      // Repartir fichas aleatoriamente quitándolas de la bolsa
      fichas.push(this.agregarFicha(bolsa));
    }
    return fichas;
  }

}

export default BolsaFichas;
