<?php
header('Content-Type: application/json');

$resposta = [
    'sucesso' => false,
    'erro' => 'Requisição inválida.'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $token = $_POST['g-recaptcha-response'] ?? '';

    if (!$token) {
        echo json_encode(['sucesso' => false, 'erro' => 'Token reCAPTCHA ausente.']);
        exit;
    }

    // ---------- Verificação reCAPTCHA ----------
    $config = require "config.php";
    $secretKey = $config["recaptcha_secret"];
    $url = "https://www.google.com/recaptcha/api/siteverify";

    $data = [
        'secret' => $secretKey,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];

    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => http_build_query($data)
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $resultData = json_decode($result, true);

    if (!($resultData['success'] ?? false) || ($resultData['score'] ?? 0) < 0.5) {
        echo json_encode([
            'sucesso' => false,
            'erro' => 'Falha na verificação reCAPTCHA.',
            'score' => $resultData['score'] ?? 0
        ]);
        exit;
    }

    // ---------- Banco SQLite ----------
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

    exit;
}
?>