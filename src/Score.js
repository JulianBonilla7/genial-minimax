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
    this[color] += puntaje;
  }

  puntajeColor(color){
    return this[color];
  }
}

export default Score;
