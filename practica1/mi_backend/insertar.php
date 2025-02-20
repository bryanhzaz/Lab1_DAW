<?php
include 'conexion.php';

$nombre = "Juanito Perez";
$correo = "juanitoperez@email.com";

$sql = "INSERT INTO usuarios (nombre,correo) VALUES ('$nombre','$correo')";

if ($conexion->query($sql) == TRUE) {
    echo "Usuario registrado correctamente.";
}   else {
    echo "Error: " . $conexion->error;
}

$conexion->close();
?>