import { Libro } from '../entidades/Libro.js';
import { Usuario } from '../entidades/Usuario.js';
import { Prestamo } from '../entidades/Prestamo.js';

export class BibliotecaService {
  constructor() {
    this.libros = [];
    this.usuarios = [];
    this.prestamos = [];
    this.inicioSistema = new Date();
  }

  agregarLibro(titulo, autor, isbn) {
    const libro = new Libro(titulo, autor, isbn);
    this.libros.push(libro);
    return libro;
  }

  registrarUsuario = (nombre, id) => {
    const usuario = new Usuario(nombre, id);
    this.usuarios.push(usuario);
    return usuario;
  };

  infoSistema() {
    return `Sistema iniciado el: ${this.inicioSistema.toLocaleString()}`;
  }

  buscarLibroPorTitulo(titulo, callback) {
    const resultado = this.libros.filter(function(libro) {
      return libro.titulo.toLowerCase().includes(titulo.toLowerCase());
    });
    callback(resultado);
  }

  buscarUsuarioPorNombre(nombre, callback) {
    const resultado = this.usuarios.filter(user =>
      user.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
    callback(resultado);
  }

  registrarPrestamo = (libroId, usuarioId) => {
    const libro = this.libros.find(l => l.isbn === libroId);
    const usuario = this.usuarios.find(u => u.id === usuarioId);
    if (libro && usuario && libro.estaDisponible()) {
      const prestamo = new Prestamo(libro, usuario);
      this.prestamos.push(prestamo);
      return prestamo;
    } else {
      console.log("No se pudo registrar el préstamo.");
      return null;
    }
  }

  buscarPrestamosPorUsuario(usuarioId, callback) {
    const resultado = this.prestamos.filter(p => p.usuario.id === usuarioId);
    callback(resultado);
  }

  calcularMultasPendientes = () =>
    this.prestamos.reduce((acc, p) => acc + p.multa, 0);
}
