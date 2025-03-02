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

    $sql = $conn->prepare("SELECT * FROM usuarios WHERE id = ?");
    $sql->bind_param("i", $id);
    $sql->execute();
    $result = $sql->get_result();
    $usuario = $result->fetch_assoc();

    if (!$usuario) {
        echo "Usuario no encontrado.";
        exit();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Editar Usuario</title>
</head>
<body>
    <h2>Editar Usuario</h2>
    <form action="actualizar.php" method="post">
        <input type="hidden" name="id" value="<?php echo $usuario['id']; ?>">
        
        <label for="nombre">Nombre:</label>
        <input type="text" name="nombre" value="<?php echo $usuario['nombre']; ?>" required><br><br>
        
        <label for="email">Email:</label>
        <input type="email" name="email" value="<?php echo $usuario['email']; ?>" required><br><br>
        
        <label for="edad">Edad:</label>
        <input type="number" name="edad" value="<?php echo $usuario['edad']; ?>" required><br><br>
        
        <button type="submit">Actualizar</button>
    </form>
</body>
</html>


