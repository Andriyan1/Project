function submitWithdrawal() {
  const bscAddress = document.getElementById("bscAddress").value;
  const withdrawAmount = document.getElementById("withdrawAmount").value;
  const withdrawButton = document.getElementById("withdrawButton");
  const successMessage = document.getElementById("successMessage");

  // Перевірка, чи заповнені поля
  if (!bscAddress || !withdrawAmount || withdrawAmount <= 0) {
    alert("Please enter a valid BSC address and amount.");
    return;
  }

  // Вимикаємо кнопку під час обробки
  withdrawButton.disabled = true;

  // Імітуємо обробку запиту (у реальному додатку це буде запит до API)
  setTimeout(() => {
    // Показуємо повідомлення про успішне подання
    successMessage.style.display = "block";
    successMessage.classList.add("visible");

    // Очищаємо поля форми
    document.getElementById("bscAddress").value = "";
    document.getElementById("withdrawAmount").value = "";

    // Приховуємо повідомлення через 3 секунди
    setTimeout(() => {
      successMessage.classList.remove("visible");
      setTimeout(() => {
        successMessage.style.display = "none";
        withdrawButton.disabled = false; // Активуємо кнопку знову
      }, 500); // Чекаємо завершення анімації зникнення
    }, 3000);
  }, 1000); // Імітація затримки обробки
}
