
function logout() {
    // Видалення всіх кукі
    document.cookie.split(';').forEach(function(c) {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    });
    
    // Перехід на головну сторінку
    window.location.href = '/'; // або вкажіть потрібний URL для головної сторінки
}
async function loadUserData() {
    try {
        console.log('Запит до /profile...');
        const response = await fetch('https://localhost:3000/profile/', {
            method: 'GET',
            credentials: 'include',  // надсилає cookies автоматично
        });

        console.log('Статус відповіді:', response.status);
        console.log('Заголовки відповіді:', response.headers);

        // Перевіряємо, чи відповідає Content-Type на JSON
        const contentType = response.headers.get('Content-Type');
        console.log('Content-Type відповіді:', contentType);

        if (!response.ok) {
            const errorText = await response.text(); // Отримуємо текст відповіді (можливо HTML)
            console.error("Помилка сервера:", errorText);
            throw new Error('Помилка при отриманні даних користувача');
        }

        // Перевірка на JSON відповідь
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Отримані дані:', data);

            // Виведення даних у елементи HTML
            document.getElementById("username").textContent = data.nickname || "Невідомо";
            document.getElementById("email").textContent = data.email || "Невідомо";
            document.getElementById("invitation-code").textContent = data.invitationCode || "Невідомо";
        } else {
            console.error('Отримано не JSON відповідь');
            throw new Error('Отримано не JSON відповідь');
        }
    } catch (error) {
        console.error('Помилка при отриманні даних користувача:', error);

        // Якщо сталася помилка, відображаємо значення за замовчуванням
        document.getElementById("username").textContent = "Гість";
        document.getElementById("email").textContent = "Невідомо";
        document.getElementById("invitation-code").textContent = "Невідомо";
    }
}

loadUserData();  // Викликаємо функцію для завантаження даних


  