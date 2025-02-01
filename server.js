const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// 📌 Configurar transporte de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hachiyt001@gmail.com',
        pass: 'dcdu xort xvau tbak', // Usa una contraseña de aplicación en Gmail
    },
});

// 📌 Base de datos simulada
let users = [];
let pendingVerifications = {};

// 📌 **Ruta de Registro**
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
    }

    if (users.some(user => user.email === email)) {
        return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    const verificationToken = uuidv4();
    pendingVerifications[verificationToken] = { email, password };

    const verificationLink = `https://natmarket.onrender.com/verify/${verificationToken}`;
    const mailOptions = {
        from: 'NatMarket <hachiyt001@gmail.com>',
        to: email,
        subject: '🔑 Verifica tu cuenta - NatMarket',
        html: `
            <h1>¡Bienvenido a NatMarket!</h1>
            <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
            <a href="${verificationLink}" style="
                background: #27ae60;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 15px;
            ">Verificar Cuenta</a>
            <p>Si no solicitaste este registro, ignora este mensaje.</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar correo:', error);
            return res.status(500).json({ success: false, message: 'Error al enviar correo' });
        }
        console.log('Correo enviado:', info.response);
        res.json({ success: true, message: 'Correo de verificación enviado' });
    });
});

// 📌 **Ruta de Verificación**
app.get('/verify/:token', async (req, res) => {
    const token = req.params.token;
    const userData = pendingVerifications[token];

    if (!userData) {
        return res.status(400).send('Enlace de verificación inválido o expirado.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    users.push({ email: userData.email, password: hashedPassword });

    delete pendingVerifications[token];

    res.send(`
        <h1 style="color: #27ae60;">✅ Cuenta verificada correctamente</h1>
        <p>Ya puedes iniciar sesión en NatMarket.</p>
        <a href="http://localhost:5500" style="
            background: #27ae60;
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-top: 15px;
        ">Iniciar Sesión</a>
    `);
});

// 📌 **Iniciar Servidor**
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
