function generateAddress() {
  const button = document.getElementById("generateButton");
  const copyButton = document.getElementById("copyButton");
  const progressBarContainer = document.getElementById("progressBarContainer");
  const addressContainer = document.getElementById("depositAddress");

  // Вимикаємо кнопку "Generate" під час анімації
  button.disabled = true;

  // Показуємо прогрес-бар
  progressBarContainer.style.display = "block";

  // Імітуємо затримку для анімації (2 секунди)
  setTimeout(() => {
    // Приховуємо прогрес-бар після завершення
    progressBarContainer.style.display = "none";

    // Показуємо адресу
    const fakeAddress = "bcs1q2x3c4v5b6n7m8p9q0w1e2r3t4y5u6i7o8";
    addressContainer.textContent = fakeAddress;
    addressContainer.classList.add("visible");

    // Приховуємо кнопку "Generate" і показуємо кнопку "Copy"
    button.style.display = "none";
    copyButton.style.display = "block";
  }, 2000); // Час анімації відповідає тривалості @keyframes (2 секунди)
}

function copyAddress() {
  const address = document.getElementById("depositAddress").textContent;
  const copyMessage = document.getElementById("copyMessage");

  // Копіюємо адресу в буфер обміну
  navigator.clipboard.writeText(address).then(() => {
    // Показуємо повідомлення про копіювання
    copyMessage.style.display = "block";
    copyMessage.classList.add("visible");

    // Приховуємо повідомлення через 2 секунди
    setTimeout(() => {
      copyMessage.classList.remove("visible");
      setTimeout(() => {
        copyMessage.style.display = "none";
      }, 500); // Чекаємо завершення анімації зникнення
    }, 2000);
  });
}
