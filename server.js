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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hachiyt001@gmail.com',
        pass: 'dcdu xort xvau tbak',  // No olvides configurar correctamente la autenticación
    },
});

// Base de datos simulada en memoria (Usar MongoDB/MySQL en producción)
let users = [];
let pendingVerifications = {};

// 📌 **Ruta de Registro**
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario ya existe
    if (users.some(user => user.email === email)) {
        return res.status(400).json({ success: false, message: 'El correo ya está registrado' });
    }

    // Generar un token de verificación único
    const verificationToken = uuidv4();
    pendingVerifications[verificationToken] = { email, password };

    // Enviar correo de verificación
    const verificationLink = `http://localhost:${port}/verify/${verificationToken}`;
    const mailOptions = {
        from: 'NatMarket <hachiyt001@gmail.com>',
        to: email,
        subject: '🔑 Verifica tu cuenta - NatMarket',
        html: `
            <h1 style="color: #2c3e50;">¡Bienvenido a NatMarket!</h1>
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
            <p style="color: #7f8c8d;">Si no solicitaste este registro, ignora este mensaje.</p>
        `
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) return res.status(500).json({ success: false, message: 'Error al enviar correo' });
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

    // Encriptar la contraseña antes de almacenarla
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    users.push({ email: userData.email, password: hashedPassword });

    // Eliminar el token de la lista de verificaciones pendientes
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

// 📌 **Ruta de Inicio de Sesión**
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(400).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Comparar contraseñas encriptadas
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });
    }

    res.json({ success: true, message: 'Inicio de sesión exitoso' });
});

app.get('/', (req, res) => {
    res.send('Bienvenido a NatMarket. Usa las rutas correctas para interactuar con el servidor.');
});


// 📌 **Servidor Escuchando**
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
