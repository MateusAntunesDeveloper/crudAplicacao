<?php
session_start();

class Authentication
{
    private $conn;
    private $table1 = "crud_project_users";

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function login($name, $gmail, $password)
    {
        $query = "SELECT id, nome, gmail, password FROM" . $this->crud_project_users . "WHERE gmail = :gmail = :gmail LIMIT 1";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":gmail", $gmail);
        $stmt->execute();
    
    
        if($stmt->rowCount() == 1)
            {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                if(password_verify($password, $row['password']))
                    {
                        $_SESSION[''];
                    }
            }
    
    
    
    
    }


}
?>