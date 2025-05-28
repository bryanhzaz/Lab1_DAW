export class Usuario {
  constructor(nombre, id) {
    this.nombre = nombre;
    this.id = id;
    this.librosPrestados = [];
    this.historial = [];
  }

  tomarPrestado(libro) {
    if (libro.prestar()) {
      this.librosPrestados.push(libro);
      this.registrarEnHistorial(`Tomó prestado: ${libro.titulo}`);
      return true;
    }
    return false;
  }

  devolverLibro = (libro) => {
    const index = this.librosPrestados.findIndex(lib => lib.isbn === libro.isbn);
    if (index !== -1) {
      libro.devolver();
      this.librosPrestados.splice(index, 1);
      this.registrarEnHistorial(`Devolvió: ${libro.titulo}`);
      return true;
    }
    return false;
  };

  registrarEnHistorial(accion) {
    this.historial.push({
      accion,
      fecha: new Date()
    });
  }

  mostrarHistorial() {
    console.log(`Historial de ${this.nombre}:`);
    this.historial.forEach((item, index) => {
      console.log(`${index + 1}. ${item.accion} - ${item.fecha.toLocaleString()}`);
    });
  }
}