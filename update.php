<?php
require_once 'database.php';

$id = $_GET['id'] ?? 0;
$errors = [];

// Buscar usuário existente
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();

if (!$user) {
    die("Usuário não encontrado!");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validações
    if (empty($name)) $errors['name'] = 'Nome obrigatório.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Email inválido.';
    
    if (empty($errors)) {
        if (!empty($password)) {
            // Atualizar com nova senha
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
            $params = [$name, $email, $passwordHash, $id];
        } else {
            // Manter senha atual
            $sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
            $params = [$name, $email, $id];
        }
        
        $stmt = $pdo->prepare($sql);
        if ($stmt->execute($params)) {
            echo "<p style='color: green;'>Usuário atualizado com sucesso!</p>";
            // Atualizar dados locais
            $user['name'] = $name;
            $user['email'] = $email;
        } else {
            echo "<p style='color: red;'>Erro ao atualizar.</p>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Editar Usuário</title>
    <style>
        .error { color: red; font-size: 0.9em; }
        form { max-width: 400px; margin: 20px auto; }
        input, button { width: 100%; padding: 8px; margin: 5px 0; }
    </style>
</head>
<body>
    <h1>Editar Usuário #<?= $user['id'] ?></h1>
    
    <form method="POST">
        <div>
            <label>Nome:</label>
            <input type="text" name="name" value="<?= htmlspecialchars($user['name']) ?>" required>
            <?php if(isset($errors['name'])): ?>
                <div class="error"><?= $errors['name'] ?></div>
            <?php endif; ?>
        </div>
        
        <div>
            <label>Email:</label>
            <input type="email" name="email" value="<?= htmlspecialchars($user['email']) ?>" required>
            <?php if(isset($errors['email'])): ?>
                <div class="error"><?= $errors['email'] ?></div>
            <?php endif; ?>
        </div>
        
        <div>
            <label>Nova Senha (deixe em branco para manter atual):</label>
            <input type="password" name="password">
            <small>Mínimo 8 caracteres</small>
        </div>
        
        <button type="submit">Atualizar</button>
    </form>
    
    <p><a href="read.php">Voltar para lista</a></p>
</body>
</html>