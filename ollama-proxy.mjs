// backend/ollama-proxy.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// Permite peticiones desde tu dominio de producción
app.use(cors({
  origin: [
    "https://natmarket.netlify.app", // Cambia por tu dominio real
    "http://localhost:5173",         // Para desarrollo local
    "http://localhost:3000"
  ]
}));
app.use(bodyParser.json());

app.post("/api/generate", async (req, res) => {
  try {
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    const data = await ollamaRes.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error al conectar con Ollama", details: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Ollama Proxy API funcionando");
});

app.listen(PORT, () => {
  console.log(`Ollama Proxy API escuchando en http://localhost:${PORT}`);
});