class Ficha {
  constructor(color1, color2, key) {
    this.color1 = color1;
    this.color2 = color2;
    this.key = key;
  }

  equals(ficha){
    return this.color1 == ficha.color1 && 
           this.color2 == ficha.color2 && 
           this.key == ficha.key;
  }
}

export default Ficha;
