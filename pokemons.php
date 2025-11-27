<?php
// --- CORS Headers (agresivo para funcionar en InfinityFree) ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// Handle preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- CONEXIÓN A BD ---
// Ajusta estos datos con las credenciales de InfinityFree
$host = 'localhost';
$db_user = 'root'; // Cambiar si es diferente en InfinityFree
$db_pass = '';     // Cambiar con tu contraseña
$database = 'pokemons_db'; // Cambiar con tu BD

try {
    $db = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $db_user, $db_pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error de conexión: ' . $e->getMessage()]);
    exit();
}

// --- CREAR TABLA SI NO EXISTE ---
try {
    $createSql = "CREATE TABLE IF NOT EXISTS pokemons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        tipo1 VARCHAR(100) NOT NULL,
        tipo2 VARCHAR(100) DEFAULT NULL,
        descripcion TEXT,
        hp INT DEFAULT 100,
        imagen_url VARCHAR(512) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    $db->exec($createSql);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Error al crear tabla: ' . $e->getMessage()]);
    exit();
}

// --- GET (LEER TODOS LOS POKÉMONS) ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT id, nombre, tipo1, tipo2, descripcion, hp, imagen_url FROM pokemons ORDER BY id ASC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $pokemons_arr = [];
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $imagen = $row['imagen_url'];
            // Si la imagen no es una URL absoluta, construir la URL completa
            if ($imagen && !preg_match('#^https?://#', $imagen)) {
                $imagen = 'https://' . $_SERVER['HTTP_HOST'] . '/uploads/images/' . $imagen;
            }
            $pokemons_arr[] = [
                'id' => (int)$row['id'],
                'nombre' => $row['nombre'],
                'tipo1' => $row['tipo1'],
                'tipo2' => $row['tipo2'],
                'descripcion' => $row['descripcion'],
                'hp' => (int)$row['hp'],
                'imagen_url' => $imagen
            ];
        }
        
        http_response_code(200);
        echo json_encode($pokemons_arr);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error al obtener Pokémons: ' . $e->getMessage()]);
    }
}

// --- POST (CREAR NUEVO POKÉMON) ---
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validar datos requeridos
        if (empty($_POST['nombre']) || empty($_POST['tipo1']) || empty($_POST['descripcion'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Faltan campos: nombre, tipo1 y descripción son obligatorios.']);
            exit();
        }

        // Procesar imagen
        $imagen_url = null;
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            $upload_dir = '../uploads/images/';
            
            // Crear carpeta si no existe
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }

            $file_ext = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));
            $allowed_ext = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            
            if (!in_array($file_ext, $allowed_ext)) {
                http_response_code(400);
                echo json_encode(['message' => 'Formato de imagen no permitido. Usa JPG, PNG, GIF o WEBP.']);
                exit();
            }

            $new_filename = uniqid('pok_', true) . '.' . $file_ext;
            $target_file = $upload_dir . $new_filename;

            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $target_file)) {
                $imagen_url = $new_filename;
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Error al subir la imagen.']);
                exit();
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'No se proporcionó una imagen válida.']);
            exit();
        }

        // Insertar en BD
        $query = "INSERT INTO pokemons (nombre, tipo1, tipo2, descripcion, hp, imagen_url) 
                  VALUES (:nombre, :tipo1, :tipo2, :descripcion, :hp, :imagen_url)";
        $stmt = $db->prepare($query);

        $nombre = $_POST['nombre'];
        $tipo1 = $_POST['tipo1'];
        $tipo2 = $_POST['tipo2'] ?? null;
        $descripcion = $_POST['descripcion'];
        $hp = $_POST['hp'] ?? 100;

        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':tipo1', $tipo1);
        $stmt->bindParam(':tipo2', $tipo2);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':hp', $hp);
        $stmt->bindParam(':imagen_url', $imagen_url);

        if ($stmt->execute()) {
            $insertId = $db->lastInsertId();
            $sel = $db->prepare("SELECT id, nombre, tipo1, tipo2, descripcion, hp, imagen_url FROM pokemons WHERE id = :id");
            $sel->bindParam(':id', $insertId);
            $sel->execute();
            $row = $sel->fetch(PDO::FETCH_ASSOC);
            
            if ($row) {
                $imagen = $row['imagen_url'];
                if ($imagen && !preg_match('#^https?://#', $imagen)) {
                    $imagen = 'https://' . $_SERVER['HTTP_HOST'] . '/uploads/images/' . $imagen;
                }
                $row['imagen_url'] = $imagen;
            }

            http_response_code(201);
            echo json_encode(['message' => 'Pokémon creado exitosamente.', 'pokemon' => $row]);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'No se pudo crear el Pokémon.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error al crear Pokémon: ' . $e->getMessage()]);
    }
}

// --- PUT (ACTUALIZAR POKÉMON) ---
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            parse_str($raw, $data);
        }

        if (empty($data['id']) || empty($data['nombre']) || empty($data['tipo1'])) {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos. Se requieren: id, nombre, tipo1.']);
            exit();
        }

        $query = "UPDATE pokemons SET nombre = :nombre, tipo1 = :tipo1, tipo2 = :tipo2, 
                  descripcion = :descripcion, hp = :hp WHERE id = :id";
        $stmt = $db->prepare($query);

        $id = $data['id'];
        $nombre = $data['nombre'];
        $tipo1 = $data['tipo1'];
        $tipo2 = $data['tipo2'] ?? null;
        $descripcion = $data['descripcion'] ?? '';
        $hp = $data['hp'] ?? 100;

        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':tipo1', $tipo1);
        $stmt->bindParam(':tipo2', $tipo2);
        $stmt->bindParam(':descripcion', $descripcion);
        $stmt->bindParam(':hp', $hp);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(['message' => 'Pokémon actualizado exitosamente.']);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'No se pudo actualizar el Pokémon.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error al actualizar: ' . $e->getMessage()]);
    }
}

// --- DELETE (ELIMINAR POKÉMON) ---
else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['message' => 'ID no proporcionado.']);
            exit();
        }

        // Obtener la imagen antes de eliminar
        $sel = $db->prepare("SELECT imagen_url FROM pokemons WHERE id = :id");
        $sel->bindParam(':id', $id);
        $sel->execute();
        $row = $sel->fetch(PDO::FETCH_ASSOC);

        // Eliminar de BD
        $query = "DELETE FROM pokemons WHERE id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $id);

        if ($stmt->execute()) {
            // Eliminar archivo de imagen si existe
            if ($row && $row['imagen_url']) {
                $upload_dir = '../uploads/images/';
                $file_path = $upload_dir . $row['imagen_url'];
                if (file_exists($file_path)) {
                    unlink($file_path);
                }
            }

            http_response_code(200);
            echo json_encode(['message' => 'Pokémon eliminado exitosamente.']);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'No se pudo eliminar el Pokémon.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['message' => 'Error al eliminar: ' . $e->getMessage()]);
    }
}

// --- Método no soportado ---
else {
    http_response_code(405);
    echo json_encode(['message' => 'Método HTTP no permitido.']);
}
?>
