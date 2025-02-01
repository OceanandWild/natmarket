const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = process.env.JWT_SECRET || "clave_secreta"; // 🔐 Clave para JWT

// 📌 **Simulación de Base de Datos**
const USERS_FILE = "users.json";
let users = fs.existsSync(USERS_FILE) ? JSON.parse(fs.readFileSync(USERS_FILE)) : [];
let pendingVerifications = {};

// 📌 **Configuración de Nodemailer**
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 **Ruta de Registro**
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios" });
  }

  if (users.some((user) => user.email === email)) {
    return res.status(400).json({ success: false, message: "El correo ya está registrado" });
  }

  const verificationToken = uuidv4();
  pendingVerifications[verificationToken] = { email, password };

  const verificationLink = `https://natmarket.onrender.com/verify/${verificationToken}`;
  const mailOptions = {
    from: "NatMarket <hachiyt001@gmail.com>",
    to: email,
    subject: "🔑 Verifica tu cuenta - NatMarket",
    html: `
        <h1>¡Bienvenido a NatMarket!</h1>
        <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
        <a href="${verificationLink}" style="background: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Verificar Cuenta</a>
        <p>Si no solicitaste este registro, ignora este mensaje.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar correo:", error);
      return res.status(500).json({ success: false, message: "Error al enviar correo" });
    }
    console.log("Correo enviado:", info.response);
    res.json({ success: true, message: "Correo de verificación enviado" });
  });
});

// 📌 **Ruta de Verificación**
app.get("/verify/:token", async (req, res) => {
  const token = req.params.token;
  const userData = pendingVerifications[token];

  if (!userData) {
    return res.status(400).json({ success: false, message: "Enlace de verificación inválido o expirado." });
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  users.push({ email: userData.email, password: hashedPassword });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); // Guardar en archivo

  delete pendingVerifications[token];

  // Generar token JWT para autenticación automática
  const authToken = jwt.sign({ email: userData.email }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ success: true, email: userData.email, token: authToken });
});

// 📌 **Ruta de Inicio de Sesión**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ success: false, message: "Usuario no encontrado" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
  }

  const authToken = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ success: true, token: authToken });
});

// 📌 **Obtener lista de usuarios (solo para depuración)**
app.get("/users", (req, res) => {
  res.json(users.map((u) => ({ email: u.email }))); // No devolver contraseñas
});

// 📌 **Iniciar Servidor**
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
