
        document.getElementById('recoveryForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('email').value;
            const emailError = document.getElementById('email-error');
            const successMessage = document.getElementById('successMessage');
            
            // Validação simples de e-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                emailError.textContent = 'Por favor, insira um endereço de e-mail válido.';
                emailError.style.display = 'block';
                successMessage.style.display = 'none';
            } else {
                emailError.style.display = 'none';
                successMessage.style.display = 'flex';
                
                // Simulação de envio - em um caso real, faria uma requisição ao servidor
                console.log('Solicitação de recuperação enviada para:', email);
                
                // Limpar o formulário após 3 segundos
                setTimeout(() => {
                    document.getElementById('recoveryForm').reset();
                    successMessage.style.display = 'none';
                }, 5000);
            }
        });
        
        // Validação em tempo real
        document.getElementById('email').addEventListener('input', function() {
            const emailError = document.getElementById('email-error');
            emailError.style.display = 'none';
        });