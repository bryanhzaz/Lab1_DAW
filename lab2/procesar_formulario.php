<?php

$server = "localhost";
$user = "root";
$password = "simonese12a13.";
$dbname = "formularios_db";

$conn = new mysqli($server, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si los datos fueron enviados
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $nombre = trim($_POST['nombre']);
    $email = trim($_POST['email']);
    $edad = trim($_POST['edad']);

    // Validar que los campos no estén vacíos
    if (empty($nombre) || empty($email) || empty($edad)) {
        die("Error: Todos los campos son obligatorios.");
    }

    // Validar el formato del email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Error: El correo no tiene un formato válido.");
    }

    // Validar que la edad sea un número positivo
    if (!ctype_digit($edad) || intval($edad) <= 0) {
        die("Error: La edad debe ser un número entero positivo.");
    }

    // Insertar los datos en la base de datos
    $sql = $conn->prepare("INSERT INTO usuarios (nombre, email, edad) VALUES (?, ?, ?)");
    $sql->bind_param("ssi", $nombre, $email, $edad);  // "ssi" -> string, string, integer

    if ($sql->execute()) {
        echo "Registro exitoso.";
    } else {
        echo "Error: " . $sql->error;
    }

    $sql->close();
}

$conn->close();

?>
