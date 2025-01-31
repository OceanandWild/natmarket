const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hachiyt001@gmail.com',
        pass: 'dcdu xort xvau tbak',
    },
});

// Almacenamiento temporal (en producción usa una base de datos)
let pendingRegistrations = [];

app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Guardar registro pendiente
    pendingRegistrations.push({ email, password });

    const adminMailOptions = {
        from: 'NatMarket <hachiyt001@gmail.com>',
        to: 'hachiyt001@gmail.com',
        subject: '✅ Nueva Solicitud de Registro - NatMarket',
        html: `
            <h1 style="color: #2c3e50;">Nuevo usuario registrado</h1>
            <p><strong>Correo:</strong> ${email}</p>
            <p><strong>Contraseña:</strong> ${password}</p>
            <a href="http://localhost:3000/admin" style="
                background: #3498db;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                display: inline-block;
                margin-top: 15px;
            ">Confirmar Registro</a>
            <p style="margin-top: 20px; color: #7f8c8d;">Haz clic en el botón para activar la cuenta</p>
        `
    };

    transporter.sendMail(adminMailOptions, (error) => {
        if (error) return res.status(500).json({ success: false, message: 'Error al notificar al admin' });
        res.json({ success: true, message: 'Solicitud enviada al administrador' });
    });
});

// Ruta para confirmación del admin
app.post('/confirm-registration', (req, res) => {
    const { userEmail, userPassword } = req.body;

    const userMailOptions = {
        from: 'NatMarket <hachiyt001@gmail.com>',
        to: userEmail,
        subject: '🎉 ¡Cuenta Activada! - NatMarket',
        html: `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
                <h1 style="color: #27ae60; text-align: center;">¡Cuenta Activada Exitosamente!</h1>
                <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px;">
                    <p style="font-size: 16px;">Hola futuro miembro de NatMarket,</p>
                    <p>Tu cuenta ha sido verificada y activada por nuestro equipo. Ya puedes iniciar sesión:</p>
                    
                    <div style="margin: 25px 0;">
                        <p><strong>Correo:</strong> ${userEmail}</p>
                        <p><strong>Contraseña:</strong> ${userPassword}</p>
                    </div>

                    <a href="http://localhost:5500" style="
                        background: #27ae60;
                        color: white;
                        padding: 12px 25px;
                        text-decoration: none;
                        border-radius: 5px;
                        display: block;
                        width: fit-content;
                        margin: 20px auto;
                    ">Ir a NatMarket</a>
                </div>
                <p style="text-align: center; color: #95a5a6; margin-top: 20px;">
                    Si no solicitaste este registro, por favor ignora este mensaje.
                </p>
            </div>
        `
    };

    transporter.sendMail(userMailOptions, (error) => {
        if (error) return res.status(500).json({ success: false, message: 'Error al notificar al usuario' });
        res.json({ success: true, message: 'Usuario notificado exitosamente' });
    });
});

// Interfaz admin (protegida en producción)
app.get('/admin', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Panel Admin - NatMarket</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .container { max-width: 500px; margin: 0 auto; }
                input, button { width: 100%; padding: 10px; margin: 5px 0; }
                button { background: #3498db; color: white; border: none; cursor: pointer; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Confirmar Registro - NatMarket</h1>
                <form id="confirmForm">
                    <input type="email" id="userEmail" placeholder="Correo del usuario" required>
                    <input type="password" id="userPassword" placeholder="Contraseña del usuario" required>
                    <button type="submit">Activar Cuenta y Notificar Usuario</button>
                </form>
                <div id="message"></div>
            </div>
            <script>
                document.getElementById('confirmForm').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const response = await fetch('http://localhost:3000/confirm-registration', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userEmail: document.getElementById('userEmail').value,
                            userPassword: document.getElementById('userPassword').value
                        })
                    });
                    
                    const result = await response.json();
                    document.getElementById('message').innerHTML = result.success 
                        ? '<p style="color: green;">✔️ Cuenta activada y usuario notificado</p>'
                        : '<p style="color: red;">❌ Error: ' + result.message + '</p>';
                });
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});