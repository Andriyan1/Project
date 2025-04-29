function logout() {
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    });
    window.location.href = '/';
  }
  
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let r = (hash >> 0) & 0xFF;
    let g = (hash >> 8) & 0xFF;
    let b = (hash >> 16) & 0xFF;
    r = Math.floor((r + 255) / 2);
    g = Math.floor((g + 255) / 2);
    b = Math.floor((b + 255) / 2);
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  async function loadProfileData() {
    try {
      const response = await fetch("/profile-data", {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Не вдалося завантажити профіль");
      }
  
      const data = await response.json();
      console.log("Отримані дані профілю:", data);
  
      const nicknameElem = document.getElementById("username");
      const emailElem = document.getElementById("email");
      const referralCodeElem = document.getElementById("referralCode");
      const profilePicText = document.querySelector(".profile-pic text");
      const profilePicWrapper = document.querySelector(".profile-pic");
  
      if (nicknameElem) nicknameElem.textContent = data.nickname ?? "—";
      if (emailElem) emailElem.textContent = data.email ?? "—";
      if (referralCodeElem) referralCodeElem.textContent = data.referralCode ?? "—";
  
      if (profilePicText && data.nickname) {
        profilePicText.textContent = data.nickname.charAt(0).toUpperCase();
  
        const generatedColor = stringToColor(data.nickname);
  
        const circle = document.querySelector(".profile-pic circle");
        if (circle) {
          circle.setAttribute("fill", generatedColor);
        }
  
        if (profilePicWrapper) {
          profilePicWrapper.style.backgroundColor = generatedColor;
        }
      }
  
      const referralCodeElement = document.getElementById("referralCode");
      const copyNotification = document.getElementById("copyNotification");
  
      referralCodeElement.addEventListener("click", function () {
        const code = referralCodeElement.textContent.trim();
        if (code && code !== "Loading...") {
          navigator.clipboard.writeText(code)
            .then(() => {
              copyNotification.style.display = "block";
              setTimeout(() => {
                copyNotification.style.display = "none";
              }, 2000);
            })
            .catch((err) => {
              console.error("Помилка копіювання:", err);
            });
        }
      });
  
    } catch (error) {
      console.error("Помилка завантаження профілю:", error);
    }
  }
  
  async function loadMyReferrals() {
    try {
      const response = await fetch('/my-referrals', {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) throw new Error('Не вдалося завантажити рефералів');
  
      let referrals = await response.json(); // треба let
  
      console.log('Мої реферали:', referrals);
  
      const countElem = document.getElementById('referralCount');
      countElem.textContent = `Кількість рефералів: ${referrals.length}`;
  
      const container = document.getElementById('referralList');
      container.innerHTML = ''; // очищаємо рефералів
  
      // Малюємо рефералів
      referrals.forEach(ref => {
        const color = stringToColor(ref.nickname || 'default');
        const firstLetter = (ref.nickname || '?').charAt(0).toUpperCase();
  
        const referralDiv = document.createElement('div');
        referralDiv.classList.add('ref-avatar');
        referralDiv.innerHTML = `
          <svg viewBox="0 0 100 100" width="50" height="50">
            <circle cx="50" cy="50" r="40" fill="${color}" />
            <text x="50%" y="50%" font-size="30" text-anchor="middle" fill="#fff" dy=".3em">${firstLetter}</text>
          </svg>
        `;
  
        container.appendChild(referralDiv);
      });
  
    } catch (err) {
      console.error('Помилка завантаження рефералів:', err);
    }
  }
  const token = getCookie('userToken'); // Ім'я кукі, яке ти використовуєш в бекенді

  if (!token) {
    // Якщо кукі немає — перекидаємо на головну
    window.location.href = '/';
  }

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  
}
  document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    loadMyReferrals();
  });
  
  