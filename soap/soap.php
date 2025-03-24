<?php
class ProductService {
    private $conn;

    public function __construct() {
        $this->conn = new mysqli("localhost", "root", "", "productos");
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function getProducts() {
        $sql = "SELECT * FROM productos";
        $result = $this->conn->query($sql);
        $products = [];
        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        return $products;
    }

    public function createProduct($nombre, $descripcion, $precio) {
        $sql = "INSERT INTO productos (nombre, descripcion, precio) VALUES ('$nombre', '$descripcion', $precio)";
        if ($this->conn->query($sql) === TRUE) {
            return "Producto creado";
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    public function updateProduct($id, $nombre, $descripcion, $precio) {
        $sql = "UPDATE productos SET nombre='$nombre', descripcion='$descripcion', precio=$precio WHERE
id=$id";
        if ($this->conn->query($sql) === TRUE) {
            return "Producto actualizado";
        } else {
            return "Error: " . $this->conn->error;
        }
    }

    public function deleteProduct($id) {
        $sql = "DELETE FROM productos WHERE id=$id";
        if ($this->conn->query($sql) === TRUE) {
            return "Producto eliminado";
        } else {
            return "Error: " . $this->conn->error;
        }
    }
}

$options = array("uri" => "http://localhost/soap/soap.php");
$server = new SoapServer(null, $options);
$server->setClass("ProductService");
$server->handle();
?>