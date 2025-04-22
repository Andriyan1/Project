document.addEventListener('DOMContentLoaded', () => {
  // Elements for password visibility toggle
  const toggleRegisterPassword = document.getElementById('toggle-register-password');
  const registerPasswordField = document.getElementById('register-password');
  const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
  const confirmPasswordField = document.getElementById('confirm-password');

  // Elements for form toggling
  const switchToRegister = document.getElementById('switch-to-register');
  const backBtn = document.getElementById('back-btn')
  const backToLogin = document.getElementById('back-to-login');
  const registrationMessage = document.getElementById('registration-message'); // Registration message
  const verifyCodeGroup = document.getElementById('verify-code-group'); // Group for "Verify Code" button
  const authButton = document.querySelector('.auth-btn'); // Registration button
  const sendCodeBtn = document.querySelector('.send-code-btn'); // Send verification code button

  // Show/Hide password and confirm password
  if (toggleRegisterPassword && registerPasswordField) {
    toggleRegisterPassword.addEventListener('click', () => {
      const type = registerPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
      registerPasswordField.setAttribute('type', type);
      toggleRegisterPassword.classList.toggle('fa-eye');
      toggleRegisterPassword.classList.toggle('fa-eye-slash');
    });
  }

  if (toggleConfirmPassword && confirmPasswordField) {
    toggleConfirmPassword.addEventListener('click', () => {
      const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPasswordField.setAttribute('type', type);
      toggleConfirmPassword.classList.toggle('fa-eye');
      toggleConfirmPassword.classList.toggle('fa-eye-slash');
    });
  }

  // Switch between login and register forms
  if (switchToRegister) {
    switchToRegister.addEventListener('click', () => {
      document.getElementById('login-form').style.display = 'none';
      document.getElementById('register-form').style.display = 'block';
      document.getElementById('form-title').textContent = 'Create An Account';
      document.getElementById('form-description').textContent = 'Fill in the form below to create a new account.';
    });
  }

  
      // Якщо ми на формі реєстрації
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          const registerForm = document.getElementById('register-form');
          const loginForm = document.getElementById('login-form');
      
          // Якщо ми на формі реєстрації
          if (registerForm.style.display === 'block') {
            // Очищаємо поля форми реєстрації
            document.getElementById('register-email').value = '';
            document.getElementById('register-password').value = '';
            document.getElementById('confirm-password').value = '';
            document.getElementById('invitation-code').value = ''; // Якщо є поле для referral code
            document.getElementById('verification-code').value = '';
        
            // Перемикаємо на форму входу
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        
            // Оновлюємо заголовок і опис форми
            document.getElementById('form-title').textContent = 'Welcome Back!';
            document.getElementById('form-description').textContent = 'Enter your username and password to continue.';
          } 
          // Якщо ми на формі входу
          else if (loginForm.style.display === 'block') {
            // Редирект на головну сторінку
            window.location.href = '../HOme/indexhome.html';  // Замість '/' вкажіть URL вашої головної сторінки
          } 
          // Якщо не на жодній формі
          else {
            window.location.href = '../HOme/indexhome.html';  // Знову редирект на головну
          }
        });
      }
      

  if (backToLogin) {
    backToLogin.addEventListener('click', () => {
      document.getElementById('register-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('form-title').textContent = 'Welcome Back!';
      document.getElementById('form-description').textContent = 'Enter your username and password to continue.';
    });
  }

  // Email and password validation functions
  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  const isValidPassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z]).{8,}$/; // Minimum 8 characters with at least one uppercase letter
    return passwordPattern.test(password);
  };

  // Verify the code function
  let isCodeVerified = false;
  sendCodeBtn.addEventListener('click', () => {
    const email = document.getElementById('register-email').value; // Перевірка введеного email
  
    // Перевірка чи email не порожній
    if (!email) {
      showMessage('Please enter a valid email address.', 'red');
      return;
    }
  
    fetch('https://localhost:3000/send-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }) // Відправляємо email на сервер
    })
      .then(response => response.json())  // Перетворюємо відповідь на JSON
      .then(data => {
        if (data.success) {
          // Якщо код верифікації успішно відправлено
          showMessage('Verification code has been sent to your email!', 'green');
          verifyCodeGroup.style.display = 'block'; // Показуємо блок для введення коду
          sendCodeBtn.style.display = 'none'; // Ховаємо кнопку "Send Code"
        } else {
          // Якщо виникла помилка під час відправки коду
          showMessage('Failed to send verification code: ' + data.message, 'red');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred while sending the verification code.', 'red');
      });
  });
  
  // Функція для відображення повідомлень
  function showMessage(message, color) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.style.color = color;
    messageElement.style.display = 'block';
  }
  

  // Code verification
const verifyCodeBtn = document.querySelector('.verify-code-btn');
if (verifyCodeBtn) {
  verifyCodeBtn.addEventListener('click', () => {
    const email = document.getElementById('register-email').value.trim();
    const verificationCode = document.getElementById('verification-code').value.trim();

    // Перевірка, чи введений код
    if (!verificationCode) {
      showMessage('Please enter the verification code.', 'red');
      return;
    }

    // Відправка запиту на сервер для верифікації
    fetch('https://localhost:3000/verify-code', {  // Використовуйте HTTPS, якщо ваш сервер працює на ньому
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code: verificationCode })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Обробка помилок на рівні запиту
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          showMessage('Verification successful!', 'green');
          displayVerificationFields();  // Показуємо додаткові поля для заповнення
          isCodeVerified = true;
          authButton.disabled = false;

          // Блокуємо поле email після успішної верифікації
          const emailField = document.getElementById('register-email');
          emailField.disabled = true;  // Забороняємо редагувати email
        } else {
          showMessage('Invalid code or the code has expired.', 'red');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred while verifying the code.', 'red');
      });
  });
}


// Функція для показу повідомлень
function showMessage(message, color) {
  const registrationMessage = document.getElementById('registration-message');
  registrationMessage.style.color = color;
  registrationMessage.textContent = message;
  registrationMessage.style.display = 'inline';
}

// Функція для показу додаткових полів після верифікації
function displayVerificationFields() {
  document.getElementById('password-group').style.display = 'block';
  document.getElementById('confirm-password-group').style.display = 'block';
  document.getElementById('mobile-group').style.display = 'block';
  document.getElementById('invitation-code-group').style.display = 'block';
  document.getElementById('agreement-group').style.display = 'block';
  document.getElementById('button-container').style.display = 'block';
}


const registerForm = document.getElementById('register-form');

if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Перевірка, чи введено реферальний код
    const referralCode = document.getElementById('invitation-code').value.trim();
    if (!referralCode) {
      showMessage('Referral code is required!', 'red');  // Повідомлення про помилку
      return;  // Якщо реферальний код не введено, зупиняємо відправку форми
    }

    // Перевірка на валідацію
    if (!isCodeVerified) {
      showMessage('Please verify the code before submitting the form.', 'red');
      return;
    }

    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();

    // Перевірка валідації email
    if (!isValidEmail(email)) {
      showMessage('Please enter a valid email address.', 'red');
      return;
    }

    // Перевірка валідації пароля
    if (!isValidPassword(password)) {
      showMessage('Password must contain at least 8 characters and one uppercase letter.', 'red');
      return;
    }

    // Перевірка на співпадіння паролів
    if (password !== confirmPassword) {
      showMessage('Passwords do not match.', 'red');
      return;
    }

    const requestBody = { email, password, referralCode, invitationCode: referralCode };

    // Відправка запиту на сервер для реєстрації
    fetch('https://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          showMessage('Registration successful!', 'green');
        } else {
          showMessage('Error: ' + data.message, 'red');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred during registration. Please try again later.', 'red');
      });
  });
}


// Ваша функція для обробки форми логіну
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Забороняємо стандартну відправку форми

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!email || !password) {
    showMessage('Будь ласка, введіть email та пароль', 'error');
    return;
  }

  // Відправка POST запиту на сервер для аутентифікації
  fetch('https://localhost:3000/login', {  // Переконайтесь, що використовуєте правильний URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })  // Відправляємо email та пароль
  })
  .then(response => response.json())  // Отримуємо JSON відповідь
  .then(data => {
    if (data.message === 'Успішний логін') {
      // Вибір елемента user-panel за допомогою querySelector
      const userPanel = document.querySelector('.user-panel');
      if (userPanel) {
        userPanel.style.display = 'block';  // Відкриваємо панель
      } else {
        console.error('Не знайдено елемент з класом user-panel');
      }

      // Збереження токену в cookies
      if (data.token) {
        document.cookie = `userToken=${data.token}; path=/; max-age=3600`;  // Збереження токену в cookies
      }

      showMessage('Успішний логін!', 'success');  // Повідомлення для користувача
      window.location.href = '/';  // Перенаправлення на головну сторінку
    } else {
      showMessage(data.message, 'error');  // Повідомлення про помилку
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showMessage('Сталася помилка при логіні. Спробуйте ще раз.', 'error');
  });
});

// Функція для відображення повідомлень
function showMessage(message, type) {
  const messageBox = document.getElementById('message');  // Блок для повідомлень
  messageBox.textContent = message;
  messageBox.className = type;  // success або error
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';  // Приховуємо повідомлення після 5 секунд
  }, 5000);
}



  
});
