function checkUserPanelVisibility() {
  const userPanel = document.querySelector('.user-panel');
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (window.getComputedStyle(userPanel).display === 'none') {
    sidebarNav.style.paddingTop = '200px';
  } else {
    sidebarNav.style.paddingTop = '0';
  }
}

function showUserGreeting() {
  const userElement = document.getElementById('user');
  const tokenCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('userToken='));
  const token = tokenCookie ? tokenCookie.split('=')[1] : null;

  if (userElement) {
    if (token) {
      const nickname = localStorage.getItem('nickname');
      userElement.textContent = nickname
        ? `Привіт, ${nickname}!`
        : 'Привіт, користувачу!';
    } else {
      userElement.textContent = 'Привіт, гість!';
    }
  }
}
document.addEventListener('DOMContentLoaded', showUserGreeting);


document.addEventListener('DOMContentLoaded', function() {
  const token = getCookie('userToken');
  console.log('Token з cookies:', token);

  const userPanel = document.querySelector('.user-panel');
  console.log('userPanel знайдено:', userPanel !== null);

  if (token && userPanel) {
    userPanel.style.display = 'block';
    checkUserPanelVisibility();
    console.log('userPanel показано');
  } else {
    console.log('Токен або userPanel відсутній');
    checkUserPanelVisibility();
  }
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Викликаємо функцію для перевірки видимості після того, як DOM готовий
document.addEventListener('DOMContentLoaded', function() {
  checkUserPanelVisibility();
});
