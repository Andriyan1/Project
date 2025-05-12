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
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) throw new Error('Не вдалося завантажити рефералів');
  
      const data = await response.json();
      console.log('Отримано:', data);
  
      const { totalReferrals, level1, level2, level3 } = data;
  
      // Вставляємо кількість рефералів у відповідні div'и
      document.getElementById('referralCountTotal').textContent = `Загальна кількість рефералів: ${totalReferrals}`;
      const container = document.getElementById('referralList');
      container.innerHTML = ''; // очищення
  
      const renderLevel = (referrals, level) => {
        const levelWrapper = document.createElement('div');
        levelWrapper.style.marginBottom = '20px';
  
        const title = document.createElement('div');
        title.textContent = `Рівень ${level}: ${referrals.length}`;
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '10px';
        levelWrapper.appendChild(title);
  
        const grid = document.createElement('div');
        grid.style.display = 'flex';
        grid.style.flexWrap = 'wrap';
        grid.style.gap = '10px';
  
        referrals.forEach(nickname => {
          const color = stringToColor(nickname || 'default');
          const firstLetter = (nickname || '?').charAt(0).toUpperCase();
  
          const refDiv = document.createElement('div');
          refDiv.style.display = 'flex';
          refDiv.style.flexDirection = 'column';
          refDiv.style.alignItems = 'center';
          refDiv.innerHTML = `
            <svg viewBox="0 0 100 100" width="50" height="50">
              <circle cx="50" cy="50" r="40" fill="${color}" />
              <text x="50%" y="50%" font-size="30" text-anchor="middle" fill="#fff" dy=".3em">${firstLetter}</text>
            </svg>
          `;
  
          grid.appendChild(refDiv);
        });
  
        levelWrapper.appendChild(grid);
        container.appendChild(levelWrapper);
      };
  
      renderLevel(level1, 1);
      renderLevel(level2, 2);
      renderLevel(level3, 3);

    } catch (err) {
      console.error('Помилка завантаження рефералів:', err);
    }
  }
  
  // Перевірка кукі
  const token = getCookie('userToken');
  if (!token) {
    window.location.href = '/';
  } else {
    loadMyReferrals();
  }
  
  // Функція для отримання кукі
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Функція для відправки запиту на повторну відправку email
//  // Функція для відправки запиту на повторну відправку email
async function checkVerificationStatus() {
  const token = getCookie('userToken');
  console.log('Token:', token);

  if (!token) {
      console.warn('Токен відсутній у кукі');
      document.getElementById('account-status').textContent = 'Status: Not Authorized';
      document.getElementById('verification-status').style.display = 'block';
      document.getElementById('resend-verification').style.display = 'none';
      return;
  }

  try {
      console.log('Sending request to http://localhost:3000/api/user-status');
      const response = await fetch('/user-status', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Сервер повернув не JSON');
      }

      const user = await response.json();
      console.log('User data:', user);

      if (response.ok) {
          if (!user.verified) {
              document.getElementById('account-status').textContent = 'Status: Not Verified';
              document.getElementById('verification-status').style.display = 'block';
              document.getElementById('resend-verification').style.display = 'block';
              document.getElementById('resend-verification').addEventListener('click', resendVerificationEmail);
          } else {
              document.getElementById('account-status').textContent = 'Status: Verified';
              document.getElementById('verification-status').style.display = 'none';
              document.getElementById('resend-verification').style.display = 'none';
          }
      } else {
          console.error('Server error:', user.message);
          alert(`Помилка: ${user.message}`);
      }
  } catch (error) {
      console.error('Fetch error:', error);
      document.getElementById('account-status').textContent = 'Status: Error';
  }
}

async function resendVerificationEmail() {
  const token = getCookie('userToken');
  console.log('Token:', token);

  if (!token) {
      alert('Ви не авторизовані. Увійдіть у систему.');
      return;
  }

  try {
      const response = await fetch('/resend-verification', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      const result = await response.json();

      if (response.ok) {
          alert('Посилання для верифікації надіслано на ваш email.');
      } else {
          alert(`Помилка: ${result.message}`);
      }
  } catch (error) {
      console.error('Помилка при відправці запиту:', error);
      alert('Сталася помилка. Спробуйте ще раз.');
  }
}

window.onload = checkVerificationStatus;

  document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    loadMyReferrals();
  });
  // Симуляція даних користувача (для демонстрації)


// Функція для перевірки статусу верифікації

