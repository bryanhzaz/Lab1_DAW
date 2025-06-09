class Rompecabezas {
  constructor(tableroId, jugarId, movimientosId, tiempoId) {
    this.tablero = document.getElementById(tableroId);
    this.botonJugar = document.getElementById(jugarId);
    this.movimientosElem = document.getElementById(movimientosId);
    this.tiempoElem = document.getElementById(tiempoId);
    this.tiles = [...Array(15).keys()].map(x => x + 1).concat('');
    this.movimientos = 0;
    this.tiempo = 0;
    this.timer = null;

    this.botonJugar.addEventListener('click', () => this.iniciarJuego());
    this.renderizar();
  }

  iniciarJuego() {
    this.mezclar();
    this.movimientos = 0;
    this.tiempo = 0;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.tiempo++;
      this.tiempoElem.textContent = `Tiempo: ${this.tiempo}`;
    }, 1000);
    this.renderizar();
  }

  mezclar() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
  }

  renderizar() {
    this.tablero.innerHTML = '';
    this.tiles.forEach((valor, index) => {
      const btn = document.createElement('button');
      btn.textContent = valor;
      if (valor === '') btn.classList.add('vacio');
      btn.addEventListener('click', () => this.mover(index));
      this.tablero.appendChild(btn);
    });
    this.movimientosElem.textContent = `Movimientos: ${this.movimientos}`;
  }

  mover(indice) {
    const vacio = this.tiles.indexOf('');
    const vecinos = [vacio - 1, vacio + 1, vacio - 4, vacio + 4];
    if (vecinos.includes(indice) && this.esMovimientoValido(indice, vacio)) {
      [this.tiles[indice], this.tiles[vacio]] = [this.tiles[vacio], this.tiles[indice]];
      this.movimientos++;
      this.renderizar();
    }
  }

  esMovimientoValido(de, a) {
    const filaDe = Math.floor(de / 4), colDe = de % 4;
    const filaA = Math.floor(a / 4), colA = a % 4;
    return (Math.abs(filaDe - filaA) + Math.abs(colDe - colA)) === 1;
  }
}

new Rompecabezas('tablero', 'jugar', 'movimientos', 'tiempo');