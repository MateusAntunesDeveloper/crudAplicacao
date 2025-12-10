
        // Pegar dados do usuário do localStorage
        const userName = localStorage.getItem('userName') || 'Usuário';
        const userEmail = localStorage.getItem('userEmail') || '';

        document.getElementById('user-name').textContent = `Bem-vindo, ${userName}`;
        document.getElementById('user-email').textContent = userEmail;

        // Configurações da conta
        const changeAccountBtn = document.getElementById('changeAccountBtn');
        const accountForm = document.getElementById('accountForm');

        changeAccountBtn.addEventListener('click', () => {
            accountForm.style.display = 'flex';
            changeAccountBtn.style.display = 'none';
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            const newEmail = document.getElementById('newEmail').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();

            if(newEmail) {
                localStorage.setItem('userEmail', newEmail);
                document.getElementById('user-email').textContent = newEmail;
            }

            if(newPassword) {
                localStorage.setItem('userPassword', newPassword);
            }

            alert('Alterações salvas com sucesso!');
            accountForm.style.display = 'none';
            changeAccountBtn.style.display = 'block';
        });

        // Sistema de Pagamento
        const paymentOption = document.getElementById('paymentOption');
        const paymentModal = document.getElementById('paymentModal');
        const closeModal = document.querySelector('.close-modal');
        const paymentForm = document.getElementById('paymentForm');
        const cardPreview = document.getElementById('cardPreview');

        // Abrir modal de pagamento
        paymentOption.addEventListener('click', () => {
            paymentModal.style.display = 'flex';
            paymentOption.classList.add('selected');
            
            // Carregar dados salvos se existirem
            loadSavedCard();
        });

        // Fechar modal
        closeModal.addEventListener('click', () => {
            paymentModal.style.display = 'none';
            paymentOption.classList.remove('selected');
            resetForm();
        });

        // Fechar modal ao clicar fora
        paymentModal.addEventListener('click', (e) => {
            if (e.target === paymentModal) {
                paymentModal.style.display = 'none';
                paymentOption.classList.remove('selected');
                resetForm();
            }
        });

        // Funções de validação de cartão
        function validateCardNumber(cardNumber) {
            // Remover espaços
            const cleanNumber = cardNumber.replace(/\s/g, '');
            
            // Verificar se contém apenas números
            if (!/^\d+$/.test(cleanNumber)) {
                return { valid: false, type: 'invalid' };
            }
            
            // Algoritmo de Luhn
            let sum = 0;
            let isEven = false;
            
            for (let i = cleanNumber.length - 1; i >= 0; i--) {
                let digit = parseInt(cleanNumber.charAt(i));
                
                if (isEven) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }
                
                sum += digit;
                isEven = !isEven;
            }
            
            const isValid = (sum % 10) === 0;
            
            // Identificar bandeira
            let cardType = 'unknown';
            if (/^4/.test(cleanNumber)) {
                cardType = 'visa';
            } else if (/^5[1-5]/.test(cleanNumber)) {
                cardType = 'mastercard';
            } else if (/^3[47]/.test(cleanNumber)) {
                cardType = 'amex';
            } else if (/^6(?:011|5)/.test(cleanNumber)) {
                cardType = 'discover';
            }
            
            return { valid: isValid, type: cardType };
        }

        function formatCardNumber(value) {
            // Remover tudo exceto números
            const numbers = value.replace(/\D/g, '');
            
            // Formatar em grupos de 4
            const groups = numbers.match(/.{1,4}/g);
            return groups ? groups.join(' ') : numbers;
        }

        function validateExpiryDate(expiry) {
            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                return false;
            }
            
            const [month, year] = expiry.split('/').map(Number);
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            
            if (month < 1 || month > 12) {
                return false;
            }
            
            if (year < currentYear) {
                return false;
            }
            
            if (year === currentYear && month < currentMonth) {
                return false;
            }
            
            return true;
        }

        function validateCVV(cvv, cardType) {
            if (!/^\d+$/.test(cvv)) {
                return false;
            }
            
            if (cardType === 'amex') {
                return cvv.length === 4;
            } else {
                return cvv.length === 3;
            }
        }

        // Elementos do formulário
        const cardNumberInput = document.getElementById('cardNumber');
        const cardNameInput = document.getElementById('cardName');
        const cardExpiryInput = document.getElementById('cardExpiry');
        const cardCvvInput = document.getElementById('cardCvv');
        const submitPaymentBtn = document.getElementById('submitPayment');

        // Atualizar pré-visualização em tempo real
        cardNumberInput.addEventListener('input', (e) => {
            // Formatar número
            const formatted = formatCardNumber(e.target.value);
            e.target.value = formatted;
            
            // Atualizar pré-visualização
            document.getElementById('cardNumberPreview').textContent = formatted || '**** **** **** ****';
            
            // Validar e mostrar bandeira
            const validation = validateCardNumber(formatted);
            updateCardIcons(validation.type);
            
            // Mostrar pré-visualização
            cardPreview.style.display = 'block';
            
            // Validar input
            validateInput(cardNumberInput, validation.valid, 'cardNumberError');
        });

        cardNameInput.addEventListener('input', (e) => {
            const name = e.target.value.toUpperCase();
            document.getElementById('cardNamePreview').textContent = name || 'NOME NO CARTAO';
            validateInput(cardNameInput, name.length >= 3, 'cardNameError');
        });

        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            
            e.target.value = value;
            
            if (value.length === 5) {
                document.getElementById('cardExpiryPreview').textContent = value;
                validateInput(cardExpiryInput, validateExpiryDate(value), 'cardExpiryError');
            } else {
                document.getElementById('cardExpiryPreview').textContent = 'MM/AA';
            }
        });

        cardCvvInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/\D/g, '');
            e.target.value = value;
            
            // Determinar bandeira para validar CVV
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            const cardType = getCardType(cardNumber);
            const isValid = validateCVV(value, cardType);
            
            validateInput(cardCvvInput, isValid, 'cardCvvError');
        });

        function getCardType(cardNumber) {
            if (/^4/.test(cardNumber)) return 'visa';
            if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
            if (/^3[47]/.test(cardNumber)) return 'amex';
            if (/^6(?:011|5)/.test(cardNumber)) return 'discover';
            return 'unknown';
        }

        function updateCardIcons(cardType) {
            // Reset todos os ícones
            document.querySelectorAll('.card-icon').forEach(icon => {
                icon.classList.remove('active');
            });
            
            // Ativar ícone correspondente
            switch(cardType) {
                case 'visa':
                    document.getElementById('visaIcon').classList.add('active');
                    break;
                case 'mastercard':
                    document.getElementById('mastercardIcon').classList.add('active');
                    break;
                case 'amex':
                    document.getElementById('amexIcon').classList.add('active');
                    break;
                case 'discover':
                    document.getElementById('discoverIcon').classList.add('active');
                    break;
            }
        }

        function validateInput(input, isValid, errorId) {
            const errorElement = document.getElementById(errorId);
            
            if (isValid) {
                input.classList.remove('input-error');
                input.classList.add('input-success');
                errorElement.style.display = 'none';
            } else {
                input.classList.remove('input-success');
                input.classList.add('input-error');
                errorElement.style.display = 'block';
            }
            
            updateSubmitButton();
        }

        function updateSubmitButton() {
            const cardNumberValid = validateCardNumber(cardNumberInput.value).valid;
            const cardNameValid = cardNameInput.value.length >= 3;
            const expiryValid = validateExpiryDate(cardExpiryInput.value);
            
            // Validar CVV baseado na bandeira
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            const cardType = getCardType(cardNumber);
            const cvvValid = validateCVV(cardCvvInput.value, cardType);
            
            const allValid = cardNumberValid && cardNameValid && expiryValid && cvvValid;
            
            submitPaymentBtn.disabled = !allValid;
        }

        function resetForm() {
            cardNumberInput.value = '';
            cardNameInput.value = '';
            cardExpiryInput.value = '';
            cardCvvInput.value = '';
            
            document.querySelectorAll('.error-message').forEach(el => {
                el.style.display = 'none';
            });
            
            document.querySelectorAll('input').forEach(input => {
                input.classList.remove('input-error', 'input-success');
            });
            
            cardPreview.style.display = 'none';
            document.getElementById('successMessage').style.display = 'none';
            submitPaymentBtn.disabled = true;
            
            // Reset ícones
            document.querySelectorAll('.card-icon').forEach(icon => {
                icon.classList.remove('active');
            });
        }

        function loadSavedCard() {
            const savedCard = localStorage.getItem('userCard');
            if (savedCard) {
                try {
                    const card = JSON.parse(savedCard);
                    cardNumberInput.value = formatCardNumber(card.number);
                    cardNameInput.value = card.name;
                    cardExpiryInput.value = card.expiry;
                    
                    // Atualizar pré-visualização
                    document.getElementById('cardNumberPreview').textContent = formatCardNumber(card.number);
                    document.getElementById('cardNamePreview').textContent = card.name.toUpperCase();
                    document.getElementById('cardExpiryPreview').textContent = card.expiry;
                    
                    // Validar bandeira
                    const validation = validateCardNumber(card.number);
                    updateCardIcons(validation.type);
                    
                    cardPreview.style.display = 'block';
                    
                    // Validar inputs
                    validateInput(cardNumberInput, validation.valid, 'cardNumberError');
                    validateInput(cardNameInput, card.name.length >= 3, 'cardNameError');
                    validateInput(cardExpiryInput, validateExpiryDate(card.expiry), 'cardExpiryError');
                    
                } catch (e) {
                    console.error('Erro ao carregar cartão salvo:', e);
                }
            }
        }

        // Submeter formulário de pagamento
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Coletar dados
            const cardData = {
                number: cardNumberInput.value.replace(/\s/g, ''),
                name: cardNameInput.value,
                expiry: cardExpiryInput.value,
                type: getCardType(cardNumberInput.value.replace(/\s/g, ''))
            };
            
            // Salvar no localStorage
            localStorage.setItem('userCard', JSON.stringify(cardData));
            
            // Mostrar mensagem de sucesso
            document.getElementById('successMessage').style.display = 'block';
            
            // Atualizar botão de pagamento na interface
            paymentOption.innerHTML = `
                <div class="payment-option-header">
                    <i class="fas fa-check-circle" style="color: #2ecc71;"></i>
                    <div>
                        <h3>Cartão Cadastrado</h3>
                        <p>${cardData.type.toUpperCase()} •••• ${cardData.number.slice(-4)}</p>
                    </div>
                </div>
            `;
            
            // Fechar modal após 2 segundos
            setTimeout(() => {
                paymentModal.style.display = 'none';
                resetForm();
            }, 2000);
        });

        // Inicializar
        updateSubmitButton();