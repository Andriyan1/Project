// Ініціалізація голосів
let ecoSphereVotes = parseInt(localStorage.getItem("ecoSphereVotes")) || 0;
let starLinkVotes = parseInt(localStorage.getItem("starLinkVotes")) || 0;
let hasVoted = localStorage.getItem("hasVoted") === "true";

// Оновлення відображення голосів
document.getElementById(
  "ecoSphereVotes"
).textContent = `Votes: ${ecoSphereVotes}`;
document.getElementById(
  "starLinkVotes"
).textContent = `Votes: ${starLinkVotes}`;

// Якщо вже голосували, відключаємо кнопки
if (hasVoted) {
  document
    .querySelectorAll(".vote-btn")
    .forEach((btn) => (btn.disabled = true));
}

// Функція для голосування
function vote(projectName) {
  if (hasVoted) {
    alert("You have already voted! Wait for the next voting session.");
    return;
  }

  if (projectName === "EcoSphere") {
    ecoSphereVotes++;
    localStorage.setItem("ecoSphereVotes", ecoSphereVotes);
    document.getElementById(
      "ecoSphereVotes"
    ).textContent = `Votes: ${ecoSphereVotes}`;
  } else if (projectName === "StarLink") {
    starLinkVotes++;
    localStorage.setItem("starLinkVotes", starLinkVotes);
    document.getElementById(
      "starLinkVotes"
    ).textContent = `Votes: ${starLinkVotes}`;
  }

  hasVoted = true;
  localStorage.setItem("hasVoted", "true");
  document
    .querySelectorAll(".vote-btn")
    .forEach((btn) => (btn.disabled = true));
  alert(
    `Thank you for voting for ${projectName}! Your vote has been recorded.`
  );
}

// Таймер на 6 годин (6 * 60 * 60 = 21600 секунд)
let timeLeft = 21600; // 6 годин у секундах
const timerElement = document.getElementById("timer");

function updateTimer() {
  if (timeLeft <= 0) {
    timerElement.textContent = "Voting has ended!";
    localStorage.removeItem("hasVoted"); // Скидаємо статус голосування після завершення
    return;
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  timerElement.textContent = `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  timeLeft--;
}

// Оновлюємо таймер кожну секунду
setInterval(updateTimer, 1000);
updateTimer(); // Викликаємо одразу, щоб уникнути затримки
