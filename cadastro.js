const form = document.getElementById('loginForm');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // pegar valores
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // VALIDAR CAMPOS
    if (!validarCampos(email, password)) {
        return;
    }

    grecaptcha.ready(async function() {
        try {
            // TOKEN DO RECAPTCHA
            const token = await grecaptcha.execute(
                '6LcvXCEsAAAAAD8UP8FtA29Anwpeq7AhiVWZQ_fQ',   // SITE KEY
                { action: 'submit' }
            );

            const formData = new FormData(form);
            formData.append('g-recaptcha-response', token);

            // =============================
            // 1️⃣ ENVIA PARA O BACKEND.PHP
            // =============================
            const respostaBackend = await fetch("cadastro.php", {
                method: "POST",
                body: formData
            });

            const resultado = await respostaBackend.json();
            console.log("Resultado do backend:", resultado);

            if (!resultado.sucesso) {
                alert("⚠ Erro no reCAPTCHA: " + resultado.erro);
                return;
            }

            // =============================
            // 2️⃣ ENVIAR EMAIL VIA EMAILJS
            // =============================
            const emailParams = {
                user_email: email  // ❗Se for usar na prática, remova isso.
            };

            const emailResponse = await emailjs.send(
                "service_woaqqdh",    
                "template_tg9sqd3",   
                emailParams
            );

            console.log("EmailJS:", emailResponse);

            alert("✅ Login validado! Score Google: " + resultado.score);

            // Redirecionar após sucesso
            window.location.href = "account.html";



            


        } catch (erro) {
            console.error("Erro:", erro);
            alert("❌ Ocorreu um erro inesperado. Veja o console.");
        }
    });
});

// ---------- Função de validação ----------
function validarCampos(email, password) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        alert("Digite um e-mail válido.");
        return false;
    }

    if (password.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return false;
    }

    return true;
}



