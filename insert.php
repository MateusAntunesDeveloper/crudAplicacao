<?php
require_once 'database.php';

$errors= [];
$name = $email = $password = '';


if($_SERVER['REQUEST METHOD'] === 'POST'){

    if(isset($_POST['name']) && $_POST['name'] !== '')
        {
            $name = filter_input(INPUT_POST,'name',FILTER_SANITIZE_STRING);
            if($name === false || $name === ''){
                $errors['name'] = 'nome invalido.';
            }
        }else
        {
            $errors['name'] = 'nome obrigatorio.';
        }

    if(isset($_POST['email']) && $_POST['email'] !== '')
        {
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            
            if(!filter_var($email, FILTER_SANITIZE_EMAIL))
            {
                $errors['email'] = 'Email invalido';
            }
        }else
        {
            $errors['email'] = 'email obrigatorio';
        }

    if(isset($_POST['password']) && $_POST['password'] !== '')
        {
            $password = $_POST['password'];
            if(strlen($password) < 15)
                {
                    $errors['password'] = 'senha deve conter no minimo 15 caracteres';
                }
        }else
        {
            $errors['password'] = 'Senha obrigatoria.';
        }
        if(empty($errors))
            {
                $passwordHash = password_hash($password, PASSWORD_DEFAULT);
                
                $sql = "INSERT INTO users (name,email,password) VALUES (?,?,?)";
                $stmt = $pdo->prepare($sql); 
            
            
                try{
                    $pdo->beginTransaction();
                    $stmt->execute([$name, $email, $passwordHash]);
                    $pdo->commit();
                    echo "Usuario cadastrado com sucesso! ";
                }catch(PDOException $e)
                {
                    $pdo->rollBack();
                    echo "Erro ao cadastrar usuario.\n";
                }    
            }else
            {
                foreach ($errors as $error) {
                    echo $error . "<br>";
                }
            }
}else
{
    echo "Requisicao invalidada.\n";
}
?>