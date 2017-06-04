import Ficha from './Ficha';
import constantes from './constantes';

class BolsaFichas {

  static crearFichas() {
    let bolsa = []
    let contador = 0;
  	const fichasMismoColor = 5,
  		    fichasDiferenteColor = 6;

  	for (let color of constantes.COLORES) {
  	  let n = fichasMismoColor;
  	  while (n > 0) {
        contador++;
        bolsa.push(new Ficha(color, color, contador));
  	  	n--;
  	  }
  	}

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
