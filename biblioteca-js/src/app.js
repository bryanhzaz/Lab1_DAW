import { BibliotecaService } from './servicios/BibliotecaService.js';
import { mostrarInfoFlecha } from './helpers/funciones.js';

console.log(mostrarInfoFlecha());

const biblioteca = new BibliotecaService();
console.log(biblioteca.infoSistema());

biblioteca.agregarLibro("Cien años de soledad", "García Márquez", "123456");
biblioteca.registrarUsuario("Ana Torres", "001");

const prestamo = biblioteca.registrarPrestamo("123456", "001");
if (prestamo) {
  console.log(prestamo.infoPrestamo());

  // Simular devolución luego de 20 días
  prestamo.fechaPrestamo.setDate(prestamo.fechaPrestamo.getDate() - 20);
  prestamo.registrarDevolucion();
  console.log(prestamo.infoPrestamo());
  console.log(`Multa: $${prestamo.multa}`);

  // Buscar préstamos por usuario
  biblioteca.buscarPrestamosPorUsuario("001", function(resultados) {
    console.log("\nPréstamos del usuario 001:");
    resultados.forEach(p => console.log(p.infoPrestamo()));
  });

  // Calcular multas totales
  console.log(`\nMultas pendientes totales: $${biblioteca.calcularMultasPendientes()}`);
}
