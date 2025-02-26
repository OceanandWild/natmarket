const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Configura CORS dinámicamente para permitir tanto localhost como producción
const allowedOrigins = [
    'https://natmarket.netlify.app',  // Producción
    'http://127.0.0.1:5502',         // Desarrollo en Live Server (VS Code)
    'http://localhost:3000'          // Desarrollo local
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed'));
        }
    },
    credentials: true
}));

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hachiyt001@gmail.com',
        pass: 'nkqv wmet yusf znja'
    }
});

app.post('/createProduct', (req, res) => {
    const {
        productName,
        productDescription,
        productPrice,
        userEmail,
        productState,
        productCategory,
        productLocation,
        productAvailability
    } = req.body;

    const mailOptions = {
        from: 'hachiyt001@gmail.com',
        to: 'hachiyt001@gmail.com',
        subject: 'Nuevo Producto Creado',
        text: `
            Nombre del Producto: ${productName}
            Descripción: ${productDescription}
            Precio: ${productPrice}
            Estado: ${productState}
            Categoría: ${productCategory}
            Ubicación: ${productLocation}
            Disponibilidad: ${productAvailability}
            Correo del Usuario: ${userEmail}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
        res.json({ success: true });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

app.get("/", (req, res) => {
    res.send("Servidor de productos en funcionamiento");
  });
  