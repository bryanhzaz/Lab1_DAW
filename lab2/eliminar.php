<?php
$server = "localhost";
$user = "root";
$password = "simonese12a13.";
$dbname = "formularios_db";

$conn = new mysqli($server, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if (isset($_GET["id"])) {
    $id = intval($_GET["id"]);

    $sql = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
    $sql->bind_param("i", $id);

    if ($sql->execute()) {
        echo "Usuario eliminado correctamente.";
    } else {
        echo "Error al eliminar el usuario: " . $conn->error;
    }

    $sql->close();
}

$conn->close();
header("Location: mostrar_datos.php"); // Redirige a la lista después de eliminar
exit();
?>
