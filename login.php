<?php
session_start();

// Se já estiver logado, redireciona para dashboard
if(isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    header("Location: dashboard.php");
    exit;
}

include_once 'config/database.php';
include_once 'auth.php';

$database = new Database();
$db = $database->getConnection();
$auth = new Auth($db);

$error = "";

if($_POST) {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    if($auth->login($email, $password)) {
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Email ou senha incorretos!";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StyleStore - Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="login-container">
            <div class="brand-section">
                <h1 class="brand-name">StyleStore</h1>
                <p class="brand-tagline">Sua moda, seu estilo</p>
            </div>
            
            <?php if($error): ?>
                <div class="error-message" style="background: #ffebee; color: #c62828; padding: 12px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <?php echo $error; ?>
                </div>
            <?php endif; ?>
            
            <form class="login-form" method="POST" action="login.php">
                <h2>Faça seu login</h2>
                
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="seu@email.com"
                        value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>"
                        required>
                </div>
                
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="Sua senha"
                        required>
                </div>
                
                <div class="form-options">
                    <label class="remember-me">
                        <input type="checkbox" name="remember">
                        Lembrar-me
                    </label>
                    <a href="#" class="forgot-password">Esqueci minha senha</a>
                </div>
                
                <button type="submit" class="login-btn">Entrar</button>
                
                <div class="divider">
                    <span>ou</span>
                </div>
                
                <button type="button" class="social-btn google-btn">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2LjUxIDkuMjA0NTVWOS4wOTU0NUg5Vi4wOTU0NTZIMTYuNTFDMTcuODcgMi4wNDU0NSA5IDkuMjA0NTUgOSA5LjIwNDU1WiIgZmlsbD0iIzQyODVGMyIvPgo8cGF0aCBkPSJNMSAyLjU0NTQ1QzIuMDkgMS4wOTU0NSAzLjY4IDAuMDk1NDU2IDUuNSAwLjA5NTQ1NkM3LjgyIDAuMDk1NDU2IDkuNzMgMS4zNDU0NSAxMC43NSAzLjA5NTQ1TDEzLjI1IDAuNTk1NDU2QzExLjU5IC0xLjUwNDU1IDguNzIgLTIuOTA0NTUgNS41IC0yLjkwNDU1QzIuMzggLTIuOTA0NTUgLTAuMzkgLTEuNjA0NTUgMSAyLjU0NTQ1WiIgZmlsbD0iIzM0QTgzOCIvPgo8cGF0aCBkPSJNNS41IDE4LjA5NTRDMy42OCAxOC4wOTU0IDIuMDkgMTcuMDk1NCAxIDE1LjY0NTRDMi4zOSAxMy4xOTU0IDUuNSAxMS4wOTU0IDUuNSAxMS4wOTU0QzYuNSAxMi4wOTU0IDguMTggMTMuNTk1NCA4LjE4IDEzLjU5NTRDMTEuMDkgMTEuMDk1NCAxMy4yNSAxMC4wOTU0IDEzLjI1IDEwLjA5NTRDMTMuMjUgMTEuMDk1NCAxMy4yNSAxMy4wOTU0IDEzLjI1IDE0LjA5NTRDMTMuMjUgMTYuMDk1NCAxMS41OSAxOC4wOTU0IDUuNSAxOC4wOTU0WiIgZmlsbD0iI0ZCQkMwNCIvPgo8cGF0aCBkPSJNMTYgMTUuMDk1NEMxNiAxNy4wOTU0IDE0LjM0IDE4LjA5NTQgOS4yNSAxOC4wOTU0QzQuMTYgMTguMDk1NCAxLjUgMTcuMDk1NCAxLjUgMTUuMDk1NEMxLjUgMTMuMDk1NCAzLjE2IDEyLjA5NTQgOC4yNSAxMi4wOTU0QzEzLjM0IDEyLjA5NTQgMTYgMTMuMDk1NCAxNiAxNS4wOTU0WiIgZmlsbD0iIzM0QTgzOCIvPgo8L3N2Zz4K" alt="Google">
                    Continuar com Google
                </button>
                
                <p class="signup-link">
                    Não tem uma conta? <a href="register.php">Cadastre-se</a>
                </p>
            </form>
        </div>
        
        <div class="hero-section">
            <div class="hero-content">
                <h2>Bem-vindo de volta!</h2>
                <p>Descubra as últimas tendências da moda e renove seu guarda-roupa.</p>
                <div class="features">
                    <div class="feature">
                        <span>🛍️</span>
                        <span>Frete grátis acima de R$ 199</span>
                    </div>
                    <div class="feature">
                        <span>🎁</span>
                        <span>Primeira compra com 15% off</span>
                    </div>
                    <div class="feature">
                        <span>🔒</span>
                        <span>Compra 100% segura</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>