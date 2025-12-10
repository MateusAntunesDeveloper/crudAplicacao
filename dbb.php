<?php

try {
        $db = new PDO('sqlite:db.db');  // cria db.db na mesma pasta se não existir
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Cria tabela se não existir
        $db->exec("CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )");

    } catch (PDOException $e) {
        echo json_encode(['sucesso' => false, 'erro' => 'Erro no banco: ' . $e->getMessage()]);
        exit;
    }

    // ---------- Registro / Inserção ----------
    if ($email && $password) {
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $db->prepare("INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)");
        try {
            $stmt->execute([$email, $hash]);
        } catch (PDOException $e) {
            echo json_encode(['sucesso' => false, 'erro' => 'Email já cadastrado ou erro: ' . $e->getMessage()]);
            exit;
        }
    }

    // ---------- Login ----------
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Login OK',
            'score' => $resultData['score']
        ]);
    } else {
        echo json_encode([
            'sucesso' => false,
            'erro' => 'Email ou senha inválidos',
            'score' => $resultData['score']
        ]);
    }

?>