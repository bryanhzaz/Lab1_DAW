export class Libro {
  constructor(titulo, autor, isbn) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.disponible = true;
  }

  prestar() {
    if (this.disponible) {
      this.disponible = false;
      console.log(`"${this.titulo}" ha sido prestado.`);
      return true;
    } else {
      console.log(`"${this.titulo}" no está disponible.`);
      return false;
    }
  }

  devolver = () => {
    this.disponible = true;
    console.log(`"${this.titulo}" ha sido devuelto.`);
  }

  get descripcion() {
    return `${this.titulo} de ${this.autor} (ISBN: ${this.isbn})`;
  }

  static crearLibroDemo = () => new Libro("Libro Demo", "Autor Demo", "999999");

  diasPrestamo = () => this.disponible ? 0 : 15;

  estaDisponible() {
    return this.disponible;
  }

  static validarISBN = (isbn) => /^\d{6}$/.test(isbn);
}