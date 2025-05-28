export class Prestamo {
  constructor(libro, usuario) {
    this.libro = libro;
    this.usuario = usuario;
    this.fechaPrestamo = new Date();
    this.fechaDevolucion = null;
    this.multa = 0;

    this.libro.prestar();
    usuario.registrarEnHistorial({
      accion: `Préstamo: ${libro.titulo}`,
      fecha: this.fechaPrestamo
    });
  }

  registrarDevolucion() {
    this.fechaDevolucion = new Date();
    this.multa = this.calcularMulta();
    this.libro.devolver();
  }

  calcularMulta = () => {
    if (!this.fechaDevolucion) return 0;
    const dias = this._diasTranscurridos();
    return dias > 15 ? (dias - 15) * 2 : 0;
  }

  _diasTranscurridos() {
    const diff = this.fechaDevolucion - this.fechaPrestamo;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  infoPrestamo() {
    const estado = () => this.fechaDevolucion ? 'Devuelto' : 'En préstamo';
    return `${this.usuario.nombre} prestó "${this.libro.titulo}" el ${this.fechaPrestamo.toLocaleDateString()} (${estado()})`;
  }
}