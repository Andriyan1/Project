// Функція перевірки видимості панелі користувача

function checkUserPanelVisibility() {
  const userPanel = document.querySelector(".user-panel");
  const sidebarNav = document.querySelector(".sidebar-nav");

  if (userPanel) {
    const displayStyle = window.getComputedStyle(userPanel).display;

    if (displayStyle === "none") {
      sidebarNav.style.paddingTop = "200px"; // Встановлюємо відступ
    } else {
      sidebarNav.style.paddingTop = "0"; // Відновлюємо відступ
    }
  }
}

// Функція для привітання користувача
function showUserGreeting() {
  const userElement = document.getElementById("user");
  const tokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("userToken="));
  const token = tokenCookie ? tokenCookie.split("=")[1] : null;

  if (userElement) {
    if (token) {
      const nickname = localStorage.getItem("nickname");
      console.log(
        `Привітання користувача: ${nickname ? nickname : "Користувач"}`
      );
      userElement.textContent = nickname
        ? `Привіт, ${nickname}!`
        : "Привіт, користувачу!";
    } else {
      userElement.textContent = "Привіт, гість!";
    }
  }
}

// Функція для отримання значення куки
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// Перевірка токену та відображення панелі користувача
document.addEventListener("DOMContentLoaded", function () {
  showUserGreeting(); // Відобразити привітання для користувача

  const token = getCookie("userToken"); // Отримати токен
  console.log(`Отриманий токен: ${token}`);

  const userPanel = document.querySelector(".user-panel");
  const loginBtn = document.querySelector(".login-btn");

  // Якщо токен є, відображаємо панель користувача
  if (token && userPanel) {
    loginBtn.style.display = "none"; // Сховати кнопку входу
    userPanel.style.display = "block"; // Показати панель
  } else {
    if (loginBtn) {
      loginBtn.style.display = "block"; // Показати кнопку входу
    }
    if (userPanel) {
      userPanel.style.display = "none"; // Приховати панель
    }
  }

  checkUserPanelVisibility(); // Перевірка наявності панелі
});

// Перевірка на сторінку налаштувань профілю
document.addEventListener("DOMContentLoaded", function () {
  const token = getCookie("userToken");
  if (!token) {
    return;
  }
  if (window.location.pathname === "/profile/") {
    const userPanel = document.querySelector(".user-panel");
    if (userPanel) {
      userPanel.style.display = "block";
    }
  }

  checkUserPanelVisibility(); // Перевірка видимості панелі на інших сторінках
});
