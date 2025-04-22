// Функція для перевірки видимості .user-panel та зміни padding
 // Функція для перевірки видимості .user-panel та зміни padding
 function checkUserPanelVisibility() {
  var userPanel = document.querySelector('.user-panel');
  var sidebarNav = document.querySelector('.sidebar-nav');

  // Перевірка, чи елемент має display: none;
  if (window.getComputedStyle(userPanel).display === 'none') {
    // Якщо елемент прихований, змінюємо padding
    sidebarNav.style.paddingTop = '200px';  // Збільшуємо відступ
  } else {
    // Якщо елемент видимий, скидаємо padding
    sidebarNav.style.paddingTop = '0';  // Встановлюємо padding в 0
  }
}



// Викликаємо функцію для перевірки видимості після того, як DOM готовий
document.addEventListener('DOMContentLoaded', function() {
  checkUserPanelVisibility();
});

function insertSidebar() {
  const sidebarHTML = `
    <aside class="sidebar main-sidebar">
      <div class="logo">
        <div class="sidebar-wrapper">
          <div class="logo-container">
            <img src="img/photo_2025-04-11_23-16-24.jpg" class="logo-icon" alt="logo" />
            <div class="logo-text">
              <h1><span class="brand">MANA</span><span class="dot">.</span><span class="invest">invest</span></h1>
              <p class="link">WWW.MANA.WORLD</p>
            </div>
          </div>
        </div>
      </div>

      <div class="user-panel">
        <div class="user-info">
          <i class='far fa-user-circle'></i>
          <p>Username</p>
        </div>

        <div class="wallet-info">
          <p><strong>Balance:</strong> <span id="balance">$1000</span></p>
        </div>

        <div class="sidebar-inner">
          <div class="sidebar-inner-button"><i class="fa-solid fa-money-bill-transfer"></i>Deposit</div>
          <div class="sidebar-inner-button"><i class="fa-solid fa-wallet"></i>Withdraw</div>
          <div class="sidebar-inner-button"><i class="fa-solid fa-file"></i>View Transactions</div>
          <div class="sidebar-inner-button">Profile Settings</div>
        </div>
      </div>

      <br><br><br>

      <nav class="sidebar-nav">
        <a onclick="window.location.href='/'" class="nav-item">🏠 Home</a>
        <a onclick="window.location.href='/help'" class="nav-item">👥 Team</a>
        <a onclick="window.location.href='/help'" class="nav-item">🎧 Online</a>
        <a onclick="window.location.href='/about'" class="nav-item">ℹ About Us</a>
        <a onclick="window.location.href='/help'" class="nav-item">✉ Help</a>
      </nav>

      <div class="share">
        <p>Share To:</p>
        <div class="share-icons">
          <a href="#"><i class="fa-brands fa-telegram"></i></a>
          <a href="#"><i class="fa-brands fa-youtube"></i></a>
          <a href="#"><i class="fa-brands fa-whatsapp"></i></a>
        </div>
      </div>
    </aside>
  `;

  // Знаходимо контейнер для вставки сайдбара
  const container = document.getElementById('sidebar-container');

  // Вставляємо HTML код сайдбара в контейнер
  container.innerHTML = sidebarHTML;

  // Викликаємо функцію для перевірки видимості після вставки контенту
  checkUserPanelVisibility();
}

// Викликаємо функцію при завантаженні сторінки
window.onload = insertSidebar;