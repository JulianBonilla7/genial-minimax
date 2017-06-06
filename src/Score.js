class Score {
  constructor(player) {
    this.player = player;
    this.red = 0;
    this.yellow = 0;
    this.purple = 0;
    this.blue = 0;
    this.orange = 0;
    this.green = 0;
  }

  update(color, puntaje){
    if (this[color] + puntaje <= 18) {
      this[color] += puntaje;
    }
    else{
      this[color] = 18;
      console.log('GENIAL!');
    }
  }

  puntajeColor(color){
    return this[color];
  }

  getPlayer(){
    return this.player;
  }
}

export default Score;
