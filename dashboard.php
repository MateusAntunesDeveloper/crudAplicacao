<?php
session_start();

// Verifica se o usuário está logado
if(!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header("Location: login.php");
    exit;
}

include_once 'config/database.php';
include_once 'auth.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - StyleStore</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .dashboard-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            display: flex;
            justify-content: between;
            align-items: center;
        }
        .welcome-message {
            flex: 1;
        }
        .welcome-message h1 {
            color: #333;
            margin-bottom: 5px;
        }
        .welcome-message p {
            color: #666;
        }
        .logout-btn {
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
        }
        .stat-card h3 {
            font-size: 2rem;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="header">
            <div class="welcome-message">
                <h1>Bem-vindo, <?php echo htmlspecialchars($_SESSION['user_name']); ?>! 👋</h1>
                <p>Gerencie sua conta e descubra novidades</p>
            </div>
            <a href="logout.php" class="logout-btn">Sair</a>
        </div>
        
        <div class="content">
            <div class="stats">
                <div class="stat-card">
                    <h3>12</h3>
                    <p>Pedidos Realizados</p>
                </div>
                <div class="stat-card">
                    <h3>R$ 1.247</h3>
                    <p>Total Gasto</p>
                </div>
                <div class="stat-card">
                    <h3>3</h3>
                    <p>Cupons Ativos</p>
                </div>
            </div>
            
            <h2>Últimas Novidades</h2>
            <p>Confira as novas coleções que chegaram na loja!</p>
            <!-- Aqui você pode adicionar mais conteúdo do dashboard -->
        </div>
    </div>
</body>
</html>