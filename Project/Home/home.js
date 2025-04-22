// Додаємо функціональність до кнопки 'SIGN UP NOW'
document.querySelector('.signup-btn').addEventListener('click', function () {
  // Видаляємо alert, щоб не з'являлося повідомлення
  window.location.href = 'indexhome.html'; // Перехід на сторінку
});
const toggleBtn = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("closed");
});
document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    document.getElementById('user-panel').style.display = 'block';
    document.getElementById('username').textContent = user.username || 'User';
    document.getElementById('wallet-balance').textContent = user.balance || '0.00 USDT';
  }
});
function logoutUser() {
  localStorage.removeItem('user');
  location.reload();
}
