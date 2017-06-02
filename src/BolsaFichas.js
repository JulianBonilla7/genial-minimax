import Ficha from './Ficha';
import constantes from './constantes';

class BolsaFichas {

  static crearFichas() {
  	let bolsa = [];

  	const fichasMismoColor = 5,
  		fichasDiferenteColor = 6;

  	for (let color of constantes.COLORES) {
  	  let n = fichasMismoColor;
  	  while (n > 0) {
  	  	bolsa.push(new Ficha(color, color));
  	  	n--;
  	  }
  	}

  	for (let i = 0; i < constantes.COLORES.length; i++) {
  		for (let j = i+1; j < constantes.COLORES.length; j++) {
	  		let n = fichasDiferenteColor;
	  		while (n > 0) {
  				bolsa.push(new Ficha(constantes.COLORES[i], constantes.COLORES[j]));
  			n--;
  			}
  		}
  	}

  	return bolsa;
  }
}

export default BolsaFichas;
