// Окремо оголошена функція для отримання куки
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

async function generateAddress() {
  const button = document.getElementById("generateButton");
  const copyButton = document.getElementById("copyButton");
  const progressBarContainer = document.getElementById("progressBarContainer");
  const addressContainer = document.getElementById("depositAddress");

  button.disabled = true;
  progressBarContainer.style.display = "block";

  const token = getCookie('userToken');
  if (!token) {
    window.location.href = '/';
    return;
  }

  try {
    console.log("Sending request with token:", token);

    const response = await fetch("/generate-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userToken: token })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const data = await response.json();
      console.error('Error response data:', data);
      alert(data.error || "Помилка при створенні адреси");
      button.disabled = false;
      return;
    }

    const data = await response.json();
    console.log('Received data:', data);

    progressBarContainer.style.display = "none";
    addressContainer.textContent = data.address;
    addressContainer.classList.add("visible");

    button.style.display = "none";
    copyButton.style.display = "block";

  } catch (error) {
    progressBarContainer.style.display = "none";
    console.error("Error generating address:", error);
    alert("Сервер недоступний");
    button.disabled = false;
  }
}

// Функція для копіювання адреси в буфер обміну
function copyAddress() {
  const addressContainer = document.getElementById("depositAddress");
  const copyMessage = document.getElementById("copyMessage");

  if (addressContainer) {
    // Створення тимчасового елемента для копіювання
    const textarea = document.createElement("textarea");
    textarea.value = addressContainer.textContent; // Адреса для копіювання
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy"); // Виконуємо копіювання
    document.body.removeChild(textarea);

    // Показуємо повідомлення про успішне копіювання
    copyMessage.style.display = "block";

    // Сховати повідомлення через 3 секунди
 
  } else {
    alert("Адресу не знайдено для копіювання.");
  }
}

// Прив'язуємо функцію до кнопки копіювання
const copyButton = document.getElementById("copyButton");
if (copyButton) {
  copyButton.addEventListener("click", copyAddress);
}
