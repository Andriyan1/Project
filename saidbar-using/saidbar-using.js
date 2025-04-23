function checkUserPanelVisibility() {
  const userPanel = document.querySelector('.user-panel');
  const sidebarNav = document.querySelector('.sidebar-nav');
  if (window.getComputedStyle(userPanel).display === 'none') {
    sidebarNav.style.paddingTop = '200px';
  } else {
    sidebarNav.style.paddingTop = '0';
  }
}
checkUserPanelVisibility();

document.addEventListener('DOMContentLoaded', function() {
  const token = getCookie('userToken');
  console.log('Token з cookies:', token);

  const userPanel = document.querySelector('.user-panel');
  
  console.log('userPanel знайдено:', userPanel !== null);

  if (token && userPanel) {
    userPanel.style.display = 'block';
    console.log('userPanel показано');
  } else {
    console.log('Токен або userPanel відсутній');
  }
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}
