import { BibliotecaService } from './servicios/BibliotecaService.js';
import { mostrarInfoFlecha } from './helpers/funciones.js';

console.log(mostrarInfoFlecha());

const biblioteca = new BibliotecaService();
console.log(biblioteca.infoSistema());

// Agregar libros
const libros = [
  biblioteca.agregarLibro("Cien años de soledad", "García Márquez", "123456"),
  biblioteca.agregarLibro("1984", "George Orwell", "234567"),
  biblioteca.agregarLibro("El Principito", "Antoine de Saint-Exupéry", "345678"),
  biblioteca.agregarLibro("Rayuela", "Julio Cortázar", "456789"),
  biblioteca.agregarLibro("Ficciones", "Jorge Luis Borges", "567890")
];

// Agregar usuarios
const usuarios = [
  biblioteca.registrarUsuario("Ana Torres", "001"),
  biblioteca.registrarUsuario("Carlos Díaz", "002"),
  biblioteca.registrarUsuario("Beatriz Gómez", "003"),
  biblioteca.registrarUsuario("Daniel Ruiz", "004"),
  biblioteca.registrarUsuario("Elena Martínez", "005")
];

// Registrar múltiples préstamos
const prestamos = [
  biblioteca.registrarPrestamo("123456", "001"),
  biblioteca.registrarPrestamo("234567", "001"),
  biblioteca.registrarPrestamo("345678", "002"),
  biblioteca.registrarPrestamo("456789", "002"),
  biblioteca.registrarPrestamo("567890", "003"),
  biblioteca.registrarPrestamo("123456", "004"), // debería fallar, ya prestado
  biblioteca.registrarPrestamo("345678", "003"), // debería fallar, ya prestado
  biblioteca.registrarPrestamo("456789", "005")  // debería fallar, ya prestado
];

// Simular devoluciones con fechas antiguas
prestamos.forEach((p, i) => {
  if (p) {
    // Simular antigüedad en los primeros 4 préstamos
    if (i < 4) p.fechaPrestamo.setDate(p.fechaPrestamo.getDate() - (10 + i * 5));
    p.registrarDevolucion();
    console.log(p.infoPrestamo());
    console.log(`Multa: $${p.multa}`);
  }
});

// Mostrar historiales
console.log("\n--- Historiales de usuarios ---");
usuarios.forEach(u => u.mostrarHistorial());

// Buscar préstamos por usuario
console.log("\n--- Préstamos por usuario ---");
usuarios.forEach(u => {
  biblioteca.buscarPrestamosPorUsuario(u.id, function(resultados) {
    console.log(`\nPréstamos del usuario ${u.nombre}:`);
    resultados.forEach(p => console.log(p.infoPrestamo()));
  });
});

// Calcular multas totales
console.log(`\nMultas pendientes totales: $${biblioteca.calcularMultasPendientes()}`);
