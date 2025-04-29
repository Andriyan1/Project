function viewTransactions() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const viewButton = document.getElementById("viewButton");
  const progressBarContainer = document.getElementById("progressBarContainer");
  const transactionsTable = document.getElementById("transactionsTable");
  const transactionsBody = document.getElementById("transactionsBody");

  // Перевірка коректності дат
  if (startDate > endDate) {
    alert("Start date cannot be later than end date!");
    return;
  }

  // Вимикаємо кнопку під час анімації
  viewButton.disabled = true;

  // Показуємо прогрес-бар
  progressBarContainer.style.display = "block";

  // Імітуємо затримку для анімації (2 секунди)
  setTimeout(() => {
    // Приховуємо прогрес-бар після завершення
    progressBarContainer.style.display = "none";

    // Очищаємо попередні транзакції
    transactionsBody.innerHTML = "";

    // Імітація транзакцій (у реальному додатку це буде запит до API)
    const fakeTransactions = [
      {
        date: "2025-03-15",
        type: "Deposit",
        amount: "120 USDT",
        address: "bcs1q2x3c4v5b6n7m8p9q0w1e2r3t4y5u6i7o8",
        status: "Completed",
      },
      {
        date: "2025-04-10",
        type: "Withdrawal",
        amount: "100 USDT",
        address: "0x1234567890abcdef1234567890abcdef12345678",
        status: "Pending",
      },
      {
        date: "2025-05-20",
        type: "Deposit",
        amount: "50 USDT",
        address: "bcs1q9w8e7r6t5y4u3i2o1p0m9n8b7v6c5x4z3",
        status: "Completed",
      },
    ];

    // Фільтруємо транзакції за вибраним діапазоном дат
    const filteredTransactions = fakeTransactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });

    // Додаємо транзакції в таблицю
    filteredTransactions.forEach((tx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${tx.date}</td>
                <td>${tx.type}</td>
                <td>${tx.amount}</td>
                <td>${tx.address}</td>
                <td>${tx.status}</td>
            `;
      transactionsBody.appendChild(row);
    });

    // Якщо транзакцій немає, показуємо повідомлення
    if (filteredTransactions.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5">No transactions found in this date range.</td>`;
      transactionsBody.appendChild(row);
    }

    // Показуємо таблицю
    transactionsTable.classList.add("visible");

    // Активуємо кнопку знову
    viewButton.disabled = false;
  }, 2000); // Час анімації відповідає тривалості @keyframes (2 секунди)
}
