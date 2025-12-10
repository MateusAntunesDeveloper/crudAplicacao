<?php
header('Content-Type: application/json');

// Resposta padrão caso algo dê errado
$resposta = [
    'sucesso' => false,
    'erro' => 'Requisição inválida.'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Recebe token
    $token = htmlspecialchars(trim($_POST['g-recaptcha-response'] ?? ''), ENT_QUOTES, 'UTF-8');

    if (!$token) {
        echo json_encode([
            'sucesso' => false,
            'erro' => 'Token do reCAPTCHA ausente.'
        ]);
        exit;
    }

    // 2. Secret key
    $secretKey = "6LcvXCEsAAAAALhdjN9brcMVR33i5aQwspMOWXv9";
    $url = "https://www.google.com/recaptcha/api/siteverify";

    // 3. Dados enviados ao Google
    $dados = [
        'secret'   => $secretKey,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];

    // 4. Faz requisição HTTP
    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => http_build_query($dados)
        ]
    ];

    $context = stream_context_create($options);
    $respostaGoogle = @file_get_contents($url, false, $context);

    // Falha na requisição ao Google
    if ($respostaGoogle === false) {
        echo json_encode([
            'sucesso' => false,
            'erro' => 'Falha ao conectar com os servidores do Google.'
        ]);
        exit;
    }

    // 5. Decodifica JSON
    $resultadoGoogle = json_decode($respostaGoogle, true);

    if (!$resultadoGoogle) {
        echo json_encode([
            'sucesso' => false,
            'erro' => 'Resposta inválida do Google.'
        ]);
        exit;
    }

    // 6. Valida score e ação
    if (
        ($resultadoGoogle['success'] ?? false) &&
        ($resultadoGoogle['score'] >= 0.5) &&
        ($resultadoGoogle['action'] === 'submit')
    ) {

        // 7. Sucesso
        $resposta = [
            'sucesso' => true,
            'mensagem' => 'Formulário processado!',
            'score' => $resultadoGoogle['score'],
            'acao' => $resultadoGoogle['action']
        ];

    } else {

        // 8. Falha
        $resposta = [
            'sucesso' => false,
            'erro' => 'Falha na verificação reCAPTCHA.',
            'score' => $resultadoGoogle['score'] ?? 0,
            'acao' => $resultadoGoogle['action'] ?? 'desconhecida'
        ];
    }
}

// 9. Retorna resposta ao JavaScript
echo json_encode($resposta);
exit;



?>
