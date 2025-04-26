document.getElementById("logout-btn").addEventListener("click", function() {
    alert("Logging out...");
    // Logic for logging out (clear session, etc.)
});
// Список кольорів для випадкових іконок
const colors = ['#ff5733', '#33ff57', '#3357ff', '#f5a623', '#8e44ad', '#f39c12', '#e74c3c', '#2ecc71', '#3498db'];

// Масив рефералів
const referrals = [
    { username: "referralUser1", email: "ref1@gmail.com", status: "Active" },
    { username: "referralUser2", email: "ref2@gmail.com", status: "Active" },
    { username: "referralUser3", email: "ref3@gmail.com", status: "Inactive" },
];

// Генерація випадкової іконки для реферала
function generateRandomAvatar() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Випадкова буква

    return { color: randomColor, letter: randomChar };
}

// Функція для додавання рефералів на сторінку
function loadReferrals() {
    const referralList = document.getElementById('referralList');
    
    // Очищаємо список рефералів
    referralList.innerHTML = '';

    // Перебираємо рефералів і додаємо їх на сторінку
    referrals.forEach(referral => {
        const avatar = generateRandomAvatar();

        // Створюємо елемент для кожного реферала
        const referralItem = document.createElement('div');
        referralItem.classList.add('referral-item');

        // Додаємо SVG іконку для реферала
        const avatarElement = document.createElement('div');
        avatarElement.classList.add('ref-avatar');
        avatarElement.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="50" height="50">
                <circle cx="50" cy="50" r="40" fill="${avatar.color}" />
                <text x="50%" y="50%" font-size="30" text-anchor="middle" fill="#fff" dy=".3em">${avatar.letter}</text>
            </svg>
        `;

        // Додаємо деталі реферала
        const details = document.createElement('div');
        details.classList.add('ref-details');

        const username = document.createElement('p');
        username.innerHTML = `<strong>Username:</strong> ${referral.username}`;
        details.appendChild(username);

        const email = document.createElement('p');
        email.innerHTML = `<strong>Email:</strong> ${referral.email}`;
        details.appendChild(email);

        const status = document.createElement('p');
        status.innerHTML = `<strong>Status:</strong> ${referral.status}`;
        details.appendChild(status);

        // Вставляємо аватар і деталі
        referralItem.appendChild(avatarElement);
        referralItem.appendChild(details);

        // Додаємо реферала в список
        referralList.appendChild(referralItem);
    });
}

// Завантажуємо рефералів при завантаженні сторінки
window.onload = loadReferrals;