const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer"); // Для відправки пошти
const crypto = require("crypto"); // Для генерації випадкових кодів
require("dotenv").config(); // Для зчитування змінних середовища
const bcrypt = require("bcrypt"); // Переконайся, що bcrypt підключений
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const https = require("https");
const path = require("path");
const app = express();

// Підключення до бази даних
// Підключаємо mysql2 (встанови mysql2, якщо не маєш)

const db = mysql.createConnection({
  host: process.env.DB_HOST, // Використовуємо змінні середовища
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as id " + db.threadId);
});

// Дозволяємо крос-доменно запити з вашого клієнта
const corsOptions = {
  origin: "https://localhost:3000", // Адреса вашого клієнта
  methods: "GET,POST",
  credentials: true, // Дозволяємо передавати куки
};

app.use(cors(corsOptions));
// Налаштування CORS

// Налаштування для обробки JSON-запитів
app.use(bodyParser.json());

// Мідлвар для роботи з куками
app.use(cookieParser());
app.use(express.json()); // Для обробки JSON-тіла запитів
app.use(express.urlencoded({ extended: true })); // Для обробки даних з форм
app.use(
  express.static(path.join(__dirname, "client"), {
    setHeaders: function (res, path) {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "application/javascript");
      }
    },
  })
);

// SSL сертифікат
const privateKey = fs.readFileSync("ssl/server.key", "utf8");
const certificate = fs.readFileSync("ssl/server.crt", "utf8");
const credentials = { key: privateKey, cert: certificate };

app.use("/Home", express.static(path.join(__dirname, "Home")));
app.use(
  "/saidbar-using",
  express.static(path.join(__dirname, "saidbar-using"))
);
app.use("/img", express.static(path.join(__dirname, "Home", "img")));
app.use("/Pass", express.static(path.join(__dirname, "Password")));
// Налаштування для обробки статичних файлів з папки 'client'
app.use("/client", express.static(path.join(__dirname, "client")));
// Налаштування для обробки статичних файлів з папки 'about'
app.use("/about", express.static(path.join(__dirname, "about")));
app.use("/profile", express.static(path.join(__dirname, "profile")));
// Налаштування для обробки статичних файлів з папки 'Help'
app.use("/Help", express.static(path.join(__dirname, "Help")));
app.use("/Tutorial", express.static(path.join(__dirname, "Tutorial")));


// Маршрут для головної сторінки (Home)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Home", "Home.html"));
});


app.get("/Pass", (req, res) => {
  res.sendFile(path.join(__dirname, "Password", "Forgot-Password.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "login-reg3.html")); // Вказуємо правильний шлях до файлу
});
// Маршрут для сторінки "About"
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "about", "about.html")); // Сторінка "About"
});

// Маршрут для сторінки "Help"
app.get("/help", (req, res) => {
  res.sendFile(path.join(__dirname, "Help", "help.html")); // Сторінка "Help"
});
app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "profile", "profile.html")); 
});
app.get("/Tutorial", (req, res) => {
  res.sendFile(path.join(__dirname, "Tutorial", "Tutorial.html")); 
});
// Маршрут для логіну
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Перевіряємо, чи введені email і пароль
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Будь ласка, введіть email та пароль" });
  }

  // Перевіряємо наявність користувача в базі даних
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Помилка на сервері" });
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "Користувача з таким email не знайдено" });
    }

    const user = results[0];

    // Перевіряємо правильність пароля
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Помилка при перевірці пароля" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Невірний пароль" });
      }

      // Створюємо JWT токен
      const token = jwt.sign({ id: user.id, email: user.email }, "secretKey", {
        expiresIn: "1h",
      });

      // Оновлюємо cookie з токеном
      res.cookie("userToken", token, {
        secure: true, // працює тільки через HTTPS
        maxAge: 3600000,
        sameSite: "Lax",
      });

    

      res.status(200).json({
        message: "Успішний логін",
        token: token, // ✅ додаємо токен у відповідь
      });
    });
  });
});
app.get("/check-login", (req, res) => {
  const token = req.cookies.userToken;

  if (!token) {
    return res.status(401).json({ message: "Ви не авторизовані" });
  }

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Невірний токен" });
    }

    res.status(200).json({ message: "Ви авторизовані", user: decoded });
  });
});

// Функція для генерації унікального реферального коду
function generateReferralCode() {
  const upperCaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Великі літери
  const lowerCaseCharacters = "abcdefghijklmnopqrstuvwxyz"; // Малі літери
  const numbers = "0123456789"; // Цифри

  let referralCode = "";

  // Генерація 1 великої літери
  referralCode += upperCaseCharacters.charAt(
    Math.floor(Math.random() * upperCaseCharacters.length)
  );

  // Генерація 1 цифри
  referralCode += numbers.charAt(Math.floor(Math.random() * numbers.length));

  // Генерація 2 великих літер
  for (let i = 0; i < 2; i++) {
    referralCode += upperCaseCharacters.charAt(
      Math.floor(Math.random() * upperCaseCharacters.length)
    );
  }

  // Генерація 1 малої літери
  referralCode += lowerCaseCharacters.charAt(
    Math.floor(Math.random() * lowerCaseCharacters.length)
  );

  // Генерація 1 цифри
  referralCode += numbers.charAt(Math.floor(Math.random() * numbers.length));

  // Генерація 2 малих літер
  for (let i = 0; i < 2; i++) {
    referralCode += lowerCaseCharacters.charAt(
      Math.floor(Math.random() * lowerCaseCharacters.length)
    );
  }

  // Генерація останньої великої літери
  referralCode += upperCaseCharacters.charAt(
    Math.floor(Math.random() * upperCaseCharacters.length)
  );

  return referralCode;
}

// Маршрут для реєстрації

app.post("/register", (req, res) => {
  const { email, password, referralCode, invitationCode } = req.body;

  // Перевірка, чи введено реферальний код
  if (!referralCode || referralCode.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Реферальний код є обов'язковим!" });
  }

  // Перевірка, чи введено invitationCode
  if (!invitationCode || invitationCode.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Invitation code є обов'язковим!" });
  }

  // Перевірка правильності invitationCode у базі
  const referralQuery = "SELECT * FROM users WHERE referral_code = ?";
  db.query(referralQuery, [invitationCode], (err, referralResults) => {
    if (err) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Помилка перевірки реферального коду",
        });
    }

    if (referralResults.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Невірний invitationCode" });
    }

    const checkQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Помилка перевірки email" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email вже зареєстрований" });
      }

      // Генерація унікального реферального коду для нового користувача
      const newReferralCode = generateReferralCode();

      // Отримуємо id реферера з правильним invitationCode
      const referrerId = referralResults[0].id;

      // Хешування пароля
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Помилка хешування пароля" });
        }

        // Додаємо користувача до бази даних
        const insertQuery =
          "INSERT INTO users (email, password, invitation_code, referral_code) VALUES (?, ?, ?, ?)";
        db.query(
          insertQuery,
          [email, hashedPassword, invitationCode, newReferralCode],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ success: false, message: "Помилка реєстрації" });
            }

            // Додаємо запис у таблицю user_referrals
            const insertReferralQuery =
              "INSERT INTO user_referrals (referrer_id, referred_id) VALUES (?, ?)";
            db.query(
              insertReferralQuery,
              [referrerId, result.insertId],
              (err, referralResult) => {
                if (err) {
                  return res
                    .status(500)
                    .json({
                      success: false,
                      message: "Помилка додавання реферала",
                    });
                }

                res.status(200).json({
                  success: true,
                  message: "Користувача успішно зареєстровано",
                  referralCode: newReferralCode, // Повертаємо реферальний код користувача
                });
              }
            );
          }
        );
      });
    });
  });
});

// Маршрут для перевірки реферального коду

app.post("/update-user", (req, res) => {
  const { email, password, mobile } = req.body;

  // Перевірка, чи не змінено email після верифікації
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.log("Помилка перевірки email:", err);
      return res
        .status(500)
        .json({ success: false, message: "Внутрішня помилка сервера" });
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Користувач не знайдений" });
    }

    // Перевірка, чи цей email вже був верифікований
    if (results[0].is_verified === 1) {
      // Якщо email вже верифікований, то його не можна змінити
      return res
        .status(400)
        .json({
          success: false,
          message: "Ви не можете змінити email після верифікації",
        });
    }

    // Оновлення пароля та мобільного номеру
    const updateQuery =
      "UPDATE users SET password = ?, mobile = ? WHERE email = ?";
    db.query(updateQuery, [password, mobile, email], (err, result) => {
      if (err) {
        console.log("Помилка оновлення даних користувача:", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Помилка оновлення даних користувача",
          });
      }

      res
        .status(200)
        .json({ success: true, message: "Дані користувача успішно оновлено" });
    });
  });
});

app.post("/send-code", (req, res) => {
  const { email } = req.body;
  console.log("Отримано запит на відправку коду для email:", email); // Логування email

  // Перевірка, чи введено email
  if (!email) {
    console.log("Email не передано в запиті");
    return res
      .status(400)
      .json({ success: false, message: "Email не передано" });
  }

  // Генерація випадкового 6-значного коду
  const verificationCode = crypto.randomInt(100000, 999999);
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Код буде дійсний 10 хвилин

  console.log("Згенерований код:", verificationCode); // Логування коду

  // Надсилання email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}. The code will expire in 10 minutes.`,
  };

  // Надсилання email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Помилка при відправці email:", error);
      return res
        .status(500)
        .json({ success: false, message: "Не вдалося надіслати код" });
    }

    console.log("Email відправлено:", info.response);

    // Збереження коду в базі даних
    const insertCodeQuery =
      "INSERT INTO verification_codes (email, code, expiration_time) VALUES (?, ?, ?)";
    db.query(
      insertCodeQuery,
      [email, verificationCode, expirationTime],
      (err, result) => {
        if (err) {
          console.log("Помилка збереження коду в базі даних:", err);
          return res
            .status(500)
            .json({ success: false, message: "Помилка збереження коду" });
        }

        console.log("Код збережено в базі даних");
        res.status(200).json({
          success: true,
          message: "Код верифікації надіслано на вашу електронну пошту",
          expiration_time: expirationTime, // Повертаємо час дії коду
        });
      }
    );
  });
});

// Маршрут для перевірки коду
app.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  console.log("Отримано запит на перевірку коду для email:", email);

  // Перевірка, чи є код у базі даних
  const checkCodeQuery =
    "SELECT * FROM verification_codes WHERE email = ? AND code = ?";
  db.query(checkCodeQuery, [email, code], (err, results) => {
    if (err) {
      console.log("Помилка перевірки коду:", err);
      return res
        .status(500)
        .json({ success: false, message: "Внутрішня помилка сервера" });
    }

    if (results.length === 0) {
      console.log("Невірний код або код не знайдений");
      return res
        .status(400)
        .json({ success: false, message: "Невірний код або код вже минув" });
    }

    // Перевірка, чи код не був використаний
    const isUsed = results[0].used;
    if (isUsed) {
      console.log("Код вже був використаний");
      return res
        .status(400)
        .json({ success: false, message: "Цей код вже був використаний" });
    }

    // Перевірка терміну дії коду
    const expirationTime = new Date(results[0].expiration_time);
    if (expirationTime < new Date()) {
      console.log("Код прострочений");
      return res
        .status(400)
        .json({ success: false, message: "Код прострочений" });
    }

    // Якщо код правильний і не прострочений
    console.log("Код верифікації успішно перевірено");

    // Оновлюємо статус коду в базі, щоб позначити його як використаний
    const updateCodeQuery =
      "UPDATE verification_codes SET used = 1 WHERE email = ? AND code = ?";
    db.query(updateCodeQuery, [email, code], (err, result) => {
      if (err) {
        console.log("Помилка оновлення статусу коду:", err);
        return res
          .status(500)
          .json({ success: false, message: "Помилка оновлення статусу коду" });
      }

      // Відповідь про успішну верифікацію
      res
        .status(200)
        .json({ success: true, message: "Код верифікації успішно перевірено" });
    });
  });
});

app.post("/send-code-pass", (req, res) => {
  const { email } = req.body;
  console.log("Отримано запит на відправку коду для email:", email); // Логування email

  // Перевірка, чи введено email
  if (!email) {
    console.log("Email не передано в запиті");
    return res
      .status(400)
      .json({ success: false, message: "Email не передано" });
  }

  // Перевірка наявності email в базі даних
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.log("Помилка при перевірці email:", err);
      return res
        .status(500)
        .json({ success: false, message: "Помилка при перевірці email" });
    }

    if (results.length === 0) {
      // Якщо email не знайдено в базі
      return res
        .status(400)
        .json({
          success: false,
          message: "Цей email не зареєстрований в нашій системі.",
        });
    }

    // Генерація випадкового 6-значного коду
    const verificationCode = crypto.randomInt(100000, 999999);
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Код буде дійсний 10 хвилин

    console.log("Згенерований код:", verificationCode); // Логування коду

    // Надсилання email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${verificationCode}. The code will expire in 10 minutes.`,
    };

    // Надсилання email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Помилка при відправці email:", error);
        return res
          .status(500)
          .json({ success: false, message: "Не вдалося надіслати код" });
      }

      console.log("Email відправлено:", info.response);

      // Збереження коду в базі даних
      const insertCodeQuery =
        "INSERT INTO password_reset_codes (email, code, expiration_time) VALUES (?, ?, ?)";
      db.query(
        insertCodeQuery,
        [email, verificationCode, expirationTime],
        (err, result) => {
          if (err) {
            console.log("Помилка збереження коду в базі даних:", err);
            return res
              .status(500)
              .json({ success: false, message: "Помилка збереження коду" });
          }

          console.log("Код збережено в базі даних");
          res.status(200).json({
            success: true,
            message: "Код верифікації надіслано на вашу електронну пошту",
            expiration_time: expirationTime, // Повертаємо час дії коду
          });
        }
      );
    });
  });
});

app.post("/verify-code-pass", (req, res) => {
  const { email, code } = req.body;

  const query =
    "SELECT * FROM password_reset_codes WHERE email = ? AND code = ?";
  db.query(query, [email, code], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired code" });
    }

    const record = results[0];
    const expirationTime = new Date(record.expiration_time);

    if (expirationTime < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Code has expired" });
    }

    // Якщо код вірний і не прострочений
    res
      .status(200)
      .json({ success: true, message: "Code verified successfully" });
  });
});
app.post("/update-password", (req, res) => {
  const { email, newPassword } = req.body;

  // Перевірка на наявність email та нового пароля
  if (!email || !newPassword) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Email and new password are required.",
      });
  }

  // Хешування нового пароля
  bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error hashing the password." });
    }

    // Оновлення пароля в базі даних
    const query = "UPDATE users SET password = ? WHERE email = ?";
    db.query(query, [hashedPassword, email], (err, result) => {
      if (err) {
        console.log("Error updating password:", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "Error updating password in the database.",
          });
      }

      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ success: true, message: "Password updated successfully." });
      } else {
        res.status(404).json({ success: false, message: "Email not found." });
      }
    });
  });
});
// Віддаємо саму сторінку профілю


// Віддаємо дані профілю (API для JS)
// Віддаємо JSON з даними користувача для профілю
// Показує панель


// Дає дані користувача
app.get('/profile-data', (req, res) => {
  const token = req.cookies.userToken;

  if (!token) return res.status(401).json({ error: 'Немає токена' });

  try {
      const decoded = jwt.verify(token, "secretKey");
      const userId = decoded.id;

      const query = 'SELECT email, referral_code FROM users WHERE id = ?';
      db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Помилка бази' });
      
        if (results.length === 0) return res.status(404).json({ error: 'Користувача не знайдено' });
      
        const user = results[0];
        const nickname = user.email.split('@')[0].slice(0, 6);

      
        res.json({
          nickname,
          email: user.email,
          referralCode: user.referral_code || null // 👈 обов'язково перевірка
        });
      });
      
  } catch (err) {
      return res.status(401).json({ error: 'Невірний токен' });
  }
});

app.get('/my-referrals', (req, res) => {
  const token = req.cookies.userToken;
  if (!token) return res.status(401).json({ error: 'Немає токена' });

  try {
    const decoded = jwt.verify(token, "secretKey");
    const userId = decoded.id;

    const query = 'SELECT u.email FROM users u JOIN user_referrals ur ON u.id = ur.referred_id WHERE ur.referrer_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Помилка бази даних' });
      
      const referrals = results.map(r => ({
        nickname: r.email.split('@')[0].slice(0, 6)
      }));

      res.json(referrals);
    });

  } catch (err) {
    return res.status(401).json({ error: 'Невірний токен' });
  }
});


// Стартуємо сервер
https.createServer(credentials, app).listen(3000, () => {
  console.log("HTTPS сервер працює на https://localhost:3000");
});
