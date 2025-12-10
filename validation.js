
document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();        
            // Validação básica
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const termos = document.getElementById('termos').checked;
        
    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
            return;
        }
            
    if (senha.length < 8) {
            alert('A senha deve ter no mínimo 8 caracteres!');
        return;
        }
            
    if (!termos) {
            alert('Você precisa aceitar os Termos de Uso!');
        return;
        }
            
            // Simulação de cadastro bem-sucedido
    alert('Cadastro realizado com sucesso! Redirecionando...');
        setTimeout(() => {
        window.location.href = 'account.html';
    }, 1500);
    });
        
        // Validação da força da senha em tempo real
document.getElementById('senha').addEventListener('input', function(e) {
    const senha = e.target.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
            
    let strength = 0;
    let color = '#e74c3c';
    let text = 'fraca';
            
    if (senha.length >= 8) strength++;
    if (/[A-Z]/.test(senha)) strength++;
    if (/[0-9]/.test(senha)) strength++;
    if (/[^A-Za-z0-9]/.test(senha)) strength++;
            
    if (strength === 2) {
        color = '#f39c12';
        text = 'média';
    } else if (strength === 3) {
        color = '#3498db';
        text = 'boa';
    } else if (strength >= 4) {
        color = '#2ecc71';
        text = 'forte';
    }
            
strengthBar.style.width = (strength * 25) + '%';
strengthBar.style.backgroundColor = color;
strengthText.textContent = 'Força da senha: ' + text;
strengthText.style.color = color;
});
        
        // Formatação do telefone
document.getElementById('telefone').addEventListener('input', function(e) {
let value = e.target.value.replace(/\D/g, '');
            
if (value.length > 11) {
    value = value.substring(0, 11);
}
            
if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
} else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
} else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
} else if (value.length > 0) {
    value = value.replace(/^(\d*)/, '($1');
}
            
e.target.value = value;
});