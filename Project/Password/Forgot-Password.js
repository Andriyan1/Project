
document.querySelector(".back-link").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("resetPasswordForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  });
 
  document.addEventListener("DOMContentLoaded", function () {

    // Обробник кліку на кнопку "Send Code"
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    const messageElement = document.getElementById('message');
  
    // Виводимо повідомлення в елемент на сторінці
    function showMessage(message, color) {
      messageElement.textContent = message;
      messageElement.style.color = color;
      messageElement.style.display = 'block';
    }
  
    sendCodeBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value.trim();
  
      if (!email) {
        showMessage('Please enter a valid email address.', 'red');
        return;
      }
  
      // Надсилаємо email на сервер для отримання коду
      fetch('https://localhost:3000/send-code-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })
        .then(response => response.json())  // Перетворюємо відповідь на JSON
        .then(data => {
          console.log(data); // Лог для перевірки
          if (data.success) {
            // Якщо код верифікації успішно відправлений
            showMessage('Verification code has been sent to your email!', 'green');
            
            // Змінюємо кнопки
            sendCodeBtn.style.display = 'none';  // Ховаємо кнопку "Send Code"
            verifyCodeBtn.style.display = 'block';  // Показуємо кнопку "Verify Code"
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
  
    // Обробник кліку на кнопку "Verify Code"
    verifyCodeBtn.addEventListener('click', function () {
      const email = document.getElementById('email').value.trim();
      const verificationCode = document.getElementById('code').value.trim();
  
      if (!verificationCode) {
        showMessage('Please enter the verification code.', 'red');
        return;
      }
  
      // Надсилаємо код на сервер для верифікації
      fetch('https://localhost:3000/verify-code-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode })
      })
        .then(response => response.json())
        .then(data => {
          console.log(data); // Лог для перевірки
          if (data.success) {
            showMessage('Verification successful!', 'green');
            
            // Відкриваємо додаткові поля для нового пароля
            document.getElementById("newPassword").style.display = 'block';
            document.getElementById("confirmPassword").style.display = 'block';
            document.getElementById("submitBtn").style.display = 'block';
          } else {
            showMessage('Invalid code or the code has expired.', 'red');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          showMessage('An error occurred while verifying the code.', 'red');
        });
    });
    // Обробник кліку на кнопку "Submit"
  document.getElementById("submitBtn").addEventListener("click", function () {
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Валідація пароля
    if (!isValidPassword(newPassword)) {
      showMessage('Password must be at least 8 characters long and include at least one uppercase letter and one number.', 'red');
      return;
    }

    // Перевірка на співпадіння паролів
    if (newPassword !== confirmPassword) {
      showMessage('Passwords do not match.', 'red');
      return;
    }

    // Відправка запиту на сервер для оновлення пароля
    const email = document.getElementById('email').value.trim(); // Отримуємо email користувача
    fetch('https://localhost:3000/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showMessage('Password successfully updated!', 'green');
        window.location.href = "/login";  // Перенаправлення на сторінку входу після оновлення пароля
      } else {
        showMessage('Error: ' + data.message, 'red');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showMessage('An error occurred while updating the password.', 'red');
    });
  });

  // Функція валідації пароля
  function isValidPassword(password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    return passwordRegex.test(password);
  }
  
  });
  