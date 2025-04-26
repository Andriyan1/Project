
function logout() {
    // Видалення всіх кукі
    document.cookie.split(';').forEach(function(c) {
        document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    });
    
    // Перехід на головну сторінку
    window.location.href = '/'; // або вкажіть потрібний URL для головної сторінки
}
// Завантаження даних профілю
async function loadProfileData() {
    try {
      const response = await fetch("/profile-data", {
        method: "GET",
        credentials: "include", // Щоб кукі передавались
      });
  
      if (!response.ok) {
        throw new Error("Не вдалося завантажити профіль");
      }
  
      const data = await response.json();
      console.log("Отримані дані профілю:", data);
  
      const nicknameElem = document.getElementById("username");
      const emailElem = document.getElementById("email");
      const referralCodeElem = document.getElementById("referralCode");
  
      if (nicknameElem) nicknameElem.textContent = data.nickname ?? "—";
      if (emailElem) emailElem.textContent = data.email ?? "—";
      if (referralCodeElem) referralCodeElem.textContent = data.referralCode ?? "—";
  
    } catch (error) {
      console.error("Помилка завантаження профілю:", error);
    }
    const referralCodeElement = document.getElementById("referralCode");
    const copyNotification = document.getElementById("copyNotification");

    referralCodeElement.addEventListener("click", function () {
      const code = referralCodeElement.textContent.trim();
      if (code && code !== "Loading...") {
        navigator.clipboard.writeText(code)
          .then(() => {
            // Показуємо плашку
            copyNotification.style.display = "block";
            setTimeout(() => {
              copyNotification.style.display = "none";
            }, 2000); // Показувати 2 секунди
          })
          .catch((err) => {
            console.error("Помилка копіювання:", err);
          });
      }
    });
 
  
  }  
  document.addEventListener("DOMContentLoaded", loadProfileData);
  
  
  





  