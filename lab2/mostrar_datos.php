<?php

$server = "localhost";
$user = "root";
$password = "simonese12a13.";
$dbname = "formularios_db";

$conn = new mysqli($server, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Número de registros por página
$registros_por_pagina = 1;

// Obtener el número total de registros
$sql_total = "SELECT COUNT(*) as total FROM usuarios";
$result_total = $conn->query($sql_total);
$row_total = $result_total->fetch_assoc();
$total_registros = $row_total['total'];

// Calcular el número total de páginas
$total_paginas = ceil($total_registros / $registros_por_pagina);

// Obtener el número de página actual
$pagina_actual = isset($_GET['pagina']) ? intval($_GET['pagina']) : 1;
if ($pagina_actual < 1) $pagina_actual = 1;
if ($pagina_actual > $total_paginas) $pagina_actual = $total_paginas;

// Calcular el inicio de los registros en la consulta
$inicio = ($pagina_actual - 1) * $registros_por_pagina;

// Consulta con paginación
$sql = "SELECT id, nombre, email, edad FROM usuarios LIMIT $inicio, $registros_por_pagina";
$result = $conn->query($sql);

echo "<h1>Usuarios Registrados</h1>";

if ($result->num_rows > 0) {
    echo "<table border='1'>";
    echo "<tr><th>ID</th><th>Nombre</th><th>Email</th><th>Edad</th><th>Acciones</th></tr>";
    
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($row["id"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["nombre"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["email"]) . "</td>";
        echo "<td>" . htmlspecialchars($row["edad"]) . "</td>";
        echo "<td>
                <a href='editar.php?id=" . $row["id"] . "'>Editar</a> | 
                <a href='eliminar.php?id=" . $row["id"] . "' onclick='return confirm(\"¿Estás seguro de eliminar este usuario?\")'>Eliminar</a>
              </td>";
        echo "</tr>";
    }
    
    echo "</table>";

    // Paginación
    echo "<div style='margin-top: 20px;'>";
    if ($pagina_actual > 1) {
        echo "<a href='?pagina=1'>Primera</a> | ";
        echo "<a href='?pagina=" . ($pagina_actual - 1) . "'>Anterior</a> | ";
    }

    echo "Página $pagina_actual de $total_paginas";

    if ($pagina_actual < $total_paginas) {
        echo " | <a href='?pagina=" . ($pagina_actual + 1) . "'>Siguiente</a> | ";
        echo "<a href='?pagina=$total_paginas'>Última</a>";
    }
    echo "</div>";

} else {
    echo "No hay usuarios registrados.";
}

$conn->close();

?>
