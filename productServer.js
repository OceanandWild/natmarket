const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// Configura CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'https://natmarket.netlify.app', // Permite solicitudes desde este origen
    methods: ['GET', 'POST'], // Métodos permitidos
    credentials: true // Permite el envío de credenciales (si es necesario)
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
    const { productName, productDescription, productPrice, userEmail } = req.body;

    const mailOptions = {
        from: 'hachiyt001@gmail.com',
        to: 'hachiyt001@gmail.com',
        subject: 'Nuevo Producto Creado',
        text: `Nombre del Producto: ${productName}\nDescripción: ${productDescription}\nPrecio: ${productPrice}\nCorreo del Usuario: ${userEmail}`
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
  