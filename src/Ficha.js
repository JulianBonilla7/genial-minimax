// Objeto ficha que consiste en dos colores y una key para identificarla en el juego
class Ficha {
  constructor(color1, color2, key) {
    this.color1 = color1;
    this.color2 = color2;
    this.key = key;
  }

  equals(ficha){
    return this.key == ficha.key;
  }
}

export default Ficha;
