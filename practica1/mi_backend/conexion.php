<?php
$servidor = "localhost";
$usuario = "root";
$password = "simonese12a13.";
$base_datos = "usuarios_db";

//creamos conexion
$conexion = new mysqli($servidor, $usuario, $password, $base_datos);

//Verificar conexion
if ($conexion->connect_error){
    die("Error en la conexion: " . $conexion->connect_error);
}   else{
    echo "Conexion exitosa a la base de datos.";
}
?>