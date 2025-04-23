// FAQ запитання та відповіді
const faq = {
    "What is your return policy?": "You can return items within 30 days of purchase.",
    "How do I track my order?": "You can track your order using the tracking number we sent to your email.",
    "Do you ship internationally?": "Yes, we offer international shipping to most countries.",
    "What payment methods do you accept?": "We accept credit cards, PayPal, and bank transfers.",
    "Can I change my order?": "Unfortunately, orders cannot be changed once placed. However, you can cancel within 24 hours."
  };
  
  // Відкриваємо чат
  document.getElementById('chat-button').addEventListener('click', () => {
    document.getElementById('chat-popup').style.display = 'flex';
  });
  
  // Закриваємо чат
  document.getElementById('close-chat').addEventListener('click', () => {
    document.getElementById('chat-popup').style.display = 'none';
  });
  
  // Обробка натискання на кнопки FAQ
  const faqButtons = document.querySelectorAll('.faq-btn');
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const question = button.dataset.question;
      addMessage(question, 'user-message');
      addMessage(faq[question], 'bot-message');
    });
  });
  
  // Обробка введення запитів
  document.getElementById('send-btn').addEventListener('click', function () {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput) {
      addMessage(userInput, 'user-message');
      document.getElementById('user-input').value = '';
  
      if (faq[userInput]) {
        addMessage(faq[userInput], 'bot-message');
      } else {
        addMessage("Sorry, I didn't understand that. Can you rephrase?", 'bot-message');
      }
    }
  });
  
  // Додаємо повідомлення
  function addMessage(message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add(className);
    messageElement.textContent = message;
    document.getElementById('messages').appendChild(messageElement);
    
    // Автоматично прокручувати вниз після кожного нового повідомлення
    const chatBody = document.querySelector('.chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
  }
  