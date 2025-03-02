<?php
$server = "localhost";
$user = "root";
$password = "simonese12a13.";
$dbname = "formularios_db";

$conn = new mysqli($server, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = intval($_POST["id"]);
    $nombre = $_POST["nombre"];
    $email = $_POST["email"];
    $edad = $_POST["edad"];

    $sql = $conn->prepare("UPDATE usuarios SET nombre = ?, email = ?, edad = ? WHERE id = ?");
    $sql->bind_param("ssii", $nombre, $email, $edad, $id);

    if ($sql->execute()) {
        echo "Usuario actualizado correctamente.";
    } else {
        echo "Error al actualizar usuario: " . $conn->error;
    }

    $sql->close();
}

$conn->close();
header("Location: mostrar_datos.php"); // Redirige a la lista después de actualizar
exit();
?>
